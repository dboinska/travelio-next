"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "three";
import {
  DEFAULT_FOV_MARGIN,
  DEFAULT_VIEW_RADIUS_SCALE,
  FOCUSED_FOV_MARGIN,
  GLOBE_SCALE,
} from "@/lib/globe/constants";

const EARTH_RADIUS = 100 * GLOBE_SCALE;

/** Widen default FOV so the globe sits smaller in frame and 3D clouds stay visible. */
export default function GlobeCameraFit({ focused }: { focused: boolean }) {
  const { camera } = useThree();
  const fitRadius = focused
    ? EARTH_RADIUS
    : EARTH_RADIUS * DEFAULT_VIEW_RADIUS_SCALE;
  const margin = focused ? FOCUSED_FOV_MARGIN : DEFAULT_FOV_MARGIN;

  useFrame(() => {
    if (!(camera instanceof PerspectiveCamera)) return;

    const distance = camera.position.length();
    if (distance <= fitRadius) return;

    const halfFovRad = Math.asin(Math.min(0.995, fitRadius / distance));
    const targetFov = (2 * Math.atan(halfFovRad / margin) * 180) / Math.PI;

    if (Math.abs(camera.fov - targetFov) > 0.05) {
      // Three.js cameras are updated in-place each frame; R3F expects this pattern.
      // eslint-disable-next-line react-hooks/immutability -- PerspectiveCamera FOV must be mutated in useFrame
      camera.fov += (targetFov - camera.fov) * 0.12;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
