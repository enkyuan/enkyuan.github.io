// @ts-nocheck -- Bun's test runtime is outside the application's TypeScript config.
import { expect, test } from "bun:test";

// Value: protects=the production flag dependency matches its lock and installed asset version;
// fails_when=manifest and lock drift or dependency is dev-only; why_new=no existing packaging contract test;
// seam=none; no_claim=the bundler's emitted asset URLs require the production build check.
test("locks the production flag dependency and retains its distributable SVG assets", async () => {
  const root = new URL("../", import.meta.url);
  const manifest = await Bun.file(new URL("package.json", root)).json();
  const lockText = await Bun.file(new URL("bun.lock", root)).text();
  // Bun's text lock uses JSON with trailing commas, without executable expressions.
  const lock = JSON.parse(lockText.replace(/,\s*([}\]])/g, "$1"));
  expect(await Bun.file(new URL("static/licenses/country-flag-icons.txt", root)).text()).toBe(
    await Bun.file(new URL("../node_modules/country-flag-icons/LICENSE", import.meta.url)).text(),
  );
  const dependency = "country-flag-icons";
  expect(manifest.dependencies[dependency]).toBeTruthy();
  expect(lock.workspaces[""].dependencies[dependency]).toBe(manifest.dependencies[dependency]);
  const installed = await Bun.file(
    new URL("../node_modules/country-flag-icons/package.json", import.meta.url),
  ).json();
  expect(lock.packages[dependency][0]).toBe(`${dependency}@${installed.version}`);
  expect(Bun.semver.satisfies(installed.version, manifest.dependencies[dependency])).toBeTrue();
  for (const code of ["FR", "FJ", "US", "CN", "JP", "BR", "ZA"]) {
    const svg = await Bun.file(
      new URL(`../node_modules/country-flag-icons/1x1/${code}.svg`, import.meta.url),
    ).text();
    expect(svg).toMatch(/<svg\b/);
  }
});
