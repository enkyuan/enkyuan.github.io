// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";
import {
  describeGeolocationError,
  formatGeocodedCountryCode,
  formatGeocodedPlace,
  GEOLOCATION_OPTIONS,
  requestCurrentPosition,
} from "../../../src/lib/hooks/use-location";

const locationHook = await Bun.file(
  new URL("../../../src/lib/hooks/use-location.ts", import.meta.url),
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
  expect(locationHook).toContain(
    "geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode",
  );
  expect(locationHook).toContain('featureTypes: "Locality"');
  expect(locationHook).toContain("findLocationCluster(cells, latitude, longitude)");
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
    retryable: false,
    hint: "Allow it in browser settings",
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
