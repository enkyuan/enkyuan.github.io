import { onMount, tick } from "svelte";
import { get, writable } from "svelte/store";
import { createLocationGradient, findLocationCluster, type MapCell } from "$lib/hooks/use-map";

import {
  formatGeocodedCountryCode,
  formatGeocodedPlace,
  reverseGeocode,
  type ReverseGeocodeResult,
} from "./geocoding";
export { formatGeocodedCountryCode, formatGeocodedPlace, reverseGeocode } from "./geocoding";

type LocationState = "locating" | "located" | "error";
type LocationFailureKind =
  | "permission-denied"
  | "position-unavailable"
  | "timeout"
  | "unsupported"
  | "geocoding";

export type LocationFailure = {
  kind: LocationFailureKind;
  title: string;
  hint: string;
  retryable: boolean;
  statusMessage: string;
};

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
  failure?: LocationFailure;
  statusMessage: string;
};

const GEOLOCATION_ERROR_CODES = {
  permissionDenied: 1,
  positionUnavailable: 2,
  timeout: 3,
} as const;
export const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 5 * 60 * 1000,
  timeout: 10_000,
};
const UNSUPPORTED_LOCATION_FAILURE: LocationFailure = {
  kind: "unsupported",
  title: "Location unavailable",
  hint: "Try another browser",
  retryable: false,
  statusMessage: "Location is not available in this browser.",
};

export function describeGeolocationError(error: unknown): LocationFailure {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? Number(error.code)
      : GEOLOCATION_ERROR_CODES.positionUnavailable;

  if (code === GEOLOCATION_ERROR_CODES.permissionDenied) {
    return {
      kind: "permission-denied",
      title: "Location access blocked",
      hint: "Allow access in settings, then tap to retry",
      retryable: true,
      statusMessage:
        "Location access is blocked. Allow location access in your browser settings, then try again.",
    };
  }

  if (code === GEOLOCATION_ERROR_CODES.timeout) {
    return {
      kind: "timeout",
      title: "Location timed out",
      hint: "Tap to try again",
      retryable: true,
      statusMessage: "Finding your location took too long. Try again.",
    };
  }

  return {
    kind: "position-unavailable",
    title: "Location unavailable",
    hint: "Tap to try again",
    retryable: true,
    statusMessage: "Your location is temporarily unavailable. Try again.",
  };
}

export function requestCurrentPosition(geolocation: Pick<Geolocation, "getCurrentPosition">) {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    geolocation.getCurrentPosition(resolve, reject, GEOLOCATION_OPTIONS);
  });
}

/**
 * Derives a precision factor in [0, 1] from GPS accuracy and geocoded admin level.
 *
 * 0 = pinpoint (small cluster) · 1 = country-level (large cluster)
 *
 * GPS accuracy is log-scaled from 30 m (0.0) to 50 km (1.0).
 * Admin-level corrections:
 *   - City / District resolved  → −0.20 (tighten cluster)
 *   - Region / Territory only   →  0.00 (neutral)
 *   - Country only              → +0.15 (broaden cluster)
 */
function resolveClusterPrecision(
  accuracyMeters: number,
  geocodeResult?: ReverseGeocodeResult,
): number {
  const LOG_MIN = Math.log10(30);
  const LOG_MAX = Math.log10(50_000);
  const accuracyFactor = Math.max(
    0,
    Math.min(1, (Math.log10(Math.max(accuracyMeters, 30)) - LOG_MIN) / (LOG_MAX - LOG_MIN)),
  );

  const address = geocodeResult?.address;
  const hasCity = Boolean(address?.City?.trim() || address?.District?.trim());
  const hasRegion = Boolean(address?.Region?.trim() || address?.Territory?.trim());
  const adminCorrection = hasCity ? -0.2 : hasRegion ? 0.0 : 0.15;

  return Math.max(0, Math.min(1, accuracyFactor + adminCorrection));
}

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
  let inFlight = false;
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
    const currentLocation = get(location);
    const nextLocation = update(currentLocation);
    const applyUpdate = () => location.set(nextLocation);
    const staysAtBottom = currentLocation.state !== "located" && nextLocation.state !== "located";
    const viewTransitionDocument = document as ViewTransitionDocument;
    try {
      if (!shouldAnimate() || prefersReducedMotion) {
        applyUpdate();
        await tick();
        return;
      }

      if (staysAtBottom) {
        const sharedPill = getSharedPill();
        const firstRect = sharedPill?.getBoundingClientRect();
        applyUpdate();
        await tick();
        const lastRect = sharedPill?.getBoundingClientRect();
        if (!sharedPill || !firstRect || !lastRect || lastRect.width === 0) return;

        sharedPillAnimation?.cancel();
        sharedPillAnimation = sharedPill.animate(
          [
            {
              opacity: 0.82,
              filter: "blur(2px)",
              transform: `scaleX(${firstRect.width / lastRect.width})`,
              transformOrigin: "center bottom",
            },
            {
              opacity: 1,
              filter: "blur(0)",
              transform: "scaleX(1)",
              transformOrigin: "center bottom",
            },
          ],
          {
            duration: 240,
            easing: "cubic-bezier(0.77, 0, 0.175, 1)",
            fill: "both",
          },
        );
        await sharedPillAnimation.finished.catch(() => undefined);
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
          duration: 280,
          easing: "cubic-bezier(0.32, 0.72, 0, 1)",
          fill: "both",
        },
      );
      await sharedPillAnimation.finished.catch(() => undefined);
    } catch {
      // Optional browser animation support must never turn valid coordinates
      // into a geolocation error. The state update is safe to apply again.
      applyUpdate();
      await tick();
    }
  }

  async function locate() {
    if (!("geolocation" in navigator)) {
      await updateLocationState((current) => ({
        ...current,
        state: "error",
        failure: UNSUPPORTED_LOCATION_FAILURE,
        statusMessage: UNSUPPORTED_LOCATION_FAILURE.statusMessage,
      }));
      return;
    }

    if (inFlight) return;
    inFlight = true;
    // Keep the browser request in the click's user-activation task. Awaiting
    // a badge animation first can lose that activation on permission retries.
    location.update((current) => ({
      ...current,
      state: "locating",
      failure: undefined,
      statusMessage: "Finding your spot on the map.",
    }));

    try {
      const position = await requestCurrentPosition(navigator.geolocation);
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const accuracy = position.coords.accuracy;
      const resolved = await reverseGeocode(latitude, longitude).catch(() => undefined);
      const place = resolved ? formatGeocodedPlace(resolved) : "Current location";
      const precisionFactor = resolveClusterPrecision(accuracy, resolved);
      const cluster = findLocationCluster(cells, latitude, longitude, { precisionFactor });

      inFlight = false;
      await updateLocationState((current) => ({
        ...current,
        latitude,
        longitude,
        place,
        countryCode: resolved ? formatGeocodedCountryCode(resolved) : "",
        highlightedCells: cluster,
        highlightedCellColors: createLocationGradient(cells, cluster),
        state: "located",
        failure: resolved
          ? undefined
          : {
              kind: "geocoding",
              title: "Place name unavailable",
              hint: "Tap to retry the place name",
              retryable: true,
              statusMessage: "Coordinates found. Place name unavailable. Tap to retry.",
            },
        statusMessage: resolved
          ? `Current location found near ${place}.`
          : "Coordinates found. Place name unavailable. Tap to retry.",
      }));
    } catch (error) {
      const failure = describeGeolocationError(error);
      inFlight = false;
      await updateLocationState((current) => ({
        ...current,
        state: "error",
        failure,
        statusMessage: failure.statusMessage,
      }));
    }
  }

  return { location, locate };
}
