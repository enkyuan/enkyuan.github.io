// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";
import {
  DOT_FIELD_DOTS,
  DOT_FIELD_GRID,
  isCircularDotVisible,
  isErrorMarkDot,
} from "../../../src/lib/constants/dot-field";

test("uses one symmetric circular dot silhouette for every badge state", () => {
  const rowWidths = DOT_FIELD_DOTS.map(
    (row) => DOT_FIELD_DOTS.filter((column) => isCircularDotVisible(row, column)).length,
  );
  const columnHeights = DOT_FIELD_DOTS.map(
    (column) => DOT_FIELD_DOTS.filter((row) => isCircularDotVisible(row, column)).length,
  );

  expect(DOT_FIELD_GRID).toBe(13);
  expect(rowWidths).toEqual([5, 9, 11, 11, 13, 13, 13, 13, 13, 11, 11, 9, 5]);
  expect(columnHeights).toEqual(rowWidths);
  expect(rowWidths).toEqual([...rowWidths].reverse());
  expect(isErrorMarkDot(6, 6)).toBeTrue();
  expect(isErrorMarkDot(6, 2)).toBeFalse();
});
