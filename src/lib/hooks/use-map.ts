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

export const WORLD_GRID_COLUMNS = 96;
export const WORLD_GRID_ROWS = 48;
export const WORLD_CELL_SIZE = 0.68;
export const WORLD_CELL_OFFSET = (1 - WORLD_CELL_SIZE) / 2;
export const WORLD_CELL_RADIUS = 0.14;
export const WORLD_PATH_WAVE_COUNT = 10;
const WORLD_PATH_WAVE_SLOPE = 0.65;
const LOCATION_CLUSTER_REACH = 6;
const MIN_LOCATION_CLUSTER_SIZE = 3;
const MAX_LOCATION_CLUSTER_SIZE = 18;
const CARDINAL_NEIGHBORS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
] as const;

const MAP_GRADIENT_STOPS: readonly GradientStop[] = [
  { at: 0, color: "oklch(0.151 0.03 261.872)" },
  { at: 0.42, color: "oklch(0.373 0.13 262.31)" },
  { at: 0.73, color: "oklch(0.702 0.088 253.74)" },
  { at: 1, color: "oklch(0.972 0.003 247.858)" },
];

// Generated from Natural Earth's public-domain 1:50m land polygons using
// 3 × 3 supersampling per cell, with small-island centroids retained.
// https://www.naturalearthdata.com/downloads/50m-physical-vectors/
const WORLD_LAND_MASK: readonly string[] = [
  "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000011110000000000000000000000000000000000000000000000000000000",
  "000000000000000000000111111111111111111111110000000111111000111111001100111000000000000000000000",
  "000000000000000111111111111111111111111111110000000110110000000010000101011111000000110110000000",
  "100000000000001111110111111100000111111111100000000001000000001100111111111111111110111100000000",
  "100011111111111111111111111111000111111111000100000111111100011111111111111111111111111111111111",
  "111111111111111111111111110111110011111000110000001111111111111111111111111111111111111111111111",
  "011111111111111111111111011111100001100000000011011111111111111111111111111111111111111111111111",
  "001001110101111111111111001111110000000000000011011111111111111111111111111111111111110011110000",
  "001111100000111111111111111111111000000000000111011111111111111111111111111111111111110001101010",
  "111000000000011111111111111111111100000000000011111111111111111111111111111111111111111001000011",
  "000000000000000111111111111111111100000000000001111111111111111111111111111111111111110010000000",
  "000000000000000111111111111111101000000000000111111111110011111111111111111111111111011100000000",
  "000000000000000111111111111110000000000111000111111111111111101111111111111111111110110000000000",
  "000000000000000111111111111100000000000001000011111100111111111111111111111111110111110000000000",
  "000000000000000011111111111000100000000000010111111111111111111111111111111111111111010000000000",
  "000000000000000011111111111100000000000000011111111111111111111111111111111111111010010000000000",
  "000000000000000000111100001110000000000000001111111111111111111111111111111111111100000000000000",
  "000001100000000000111100111110000000000000011111111111111111111100011111111111101000001000000000",
  "000000000000000000000111110100110000000001011111111111111111111000011100011110001000001000000000",
  "000000000000000000000000110001011000000001011111111111111111101000001100101110011100001000000000",
  "000000000000000000000000011111110000000000011111111111111111110000011100101110011101100000001000",
  "000001000000000000000000001111111100000000000111111111111111100000010100111110111100000010110100",
  "000000100000000000000000001111111110000000000000011111111111000000010000011111111110000000000010",
  "001000000000000000000001101111111111100000000000001111111110000000000000001111111111110110001110",
  "011000100000000000000000001111111111111000000000000111111110001000010000000110101111111111000001",
  "001000000011000000000000000111111111111000001000000111111110000000000000000010111111111111111001",
  "111000010000000000000000000111111111110000000000000111111111110000000000000000000111111011101001",
  "110000011111000000000000000011111111110000000010000111111110110000000000000000001111111000001001",
  "111001000001000000000000000001111111110000000000000111111101101100000000000000111111111110101111",
  "000000000000010000000000000001111111100000000000000011111101100000000000000000111111111110001000",
  "000000000000000000100000000001111111000000000000000011111000000000000000000000111111111110000000",
  "000000000000000000000000001001111110000000000000000011110000000000000000000000011111111110000000",
  "000000000000000000000000000011111100000000000000000000000000000000000000000000010000111100000010",
  "000000000000000000000000000011111000000000000000000000000000000000000000000000000000001100000011",
  "110000000000000000000000000111100000000000000000000000000000000000000000000000000000000100000100",
  "000000000000000000000000000111000000000000000000000000000010010000000000000000000000000000001100",
  "000000000000000000000000000111011000000000000000000000000000000000100000000000000000000000001000",
  "000000000000000000000000000011100000001000000000000000000000000000010000000000000000000000100100",
  "000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000011101000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000001111000000000000000000000000000111000000011111111100101110000010000",
  "000000000000000000000000000111110000000000000011111110011111111111111111111111111111111111100000",
  "000000000000111110001111111111110000000000111111111111111111111111111111111111111111111111111100",
  "000000111111111111111111111111100001000111111111111111111111111111111111111111111111111111111000",
  "000011111111111111111111111111110011111111111111111111111111111111111111111111111111111111100000",
  "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
  "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
];

export function projectLocation(latitude: number, longitude: number) {
  const clampedLatitude = Math.max(-90, Math.min(latitude, 90));
  const wrappedLongitude = (((longitude + 180) % 360) + 360) % 360;
  const xProgress = wrappedLongitude / 360;
  const yProgress = (90 - clampedLatitude) / 180;

  return {
    column: xProgress * WORLD_GRID_COLUMNS,
    row: yProgress * WORLD_GRID_ROWS,
    xPercent: xProgress * 100,
    yPercent: yProgress * 100,
  };
}

function squaredGridDistance(cell: MapCell, targetRow: number, targetColumn: number) {
  const rowDistance = cell.row + 0.5 - targetRow;
  const rawColumnDistance = cell.column + 0.5 - targetColumn;
  const columnDistance =
    ((rawColumnDistance + WORLD_GRID_COLUMNS * 1.5) % WORLD_GRID_COLUMNS) - WORLD_GRID_COLUMNS / 2;
  return rowDistance ** 2 + columnDistance ** 2;
}

function findLandNeighborhood(cells: readonly MapCell[], anchor: MapCell) {
  const cellsById = new Map(cells.map((cell) => [cell.id, cell]));
  const neighborhood: MapCell[] = [];
  const visited = new Set([anchor.id]);
  const queue = [{ cell: anchor, depth: 0 }];

  for (let index = 0; index < queue.length; index += 1) {
    const { cell, depth } = queue[index];
    neighborhood.push(cell);
    if (depth >= LOCATION_CLUSTER_REACH) continue;

    for (const [rowOffset, columnOffset] of CARDINAL_NEIGHBORS) {
      const row = cell.row + rowOffset;
      if (row < 0 || row >= WORLD_GRID_ROWS) continue;

      const column = (cell.column + columnOffset + WORLD_GRID_COLUMNS) % WORLD_GRID_COLUMNS;
      const nextCell = cellsById.get(`${row}-${column}`);
      if (!nextCell || visited.has(nextCell.id)) continue;

      visited.add(nextCell.id);
      queue.push({ cell: nextCell, depth: depth + 1 });
    }
  }

  return neighborhood;
}

function adaptiveClusterSize(neighborhood: readonly MapCell[]) {
  const equalAreaCellCount = neighborhood.reduce(
    (total, cell) => total + Math.max(Math.cos((cell.latitude * Math.PI) / 180), 0),
    0,
  );
  const calculatedSize = Math.round(MIN_LOCATION_CLUSTER_SIZE + Math.sqrt(equalAreaCellCount));

  return Math.min(
    neighborhood.length,
    Math.max(MIN_LOCATION_CLUSTER_SIZE, Math.min(calculatedSize, MAX_LOCATION_CLUSTER_SIZE)),
  );
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

function roundedCellPath(cell: MapCell) {
  const x = Number((cell.column + WORLD_CELL_OFFSET).toFixed(2));
  const y = Number((cell.row + WORLD_CELL_OFFSET).toFixed(2));
  const straight = Number((WORLD_CELL_SIZE - WORLD_CELL_RADIUS * 2).toFixed(2));
  const radius = WORLD_CELL_RADIUS;

  return [
    `M${x + radius},${y}`,
    `h${straight}`,
    `a${radius},${radius} 0 0 1 ${radius},${radius}`,
    `v${straight}`,
    `a${radius},${radius} 0 0 1 -${radius},${radius}`,
    `h-${straight}`,
    `a${radius},${radius} 0 0 1 -${radius},-${radius}`,
    `v-${straight}`,
    `a${radius},${radius} 0 0 1 ${radius},-${radius}`,
    "z",
  ].join("");
}

export function createWorldPath(cells: readonly MapCell[]) {
  return cells.map(roundedCellPath).join("");
}

function cellWavePosition(cell: MapCell) {
  return cell.column + cell.row * WORLD_PATH_WAVE_SLOPE;
}

export function createWorldPathWaves(cells: readonly MapCell[]) {
  const sortedCells = [...cells].sort(
    (first, second) => cellWavePosition(first) - cellWavePosition(second),
  );

  return Array.from({ length: WORLD_PATH_WAVE_COUNT }, (_, index) => {
    const start = Math.floor((index * sortedCells.length) / WORLD_PATH_WAVE_COUNT);
    const end = Math.floor(((index + 1) * sortedCells.length) / WORLD_PATH_WAVE_COUNT);

    return {
      index,
      path: createWorldPath(sortedCells.slice(start, end)),
    };
  });
}

export function findLocationCluster(
  cells: readonly MapCell[],
  latitude: number,
  longitude: number,
  count?: number,
) {
  const projectedLocation = projectLocation(latitude, longitude);
  const sortedCells = [...cells].sort(
    (first, second) =>
      squaredGridDistance(first, projectedLocation.row, projectedLocation.column) -
      squaredGridDistance(second, projectedLocation.row, projectedLocation.column),
  );
  const anchor = sortedCells[0];
  if (!anchor) return [];

  const neighborhood = findLandNeighborhood(cells, anchor);
  const clusterSize = count ?? adaptiveClusterSize(neighborhood);

  return neighborhood
    .sort(
      (first, second) =>
        squaredGridDistance(first, projectedLocation.row, projectedLocation.column) -
        squaredGridDistance(second, projectedLocation.row, projectedLocation.column),
    )
    .slice(0, clusterSize)
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
