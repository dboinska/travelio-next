"use client";

import dynamic from "next/dynamic";
import type { GlobeData } from "@/lib/globe/types";
import GlobeFallback from "./GlobeFallback";
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

  return (
    <div className="relative mx-auto flex w-full items-center justify-center lg:mx-0 lg:-translate-x-2">
      <div
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${globeSizeClass} rounded-full bg-[radial-gradient(circle,rgba(48,207,208,0.025)_0%,transparent_78%)]`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${globeSizeClass} rounded-full bg-[radial-gradient(circle_at_center,transparent_58%,var(--background)_86%)]`}
      />

      <div
        className={`relative ${globeSizeClass} [-webkit-mask-image:radial-gradient(circle_at_center,black_58%,transparent_84%)] [mask-image:radial-gradient(circle_at_center,black_58%,transparent_84%)]`}
      >
        {prefersReducedMotion ? (
          <GlobeFallback />
        ) : (
          <GlobeCanvas points={globeData.points} arcs={globeData.arcs} />
        )}
      </div>
    </div>
  );
}
