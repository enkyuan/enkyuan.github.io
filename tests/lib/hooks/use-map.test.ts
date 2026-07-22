// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";
import {
  createLocationGradient,
  createWorldGrid,
  findLocationCluster,
  formatCoordinate,
  WORLD_GRID_COLUMNS,
  WORLD_GRID_ROWS,
} from "../../../src/lib/hooks/use-map";

test("builds a recognizable world grid with unique cells", () => {
  const cells = createWorldGrid();
  const ids = new Set(cells.map((cell) => cell.id));

  expect(cells.length).toBeGreaterThan(600);
  expect(cells.length).toBeLessThan(700);
  expect(ids.size).toBe(cells.length);
  expect(Math.max(...cells.map((cell) => cell.column))).toBeLessThan(WORLD_GRID_COLUMNS);
  expect(Math.max(...cells.map((cell) => cell.row))).toBeLessThan(WORLD_GRID_ROWS);
});

test("keeps Alaska and Greenland distinct at the arctic grid resolution", () => {
  const ids = new Set(createWorldGrid().map((cell) => cell.id));

  for (const landCell of ["3-4", "4-3", "5-3", "6-2", "1-24", "2-24", "3-24", "4-24"]) {
    expect(ids.has(landCell), `${landCell} should be land`).toBeTrue();
  }

  for (const waterCell of ["3-1", "3-21", "4-22", "4-26", "4-30", "6-5"]) {
    expect(ids.has(waterCell), `${waterCell} should be water`).toBeFalse();
  }
});

test("anchors location highlights to land for cities on different continents", () => {
  const cells = createWorldGrid();
  const chicago = findLocationCluster(cells, 41.88, -87.63);
  const sydney = findLocationCluster(cells, -33.87, 151.21);

  expect(chicago).toHaveLength(9);
  expect(sydney).toHaveLength(9);
  expect(chicago[0]).not.toBe(sydney[0]);
  expect(cells.some((cell) => cell.id === chicago[0])).toBeTrue();
  expect(cells.some((cell) => cell.id === sydney[0])).toBeTrue();
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
