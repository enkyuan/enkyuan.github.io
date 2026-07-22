export const DOT_FIELD_SIZE = 34;
export const DOT_FIELD_GRID = 13;
export const DOT_FIELD_RADIUS = 1.05;
export const DOT_FIELD_STEP = DOT_FIELD_SIZE / DOT_FIELD_GRID;
export const DOT_FIELD_DOTS = Array.from({ length: DOT_FIELD_GRID }, (_, index) => index);

const DOT_FIELD_CENTER = (DOT_FIELD_GRID - 1) / 2;
const CIRCLE_RADIUS = 6.7;

export function isCircularDotVisible(row: number, column: number) {
  return (column - DOT_FIELD_CENTER) ** 2 + (row - DOT_FIELD_CENTER) ** 2 <= CIRCLE_RADIUS ** 2;
}

export function distanceFromDotFieldCenter(row: number, column: number) {
  return Math.hypot(column - DOT_FIELD_CENTER, row - DOT_FIELD_CENTER);
}

export function isErrorMarkDot(row: number, column: number) {
  const x = Math.abs(column - DOT_FIELD_CENTER);
  const y = Math.abs(row - DOT_FIELD_CENTER);
  return isCircularDotVisible(row, column) && Math.abs(x - y) <= 1;
}
