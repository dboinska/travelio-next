"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { GlobeData, GlobePoint } from "@/lib/globe/types";
import GlobeFallback from "./GlobeFallback";
import { useGlobeActive } from "./useGlobeActive";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const GlobeCanvas = dynamic(() => import("./GlobeCanvas"), {
  ssr: false,
  loading: () => <GlobeFallback />,
});

type Props = {
  globeData: GlobeData;
};

const globeSizeClass =
  "aspect-square w-full max-w-[min(78vw,460px)] sm:max-w-[min(62vh,500px)]";

export default function HeroGlobe({ globeData }: Props) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isActive = useGlobeActive(containerRef);
  const [focusedPoint, setFocusedPoint] = useState<GlobePoint | null>(null);

  return (
    <div className="relative mx-auto flex w-full items-center justify-center lg:mx-0 lg:-translate-x-2">
      <div
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${globeSizeClass} rounded-full bg-[radial-gradient(circle,rgba(48,207,208,0.025)_0%,transparent_78%)]`}
      />

      <div
        ref={containerRef}
        className={`hero-globe-clip relative ${globeSizeClass}`}
      >
        <div className="absolute left-1/2 top-1/2 h-[124%] w-[124%] -translate-x-1/2 -translate-y-1/2">
          {prefersReducedMotion ? (
            <GlobeFallback />
          ) : (
            <GlobeCanvas
              points={globeData.points}
              arcs={globeData.arcs}
              isActive={isActive}
              isFocused={focusedPoint !== null}
              onFocusChange={setFocusedPoint}
            />
          )}
        </div>

        {focusedPoint ? (
          <div
            className="pointer-events-none absolute bottom-[8%] left-1/2 z-10 max-w-[88%] -translate-x-1/2 rounded-full border border-border/60 bg-surface/90 px-4 py-1.5 text-center text-xs font-medium tracking-wide text-foreground/90 backdrop-blur-sm sm:text-sm"
            aria-live="polite"
          >
            {focusedPoint.label}
          </div>
        ) : null}
      </div>
    </div>
  );
}
