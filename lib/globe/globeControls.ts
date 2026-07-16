import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  ZOOM_MAX_DISTANCE,
  ZOOM_MIN_DISTANCE,
} from "./constants";

export function applyZoomRange(controls: OrbitControlsImpl) {
  controls.enableZoom = true;
  controls.minDistance = ZOOM_MIN_DISTANCE;
  controls.maxDistance = ZOOM_MAX_DISTANCE;
}
