// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";
import {
  describeGeolocationError,
  formatGeocodedCountryCode,
  formatGeocodedPlace,
  GEOLOCATION_OPTIONS,
  requestCurrentPosition,
  reverseGeocode,
} from "../../../src/lib/hooks/use-location";

test("falls back to a broader place when no locality exists", async () => {
  const queries = [];
  const fetcher = async (url) => {
    queries.push(new URL(url).searchParams.get("featureTypes"));
    return new Response(
      JSON.stringify(
        queries.length === 1
          ? { error: { code: 400, message: "Unable to find address" } }
          : { address: { CntryName: "Fiji", CountryCode: "FJI" } },
      ),
    );
  };
  expect(await reverseGeocode(-17.7, 178.1, fetcher)).toMatchObject({
    address: { CountryCode: "FJI" },
  });
  expect(queries).toEqual(["Locality", "Country"]);
});

test("keeps an unavailable geocoder recoverable", async () => {
  const fetcher = async () => {
    throw new TypeError("Network request failed");
  };
  await expect(reverseGeocode(48.85, 2.35, fetcher)).rejects.toThrow();
});

const locationHook = await Bun.file(
  new URL("../../../src/lib/hooks/use-location.ts", import.meta.url),
).text();
const geocoding = await Bun.file(
  new URL("../../../src/lib/hooks/geocoding.ts", import.meta.url),
).text();
const appHtml = await Bun.file(new URL("../../../src/app.html", import.meta.url)).text();

test("connects the visiting browser's live coordinates to the map", () => {
  expect(locationHook).toContain("export function useLocation(");
  expect(locationHook).toContain("const location = writable<Location>(");
  expect(locationHook).not.toContain("$state");
  expect(locationHook).toContain("onMount(() => {");
  expect(locationHook).toContain("void locate();");
  expect(locationHook).toContain("requestCurrentPosition(navigator.geolocation)");
  expect(locationHook).toContain("const latitude = position.coords.latitude;");
  expect(locationHook).toContain("const longitude = position.coords.longitude;");
  expect(locationHook).toContain("reverseGeocode(latitude, longitude)");
  expect(geocoding).toContain(
    "geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode",
  );
  expect(geocoding).toContain('["Locality", "Country"]');
  expect(locationHook).toContain(
    "findLocationCluster(cells, latitude, longitude, { precisionFactor })",
  );
  expect(locationHook).toContain("createLocationGradient(cells, cluster)");
  expect(appHtml).toContain("connect-src 'self' https://corsproxy.io https://geocode.arcgis.com;");
  expect(locationHook).not.toContain("localStorage");
  expect(locationHook).not.toContain("sessionStorage");
});

test("formats live reverse-geocoding results for international regions", () => {
  expect(
    formatGeocodedPlace({
      address: {
        City: "Frisco",
        Region: "Texas",
        RegionAbbr: "TX",
        CntryName: "United States",
        CountryCode: "USA",
      },
    }),
  ).toBe("Frisco, TX");
  expect(
    formatGeocodedPlace({
      address: {
        City: "Toronto",
        Region: "Ontario",
        RegionAbbr: "ON",
        CountryCode: "CAN",
      },
    }),
  ).toBe("Toronto, ON");
  expect(
    formatGeocodedPlace({
      address: {
        City: "Paris",
        Region: "Île-de-France",
        RegionAbbr: "IDF",
        CountryCode: "FRA",
      },
    }),
  ).toBe("Paris, Île-de-France");
  expect(
    formatGeocodedPlace({
      address: {
        City: "Singapore",
        Region: "Singapore",
        CountryCode: "SGP",
      },
    }),
  ).toBe("Singapore");
});

test("converts global geocoder country metadata into two-letter flag codes", () => {
  expect(
    formatGeocodedCountryCode({
      address: { CntryName: "United States", CountryCode: "USA" },
    }),
  ).toBe("US");
  expect(
    formatGeocodedCountryCode({
      address: { CntryName: "Mexico", CountryCode: "MEX" },
    }),
  ).toBe("MX");
  expect(
    formatGeocodedCountryCode({
      address: { CntryName: "Austria", CountryCode: "AUT" },
    }),
  ).toBe("AT");
});

test("classifies browser geolocation failures by retryability", () => {
  expect(describeGeolocationError({ code: 1 })).toMatchObject({
    kind: "permission-denied",
    retryable: true,
    hint: "Allow access in settings, then tap to retry",
  });
  expect(describeGeolocationError({ code: 2 })).toMatchObject({
    kind: "position-unavailable",
    retryable: true,
  });
  expect(describeGeolocationError({ code: 3 })).toMatchObject({
    kind: "timeout",
    retryable: true,
  });
  expect(GEOLOCATION_OPTIONS).toEqual({
    enableHighAccuracy: false,
    maximumAge: 300_000,
    timeout: 10_000,
  });
});

test("allows a transient geolocation failure to succeed on retry", async () => {
  const position = {
    coords: { latitude: 33.102, longitude: -96.817 },
    timestamp: Date.now(),
  };
  let attempts = 0;
  const geolocation = {
    getCurrentPosition(success, failure, options) {
      expect(options).toEqual(GEOLOCATION_OPTIONS);
      attempts += 1;
      if (attempts === 1) {
        failure({ code: 2 });
        return;
      }
      success(position);
    },
  };

  const firstResult = await requestCurrentPosition(geolocation).then(
    () => undefined,
    (error) => error,
  );
  expect(firstResult).toMatchObject({ code: 2 });
  expect(await requestCurrentPosition(geolocation)).toBe(position);
  expect(attempts).toBe(2);
});

test("resolves France to FR instead of the deprecated FX alias", () => {
  expect(formatGeocodedCountryCode({ address: { CntryName: "France", CountryCode: "FRA" } })).toBe(
    "FR",
  );
  expect(formatGeocodedCountryCode({ address: { CntryName: "France" } })).toBe("FR");
  expect(formatGeocodedCountryCode({ address: { CntryName: "Fiji", CountryCode: "FJI" } })).toBe(
    "FJ",
  );
});

// Value: protects=unusable geocoder responses never become successful place results;
// fails_when=HTTP failures or empty or malformed addresses are accepted; why_new=existing fallback covers only a provider error object;
// seam=none; no_claim=provider fixtures exercise response handling, not live provider availability.
test("rejects HTTP errors, invalid JSON and responses without an administrative place", async () => {
  for (const response of [
    () => new Response("limited", { status: 429 }),
    () => new Response("invalid json"),
    () => new Response(JSON.stringify({ address: {} })),
    () => new Response(JSON.stringify({ address: { City: "  ", CountryCode: "FRA" } })),
    () => new Response(JSON.stringify({ error: { code: 400 } })),
  ]) {
    await expect(reverseGeocode(48.85, 2.35, async () => response())).rejects.toThrow();
  }
});

// Value: protects=an aborted geocoder request rejects instead of hanging and releases its deadline;
// fails_when=the abort signal is omitted or deadline cleanup is removed; why_new=no existing abort-path assertion;
// seam=none; no_claim=the event-driven timer fixture does not measure real network latency.
test("aborts a pending geocoder request at its deadline and clears the timer", async () => {
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  let deadline;
  let delay;
  let cleared;
  const timer = { fixture: true };
  globalThis.setTimeout = (callback, milliseconds) => {
    deadline = callback;
    delay = milliseconds;
    return timer;
  };
  globalThis.clearTimeout = (value) => {
    cleared = value;
  };
  try {
    const request = reverseGeocode(
      48.85,
      2.35,
      async (_url, options) =>
        new Promise((_resolve, reject) => {
          options.signal.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          );
        }),
    );
    expect(delay).toBe(6000);
    deadline();
    await expect(request).rejects.toMatchObject({ name: "AbortError" });
    expect(cleared).toBe(timer);
  } finally {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
  }
});
