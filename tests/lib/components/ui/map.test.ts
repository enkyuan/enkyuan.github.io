// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const mapComponent = await Bun.file(
  new URL("../../../../src/lib/components/ui/map.svelte", import.meta.url),
).text();
const mapStyles = await Bun.file(
  new URL("../../../../src/lib/styles/map.css", import.meta.url),
).text();
const locationHook = await Bun.file(
  new URL("../../../../src/lib/hooks/use-location.ts", import.meta.url),
).text();

test("presents live coordinates in the map badge", () => {
  expect(mapComponent).toContain('import { useLocation } from "$lib/hooks/use-location";');
  expect(mapComponent).toContain('import Badge from "$lib/components/ui/badge.svelte";');
  expect(mapComponent).toContain('import Flags from "$lib/components/ui/flags.svelte";');
  expect(mapComponent).toContain('import "$lib/styles/map.css";');
  expect(mapComponent).toContain('from "$lib/hooks/use-map";');
  expect(mapComponent).toContain('class="map"');
  expect(mapComponent).toContain('class="location-badge"');
  expect(mapComponent).toContain(
    "class:location-anchor={cell.id === $location.highlightedCells[0]}",
  );
  expect(mapComponent).toContain("<Flags countryCode={$location.countryCode} />");
  expect(mapStyles).toContain("@keyframes location-cell-drop");
  expect(mapStyles).not.toContain(".map-cell.location-cell {\n\tbackground: linear-gradient");
  expect(mapComponent).not.toContain("pill-pin-icon");
  expect(mapComponent).not.toContain("Use current location");
});

test("keeps pending and failed states at one viewport-bottom anchor", () => {
  expect(mapComponent).toContain('class:bottom-state={$location.state !== "located"}');
  expect(mapStyles).toContain(".location-badge-anchor.bottom-state {");
  expect(mapStyles).toContain("position: fixed;");
  expect(mapStyles).toContain("bottom: max(1.5rem, env(safe-area-inset-bottom));");
  expect(mapStyles).toContain("left: 50%;");
  expect(mapStyles).toContain("transform: translateX(-50%);");
  expect(mapComponent).toContain('class:locating={$location.state === "locating"}');
  expect(mapComponent).toContain('class="loading-field"');
  expect(mapComponent).toContain("Finding your spot on the map…");
  expect(mapComponent).toContain('<svg viewBox="0 0 34 34" focusable="false">');
  expect(mapComponent).toContain("isCircularDotVisible(row, column)");
  expect(mapComponent).toContain("r={DOT_FIELD_RADIUS}");
  expect(mapStyles).toContain("flex: 0 0 34px;");
  expect(mapStyles).toContain("@keyframes loading-dot");
  expect(mapStyles).toContain("animation-delay: calc(var(--loader-delay) - 900ms);");
});

test("morphs loading and error badges in place", () => {
  expect(locationHook).toContain(
    'const staysAtBottom = currentLocation.state !== "located" && nextLocation.state !== "located";',
  );
  expect(locationHook).toContain("if (staysAtBottom) {");
  expect(locationHook).toContain("sharedPill.animate(");
  expect(locationHook).toContain("transform: `scaleX(${firstRect.width / lastRect.width})`");
  expect(locationHook).toContain('transformOrigin: "center bottom"');
  expect(locationHook).toContain("duration: 240");
  expect(locationHook).toContain('easing: "cubic-bezier(0.77, 0, 0.175, 1)"');
  expect(mapComponent).not.toContain("{#key $location.state}");
  expect(mapStyles).toContain("view-transition-name: location-pill;");
  expect(mapStyles).toContain("::view-transition-group(location-pill)");
  expect(mapStyles).toContain("@keyframes liquid-pill-in");
  expect(mapStyles).toContain("transform: scale(1.01, 0.99);");
  expect(mapComponent).not.toContain("in:fade");
  expect(mapComponent).not.toContain("out:fade");
});

test("renders classified failures with the shared dot-matrix X", () => {
  expect(mapComponent).toContain('class="error-field"');
  expect(mapComponent).toContain("class:error-mark={isErrorMarkDot(row, column)}");
  expect(mapComponent).toContain('$location.failure?.title ?? "Location unavailable"');
  expect(mapComponent).toContain('class="state-hint"');
  expect(mapStyles).toContain("fill: oklch(0.849 0.083 17.077 / 0.42);");
  expect(mapStyles).toContain("fill: oklch(0.692 0.198 21.503);");
  expect(mapStyles).not.toContain("border-radius: 50%;");
  expect(mapComponent).not.toContain("RetryIcon");
  expect(mapComponent).not.toContain("retry-button");
});

test("makes only recoverable location failures interactive", () => {
  expect(mapComponent).toContain("$location.failure?.retryable === true");
  expect(mapComponent).toContain("onclick={canRetryLocation ? () => void locate() : undefined}");
  expect(mapComponent).toContain(
    'ariaLabel={canRetryLocation ? "Try finding your location again" : undefined}',
  );
  expect(mapComponent).not.toContain('"Refresh your current location"');
  expect(mapComponent).not.toContain('"Refresh location"');
});

test("positions the location badge beside its marker across every map edge", () => {
  expect(mapComponent).toContain("cells.find((cell) => cell.id === $location.highlightedCells[0])");
  expect(mapComponent).toContain(
    "function pillPosition(currentLatitude: number | undefined, currentLongitude: number | undefined)",
  );
  expect(mapComponent).toContain("((currentLongitude + 180) / 360) * 100");
  expect(mapComponent).toContain("((90 - currentLatitude) / 180) * 100");
  expect(mapComponent).toContain("--anchor-x:${x}%;--anchor-y:${y}%");
  expect(mapComponent).toContain("class:opens-right");
  expect(mapComponent).toContain("class:opens-left");
  expect(mapComponent).toContain("class:opens-below");
  expect(mapComponent).toContain("class:opens-above");
  expect(mapComponent).toContain(
    "style={pillPosition(locationAnchor?.latitude, locationAnchor?.longitude)}",
  );
  expect(mapStyles).toContain("anchor-name: --current-location;");
  expect(mapStyles).toContain("@supports (anchor-name: --current-location)");
  expect(mapStyles).toContain("position-anchor: --current-location;");
  expect(mapStyles).toContain("position-area: bottom right;");
  expect(mapStyles).toContain("flip-inline,");
  expect(mapStyles).toContain("flip-block,");
  expect(mapStyles).toContain("flip-block flip-inline,");
  expect(mapStyles).toContain("bottom,");
  expect(mapStyles).toContain("top;");
  expect(mapStyles).toContain("inset: auto;");
  expect(mapStyles).toContain("max-width: calc(100% - 1rem);");
  expect(mapStyles).toContain("min-width: 0;");
  expect(mapStyles).toContain("text-overflow: ellipsis;");
  expect(mapStyles).toContain("--badge-offset-block: 8px;");
  expect(mapStyles).toContain("--badge-offset-inline: 10px;");
  expect(mapStyles).toContain("margin: var(--badge-offset-block) var(--badge-offset-inline);");
  expect(mapStyles).toContain(
    "translate(calc(-100% - var(--badge-offset-inline)), var(--badge-offset-block))",
  );
});
