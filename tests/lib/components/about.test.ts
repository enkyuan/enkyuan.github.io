// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const aboutComponent = await Bun.file(
  new URL("../../../src/lib/components/about.svelte", import.meta.url),
).text();
const aboutStyles = await Bun.file(
  new URL("../../../src/lib/styles/about.css", import.meta.url),
).text();

test("renders introduction content from the about constant", () => {
  expect(aboutComponent).toContain('import { about } from "$lib/constants/about";');
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

test("keeps contact links clean and aligned with the surrounding text", () => {
  expect(aboutStyles).toContain("text-decoration: none;");
  expect(aboutStyles).toContain("transition: color 150ms var(--ease-out);");
  expect(aboutStyles).toContain("--map-gradient-blue: oklch(0.373 0.13 262.31);");
  expect(aboutStyles).toContain("color: var(--map-gradient-blue);");
  expect(aboutStyles).toContain("outline: 2px solid var(--map-gradient-blue);");
  expect(aboutStyles).not.toContain("text-decoration-line: underline;");
  expect(aboutComponent).toContain('class="social-icon"');
  expect(aboutComponent).toContain('<span class="contact-separator" aria-hidden="true">/</span>');
  expect(aboutComponent).toContain(
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
  );
  expect(aboutComponent).toContain("M18.244 2.25h3.308l-7.227 8.26");
  expect(aboutStyles).toContain("width: 0.82em;");
  expect(aboutStyles).toContain("height: 0.82em;");
  expect(aboutStyles).toContain("vertical-align: -0.08em;");
  expect(aboutStyles).toContain("margin-right: -0.16em;");
  expect(aboutComponent).not.toContain('aria-label="Enkang on X">x</a>');
});

test("uses one rounded type system and a readable map-note measure", () => {
  expect(aboutStyles).toContain(
    '".SF NS Rounded", "SF Pro Rounded", "Portfolio Rounded", sans-serif;',
  );
  expect(aboutStyles.match(/font-family: var\(--font-about-rounded\);/g)).toHaveLength(3);
  expect(aboutStyles).toContain("max-width: 58ch;");
  expect(aboutStyles).toContain("text-wrap: pretty;");
  expect(aboutStyles).toContain("font-size: 0.8125rem;");
  expect(aboutStyles).toContain("line-height: 1.55;");
  expect(aboutStyles).toContain("font-size: 1.125rem;");
});
