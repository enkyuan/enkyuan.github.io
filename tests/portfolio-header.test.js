// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const page = await Bun.file(new URL("../src/routes/+page.svelte", import.meta.url)).text();

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
