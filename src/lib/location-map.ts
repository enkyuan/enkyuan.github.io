export type MapCell = {
  id: string;
  row: number;
  column: number;
  latitude: number;
  longitude: number;
};

type Coordinate = readonly [longitude: number, latitude: number];
type Polygon = readonly Coordinate[];

type Place = {
  name: string;
  latitude: number;
  longitude: number;
};

const WORLD_POLYGONS: readonly Polygon[] = [
  // North America
  [
    [-168, 72],
    [-152, 59],
    [-135, 54],
    [-126, 48],
    [-124, 32],
    [-113, 24],
    [-101, 18],
    [-88, 18],
    [-82, 25],
    [-80, 34],
    [-67, 45],
    [-54, 52],
    [-61, 62],
    [-82, 70],
    [-111, 77],
    [-144, 76],
  ],
  // Greenland
  [
    [-54, 82],
    [-23, 80],
    [-18, 68],
    [-32, 59],
    [-49, 62],
  ],
  // Central America
  [
    [-101, 22],
    [-83, 8],
    [-77, 7],
    [-83, 18],
  ],
  // South America
  [
    [-81, 12],
    [-67, 11],
    [-49, 2],
    [-35, -8],
    [-48, -29],
    [-58, -52],
    [-72, -55],
    [-76, -32],
    [-81, -8],
  ],
  // Europe
  [
    [-11, 36],
    [-10, 58],
    [5, 71],
    [29, 71],
    [42, 57],
    [31, 43],
    [12, 36],
  ],
  // Africa
  [
    [-18, 36],
    [10, 37],
    [34, 31],
    [51, 12],
    [40, -11],
    [29, -35],
    [14, -35],
    [2, -17],
    [-16, 5],
  ],
  // Asia
  [
    [30, 42],
    [43, 71],
    [94, 77],
    [151, 68],
    [177, 58],
    [155, 46],
    [141, 35],
    [122, 21],
    [105, 6],
    [89, 7],
    [75, 21],
    [59, 25],
    [47, 39],
  ],
  // India and Southeast Asia
  [
    [67, 25],
    [91, 27],
    [105, 11],
    [121, 4],
    [114, -9],
    [97, 2],
    [82, 7],
  ],
  // Japan
  [
    [130, 31],
    [145, 45],
    [140, 30],
  ],
  // Australia
  [
    [112, -11],
    [139, -10],
    [154, -27],
    [145, -43],
    [119, -36],
  ],
  // Madagascar
  [
    [43, -12],
    [51, -13],
    [49, -27],
    [44, -25],
  ],
  // New Zealand
  [
    [166, -34],
    [179, -47],
    [173, -32],
  ],
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

function pointInPolygon(longitude: number, latitude: number, polygon: Polygon) {
  let inside = false;

  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const [currentLongitude, currentLatitude] = polygon[index];
    const [previousLongitude, previousLatitude] = polygon[previous];
    const crossesLatitude = currentLatitude > latitude !== previousLatitude > latitude;
    const crossingLongitude =
      ((previousLongitude - currentLongitude) * (latitude - currentLatitude)) /
        (previousLatitude - currentLatitude) +
      currentLongitude;

    if (crossesLatitude && longitude < crossingLongitude) inside = !inside;
  }

  return inside;
}

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

export function createWorldGrid(columns = 48, rows = 24): MapCell[] {
  const cells: MapCell[] = [];

  for (let row = 0; row < rows; row += 1) {
    const latitude = 90 - ((row + 0.5) / rows) * 180;

    for (let column = 0; column < columns; column += 1) {
      const longitude = -180 + ((column + 0.5) / columns) * 360;
      if (!WORLD_POLYGONS.some((polygon) => pointInPolygon(longitude, latitude, polygon))) {
        continue;
      }

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
