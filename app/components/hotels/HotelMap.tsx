"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Props {
  lngLat?: [number, number] | null;
  title?: string;
  mapToken?: string;
  height?: string;
}

export default function HotelMap({
  lngLat,
  title,
  mapToken,
  height = "h-64",
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const token = mapToken ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    const center = lngLat ?? [0, 0];

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: center as [number, number],
      zoom: lngLat ? 12 : 1,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    mapInstanceRef.current = map;

    map.on("load", () => {
      if (lngLat) {
        const marker = new mapboxgl.Marker({ color: "#FFEA00" })
          .setLngLat(lngLat)
          .addTo(map);

        if (title) {
          const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(
            `<strong>${title}</strong>`,
          );
          marker.setPopup(popup);
        }
      }
    });

    return () => {
      mapInstanceRef.current = null;
      map.remove();
    };
  }, [lngLat, mapToken, title]);

  return (
    <div
      ref={mapRef}
      className={`${height} w-full overflow-hidden rounded-2xl`}
    />
  );
}
