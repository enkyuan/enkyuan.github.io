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

test("keeps Connect links without rendering the live clock", () => {
  expect(page).toContain('<p class="entry-date">Connect</p>');
  expect(page).toContain("{#each socials as social}");
  expect(page).not.toContain("LiveClock");
  expect(page).not.toContain("connect-copy");
});
