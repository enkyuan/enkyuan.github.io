// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const flagsComponent = await Bun.file(
  new URL("../../../../src/lib/components/ui/flags.svelte", import.meta.url),
).text();

test("selects any country flag through one compact component API", () => {
  expect(flagsComponent).toContain("countryCode: string; size?: number");
  expect(flagsComponent).toContain('code === "US"');
  expect(flagsComponent).toContain("String.fromCodePoint");
  expect(flagsComponent).toContain('class="country-flag"');
});

test("forms the US flag from the shared circular dot field", () => {
  expect(flagsComponent).toContain("isCircularDotVisible(row, column)");
  expect(flagsComponent).toContain("r={DOT_FIELD_RADIUS}");
  expect(flagsComponent).toContain("fill={`url(#${patternId})`}");
  expect(flagsComponent).not.toContain("border-radius: 50%");
  expect(flagsComponent).not.toContain("overflow: hidden");
  expect(flagsComponent).not.toContain("clipPath");
  expect(flagsComponent).not.toContain("<rect");
  expect(flagsComponent).not.toContain("<path");
  expect(flagsComponent).not.toContain("<use");
});
