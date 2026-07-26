// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";
import {
  createLocationGradient,
  createWorldGrid,
  createWorldPath,
  createWorldPathWaves,
  findLocationCluster,
  formatCoordinate,
  projectLocation,
  WORLD_GRID_COLUMNS,
  WORLD_GRID_ROWS,
  WORLD_PATH_WAVE_COUNT,
} from "../../../src/lib/hooks/use-map";

test("builds a recognizable world grid with unique cells", () => {
  const cells = createWorldGrid();
  const ids = new Set(cells.map((cell) => cell.id));

  expect(cells.length).toBeGreaterThan(2000);
  expect(cells.length).toBeLessThan(2100);
  expect(ids.size).toBe(cells.length);
  expect(Math.max(...cells.map((cell) => cell.column))).toBeLessThan(WORLD_GRID_COLUMNS);
  expect(Math.max(...cells.map((cell) => cell.row))).toBeLessThan(WORLD_GRID_ROWS);
});

test("combines the static world into one rounded SVG path", () => {
  const cells = createWorldGrid();
  const path = createWorldPath(cells);

  expect(path.match(/M/g)?.length).toBe(cells.length);
  expect(path).toContain("a0.14,0.14 0 0 1");
  expect(path).not.toContain("NaN");
});

test("groups the world into balanced diagonal animation waves", () => {
  const cells = createWorldGrid();
  const waves = createWorldPathWaves(cells);
  const waveCellCounts = waves.map((wave) => wave.path.match(/M/g)?.length ?? 0);

  expect(waves.length).toBe(WORLD_PATH_WAVE_COUNT);
  expect(waves.map((wave) => wave.index)).toEqual(
    Array.from({ length: WORLD_PATH_WAVE_COUNT }, (_, index) => index),
  );
  expect(waveCellCounts.reduce((total, count) => total + count, 0)).toBe(cells.length);
  expect(Math.max(...waveCellCounts) - Math.min(...waveCellCounts)).toBeLessThanOrEqual(1);
});

test("keeps Alaska and Greenland distinct at the higher grid resolution", () => {
  const ids = new Set(createWorldGrid().map((cell) => cell.id));

  expect(ids.has("7-8"), "Anchorage should resolve to Alaskan land").toBeTrue();
  expect(ids.has("6-34"), "Nuuk should resolve to Greenlandic land").toBeTrue();
  expect(ids.has("12-5"), "the Gulf of Alaska should remain water").toBeFalse();
  expect(ids.has("10-38"), "the North Atlantic should remain water").toBeFalse();
});

test("scales location highlights to the nearby landmass without crossing water", () => {
  const cells = createWorldGrid();
  const frisco = findLocationCluster(cells, 33.102, -96.817);
  const sydney = findLocationCluster(cells, -33.87, 151.21);
  const honolulu = findLocationCluster(cells, 21.31, -157.86);

  expect(frisco.length).toBeGreaterThan(sydney.length);
  expect(sydney.length).toBeGreaterThan(honolulu.length);
  expect(honolulu).toEqual(["18-5", "18-6"]);
  expect(
    [...frisco, ...sydney, ...honolulu].every((id) => cells.some((cell) => cell.id === id)),
  ).toBeTrue();
});

test("projects the badge and location cells through the same map coordinates", () => {
  const cells = createWorldGrid();
  const projected = projectLocation(33.102, -96.817);
  const [nearestCellId] = findLocationCluster(cells, 33.102, -96.817);
  const nearestCell = cells.find((cell) => cell.id === nearestCellId);

  expect(projected.xPercent).toBeCloseTo(23.106, 3);
  expect(projected.yPercent).toBeCloseTo(31.61, 2);
  expect(Math.abs(nearestCell.column + 0.5 - projected.column)).toBeLessThan(1);
  expect(Math.abs(nearestCell.row + 0.5 - projected.row)).toBeLessThan(1);
});

test("samples one continuous gradient across the location cluster", () => {
  const cells = createWorldGrid();
  const chicago = findLocationCluster(cells, 41.88, -87.63);
  const colors = createLocationGradient(cells, chicago);

  expect(colors.size).toBe(chicago.length);
  expect(new Set(colors.values()).size).toBeGreaterThan(3);
  expect(
    [...colors.values()].every(
      (color) => color.startsWith("color-mix(in srgb, oklch(") && !color.includes("rgb("),
    ),
  ).toBeTrue();
});

test("rounds coordinates for the privacy-preserving readout", () => {
  expect(formatCoordinate(41.8819, "N", "S")).toBe("41.88° N");
  expect(formatCoordinate(-87.6278, "E", "W")).toBe("87.63° W");
  expect(formatCoordinate(41.8819, "N", "S", 3)).toBe("41.882° N");
});
