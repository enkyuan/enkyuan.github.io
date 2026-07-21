// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const page = await Bun.file(new URL("../src/routes/+page.svelte", import.meta.url)).text();
const mapComponent = await Bun.file(
  new URL("../src/lib/components/ui/map.svelte", import.meta.url),
).text();
const flagsComponent = await Bun.file(
  new URL("../src/lib/components/ui/flags.svelte", import.meta.url),
).text();
const badgeComponent = await Bun.file(
  new URL("../src/lib/components/ui/badge.svelte", import.meta.url),
).text();

test("renders the Ndot Hanzi name inline in the header", () => {
  expect(page).not.toContain("HanziName");
  expect(page).toContain('<span class="hanzi-name" aria-hidden="true">袁恩康</span>');
  expect(page).toContain("Ndot 77 JP Extended Name");
  expect(page).toContain("/fonts/ndot-77-jp-extended/name.woff2");
  expect(page).toContain("font-size: 1.125rem");
  expect(page).toContain("transform: translateY(1px)");
});

test("uses a deterministic rounded face for the Timeline and Works tabs", () => {
  expect(page).toContain('{ id: "timeline", label: "Timeline" }');
  expect(page).toContain('{ id: "work", label: "Works" }');
  expect(page).toContain('font-family: "Portfolio Rounded";');
  expect(page).toContain("/fonts/nunito/regular-latin.woff2");
  expect(page).toContain(
    'font-family: ".SF NS Rounded", "SF Pro Rounded", "Portfolio Rounded", sans-serif;',
  );
  expect(page).not.toContain("font-family: ui-rounded;");
});

test("fades the secondary tabs in without flashing on load", () => {
  expect(page).toContain("animation: secondary-tab-enter 240ms var(--ease-out) 180ms both;");
  expect(page).toContain(".secondary-tab:nth-child(3)");
  expect(page).toContain("animation-delay: 250ms;");
  expect(page).toContain("@keyframes secondary-tab-enter");
  expect(page).toContain(".secondary-tab {\n\t\t\tanimation: none;");
});

test("removes the Connect section without leaving stale styles", () => {
  expect(page).not.toContain('<p class="entry-date">Connect</p>');
  expect(page).not.toContain("$lib/constants/socials");
  expect(page).not.toContain("social-links");
  expect(page).not.toContain("LiveClock");
});

test("staggers Timeline and Works content without animating keyboard navigation", () => {
  expect(page).toContain("function staggerDelay(entryIndex: number, itemIndex: number)");
  expect(page).toContain("Math.min(entryIndex * 70 + itemIndex * 35, 280)");
  expect(page).toContain("{#each experiences as experience, entryIndex}");
  expect(page).toContain("{#each projects as project, entryIndex}");
  expect(page.match(/class:animate-content=\{animateContent\}/g)).toHaveLength(2);
  expect(page).toContain("animateContent = !fromKeyboard");
  expect(page).toContain(
    "animation: content-enter 260ms var(--ease-out) var(--stagger-delay, 0ms) both;",
  );
  expect(page).toContain("transform: translateY(0.45rem)");
  expect(page).toContain("@media (prefers-reduced-motion: reduce)");
  expect(page).toContain("animation: none");
});

test("renders the current-location map in the name tab", () => {
  expect(page).toContain('import Map from "$lib/components/ui/map.svelte";');
  expect(page).toContain("<Map animate={animateContent} />");
  expect(page).toContain('hidden={activeTab !== "name"}');
  expect(page).not.toContain("location-map.svelte");
});

test("locates automatically and presents the coordinates in a rounded pill", () => {
  expect(mapComponent).toContain('import { onMount } from "svelte";');
  expect(mapComponent).toContain('import { fade } from "svelte/transition";');
  expect(mapComponent).toContain('import Badge from "$lib/components/ui/badge.svelte";');
  expect(mapComponent).toContain('import Flags from "$lib/components/ui/flags.svelte";');
  expect(mapComponent).toContain('from "$lib/map";');
  expect(mapComponent).toContain("onMount(() => {");
  expect(mapComponent).toContain("locate();");
  expect(mapComponent).toContain('class="map"');
  expect(mapComponent).toContain('class="location-badge"');
  expect(mapComponent).not.toContain("pill-pin-icon");
  expect(mapComponent).not.toContain('<svg viewBox="0 0 16 16"');
  expect(mapComponent).not.toContain(".location-badge-anchor.located::after");
  expect(mapComponent).not.toContain(".map-cell.location-anchor::after");
  expect(mapComponent).not.toContain("@keyframes location-pin-drop");
  expect(mapComponent).toContain("class:location-anchor={cell.id === highlightedCells[0]}");
  expect(mapComponent).toContain("@keyframes location-cell-drop");
  expect(mapComponent).toContain("<Flags {countryCode} />");
  expect(mapComponent).not.toContain("countryCodeToFlag");
  expect(mapComponent).not.toContain("US_FLAG");
  expect(mapComponent).not.toContain(".map-cell.location-cell {\n\t\tbackground: linear-gradient");
  expect(badgeComponent).toContain("border-radius: 999px;");
  expect(mapComponent).not.toContain("Use current location");
});

test("keeps pending and failed location states at one viewport-bottom anchor", () => {
  expect(mapComponent).toContain('class:bottom-state={locationState !== "located"}');
  expect(mapComponent).toContain(".location-badge-anchor.bottom-state {");
  expect(mapComponent).toContain("position: fixed;");
  expect(mapComponent).toContain("bottom: max(1.5rem, env(safe-area-inset-bottom));");
  expect(mapComponent).toContain("left: 50%;");
  expect(mapComponent).toContain("transform: translateX(-50%);");
  expect(mapComponent).toContain('class:locating={locationState === "locating"}');
  expect(mapComponent).toContain("const LOADER_GRID = 12;");
  expect(mapComponent).toContain('class="loading-field"');
  expect(mapComponent).toContain("Finding your spot on the map…");
  expect(mapComponent).toContain('<svg viewBox="0 0 34 34" focusable="false">');
  expect(mapComponent).toContain("isLoadingDotVisible(row, column)");
  expect(mapComponent).toContain('r="1.15"');
  expect(mapComponent).toContain("flex: 0 0 34px;");
  expect(mapComponent).toContain("@keyframes loading-dot");
  expect(mapComponent).toContain("animation-delay: calc(var(--loader-delay) - 900ms);");
  expect(mapComponent).toContain(
    "in:fade={{ duration: animate && !prefersReducedMotion ? 180 : 0 }}",
  );
  expect(mapComponent).toContain(
    "out:fade={{ duration: animate && !prefersReducedMotion ? 120 : 0 }}",
  );
  expect(mapComponent).toContain('window.matchMedia("(prefers-reduced-motion: reduce)")');
});

test("keeps loading pending and renders location failures as a dot-matrix X", () => {
  expect(mapComponent).toContain("{ enableHighAccuracy: true, maximumAge: 0 }");
  expect(mapComponent).not.toContain("timeout:");
  expect(mapComponent).toContain('class="error-field"');
  expect(mapComponent).toContain("isErrorDotVisible(row, column)");
  expect(mapComponent).toContain("class:error-mark={isErrorDotVisible(row, column)}");
  expect(mapComponent).toContain("Math.abs(x - y) <= 1");
  expect(mapComponent).toContain("fill: rgba(255, 184, 186, 0.42);");
  expect(mapComponent).toContain("fill: #ff5c63;");
  expect(mapComponent).toContain('<h1 id="location-title">Location not found</h1>');
  expect(mapComponent).toContain("border-radius: 50%;");
  expect(mapComponent).not.toContain("RetryIcon");
  expect(mapComponent).not.toContain("retry-button");
});

test("keeps one visitor location session mounted and makes the badge interactive", () => {
  expect(page).toContain('hidden={activeTab !== "name"}');
  expect(mapComponent).toContain(
    'onclick={locationState === "locating" ? undefined : () => locate()}',
  );
  expect(mapComponent).toContain('ariaLabel={locationState === "error"');
  expect(mapComponent).toContain('"Try finding your location again"');
  expect(mapComponent).toContain('"Refresh your current location"');
  expect(badgeComponent).toContain("onclick?: (event: MouseEvent) => void;");
  expect(badgeComponent).toContain("<button");
  expect(badgeComponent).toContain("button.badge:hover");
});

test("replaces the unused tag list with the reusable badge primitive", async () => {
  expect(
    await Bun.file(new URL("../src/lib/components/ui/tag_list.svelte", import.meta.url)).exists(),
  ).toBe(false);
  expect(badgeComponent).toContain("children: Snippet;");
  expect(badgeComponent).toContain('class="badge {className}"');
});

test("selects any country flag through one compact component API", () => {
  expect(flagsComponent).toContain("countryCode: string; size?: number");
  expect(flagsComponent).toContain('code === "US"');
  expect(flagsComponent).toContain("String.fromCodePoint");
  expect(flagsComponent).toContain('class="country-flag"');
  expect(flagsComponent).toContain("isVisible(row, column)");
  expect(flagsComponent).not.toContain("clipPath");
  expect(flagsComponent).not.toContain("<rect");
  expect(flagsComponent).not.toContain("<path");
  expect(flagsComponent).not.toContain("<use");
});

test("positions the location pill from exact coordinates and the resolved map quadrant", () => {
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
  expect(mapComponent).toContain("enableHighAccuracy: true");
  expect(mapComponent).toContain("maximumAge: 0");
});
