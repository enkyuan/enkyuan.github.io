export type MapCell = {
  id: string;
  row: number;
  column: number;
  latitude: number;
  longitude: number;
};

type Place = {
  name: string;
  latitude: number;
  longitude: number;
};

export const WORLD_GRID_COLUMNS = 64;
export const WORLD_GRID_ROWS = 32;

// Generated from Natural Earth's public-domain 1:110m land polygons.
// https://www.naturalearthdata.com/downloads/110m-physical-vectors/
const WORLD_LAND_MASK: readonly string[] = [
  "0000000000000000000000000000000000000000000000000000000000000000",
  "0000000000000001111111111111110000011000000000001100000000000000",
  "0000000000011011110011111111100000000000001100011111000010000000",
  "1111111111111111111111111111111111101001111011111111111111110000",
  "0111111111111111111111111111111111111111111111111111111111111111",
  "0001111111111111001110000000000101101111111111111111111111111100",
  "0000000011111111111111000000001101111111111111111111111110011000",
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

const PLACES: readonly Place[] = [
  { name: "Amsterdam", latitude: 52.37, longitude: 4.9 },
  { name: "Atlanta", latitude: 33.75, longitude: -84.39 },
  { name: "Austin", latitude: 30.27, longitude: -97.74 },
  { name: "Bangkok", latitude: 13.76, longitude: 100.5 },
  { name: "Barcelona", latitude: 41.39, longitude: 2.17 },
  { name: "Beijing", latitude: 39.9, longitude: 116.41 },
  { name: "Berlin", latitude: 52.52, longitude: 13.41 },
  { name: "Boston", latitude: 42.36, longitude: -71.06 },
  { name: "Buenos Aires", latitude: -34.6, longitude: -58.38 },
  { name: "Chicago", latitude: 41.88, longitude: -87.63 },
  { name: "Dallas", latitude: 32.78, longitude: -96.8 },
  { name: "Denver", latitude: 39.74, longitude: -104.99 },
  { name: "Dubai", latitude: 25.2, longitude: 55.27 },
  { name: "Hong Kong", latitude: 22.32, longitude: 114.17 },
  { name: "Istanbul", latitude: 41.01, longitude: 28.98 },
  { name: "Jakarta", latitude: -6.21, longitude: 106.85 },
  { name: "Lagos", latitude: 6.52, longitude: 3.38 },
  { name: "London", latitude: 51.51, longitude: -0.13 },
  { name: "Los Angeles", latitude: 34.05, longitude: -118.24 },
  { name: "Madrid", latitude: 40.42, longitude: -3.7 },
  { name: "Mexico City", latitude: 19.43, longitude: -99.13 },
  { name: "Miami", latitude: 25.76, longitude: -80.19 },
  { name: "Mumbai", latitude: 19.08, longitude: 72.88 },
  { name: "Nairobi", latitude: -1.29, longitude: 36.82 },
  { name: "New York", latitude: 40.71, longitude: -74.01 },
  { name: "Paris", latitude: 48.86, longitude: 2.35 },
  { name: "São Paulo", latitude: -23.55, longitude: -46.63 },
  { name: "San Francisco", latitude: 37.77, longitude: -122.42 },
  { name: "Seattle", latitude: 47.61, longitude: -122.33 },
  { name: "Seoul", latitude: 37.57, longitude: 126.98 },
  { name: "Shanghai", latitude: 31.23, longitude: 121.47 },
  { name: "Singapore", latitude: 1.35, longitude: 103.82 },
  { name: "Sydney", latitude: -33.87, longitude: 151.21 },
  { name: "Taipei", latitude: 25.03, longitude: 121.57 },
  { name: "Tokyo", latitude: 35.68, longitude: 139.69 },
  { name: "Toronto", latitude: 43.65, longitude: -79.38 },
  { name: "Vancouver", latitude: 49.28, longitude: -123.12 },
  { name: "Washington", latitude: 38.91, longitude: -77.04 },
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

export function nearestPlace(latitude: number, longitude: number) {
  return PLACES.reduce((nearest, place) => {
    const nearestDistance = squaredProjectedDistance(
      nearest.latitude,
      nearest.longitude,
      latitude,
      longitude,
    );
    const placeDistance = squaredProjectedDistance(
      place.latitude,
      place.longitude,
      latitude,
      longitude,
    );

    return placeDistance < nearestDistance ? place : nearest;
  }).name;
}

export function formatCoordinate(value: number, positive: string, negative: string) {
  return `${Math.abs(value).toFixed(2)}° ${value >= 0 ? positive : negative}`;
}
