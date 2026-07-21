// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";
import {
  createWorldGrid,
  createLocationGradient,
  findLocationCluster,
  formatCoordinate,
  nearestLocation,
  nearestPlace,
  WORLD_GRID_COLUMNS,
  WORLD_GRID_ROWS,
} from "../src/lib/map";

test("builds a recognizable world grid with unique cells", () => {
  const cells = createWorldGrid();
  const ids = new Set(cells.map((cell) => cell.id));

  expect(cells.length).toBeGreaterThan(600);
  expect(cells.length).toBeLessThan(700);
  expect(ids.size).toBe(cells.length);
  expect(Math.max(...cells.map((cell) => cell.column))).toBeLessThan(WORLD_GRID_COLUMNS);
  expect(Math.max(...cells.map((cell) => cell.row))).toBeLessThan(WORLD_GRID_ROWS);
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
  expect([...colors.values()].every((color) => color.startsWith("rgb("))).toBeTrue();
});

test("derives the visible place from the current coordinates", () => {
  expect(nearestPlace(41.88, -87.63)).toBe("Chicago");
  expect(nearestPlace(51.51, -0.13)).toBe("London");
  expect(nearestLocation(33.11, -96.82).countryCode).toBe("US");
});

test("rounds coordinates for the privacy-preserving readout", () => {
  expect(formatCoordinate(41.8819, "N", "S")).toBe("41.88° N");
  expect(formatCoordinate(-87.6278, "E", "W")).toBe("87.63° W");
  expect(formatCoordinate(41.8819, "N", "S", 3)).toBe("41.882° N");
});
