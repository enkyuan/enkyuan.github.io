// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const projectRoot = new URL("..", import.meta.url).pathname;
const sourceFiles = [
  ...new Bun.Glob("src/**/*.{css,svelte,ts}").scanSync({ cwd: projectRoot }),
  ...new Bun.Glob("tests/**/*.{js,ts}").scanSync({ cwd: projectRoot }),
];
const authoredColorFiles = [
  ...new Bun.Glob("src/**/*.{css,html,svelte,ts}").scanSync({ cwd: projectRoot }),
  "static/favicon/favicon.svg",
  "static/favicon/site.webmanifest",
];

test("keeps source files below the 400-line responsibility ceiling", async () => {
  for (const file of sourceFiles) {
    const contents = await Bun.file(`${projectRoot}/${file}`).text();
    const lineCount = contents.trimEnd().split(/\r?\n/).length;
    expect(lineCount, `${file} has ${lineCount} lines`).toBeLessThanOrEqual(400);
  }
});

test("uses OKLCH for every authored literal color", async () => {
  const legacyColor = /#[\da-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\(/i;

  for (const file of authoredColorFiles) {
    const contents = await Bun.file(`${projectRoot}/${file}`).text();
    expect(contents, `${file} contains a non-OKLCH literal color`).not.toMatch(legacyColor);
  }
});

test("does not retain the orphaned link-preview surface", async () => {
  const removedFiles = [
    "src/lib/components/ui/link-preview.svelte",
    "src/lib/providers/link-preview.svelte",
    "src/lib/stores/link-preview.svelte",
  ];

  for (const file of removedFiles) {
    expect(await Bun.file(`${projectRoot}/${file}`).exists(), file).toBe(false);
  }
});

test("keeps the map badge inline", async () => {
  expect(await Bun.file(`${projectRoot}/src/lib/components/ui/map-badge.svelte`).exists()).toBe(
    false,
  );
});

test("keeps portfolio entries inline", async () => {
  expect(await Bun.file(`${projectRoot}/src/lib/components/portfolio-panel.svelte`).exists()).toBe(
    false,
  );
});

test("keeps map behavior in hooks and substantial component CSS in styles", async () => {
  const expectedFiles = [
    "src/lib/hooks/use-map.ts",
    "src/lib/hooks/use-location.ts",
    "src/lib/styles/about.css",
    "src/lib/styles/badge.css",
    "src/lib/styles/button.css",
    "src/lib/styles/card.css",
    "src/lib/styles/map.css",
  ];

  for (const file of expectedFiles) {
    expect(await Bun.file(`${projectRoot}/${file}`).exists(), file).toBe(true);
  }

  expect(await Bun.file(`${projectRoot}/src/lib/map.ts`).exists()).toBe(false);
  expect(await Bun.file(`${projectRoot}/src/lib/hooks/use-map-location.svelte.ts`).exists()).toBe(
    false,
  );
  expect(await Bun.file(`${projectRoot}/src/lib/components/ui/map.css`).exists()).toBe(false);

  const styleConsumers = [
    ["src/lib/components/about.svelte", 'import "$lib/styles/about.css";'],
    ["src/lib/components/ui/badge.svelte", 'import "$lib/styles/badge.css";'],
    ["src/lib/components/ui/button.svelte", 'import "$lib/styles/button.css";'],
    ["src/lib/components/ui/card.svelte", 'import "$lib/styles/card.css";'],
    ["src/lib/components/ui/map.svelte", 'import "$lib/styles/map.css";'],
  ] as const;

  for (const [file, stylesheetImport] of styleConsumers) {
    const contents = await Bun.file(`${projectRoot}/${file}`).text();
    expect(contents, file).toContain(stylesheetImport);
    expect(contents, file).not.toContain("<style>");
  }
});
