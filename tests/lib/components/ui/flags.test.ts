// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const flagsComponent = await Bun.file(
  new URL("../../../../src/lib/components/ui/flags.svelte", import.meta.url),
).text();

test("selects any country flag through one compact component API", () => {
  expect(flagsComponent).toContain("countryCode: string; size?: number");
  expect(flagsComponent).toContain('code === "US"');
  expect(flagsComponent).not.toContain("String.fromCodePoint");
  expect(flagsComponent).toContain("country-flag-icons/1x1/");
  expect(flagsComponent).toContain('class="country-flag"');
});

test("forms the US flag from the shared circular dot field", () => {
  expect(flagsComponent).toContain("isCircularDotVisible(row, column)");
  expect(flagsComponent).toContain("r={DOT_FIELD_RADIUS}");
  expect(flagsComponent).toContain("mask-image: var(--flag-mask)");
  expect(flagsComponent).not.toContain("foreignObject");
  expect(flagsComponent).not.toContain("border-radius: 50%");
  expect(flagsComponent).not.toContain("overflow: hidden");
  expect(flagsComponent).not.toContain("clipPath");
  expect(flagsComponent).not.toContain("<rect");
  expect(flagsComponent).not.toContain("<path");
  expect(flagsComponent).not.toContain("<use");
});

test("bundles SVG flags across regions and provides a load-error fallback", async () => {
  for (const code of ["FR", "CN", "FJ", "NZ", "ZA", "BR", "CA", "JP", "IN", "GB"]) {
    const svg = await Bun.file(
      new URL(`../../../../node_modules/country-flag-icons/1x1/${code}.svg`, import.meta.url),
    ).text();
    expect(svg).toContain("<svg");
    expect(svg).not.toContain("<foreignObject");
  }
  expect(flagsComponent).toContain("failedSource !== source");
  expect(flagsComponent).toContain('class="fallback"');
});
