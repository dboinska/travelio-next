import type { JsonValue } from "@prisma/client/runtime/library";

type GeometryLike = {
  type?: string;
  coordinates?: unknown;
  longitude?: number;
  latitude?: number;
  lng?: number;
  lat?: number;
};

export type HotelCoordinatesSource = {
  geometry?: JsonValue;
};

/** Współrzędne hotelu: GeoJSON Point lub { longitude, latitude }. */
export function extractHotelCoordinates(
  hotel: HotelCoordinatesSource,
): { lng: number; lat: number } | null {
  const geom = hotel.geometry as GeometryLike | null | undefined;

  if (geom && Array.isArray(geom.coordinates) && geom.coordinates.length >= 2) {
    const [lng, lat] = geom.coordinates;
    if (typeof lng === "number" && typeof lat === "number") {
      return { lng, lat };
    }
  }

  if (geom) {
    const lng = geom.longitude ?? geom.lng;
    const lat = geom.latitude ?? geom.lat;
    if (typeof lng === "number" && typeof lat === "number") {
      return { lng, lat };
    }
  }

  const record = hotel as Record<string, unknown>;
  const topLng = record.longitude ?? record.lng ?? record.lon;
  const topLat = record.latitude ?? record.lat;
  if (typeof topLng === "number" && typeof topLat === "number") {
    return { lng: topLng, lat: topLat };
  }

  return null;
}

/** Przybliżony bounding box Europy (bez Rosji wschodniej). */
export function isInEurope(lng: number, lat: number): boolean {
  return lng >= -25 && lng <= 45 && lat >= 35 && lat <= 72;
}

function distanceSq(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const dLat = a.lat - b.lat;
  const dLng = a.lng - b.lng;
  return dLat * dLat + dLng * dLng;
}

const MAX_GLOBE_POINTS = 50;
const MAX_GLOBE_ARCS = 64;
const NEIGHBORS_PER_POINT = 2;
const LONG_HAUL_PER_EUROPEAN = 4;

type GlobePointLike = { lat: number; lng: number; label: string };

type GlobeArcLike = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  label: string;
};

function arcPairKey(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const aKey = `${a.lat.toFixed(3)},${a.lng.toFixed(3)}`;
  const bKey = `${b.lat.toFixed(3)},${b.lng.toFixed(3)}`;
  return aKey < bKey ? `${aKey}|${bKey}` : `${bKey}|${aKey}`;
}

function sortedNeighbors(
  origin: GlobePointLike,
  points: GlobePointLike[],
  count: number,
  farthest = false,
): GlobePointLike[] {
  return [...points]
    .filter((point) => point !== origin)
    .sort((a, b) => {
      const diff = distanceSq(origin, a) - distanceSq(origin, b);
      return farthest ? -diff : diff;
    })
    .slice(0, count);
}

function addArc(
  arcs: GlobeArcLike[],
  seen: Set<string>,
  from: GlobePointLike,
  to: GlobePointLike,
) {
  if (from === to) return false;

  const key = arcPairKey(from, to);
  if (seen.has(key)) return false;

  seen.add(key);
  arcs.push({
    startLat: from.lat,
    startLng: from.lng,
    endLat: to.lat,
    endLng: to.lng,
    label: `${from.label} → ${to.label}`,
  });
  return true;
}

function pointKey(point: { lat: number; lng: number }) {
  return `${point.lat.toFixed(4)},${point.lng.toFixed(4)}`;
}

function connectionCount(point: GlobePointLike, arcs: GlobeArcLike[]): number {
  const key = pointKey(point);
  return arcs.filter(
    (arc) =>
      pointKey({ lat: arc.startLat, lng: arc.startLng }) === key ||
      pointKey({ lat: arc.endLat, lng: arc.endLng }) === key,
  ).length;
}

export function selectGlobePoints<T extends { lat: number; lng: number }>(
  points: T[],
): T[] {
  if (points.length <= MAX_GLOBE_POINTS) return points;

  const european = points.filter((point) => isInEurope(point.lng, point.lat));
  const others = points.filter((point) => !isInEurope(point.lng, point.lat));
  const othersBudget = Math.max(0, MAX_GLOBE_POINTS - european.length);

  return [...european, ...others.slice(0, othersBudget)];
}

export function buildGlobeArcs(points: GlobePointLike[]): GlobeArcLike[] {
  if (points.length < 2) return [];

  const arcs: GlobeArcLike[] = [];
  const seen = new Set<string>();

  const european = points.filter((point) => isInEurope(point.lng, point.lat));
  const others = points.filter((point) => !isInEurope(point.lng, point.lat));

  for (const point of points) {
    for (const neighbor of sortedNeighbors(point, points, NEIGHBORS_PER_POINT)) {
      addArc(arcs, seen, point, neighbor);
    }
  }

  for (let i = 0; i < european.length; i++) {
    for (let j = i + 1; j < european.length; j++) {
      addArc(arcs, seen, european[i], european[j]);
    }
  }

  for (const hub of european) {
    const longHaulTargets = sortedNeighbors(
      hub,
      others.length > 0 ? others : points,
      LONG_HAUL_PER_EUROPEAN,
      true,
    );
    for (const destination of longHaulTargets) {
      addArc(arcs, seen, hub, destination);
    }
  }

  for (const point of points) {
    if (connectionCount(point, arcs) > 0) continue;

    const nearest = sortedNeighbors(point, points, 1)[0];
    if (nearest) addArc(arcs, seen, point, nearest);
  }

  for (const point of points) {
    if (connectionCount(point, arcs) >= NEIGHBORS_PER_POINT) continue;

    const extraNeighbors = sortedNeighbors(
      point,
      points,
      NEIGHBORS_PER_POINT + 2,
    );
    for (const neighbor of extraNeighbors) {
      if (connectionCount(point, arcs) >= NEIGHBORS_PER_POINT) break;
      addArc(arcs, seen, point, neighbor);
    }
  }

  return arcs.slice(0, MAX_GLOBE_ARCS);
}
