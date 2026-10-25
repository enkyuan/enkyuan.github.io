import { countries } from "country-flag-icons";

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

    // Restrict lookup to supported, current codes. Enumerating AA..ZZ also
    // includes deprecated aliases (for example FX -> France) that overwrite FR.
    for (const code of countries.filter((code) => /^[A-Z]{2}$/.test(code))) {
      const name = displayNames.of(code);
      if (name && name !== code && name !== "Unknown Region") {
        codes.set(normalizeCountryName(name), code);
      }
    }
  }

  countryCodesByName = codes;
  return codes;
}

export function formatGeocodedCountryCode(result: ReverseGeocodeResult) {
  const sourceCode = result.address?.CountryCode?.trim().toUpperCase() ?? "";
  if (/^[A-Z]{2}$/.test(sourceCode)) return sourceCode;

  if (COUNTRY_CODE_FALLBACKS[sourceCode]) return COUNTRY_CODE_FALLBACKS[sourceCode];

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

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  fetcher: typeof fetch = fetch,
) {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 6000);
  try {
    for (const featureTypes of ["Locality", "Country"]) {
      const query = new URLSearchParams({
        location: `${longitude},${latitude}`,
        featureTypes,
        langCode: "en",
        f: "json",
      });
      const response = await fetcher(
        `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?${query}`,
        { signal: controller.signal, credentials: "omit", referrerPolicy: "no-referrer" },
      );
      if (!response.ok) throw new Error(`Reverse geocoding failed with ${response.status}`);
      const result = (await response.json()) as ReverseGeocodeResult;
      const address = result.address;
      if (
        !result.error &&
        address &&
        [address.City, address.District, address.Region, address.Territory, address.CntryName].some(
          (value) => typeof value === "string" && value.trim(),
        )
      ) {
        return result;
      }
    }
    throw new Error("Reverse geocoding returned no place name");
  } finally {
    globalThis.clearTimeout(timeout);
  }
}
