// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const page = await Bun.file(new URL("../../src/routes/+page.svelte", import.meta.url)).text();
const portfolioEntryStyles = await Bun.file(
  new URL("../../src/routes/portfolio-entries.css", import.meta.url),
).text();

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

test("removes the Connect section without leaving stale route styles", () => {
  expect(page).not.toContain('<p class="entry-date">Connect</p>');
  expect(page).not.toContain("$lib/constants/socials");
  expect(page).not.toContain("social-links");
  expect(page).not.toContain("LiveClock");
});

test("staggers Timeline and Work content without animating keyboard navigation", () => {
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

test("places the introduction directly after the map", () => {
  expect(page).toContain('import About from "$lib/components/about.svelte";');
  expect(page).toContain("<Map animate={animateContent} />\n\t\t\t<About />");
});
