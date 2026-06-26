"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { GlobeArc, GlobePoint } from "@/lib/globe/types";
import EarthGlobe from "./EarthGlobe";

const CAMERA_DISTANCE = 365;

type Props = {
  points: GlobePoint[];
  arcs: GlobeArc[];
  autoRotate?: boolean;
};

export default function GlobeCanvas({
  points,
  arcs,
  autoRotate = true,
}: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, CAMERA_DISTANCE], fov: 34 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      className="!h-full !w-full cursor-grab active:cursor-grabbing"
      style={{ display: "block", touchAction: "none" }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 2, 3]} intensity={1.4} />
      <EarthGlobe points={points} arcs={arcs} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={CAMERA_DISTANCE}
        maxDistance={CAMERA_DISTANCE}
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        rotateSpeed={0.5}
        dampingFactor={0.08}
        enableDamping
      />
    </Canvas>
  );
}
