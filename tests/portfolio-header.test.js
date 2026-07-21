// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const page = await Bun.file(new URL("../src/routes/+page.svelte", import.meta.url)).text();
const locationMap = await Bun.file(
  new URL("../src/lib/components/location-map.svelte", import.meta.url),
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
  expect(page).toContain('import LocationMap from "$lib/components/location-map.svelte";');
  expect(page).toContain("<LocationMap animate={animateContent} />");
});

test("locates automatically and presents the coordinates in a rounded pill", () => {
  expect(locationMap).toContain('import { onMount } from "svelte";');
  expect(locationMap).toContain("onMount(locate);");
  expect(locationMap).toContain('class="location-pill"');
  expect(locationMap).not.toContain("pill-pin-icon");
  expect(locationMap).not.toContain('<svg viewBox="0 0 16 16"');
  expect(locationMap).not.toContain(".location-pill.located::after");
  expect(locationMap).not.toContain(".map-cell.location-anchor::after");
  expect(locationMap).not.toContain("@keyframes location-pin-drop");
  expect(locationMap).toContain("class:location-anchor={cell.id === highlightedCells[0]}");
  expect(locationMap).toContain("@keyframes location-cell-drop");
  expect(locationMap).toContain('class="country-flag"');
  expect(locationMap).toContain("US_FLAG_DOTS");
  expect(locationMap).toContain("US_FLAG_STARS");
  expect(locationMap).toContain('id="us-flag-star"');
  expect(locationMap).not.toContain('text-anchor="middle">US</text>');
  expect(locationMap).not.toContain('<rect width="34" height="34"');
  expect(locationMap).not.toContain(".map-cell.location-cell {\n\t\tbackground: linear-gradient");
  expect(locationMap).toContain("border-radius: 999px;");
  expect(locationMap).not.toContain("Use current location");
});

test("positions the location pill from exact coordinates and the resolved map quadrant", () => {
  expect(locationMap).toContain(
    "function pillPosition(currentLatitude: number | undefined, currentLongitude: number | undefined)",
  );
  expect(locationMap).toContain("((currentLongitude + 180) / 360) * 100");
  expect(locationMap).toContain("((90 - currentLatitude) / 180) * 100");
  expect(locationMap).toContain("--anchor-x:${x}%;--anchor-y:${y}%");
  expect(locationMap).toContain("class:opens-right");
  expect(locationMap).toContain("class:opens-left");
  expect(locationMap).toContain("class:opens-below");
  expect(locationMap).toContain("class:opens-above");
  expect(locationMap).toContain("enableHighAccuracy: true");
  expect(locationMap).toContain("maximumAge: 0");
});
