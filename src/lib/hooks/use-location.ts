import { onMount, tick } from "svelte";
import { get, writable } from "svelte/store";
import { createLocationGradient, findLocationCluster, type MapCell } from "$lib/hooks/use-map";

type LocationState = "locating" | "located" | "error";

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

export type ReverseGeocodeResult = {
  address?: {
    City?: string;
    District?: string;
    Region?: string;
    RegionAbbr?: string;
    Territory?: string;
    CntryName?: string;
    CountryCode?: string;
  };
  error?: {
    code?: number;
    message?: string;
  };
};

const ABBREVIATED_SUBDIVISION_COUNTRIES = new Set(["AUS", "BRA", "CAN", "MEX", "USA"]);
const COUNTRY_CODE_FALLBACKS: Readonly<Record<string, string>> = {
  AUS: "AU",
  BRA: "BR",
  CAN: "CA",
  CHN: "CN",
  DEU: "DE",
  ESP: "ES",
  FRA: "FR",
  GBR: "GB",
  IND: "IN",
  JPN: "JP",
  KOR: "KR",
  MEX: "MX",
  SGP: "SG",
  USA: "US",
};
let countryCodesByName: Map<string, string> | undefined;

function normalizeCountryName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function getCountryCodesByName() {
  if (countryCodesByName) return countryCodesByName;

  const codes = new Map<string, string>();
  if (typeof Intl.DisplayNames === "function") {
    const displayNames = new Intl.DisplayNames(["en"], { type: "region" });

    for (let first = 65; first <= 90; first += 1) {
      for (let second = 65; second <= 90; second += 1) {
        const code = String.fromCharCode(first, second);
        const name = displayNames.of(code);
        if (name && name !== code && name !== "Unknown Region") {
          codes.set(normalizeCountryName(name), code);
        }
      }
    }
  }

  countryCodesByName = codes;
  return codes;
}

export function formatGeocodedCountryCode(result: ReverseGeocodeResult) {
  const sourceCode = result.address?.CountryCode?.trim().toUpperCase() ?? "";
  if (/^[A-Z]{2}$/.test(sourceCode)) return sourceCode;

  const countryName = result.address?.CntryName?.trim();
  if (countryName) {
    const resolvedCode = getCountryCodesByName().get(normalizeCountryName(countryName));
    if (resolvedCode) return resolvedCode;
  }

  return COUNTRY_CODE_FALLBACKS[sourceCode] ?? "";
}

export function formatGeocodedPlace(result: ReverseGeocodeResult) {
  const address = result.address;
  const countryCode = address?.CountryCode?.toUpperCase() ?? "";
  const city = address?.City?.trim() || address?.District?.trim();
  const subdivisionName = address?.Region?.trim() || address?.Territory?.trim();
  const subdivisionCode = address?.RegionAbbr?.trim();
  const subdivision =
    ABBREVIATED_SUBDIVISION_COUNTRIES.has(countryCode) && subdivisionCode
      ? subdivisionCode
      : subdivisionName;

  if (!city) return subdivision || address?.CntryName?.trim() || "Current location";
  if (!subdivision || city.localeCompare(subdivision, undefined, { sensitivity: "accent" }) === 0)
    return city;
  return `${city}, ${subdivision}`;
}

async function reverseGeocode(latitude: number, longitude: number) {
  const query = new URLSearchParams({
    location: `${longitude},${latitude}`,
    featureTypes: "Locality",
    langCode: "en",
    f: "json",
  });
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?${query}`,
      { signal: controller.signal },
    );
    if (!response.ok) throw new Error(`Reverse geocoding failed with ${response.status}`);
    const result = (await response.json()) as ReverseGeocodeResult;
    if (result.error || !result.address) {
      throw new Error(result.error?.message ?? "Reverse geocoding returned no locality");
    }
    return result;
  } finally {
    window.clearTimeout(timeout);
  }
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
        void (async () => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const cluster = findLocationCluster(cells, latitude, longitude);
          const resolved = await reverseGeocode(latitude, longitude).catch(() => undefined);
          const place = resolved ? formatGeocodedPlace(resolved) : "Current location";

          await updateLocationState((current) => ({
            ...current,
            latitude,
            longitude,
            place,
            countryCode: resolved ? formatGeocodedCountryCode(resolved) : "",
            highlightedCells: cluster,
            highlightedCellColors: createLocationGradient(cells, cluster),
            state: "located",
            statusMessage: `Current location found near ${place}.`,
          }));
        })();
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
