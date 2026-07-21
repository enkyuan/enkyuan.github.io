// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const page = await Bun.file(new URL("../src/routes/+page.svelte", import.meta.url)).text();
const mapComponent = await Bun.file(
  new URL("../src/lib/components/ui/map.svelte", import.meta.url),
).text();
const mapStyles = await Bun.file(
  new URL("../src/lib/components/ui/map.css", import.meta.url),
).text();
const portfolioPanelComponent = await Bun.file(
  new URL("../src/lib/components/portfolio-panel.svelte", import.meta.url),
).text();
const flagsComponent = await Bun.file(
  new URL("../src/lib/components/ui/flags.svelte", import.meta.url),
).text();
const badgeComponent = await Bun.file(
  new URL("../src/lib/components/ui/badge.svelte", import.meta.url),
).text();
const aboutComponent = await Bun.file(
  new URL("../src/lib/components/about.svelte", import.meta.url),
).text();
const aboutConstants = await Bun.file(
  new URL("../src/lib/constants/about.ts", import.meta.url),
).text();
const appStyles = await Bun.file(new URL("../src/app.css", import.meta.url)).text();

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
  expect(page).toContain('import PortfolioPanel from "$lib/components/portfolio-panel.svelte";');
  expect(page).toContain("entries={timelineEntries}");
  expect(page).toContain("entries={workEntries}");
  expect(page.match(/animate=\{animateContent\}/g)).toHaveLength(3);
  expect(page).toContain("animateContent = !fromKeyboard");
  expect(portfolioPanelComponent).toContain(
    "function staggerDelay(entryIndex: number, itemIndex: number)",
  );
  expect(portfolioPanelComponent).toContain("Math.min(entryIndex * 70 + itemIndex * 35, 280)");
  expect(portfolioPanelComponent).toContain("{#each entries as entry, entryIndex}");
  expect(portfolioPanelComponent).toContain("class:animate-content={animate}");
  expect(page).toContain("animateContent = !fromKeyboard");
  expect(portfolioPanelComponent).toContain(
    "animation: content-enter 260ms var(--ease-out) var(--stagger-delay, 0ms) both;",
  );
  expect(portfolioPanelComponent).toContain("transform: translateY(0.45rem)");
  expect(portfolioPanelComponent).toContain("@media (prefers-reduced-motion: reduce)");
  expect(portfolioPanelComponent).toContain("animation: none");
});

test("renders the current-location map in the name tab", () => {
  expect(page).toContain('import Map from "$lib/components/ui/map.svelte";');
  expect(page).toContain("<Map animate={animateContent} />");
  expect(page).toContain('hidden={activeTab !== "name"}');
  expect(page).not.toContain("location-map.svelte");
});

test("follows the map with a concise introduction and contact links", () => {
  expect(page).toContain('import About from "$lib/components/about.svelte";');
  expect(page).toContain("<Map animate={animateContent} />\n\t\t\t<About />");
  expect(mapStyles).toContain("padding-bottom: clamp(2.75rem, 6vh, 3.5rem);");
  expect(aboutComponent).toContain('import { about } from "$lib/constants/about";');
  expect(aboutConstants).toContain("this map is drawn from a 64 × 32 grid");
  expect(aboutConstants).toContain("hey, i'm enkang");
  expect(aboutConstants).toContain("associate software engineer @ t-mobile");
  expect(aboutConstants).toContain('text === "Email"');
  expect(aboutConstants).toContain('text === "Twitter"');
  expect(aboutComponent).toContain('aria-label="Email Enkang"');
  expect(aboutComponent).toContain('aria-label="Enkang on X"');
});

test("fills the role text with the shared OKLCH brand gradient", () => {
  expect(aboutComponent).toContain("oklch(0.892 0.063 355.343)");
  expect(aboutComponent).toContain("oklch(0.818 0.114 355.343)");
  expect(aboutComponent).toContain("oklch(0.617 0.253 355.343)");
  expect(aboutComponent).toContain("background-clip: text;");
  expect(aboutComponent).toContain("-webkit-text-fill-color: transparent;");
  expect(aboutComponent).toContain("background-size: 220% 100%;");
  expect(aboutComponent).toContain("animation: role-gradient-drift 7s linear infinite alternate;");
  expect(aboutComponent).toContain("@keyframes role-gradient-drift");
  expect(aboutComponent).toContain("background-position: 100% 50%;");
  expect(aboutComponent).toContain("background-position: 50% 50%;\n\t\t\tanimation: none;");
});

test("keeps the contact links clean without persistent underlines", () => {
  expect(aboutComponent).toContain("text-decoration: none;");
  expect(aboutComponent).toContain("transition: color 150ms var(--ease-out);");
  expect(aboutComponent).toContain("--map-gradient-blue: rgb(23 59 132);");
  expect(aboutComponent).toContain("color: var(--map-gradient-blue);");
  expect(aboutComponent).toContain("outline: 2px solid var(--map-gradient-blue);");
  expect(aboutComponent).not.toContain("text-decoration-line: underline;");
});

test("uses an optically aligned X logo at the surrounding font size", () => {
  expect(aboutComponent).toContain('class="social-icon"');
  expect(aboutComponent).toContain(
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
  );
  expect(aboutComponent).toContain("M18.244 2.25h3.308l-7.227 8.26");
  expect(aboutComponent).toContain("width: 1em;");
  expect(aboutComponent).toContain("height: 1em;");
  expect(aboutComponent).toContain("vertical-align: -0.08em;");
  expect(aboutComponent).not.toContain('aria-label="Enkang on X">x</a>');
});

test("uses one rounded type system across the map note and personal introduction", () => {
  expect(appStyles).not.toContain("shantell-sans");
  expect(aboutComponent).toContain(
    '".SF NS Rounded", "SF Pro Rounded", "Portfolio Rounded", sans-serif;',
  );
  expect(aboutComponent.match(/font-family: var\(--font-about-rounded\);/g)).toHaveLength(3);
  expect(aboutComponent).toContain("font-size: 0.8125rem;");
  expect(aboutComponent).toContain("line-height: 1.55;");
  expect(aboutComponent).toContain("font-size: 1.125rem;");
});

test("locates automatically and presents the coordinates in a rounded pill", () => {
  expect(mapComponent).toContain('import { onMount, tick } from "svelte";');
  expect(mapComponent).toContain('import Badge from "$lib/components/ui/badge.svelte";');
  expect(mapComponent).toContain('import Flags from "$lib/components/ui/flags.svelte";');
  expect(mapComponent).toContain('import "./map.css";');
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
  expect(mapStyles).toContain("@keyframes location-cell-drop");
  expect(mapComponent).toContain("<Flags {countryCode} />");
  expect(mapComponent).not.toContain("countryCodeToFlag");
  expect(mapComponent).not.toContain("US_FLAG");
  expect(mapStyles).not.toContain(".map-cell.location-cell {\n\tbackground: linear-gradient");
  expect(badgeComponent).toContain("border-radius: 999px;");
  expect(mapComponent).not.toContain("Use current location");
});

test("keeps pending and failed location states at one viewport-bottom anchor", () => {
  expect(mapComponent).toContain('class:bottom-state={locationState !== "located"}');
  expect(mapStyles).toContain(".location-badge-anchor.bottom-state {");
  expect(mapStyles).toContain("position: fixed;");
  expect(mapStyles).toContain("bottom: max(1.5rem, env(safe-area-inset-bottom));");
  expect(mapStyles).toContain("left: 50%;");
  expect(mapStyles).toContain("transform: translateX(-50%);");
  expect(mapComponent).toContain('class:locating={locationState === "locating"}');
  expect(mapComponent).toContain("const LOADER_GRID = 12;");
  expect(mapComponent).toContain('class="loading-field"');
  expect(mapComponent).toContain("Finding your spot on the map…");
  expect(mapComponent).toContain('<svg viewBox="0 0 34 34" focusable="false">');
  expect(mapComponent).toContain("isLoadingDotVisible(row, column)");
  expect(mapComponent).toContain('r="1.15"');
  expect(mapStyles).toContain("flex: 0 0 34px;");
  expect(mapStyles).toContain("@keyframes loading-dot");
  expect(mapStyles).toContain("animation-delay: calc(var(--loader-delay) - 900ms);");
  expect(mapComponent).toContain("startViewTransition?:");
  expect(mapComponent).toContain('class="shared-pill" bind:this={sharedPill}');
  expect(mapComponent).toContain("sharedPill.animate(");
  expect(mapComponent).toContain("firstRect.width / lastRect.width");
  expect(mapComponent).toContain('filter: "blur(4px)"');
  expect(mapStyles).toContain("view-transition-name: location-pill;");
  expect(mapStyles).toContain("::view-transition-group(location-pill)");
  expect(mapStyles).toContain("@keyframes liquid-pill-in");
  expect(mapStyles).toContain("transform: scale(1.015, 0.985);");
  expect(mapComponent).not.toContain("in:fade");
  expect(mapComponent).not.toContain("out:fade");
  expect(mapComponent).toContain('window.matchMedia("(prefers-reduced-motion: reduce)")');
});

test("keeps loading pending and renders location failures as a dot-matrix X", () => {
  expect(mapComponent).toContain("{ enableHighAccuracy: true, maximumAge: 0 }");
  expect(mapComponent).not.toContain("timeout:");
  expect(mapComponent).toContain('class="error-field"');
  expect(mapComponent).toContain("isErrorDotVisible(row, column)");
  expect(mapComponent).toContain("class:error-mark={isErrorDotVisible(row, column)}");
  expect(mapComponent).toContain("Math.abs(x - y) <= 1");
  expect(mapStyles).toContain("fill: rgba(255, 184, 186, 0.42);");
  expect(mapStyles).toContain("fill: #ff5c63;");
  expect(mapComponent).toContain('<h1 id="location-title">Location not found</h1>');
  expect(mapStyles).toContain("border-radius: 50%;");
  expect(mapComponent).not.toContain("RetryIcon");
  expect(mapComponent).not.toContain("retry-button");
});

test("keeps one visitor location session mounted and only makes failed badges interactive", () => {
  expect(page).toContain('hidden={activeTab !== "name"}');
  expect(mapComponent).toContain(
    'onclick={locationState === "error" ? () => void locate() : undefined}',
  );
  expect(mapComponent).not.toContain('disabled={locationState === "locating"}');
  expect(mapComponent).toContain(
    'ariaLabel={locationState === "error" ? "Try finding your location again" : undefined}',
  );
  expect(mapComponent).toContain('"Try finding your location again"');
  expect(mapComponent).not.toContain('"Refresh your current location"');
  expect(mapComponent).not.toContain('"Refresh location"');
  expect(badgeComponent).toContain("onclick?: (event: MouseEvent) => void;");
  expect(badgeComponent).toContain("disabled?: boolean;");
  expect(badgeComponent).toContain("<button");
  expect(badgeComponent).toContain("button.badge:hover:not(:disabled)");
  expect(badgeComponent).toContain("transform: scale(0.96);");
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
