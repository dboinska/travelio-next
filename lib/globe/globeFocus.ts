import { Vector3, type Camera } from "three";
import type ThreeGlobe from "three-globe";
import { GLOBE_SCALE, POINT_ALTITUDE } from "./constants";
import type { GlobePoint } from "./types";

const projected = new Vector3();
const surfaceNormal = new Vector3();
const toCamera = new Vector3();

export type CachedGlobePoint = {
  point: GlobePoint;
  world: Vector3;
};

export function sameGlobePoint(a: GlobePoint, b: GlobePoint): boolean {
  return Math.abs(a.lat - b.lat) < 0.001 && Math.abs(a.lng - b.lng) < 0.001;
}

export function getPointWorldPosition(
  globe: ThreeGlobe,
  lat: number,
  lng: number,
  altitude = POINT_ALTITUDE,
): Vector3 {
  const coords = globe.getCoords(lat, lng, altitude);
  return new Vector3(coords.x, coords.y, coords.z).multiplyScalar(GLOBE_SCALE);
}

export function buildPointWorldCache(
  globe: ThreeGlobe,
  points: GlobePoint[],
): CachedGlobePoint[] {
  return points.map((point) => ({
    point,
    world: getPointWorldPosition(globe, point.lat, point.lng),
  }));
}

/** Align camera on the radial through lat/lng; orbit target stays at globe center. */
export function getFocusCameraState(
  globe: ThreeGlobe,
  lat: number,
  lng: number,
  distanceFromCenter: number,
  altitude = POINT_ALTITUDE,
) {
  const surfacePoint = getPointWorldPosition(globe, lat, lng, altitude);
  const direction = surfacePoint.clone().normalize();
  const position = direction.multiplyScalar(distanceFromCenter);
  return {
    target: new Vector3(0, 0, 0),
    position,
  };
}

export function getDefaultCameraState(cameraDistance: number) {
  return {
    target: new Vector3(0, 0, 0),
    position: new Vector3(0, 0, cameraDistance),
  };
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function isPointVisible(worldPosition: Vector3, camera: Camera): boolean {
  surfaceNormal.copy(worldPosition).normalize();
  toCamera.copy(camera.position).sub(worldPosition);
  return surfaceNormal.dot(toCamera) > 0;
}

export function findPointNearPointerCached(
  cached: CachedGlobePoint[],
  camera: Camera,
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
  radiusPx: number,
): GlobePoint | null {
  const rect = canvas.getBoundingClientRect();
  const pointerX = clientX - rect.left;
  const pointerY = clientY - rect.top;

  let best: GlobePoint | null = null;
  let bestDistance = radiusPx;

  for (const entry of cached) {
    if (!isPointVisible(entry.world, camera)) continue;

    projected.copy(entry.world).project(camera);
    if (projected.z > 1) continue;

    const screenX = (projected.x * 0.5 + 0.5) * rect.width;
    const screenY = (-projected.y * 0.5 + 0.5) * rect.height;
    const distance = Math.hypot(screenX - pointerX, screenY - pointerY);

    if (distance < bestDistance) {
      bestDistance = distance;
      best = entry.point;
    }
  }

  return best;
}

/** @deprecated Prefer findPointNearPointerCached for hot paths. */
export function findPointNearPointer(
  globe: ThreeGlobe,
  points: GlobePoint[],
  camera: Camera,
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
  radiusPx: number,
): GlobePoint | null {
  return findPointNearPointerCached(
    buildPointWorldCache(globe, points),
    camera,
    canvas,
    clientX,
    clientY,
    radiusPx,
  );
}
