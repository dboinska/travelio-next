"use client";

import { useEffect, useRef } from "react";

export const ClusterMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // tutaj inicjalizacja mapbox/maplibre
    // do osobnego hooka
  }, []);

  return (
    <div
      ref={mapRef}
      className="mb-10 h-[500px] w-full overflow-hidden rounded-2xl"
    />
  );
};
