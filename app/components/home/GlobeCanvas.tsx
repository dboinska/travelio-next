"use client";

import { useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type ThreeGlobe from "three-globe";
import {
  CAMERA_DISTANCE,
  ZOOM_MAX_DISTANCE,
  ZOOM_MIN_DISTANCE,
} from "@/lib/globe/constants";
import type { GlobeArc, GlobePoint } from "@/lib/globe/types";
import EarthGlobe from "./EarthGlobe";
import GlobeCameraFit from "./GlobeCameraFit";
import GlobeFrameloop from "./GlobeFrameloop";
import GlobeInteraction from "./GlobeInteraction";

type Props = {
  points: GlobePoint[];
  arcs: GlobeArc[];
  autoRotate?: boolean;
  isActive?: boolean;
  isFocused?: boolean;
  onFocusChange?: (point: GlobePoint | null) => void;
};

export default function GlobeCanvas({
  points,
  arcs,
  autoRotate = true,
  isActive = true,
  isFocused = false,
  onFocusChange,
}: Props) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [animating, setAnimating] = useState(false);
  const rendering = isActive || animating;

  return (
    <Canvas
      camera={{ position: [0, 0, CAMERA_DISTANCE], fov: 38 }}
      dpr={[1, 1.25]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x191a1a, 1);
      }}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      style={{ display: "block", touchAction: "none" }}
    >
      <GlobeFrameloop active={rendering} />
      <GlobeCameraFit focused={isFocused} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 2, 3]} intensity={1.4} />
      <EarthGlobe ref={globeRef} points={points} arcs={arcs} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom
        minDistance={ZOOM_MIN_DISTANCE}
        maxDistance={ZOOM_MAX_DISTANCE}
        zoomSpeed={0.85}
        autoRotate={autoRotate && rendering}
        autoRotateSpeed={0.6}
        rotateSpeed={0.5}
        dampingFactor={0.08}
        enableDamping
      />
      <GlobeInteraction
        globeRef={globeRef}
        controlsRef={controlsRef}
        points={points}
        onFocusChange={onFocusChange}
        onAnimatingChange={setAnimating}
      />
    </Canvas>
  );
}
