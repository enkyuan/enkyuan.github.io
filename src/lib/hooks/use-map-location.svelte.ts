import { onMount, tick } from "svelte";
import {
  createLocationGradient,
  findLocationCluster,
  nearestLocation,
  type MapCell,
} from "$lib/hooks/use-map";

export type MapLocationState = "locating" | "located" | "error";

type SharedViewTransition = { finished: Promise<void> };
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => SharedViewTransition;
};

type MapLocation = {
  state: MapLocationState;
  place: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
  highlightedCells: string[];
  highlightedCellColors: Map<string, string>;
  statusMessage: string;
};

export function useMapLocation(
  cells: readonly MapCell[],
  shouldAnimate: () => boolean,
  getSharedPill: () => HTMLDivElement | undefined,
) {
  const location = $state<MapLocation>({
    state: "locating",
    place: "Current location",
    countryCode: "",
    highlightedCells: [],
    highlightedCellColors: new Map(),
    statusMessage: "Finding your spot on the map.",
  });
  let prefersReducedMotion = $state(false);
  let sharedPillAnimation: Animation | undefined;

  onMount(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      prefersReducedMotion = reducedMotion.matches;
    };

    updateMotionPreference();
    reducedMotion.addEventListener("change", updateMotionPreference);
    void locate();

    return () => reducedMotion.removeEventListener("change", updateMotionPreference);
  });

  async function updateLocationState(update: () => void) {
    const viewTransitionDocument = document as ViewTransitionDocument;
    if (!shouldAnimate() || prefersReducedMotion) {
      update();
      await tick();
      return;
    }

    if (viewTransitionDocument.startViewTransition) {
      const transition = viewTransitionDocument.startViewTransition(async () => {
        update();
        await tick();
      });
      await transition.finished.catch(() => undefined);
      return;
    }

    const sharedPill = getSharedPill();
    const firstRect = sharedPill?.getBoundingClientRect();
    update();
    await tick();
    const lastRect = sharedPill?.getBoundingClientRect();
    if (!sharedPill || !firstRect || !lastRect || lastRect.width === 0 || lastRect.height === 0)
      return;

    sharedPillAnimation?.cancel();
    sharedPillAnimation = sharedPill.animate(
      [
        {
          opacity: 0.86,
          filter: "blur(4px)",
          transform: `translate(${firstRect.left - lastRect.left}px, ${firstRect.top - lastRect.top}px) scale(${firstRect.width / lastRect.width}, ${firstRect.height / lastRect.height})`,
        },
        { opacity: 1, filter: "blur(0)", transform: "translate(0, 0) scale(1)" },
      ],
      {
        duration: 520,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both",
      },
    );
    await sharedPillAnimation.finished.catch(() => undefined);
  }

  async function locate() {
    if (!("geolocation" in navigator)) {
      await updateLocationState(() => {
        location.state = "error";
        location.statusMessage = "Location is not available in this browser.";
      });
      return;
    }

    if (location.state === "locating") {
      location.statusMessage = "Finding your spot on the map.";
    } else {
      await updateLocationState(() => {
        location.state = "locating";
        location.statusMessage = "Finding your spot on the map.";
      });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void updateLocationState(() => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const nearest = nearestLocation(latitude, longitude);
          const cluster = findLocationCluster(cells, latitude, longitude);

          location.latitude = latitude;
          location.longitude = longitude;
          location.place = nearest.name;
          location.countryCode = nearest.countryCode;
          location.highlightedCells = cluster;
          location.highlightedCellColors = createLocationGradient(cells, cluster);
          location.state = "located";
          location.statusMessage = `Current location found near ${location.place}.`;
        });
      },
      () => {
        void updateLocationState(() => {
          location.state = "error";
          location.statusMessage = "Location not found.";
        });
      },
      { enableHighAccuracy: true, maximumAge: 0 },
    );
  }

  return { location, locate };
}
