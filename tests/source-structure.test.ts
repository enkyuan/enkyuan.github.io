// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const projectRoot = new URL("..", import.meta.url).pathname;
const sourceFiles = [
  ...new Bun.Glob("src/**/*.{css,svelte,ts}").scanSync({ cwd: projectRoot }),
  ...new Bun.Glob("tests/**/*.{js,ts}").scanSync({ cwd: projectRoot }),
];

test("keeps source files below the 400-line responsibility ceiling", async () => {
  for (const file of sourceFiles) {
    const contents = await Bun.file(`${projectRoot}/${file}`).text();
    const lineCount = contents.trimEnd().split(/\r?\n/).length;
    expect(lineCount, `${file} has ${lineCount} lines`).toBeLessThanOrEqual(400);
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
