"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type ThreeGlobe from "three-globe";
import { Object3D, Quaternion, Raycaster, Vector2, Vector3 } from "three";
import type { GlobePoint } from "@/lib/globe/types";
import { applyZoomRange } from "@/lib/globe/globeControls";
import {
  CAMERA_DISTANCE,
  FOCUS_ANIMATION_SECONDS,
  FOCUS_CAMERA_DISTANCE,
  POINT_HOVER_RADIUS_PX,
  POINT_PICK_RADIUS_PX,
  ZOOM_OUT_RESET_THRESHOLD,
} from "@/lib/globe/constants";
import {
  buildPointWorldCache,
  easeInOutCubic,
  findPointNearPointerCached,
  getDefaultCameraState,
  getFocusCameraState,
  sameGlobePoint,
  type CachedGlobePoint,
} from "@/lib/globe/globeFocus";

const DRAG_THRESHOLD_PX = 10;
const CAMERA_FORWARD = new Vector3(0, 0, 1);

function directionToQuaternion(direction: Vector3, out: Quaternion) {
  out.setFromUnitVectors(CAMERA_FORWARD, direction.clone().normalize());
}

type PointMesh = Object3D & {
  __globeObjType?: string;
  __currentTargetD?: { lat: number; lng: number };
};

type Props = {
  globeRef: React.RefObject<ThreeGlobe | null>;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  points: GlobePoint[];
  onFocusChange?: (point: GlobePoint | null) => void;
  onAnimatingChange?: (animating: boolean) => void;
};

function findPointFromIntersection(
  object: Object3D | null,
  points: GlobePoint[],
): GlobePoint | null {
  let current = object as PointMesh | null;
  while (current) {
    if (current.__globeObjType === "point" && current.__currentTargetD) {
      const { lat, lng } = current.__currentTargetD;
      const match = points.find(
        (point) =>
          Math.abs(point.lat - lat) < 0.001 &&
          Math.abs(point.lng - lng) < 0.001,
      );
      return (
        match ?? { lat, lng, label: `${lat.toFixed(2)}°, ${lng.toFixed(2)}°` }
      );
    }
    current = current.parent as PointMesh | null;
  }
  return null;
}

function isGlobeSurfaceHit(object: Object3D | null): boolean {
  let current = object as PointMesh | null;
  while (current) {
    if (current.__globeObjType === "globe") return true;
    current = current.parent as PointMesh | null;
  }
  return false;
}

export default function GlobeInteraction({
  globeRef,
  controlsRef,
  points,
  onFocusChange,
  onAnimatingChange,
}: Props) {
  const { camera, gl } = useThree();
  const raycaster = useRef(new Raycaster());
  const pointer = useRef(new Vector2());
  const animating = useRef(false);
  const progress = useRef(0);
  const startDir = useRef(new Vector3());
  const endDir = useRef(new Vector3());
  const animDir = useRef(new Vector3());
  const startQuat = useRef(new Quaternion());
  const endQuat = useRef(new Quaternion());
  const animQuat = useRef(new Quaternion());
  const startDist = useRef(0);
  const endDist = useRef(0);
  const focusedPoint = useRef<GlobePoint | null>(null);
  const restoreDefaultOnComplete = useRef(false);
  const hoveringPoint = useRef(false);

  const pointerDown = useRef({ x: 0, y: 0 });
  const wasDrag = useRef(false);

  const pointsRef = useRef(points);
  const onFocusChangeRef = useRef(onFocusChange);
  const onAnimatingChangeRef = useRef(onAnimatingChange);
  const cachedPoints = useRef<CachedGlobePoint[]>([]);
  const hoverFrame = useRef<number | null>(null);
  const pendingHover = useRef<PointerEvent | null>(null);

  useEffect(() => {
    pointsRef.current = points;
    if (globeRef.current) {
      cachedPoints.current = buildPointWorldCache(globeRef.current, points);
    }
  }, [points, globeRef]);

  useEffect(() => {
    onFocusChangeRef.current = onFocusChange;
  }, [onFocusChange]);

  useEffect(() => {
    onAnimatingChangeRef.current = onAnimatingChange;
  }, [onAnimatingChange]);

  const ensurePointCache = () => {
    if (cachedPoints.current.length > 0 || !globeRef.current) return;
    cachedPoints.current = buildPointWorldCache(
      globeRef.current,
      pointsRef.current,
    );
  };

  const setControlsEnabled = (enabled: boolean) => {
    const controls = controlsRef.current;
    if (controls) controls.enabled = enabled;
  };

  const applyDefaultControls = () => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.set(0, 0, 0);
    controls.autoRotate = true;
    applyZoomRange(controls);
  };

  const applyFocusedControls = () => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.set(0, 0, 0);
    controls.autoRotate = false;
    applyZoomRange(controls);
  };

  const clearFocusState = () => {
    focusedPoint.current = null;
    onFocusChangeRef.current?.(null);
  };

  const finishAnimation = () => {
    animating.current = false;
    onAnimatingChangeRef.current?.(false);
    setControlsEnabled(true);

    const controls = controlsRef.current;
    if (!controls) return;

    if (restoreDefaultOnComplete.current) {
      applyDefaultControls();
      restoreDefaultOnComplete.current = false;
    } else if (focusedPoint.current) {
      applyFocusedControls();
    }

    controls.update();
  };

  const startAnimation = (toFocus: { target: Vector3; position: Vector3 }) => {
    onAnimatingChangeRef.current?.(true);
    setControlsEnabled(false);

    const controls = controlsRef.current;
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.enableZoom = false;
    }

    startDir.current.copy(camera.position).normalize();
    endDir.current.copy(toFocus.position).normalize();
    directionToQuaternion(startDir.current, startQuat.current);
    directionToQuaternion(endDir.current, endQuat.current);
    startDist.current = camera.position.length();
    endDist.current = toFocus.position.length();
    progress.current = 0;
    animating.current = true;
  };

  const resetView = () => {
    clearFocusState();
    restoreDefaultOnComplete.current = true;
    startAnimation(getDefaultCameraState(CAMERA_DISTANCE));
  };

  const focusPoint = (point: GlobePoint) => {
    if (!globeRef.current) return;

    if (focusedPoint.current && sameGlobePoint(focusedPoint.current, point)) {
      resetView();
      return;
    }

    const focus = getFocusCameraState(
      globeRef.current,
      point.lat,
      point.lng,
      FOCUS_CAMERA_DISTANCE,
    );

    focusedPoint.current = point;
    onFocusChangeRef.current?.(point);
    startAnimation(focus);
  };

  const pickPointAtScreen = (
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number,
    radiusPx: number,
  ) => {
    ensurePointCache();
    return findPointNearPointerCached(
      cachedPoints.current,
      camera,
      canvas,
      clientX,
      clientY,
      radiusPx,
    );
  };

  useFrame((_, delta) => {
    const controls = controlsRef.current;

    if (animating.current) {
      progress.current = Math.min(
        1,
        progress.current + delta / FOCUS_ANIMATION_SECONDS,
      );
      const t = easeInOutCubic(progress.current);

      animQuat.current.copy(startQuat.current).slerp(endQuat.current, t);
      animDir.current
        .copy(CAMERA_FORWARD)
        .applyQuaternion(animQuat.current)
        .normalize();
      const distance =
        startDist.current + (endDist.current - startDist.current) * t;
      camera.position.copy(animDir.current.multiplyScalar(distance));

      if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
      }

      if (progress.current >= 1) {
        finishAnimation();
      }
      return;
    }

    if (
      focusedPoint.current &&
      camera.position.length() >= ZOOM_OUT_RESET_THRESHOLD
    ) {
      clearFocusState();
      if (controls) {
        controls.autoRotate = true;
        applyZoomRange(controls);
      }
    }
  });

  useEffect(() => {
    const canvas = gl.domElement;

    const setPointerFromEvent = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
    };

    const raycastGlobe = () => {
      if (!globeRef.current) return [];
      raycaster.current.setFromCamera(pointer.current, camera);
      return raycaster.current.intersectObject(globeRef.current, true);
    };

    const updateHover = (event: PointerEvent) => {
      if (wasDrag.current || animating.current || !globeRef.current) {
        if (hoveringPoint.current) {
          hoveringPoint.current = false;
          canvas.style.cursor = "";
        }
        return;
      }

      const nearPoint = pickPointAtScreen(
        canvas,
        event.clientX,
        event.clientY,
        POINT_HOVER_RADIUS_PX,
      );

      if (Boolean(nearPoint) !== hoveringPoint.current) {
        hoveringPoint.current = Boolean(nearPoint);
        canvas.style.cursor = nearPoint ? "pointer" : "";
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      pointerDown.current = { x: event.clientX, y: event.clientY };
      wasDrag.current = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      const dx = event.clientX - pointerDown.current.x;
      const dy = event.clientY - pointerDown.current.y;
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
        wasDrag.current = true;
      }

      pendingHover.current = event;
      if (hoverFrame.current !== null) return;

      hoverFrame.current = window.requestAnimationFrame(() => {
        hoverFrame.current = null;
        const pending = pendingHover.current;
        if (pending) updateHover(pending);
      });
    };

    const onPointerUp = (event: PointerEvent) => {
      if (wasDrag.current || animating.current) return;
      if (!globeRef.current) return;

      const point = pickPointAtScreen(
        canvas,
        event.clientX,
        event.clientY,
        POINT_PICK_RADIUS_PX,
      );

      if (point) {
        focusPoint(point);
        return;
      }

      setPointerFromEvent(event);
      const hits = raycastGlobe();
      for (const hit of hits) {
        const meshPoint = findPointFromIntersection(
          hit.object,
          pointsRef.current,
        );
        if (meshPoint) {
          focusPoint(meshPoint);
          return;
        }
      }

      if (
        focusedPoint.current &&
        hits.some((hit) => isGlobeSurfaceHit(hit.object))
      ) {
        resetView();
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
    };

    const onPointerLeave = () => {
      pendingHover.current = null;
      if (hoverFrame.current !== null) {
        window.cancelAnimationFrame(hoverFrame.current);
        hoverFrame.current = null;
      }
      if (hoveringPoint.current) {
        hoveringPoint.current = false;
        canvas.style.cursor = "";
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("wheel", onWheel);
      if (hoverFrame.current !== null) {
        window.cancelAnimationFrame(hoverFrame.current);
      }
      canvas.style.cursor = "";
    };
  }, [camera, gl, globeRef, controlsRef]);

  return null;
}
