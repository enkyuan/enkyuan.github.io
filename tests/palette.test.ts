// @ts-nocheck -- Bun's test runtime is outside the application's TypeScript config.
import { expect, test } from "bun:test";

const root = new URL("../", import.meta.url);
const literal = /oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/g;
const read = (path) => Bun.file(new URL(path, root)).text();
function colors(source) {
  return [...source.matchAll(literal)].map((match) => match.slice(1).map(Number));
}
function linearRgb([lightness, chroma, hue]) {
  const angle = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(angle);
  const b = chroma * Math.sin(angle);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
function luminance(color) {
  return linearRgb(color).reduce(
    (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index],
    0,
  );
}
function contrast(foreground, background) {
  const [low, high] = [luminance(foreground), luminance(background)].sort((a, b) => a - b);
  return (high + 0.05) / (low + 0.05);
}
function declaration(source, property) {
  const value = source.match(new RegExp(`${property}:\\s*(oklch\\([^;]+\\));`))?.[1];
  expect(value, `${property} must retain a literal fallback`).toBeDefined();
  return colors(value)[0];
}

// Value: protects=authored colors fit sRGB and text remains WCAG AA throughout the shimmer;
// fails_when=chroma clips or a text stop loses contrast; why_new=existing tests only check color syntax;
// seam=none; no_claim=browser rasterization and visual balance require browser QA.
test("keeps the authored palette in sRGB and text contrast safe through gradient stops", async () => {
  const paths = [
    "src/app.css",
    "src/routes/+error.svelte",
    "src/routes/+page.svelte",
    "src/lib/styles/about.css",
    "src/lib/styles/badge.css",
    "src/lib/styles/map.css",
    "src/lib/styles/button.css",
    "src/lib/styles/entries.css",
    "src/lib/hooks/use-map.ts",
  ];
  for (const path of paths) {
    for (const color of colors(await read(path))) {
      for (const channel of linearRgb(color)) {
        // Matrix round-off near white is below 1e-6; no perceptual clipping is allowed.
        expect(channel, `${path}: ${color}`).toBeGreaterThanOrEqual(-0.000001);
        expect(channel, `${path}: ${color}`).toBeLessThanOrEqual(1.000001);
      }
    }
  }
  const about = await read("src/lib/styles/about.css");
  const badge = await read("src/lib/styles/badge.css");
  const page = await read("src/routes/+page.svelte");
  const white = [1, 0, 0];
  const stops = ["--employer-deep-magenta", "--employer-magenta", "--employer-shimmer"].map(
    (name) => declaration(about, name),
  );
  for (const stop of stops) expect(contrast(stop, white)).toBeGreaterThanOrEqual(4.5);
  // The shared hue means interpolation in OKLab is linear in these L/C channels.
  for (let index = 0; index < stops.length - 1; index++) {
    for (let step = 0; step <= 100; step++) {
      const amount = step / 100;
      const color = stops[index].map(
        (value, channel) => value * (1 - amount) + stops[index + 1][channel] * amount,
      );
      expect(contrast(color, white)).toBeGreaterThanOrEqual(4.5);
    }
  }
  expect(
    contrast(declaration(badge, "color"), declaration(badge, "--surface-fill")),
  ).toBeGreaterThanOrEqual(4.5);
  expect(contrast(declaration(page, "color"), white)).toBeGreaterThanOrEqual(4.5);
});
