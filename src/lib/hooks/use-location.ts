import { onMount, tick } from "svelte";
import { get, writable } from "svelte/store";
import {
  createLocationGradient,
  findLocationCluster,
  nearestLocation,
  type MapCell,
} from "$lib/hooks/use-map";

export type LocationState = "locating" | "located" | "error";

type SharedViewTransition = { finished: Promise<void> };
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => SharedViewTransition;
};

type Location = {
  state: LocationState;
  place: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
  highlightedCells: string[];
  highlightedCellColors: Map<string, string>;
  statusMessage: string;
};

export function useLocation(
  cells: readonly MapCell[],
  shouldAnimate: () => boolean,
  getSharedPill: () => HTMLDivElement | undefined,
) {
  const location = writable<Location>({
    state: "locating",
    place: "Current location",
    countryCode: "",
    highlightedCells: [],
    highlightedCellColors: new Map(),
    statusMessage: "Finding your spot on the map.",
  });
  let prefersReducedMotion = false;
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

  async function updateLocationState(update: (current: Location) => Location) {
    const applyUpdate = () => location.update(update);
    const viewTransitionDocument = document as ViewTransitionDocument;
    if (!shouldAnimate() || prefersReducedMotion) {
      applyUpdate();
      await tick();
      return;
    }

    if (viewTransitionDocument.startViewTransition) {
      const transition = viewTransitionDocument.startViewTransition(async () => {
        applyUpdate();
        await tick();
      });
      await transition.finished.catch(() => undefined);
      return;
    }

    const sharedPill = getSharedPill();
    const firstRect = sharedPill?.getBoundingClientRect();
    applyUpdate();
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
      await updateLocationState((current) => ({
        ...current,
        state: "error",
        statusMessage: "Location is not available in this browser.",
      }));
      return;
    }

    if (get(location).state === "locating") {
      location.update((current) => ({
        ...current,
        statusMessage: "Finding your spot on the map.",
      }));
    } else {
      await updateLocationState((current) => ({
        ...current,
        state: "locating",
        statusMessage: "Finding your spot on the map.",
      }));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void updateLocationState((current) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const nearest = nearestLocation(latitude, longitude);
          const cluster = findLocationCluster(cells, latitude, longitude);

          return {
            ...current,
            latitude,
            longitude,
            place: nearest.name,
            countryCode: nearest.countryCode,
            highlightedCells: cluster,
            highlightedCellColors: createLocationGradient(cells, cluster),
            state: "located",
            statusMessage: `Current location found near ${nearest.name}.`,
          };
        });
      },
      () => {
        void updateLocationState((current) => ({
          ...current,
          state: "error",
          statusMessage: "Location not found.",
        }));
      },
      { enableHighAccuracy: true, maximumAge: 0 },
    );
  }

  return { location, locate };
}
