export type MapCell = {
  id: string;
  row: number;
  column: number;
  latitude: number;
  longitude: number;
};

type GradientStop = {
  at: number;
  color: string;
};

export const WORLD_GRID_COLUMNS = 64;
export const WORLD_GRID_ROWS = 32;

const MAP_GRADIENT_STOPS: readonly GradientStop[] = [
  { at: 0, color: "oklch(0.151 0.03 261.872)" },
  { at: 0.42, color: "oklch(0.373 0.13 262.31)" },
  { at: 0.73, color: "oklch(0.702 0.088 253.74)" },
  { at: 1, color: "oklch(0.972 0.003 247.858)" },
];

// Generated from Natural Earth's public-domain 1:110m land polygons.
// https://www.naturalearthdata.com/downloads/110m-physical-vectors/
const WORLD_LAND_MASK: readonly string[] = [
  "0000000000000000000000000000000000000000000000000000000000000000",
  "0000000000000001111101111111000000011000000000001100000000000000",
  "0000000000011011110011111111100000000000001100011111000010000000",
  "0001111111111111111110111111000000001001111011111111111111110000",
  "0011111111111111111111011100110000111111111111111111111111111111",
  "0001111111111111001110000000000101101111111111111111111111111100",
  "0111100011111111111111000000001101111111111111111111111110011000",
  "0000000000111111111111100000000111111111111111111111111111000000",
  "0000000000111111111100000000001111111111111111111111111101000000",
  "0000000000111111111000000000001111001111111111111111111110000000",
  "0000000000011111110000000000001111111111111111111111110000000000",
  "0000000000001110000000000000011111111111111111111111110000000000",
  "0000000000000111101100000000011111111111111011101110000000000000",
  "0000000000000001100000000000011111111111100001100111010000000000",
  "0000000000000000011111000000011111111111100001100100001000000000",
  "0000000000000000001111100000000001111111100000000111101000000000",
  "0000000000000000011111111000000001111110000000000011110111000000",
  "0000000000000000001111111100000000111110000000000001110001100000",
  "0000000000000000001111111000000000111110100000000000001111000000",
  "0000000000000000000111111000000000111110100000000000011111100000",
  "0000000000000000000111110000000000111100000000000000111111100000",
  "0000000000000000000111100000000000011100000000000000111111100000",
  "0000000000000000000111000000000000000000000000000000000001100001",
  "0000000000000000000110000000000000000000000000000000000000000010",
  "0000000000000000001100000000000000000000000010000000000000000000",
  "0000000000000000000101000000000000000000000000000000000000000000",
  "0000000000000000000000000000000000000000000000000000000000000000",
  "0000000000000000000000000000000000000000000000000000000000000000",
  "0000000000000000000000000000000000000000000000000000000000000000",
  "0000000000000000000000000000000000000000000000000000000000000000",
  "0000000000000000000000000000000000000000000000000000000000000000",
  "0000000000000000000000000000000000000000000000000000000000000000",
];

function squaredProjectedDistance(
  latitude: number,
  longitude: number,
  targetLatitude: number,
  targetLongitude: number,
) {
  const longitudeScale = Math.max(Math.cos((latitude * Math.PI) / 180), 0.2);
  const latitudeDistance = latitude - targetLatitude;
  const rawLongitudeDistance = longitude - targetLongitude;
  const wrappedLongitudeDistance = ((rawLongitudeDistance + 540) % 360) - 180;
  const longitudeDistance = wrappedLongitudeDistance * longitudeScale;
  return latitudeDistance ** 2 + longitudeDistance ** 2;
}

export function createWorldGrid(): MapCell[] {
  const cells: MapCell[] = [];

  for (let row = 0; row < WORLD_GRID_ROWS; row += 1) {
    const latitude = 90 - ((row + 0.5) / WORLD_GRID_ROWS) * 180;

    for (let column = 0; column < WORLD_GRID_COLUMNS; column += 1) {
      if (WORLD_LAND_MASK[row][column] !== "1") continue;

      const longitude = -180 + ((column + 0.5) / WORLD_GRID_COLUMNS) * 360;
      cells.push({
        id: `${row}-${column}`,
        row,
        column,
        latitude,
        longitude,
      });
    }
  }

  return cells;
}

export function findLocationCluster(
  cells: readonly MapCell[],
  latitude: number,
  longitude: number,
  count = 9,
) {
  return [...cells]
    .sort(
      (first, second) =>
        squaredProjectedDistance(first.latitude, first.longitude, latitude, longitude) -
        squaredProjectedDistance(second.latitude, second.longitude, latitude, longitude),
    )
    .slice(0, count)
    .map((cell) => cell.id);
}

function sampleLocationGradient(progress: number) {
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const endIndex = MAP_GRADIENT_STOPS.findIndex((stop) => stop.at >= clampedProgress);
  const end = MAP_GRADIENT_STOPS[Math.max(endIndex, 1)];
  const start = MAP_GRADIENT_STOPS[Math.max(endIndex - 1, 0)];
  const span = end.at - start.at || 1;
  const amount = (clampedProgress - start.at) / span;
  const endPercentage = Number((amount * 100).toFixed(3));
  const startPercentage = Number((100 - endPercentage).toFixed(3));

  return `color-mix(in srgb, ${start.color} ${startPercentage}%, ${end.color} ${endPercentage}%)`;
}

export function createLocationGradient(cells: readonly MapCell[], cellIds: readonly string[]) {
  const cellsById = new Map(cells.map((cell) => [cell.id, cell]));
  const selectedCells = cellIds
    .map((cellId) => cellsById.get(cellId))
    .filter((cell): cell is MapCell => cell !== undefined);
  const anchor = selectedCells[0];
  if (!anchor) return new Map<string, string>();

  const positions = selectedCells.map((cell) => {
    const wrappedColumn =
      ((cell.column - anchor.column + WORLD_GRID_COLUMNS * 1.5) % WORLD_GRID_COLUMNS) -
      WORLD_GRID_COLUMNS / 2;
    return { cell, column: wrappedColumn, row: cell.row - anchor.row };
  });
  const columns = positions.map((position) => position.column);
  const rows = positions.map((position) => position.row);
  const minColumn = Math.min(...columns);
  const maxColumn = Math.max(...columns);
  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const columnSpan = maxColumn - minColumn || 1;
  const rowSpan = maxRow - minRow || 1;

  return new Map(
    positions.map(({ cell, column, row }) => {
      const horizontalProgress = (column - minColumn) / columnSpan;
      const verticalProgress = (row - minRow) / rowSpan;
      return [cell.id, sampleLocationGradient((horizontalProgress + verticalProgress) / 2)];
    }),
  );
}

export function formatCoordinate(value: number, positive: string, negative: string, precision = 2) {
  return `${Math.abs(value).toFixed(precision)}° ${value >= 0 ? positive : negative}`;
}
