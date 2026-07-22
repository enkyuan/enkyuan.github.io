// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const page = await Bun.file(new URL("../src/routes/+page.svelte", import.meta.url)).text();
const mapComponent = await Bun.file(
  new URL("../src/lib/components/ui/map.svelte", import.meta.url),
).text();
const mapStyles = await Bun.file(new URL("../src/lib/styles/map.css", import.meta.url)).text();
const mapHook = await Bun.file(new URL("../src/lib/hooks/use-map.ts", import.meta.url)).text();
const locationHook = await Bun.file(
  new URL("../src/lib/hooks/use-location.ts", import.meta.url),
).text();
const portfolioEntryStyles = await Bun.file(
  new URL("../src/routes/portfolio-entries.css", import.meta.url),
).text();
const flagsComponent = await Bun.file(
  new URL("../src/lib/components/ui/flags.svelte", import.meta.url),
).text();
const badgeComponent = await Bun.file(
  new URL("../src/lib/components/ui/badge.svelte", import.meta.url),
).text();
const badgeStyles = await Bun.file(new URL("../src/lib/styles/badge.css", import.meta.url)).text();
const aboutComponent = await Bun.file(
  new URL("../src/lib/components/about.svelte", import.meta.url),
).text();
const aboutStyles = await Bun.file(new URL("../src/lib/styles/about.css", import.meta.url)).text();
const aboutConstants = await Bun.file(
  new URL("../src/lib/constants/about.ts", import.meta.url),
).text();
const appStyles = await Bun.file(new URL("../src/app.css", import.meta.url)).text();
const appHtml = await Bun.file(new URL("../src/app.html", import.meta.url)).text();
const dotField = await Bun.file(
  new URL("../src/lib/constants/dot-field.ts", import.meta.url),
).text();

test("uses the Hanzi name as the browser title", () => {
  expect(appHtml).toContain("<title>袁恩康</title>");
  expect(appHtml).not.toContain("<title>Enkang Yuan</title>");
});

test("renders the Ndot Hanzi name inline in the header", () => {
  expect(page).not.toContain("HanziName");
  expect(page).toContain('<span class="hanzi-name" aria-hidden="true">袁恩康</span>');
  expect(page).toContain("Ndot 77 JP Extended Name");
  expect(page).toContain("/fonts/ndot-77-jp-extended/name.woff2");
  expect(page).toContain("font-size: 1.125rem");
  expect(page).toContain("transform: translateY(1px)");
});

test("uses a deterministic rounded face for the Timeline and Work tabs", () => {
  expect(page).toContain('{ id: "timeline", label: "Timeline" }');
  expect(page).toContain('{ id: "work", label: "Work" }');
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
  expect(page).not.toContain("PortfolioPanel");
  expect(page).toContain('import "./portfolio-entries.css";');
  expect(page).toContain('activeTab === "timeline" ? timelineEntries');
  expect(page).toContain('activeTab === "work" ? workEntries : []');
  expect(page).toContain("{#each activeEntries as entry, entryIndex}");
  expect(page).toContain("class:animate-content={animateContent}");
  expect(page).toContain("animateContent = !fromKeyboard");
  expect(page).toContain("function staggerDelay(entryIndex: number, itemIndex: number)");
  expect(page).toContain("Math.min(entryIndex * 70 + itemIndex * 35, 280)");
  expect(portfolioEntryStyles).toContain(
    "animation: content-enter 260ms var(--ease-out) var(--stagger-delay, 0ms) both;",
  );
  expect(portfolioEntryStyles).toContain("transform: translateY(0.45rem)");
  expect(portfolioEntryStyles).toContain("@media (prefers-reduced-motion: reduce)");
  expect(portfolioEntryStyles).toContain("animation: none");
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
  expect(aboutConstants).toContain(
    'rolePrefix: "i\'m currently an associate software engineer intern @"',
  );
  expect(aboutConstants).toContain('role: "t-mobile"');
  expect(aboutConstants).toContain('text === "Email"');
  expect(aboutConstants).toContain('text === "Twitter"');
  expect(aboutComponent).toContain('aria-label="Email Enkang"');
  expect(aboutComponent).toContain('aria-label="Enkang on X"');
});

test("fills only the employer name with the shared OKLCH brand gradient", () => {
  expect(aboutComponent).toContain('import "$lib/styles/about.css";');
  expect(aboutComponent).toContain('<span class="role-highlight">{about.role}</span>');
  expect(aboutComponent).not.toContain('<span class="role-highlight">{about.role}</span>.');
  expect(aboutComponent).not.toContain("</a>.");
  expect(aboutStyles).toContain("oklch(0.892 0.063 355.343)");
  expect(aboutStyles).toContain("oklch(0.818 0.114 355.343)");
  expect(aboutStyles).toContain("oklch(0.617 0.253 355.343)");
  expect(aboutStyles).toContain("background-clip: text;");
  expect(aboutStyles).toContain("-webkit-text-fill-color: transparent;");
  expect(aboutStyles).toContain("background-size: 200% 100%;");
  expect(aboutStyles).toContain("animation: role-gradient-drift 5.5s linear infinite;");
  expect(aboutStyles).not.toContain("infinite alternate");
  expect(aboutStyles).toContain("@keyframes role-gradient-drift");
  expect(aboutStyles).toContain("background-position: 100% 50%;");
  expect(aboutStyles).toContain("background-position: 50% 50%;\n    animation: none;");
});

test("keeps the contact links clean without persistent underlines", () => {
  expect(aboutStyles).toContain("text-decoration: none;");
  expect(aboutStyles).toContain("transition: color 150ms var(--ease-out);");
  expect(aboutStyles).toContain("--map-gradient-blue: oklch(0.373 0.13 262.31);");
  expect(aboutStyles).toContain("color: var(--map-gradient-blue);");
  expect(aboutStyles).toContain("outline: 2px solid var(--map-gradient-blue);");
  expect(aboutStyles).not.toContain("text-decoration-line: underline;");
});

test("uses an optically aligned X logo at the surrounding font size", () => {
  expect(aboutComponent).toContain('class="social-icon"');
  expect(aboutComponent).toContain('<span class="contact-separator" aria-hidden="true">/</span>');
  expect(aboutComponent).toContain(
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
  );
  expect(aboutComponent).toContain("M18.244 2.25h3.308l-7.227 8.26");
  expect(aboutStyles).toContain(".social-icon svg {");
  expect(aboutStyles).toContain("width: 0.82em;");
  expect(aboutStyles).toContain("height: 0.82em;");
  expect(aboutStyles).toContain("vertical-align: -0.08em;");
  expect(aboutStyles).toContain("margin-right: -0.16em;");
  expect(aboutComponent).not.toContain('aria-label="Enkang on X">x</a>');
});

test("uses one rounded type system across the map note and personal introduction", () => {
  expect(appStyles).not.toContain("shantell-sans");
  expect(aboutStyles).toContain(
    '".SF NS Rounded", "SF Pro Rounded", "Portfolio Rounded", sans-serif;',
  );
  expect(aboutStyles.match(/font-family: var\(--font-about-rounded\);/g)).toHaveLength(3);
  expect(aboutStyles).toContain("font-size: 0.8125rem;");
  expect(aboutStyles).toContain("line-height: 1.55;");
  expect(aboutStyles).toContain("font-size: 1.125rem;");
});

test("locates automatically and presents the coordinates in a rounded pill", () => {
  expect(mapComponent).toContain('import { useLocation } from "$lib/hooks/use-location";');
  expect(mapComponent).toContain('import Badge from "$lib/components/ui/badge.svelte";');
  expect(mapComponent).toContain('import Flags from "$lib/components/ui/flags.svelte";');
  expect(mapComponent).toContain('import "$lib/styles/map.css";');
  expect(mapComponent).toContain('from "$lib/hooks/use-map";');
  expect(locationHook).toContain("export function useLocation(");
  expect(locationHook).toContain("const location = writable<Location>(");
  expect(locationHook).not.toContain("$state");
  expect(locationHook).toContain("onMount(() => {");
  expect(locationHook).toContain("void locate();");
  expect(mapHook).toContain("export function createWorldGrid()");
  expect(mapComponent).toContain('class="map"');
  expect(mapComponent).toContain('class="location-badge"');
  expect(mapComponent).not.toContain("pill-pin-icon");
  expect(mapComponent).not.toContain('<svg viewBox="0 0 16 16"');
  expect(mapComponent).not.toContain(".location-badge-anchor.located::after");
  expect(mapComponent).not.toContain(".map-cell.location-anchor::after");
  expect(mapComponent).not.toContain("@keyframes location-pin-drop");
  expect(mapComponent).toContain(
    "class:location-anchor={cell.id === $location.highlightedCells[0]}",
  );
  expect(mapStyles).toContain("@keyframes location-cell-drop");
  expect(mapComponent).toContain("<Flags countryCode={$location.countryCode} />");
  expect(mapComponent).not.toContain("countryCodeToFlag");
  expect(mapComponent).not.toContain("US_FLAG");
  expect(mapStyles).not.toContain(".map-cell.location-cell {\n\tbackground: linear-gradient");
  expect(badgeStyles).toContain("border-radius: 999px;");
  expect(mapComponent).not.toContain("Use current location");
});

test("derives the map marker from the visiting browser's live coordinates", () => {
  expect(locationHook).toContain("requestCurrentPosition(navigator.geolocation)");
  expect(locationHook).toContain("const latitude = position.coords.latitude;");
  expect(locationHook).toContain("const longitude = position.coords.longitude;");
  expect(locationHook).toContain("reverseGeocode(latitude, longitude)");
  expect(locationHook).toContain(
    "geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode",
  );
  expect(locationHook).toContain('featureTypes: "Locality"');
  expect(locationHook).toContain("formatGeocodedCountryCode(resolved)");
  expect(appHtml).toContain("connect-src 'self' https://corsproxy.io https://geocode.arcgis.com;");
  expect(locationHook).toContain("formatGeocodedPlace(resolved)");
  expect(locationHook).toContain("findLocationCluster(cells, latitude, longitude)");
  expect(locationHook).toContain("createLocationGradient(cells, cluster)");
  expect(locationHook).toContain("enableHighAccuracy: false");
  expect(locationHook).toContain("maximumAge: 5 * 60 * 1000");
  expect(locationHook).toContain("timeout: 10_000");
  expect(locationHook).not.toContain("localStorage");
  expect(locationHook).not.toContain("sessionStorage");
  expect(mapHook).not.toContain("const PLACES");
  expect(mapHook).not.toContain("nearestLocation");
  expect(mapComponent).toContain(
    "style={pillPosition(locationAnchor?.latitude, locationAnchor?.longitude)}",
  );
});

test("keeps pending and failed location states at one viewport-bottom anchor", () => {
  expect(mapComponent).toContain('class:bottom-state={$location.state !== "located"}');
  expect(mapStyles).toContain(".location-badge-anchor.bottom-state {");
  expect(mapStyles).toContain("position: fixed;");
  expect(mapStyles).toContain("bottom: max(1.5rem, env(safe-area-inset-bottom));");
  expect(mapStyles).toContain("left: 50%;");
  expect(mapStyles).toContain("transform: translateX(-50%);");
  expect(mapComponent).toContain('class:locating={$location.state === "locating"}');
  expect(mapComponent).toContain('from "$lib/constants/dot-field";');
  expect(mapComponent).toContain('class="loading-field"');
  expect(mapComponent).toContain("Finding your spot on the map…");
  expect(mapComponent).toContain('<svg viewBox="0 0 34 34" focusable="false">');
  expect(mapComponent).toContain("isCircularDotVisible(row, column)");
  expect(mapComponent).toContain("r={DOT_FIELD_RADIUS}");
  expect(mapStyles).toContain("flex: 0 0 34px;");
  expect(mapStyles).toContain("@keyframes loading-dot");
  expect(mapStyles).toContain("animation-delay: calc(var(--loader-delay) - 900ms);");
  expect(locationHook).toContain("startViewTransition?:");
  expect(mapComponent).toContain('class="shared-pill" bind:this={sharedPill}');
  expect(locationHook).toContain("sharedPill.animate(");
  expect(locationHook).toContain("firstRect.width / lastRect.width");
  expect(locationHook).toContain('filter: "blur(4px)"');
  expect(mapStyles).toContain("view-transition-name: location-pill;");
  expect(mapStyles).toContain("::view-transition-group(location-pill)");
  expect(mapStyles).toContain("@keyframes liquid-pill-in");
  expect(mapStyles).toContain("transform: scale(1.01, 0.99);");
  expect(mapComponent).not.toContain("in:fade");
  expect(mapComponent).not.toContain("out:fade");
  expect(locationHook).toContain('window.matchMedia("(prefers-reduced-motion: reduce)")');
});

test("morphs loading and error badges in place without a viewport-edge entrance", () => {
  expect(locationHook).toContain(
    'const staysAtBottom = currentLocation.state !== "located" && nextLocation.state !== "located";',
  );
  expect(locationHook).toContain("if (staysAtBottom) {");
  expect(locationHook).toContain("transform: `scaleX(${firstRect.width / lastRect.width})`");
  expect(locationHook).toContain('transformOrigin: "center bottom"');
  expect(locationHook).toContain("duration: 240");
  expect(locationHook).toContain('easing: "cubic-bezier(0.77, 0, 0.175, 1)"');
  expect(mapComponent).not.toContain("{#key $location.state}");
  expect(mapComponent).toContain("onclick={canRetryLocation ? () => void locate() : undefined}");
  expect(mapStyles).toContain("::view-transition-old(root)");
  expect(mapStyles).toContain("::view-transition-new(root)");
});

test("keeps loading pending and renders classified location failures as a dot-matrix X", () => {
  expect(locationHook).toContain('kind: "permission-denied"');
  expect(locationHook).toContain('hint: "Allow it in browser settings"');
  expect(locationHook).toContain('kind: "position-unavailable"');
  expect(locationHook).toContain('kind: "timeout"');
  expect(mapComponent).toContain('class="error-field"');
  expect(mapComponent).toContain("class:error-mark={isErrorMarkDot(row, column)}");
  expect(dotField).toContain("export const DOT_FIELD_GRID = 13;");
  expect(dotField).toContain("const CIRCLE_RADIUS = 6.7;");
  expect(dotField).toContain("Math.abs(x - y) <= 1");
  expect(flagsComponent).toContain("isCircularDotVisible(row, column)");
  expect(flagsComponent).toContain("r={DOT_FIELD_RADIUS}");
  expect(mapStyles).toContain("fill: oklch(0.849 0.083 17.077 / 0.42);");
  expect(mapStyles).toContain("fill: oklch(0.692 0.198 21.503);");
  expect(mapComponent).toContain('$location.failure?.title ?? "Location unavailable"');
  expect(mapComponent).toContain('class="state-hint"');
  expect(mapStyles).not.toContain("border-radius: 50%;");
  expect(mapComponent).not.toContain("RetryIcon");
  expect(mapComponent).not.toContain("retry-button");
});

test("keeps one visitor location session mounted and only makes recoverable failures interactive", () => {
  expect(page).toContain('hidden={activeTab !== "name"}');
  expect(mapComponent).toContain("$location.failure?.retryable === true");
  expect(mapComponent).toContain("onclick={canRetryLocation ? () => void locate() : undefined}");
  expect(mapComponent).toContain(
    'ariaLabel={canRetryLocation ? "Try finding your location again" : undefined}',
  );
  expect(mapComponent).toContain('"Try finding your location again"');
  expect(mapComponent).not.toContain('"Refresh your current location"');
  expect(mapComponent).not.toContain('"Refresh location"');
  expect(badgeComponent).toContain("onclick?: (event: MouseEvent) => void;");
  expect(badgeComponent).toContain("disabled?: boolean;");
  expect(badgeComponent).toContain("<button");
  expect(badgeStyles).toContain("button.badge:hover:not(:disabled)");
  expect(badgeStyles).toContain("transform: scale(0.96);");
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
  expect(flagsComponent).toContain("isCircularDotVisible(row, column)");
  expect(flagsComponent).toContain("fill={`url(#${patternId})`}");
  expect(flagsComponent).not.toContain("border-radius: 50%");
  expect(flagsComponent).not.toContain("overflow: hidden");
  expect(flagsComponent).not.toContain("clipPath");
  expect(flagsComponent).not.toContain("<rect");
  expect(flagsComponent).not.toContain("<path");
  expect(flagsComponent).not.toContain("<use");
});

test("positions the location pill from its rendered marker and resolved map quadrant", () => {
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
  expect(locationHook).toContain("enableHighAccuracy: false");
  expect(locationHook).toContain("maximumAge: 5 * 60 * 1000");
});

test("keeps the located badge beside its rendered marker and inside every map edge", () => {
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
