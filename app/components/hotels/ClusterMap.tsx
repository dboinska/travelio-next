"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

interface Props {
  hotels: GeoJSON.FeatureCollection<
    GeoJSON.Point,
    {
      popUpMarkup?: string;
      cluster?: boolean;
      cluster_id?: number;
      point_count?: number;
    }
  >;
  mapToken?: string;
  resizeTrigger?: boolean;
}

export const ClusterMap = ({ hotels, mapToken, resizeTrigger }: Props) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const token = mapToken ?? process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [-30, 40],
      zoom: 1,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    mapInstanceRef.current = map;

    map.on("load", () => {
      map.addSource("hotels", {
        type: "geojson",
        data: hotels,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "hotels",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#03A9F4",
            20,
            "#9C27B0",
            40,
            "#76FF03",
            70,
            "#F50057",
          ],

          "circle-radius": [
            "step",
            ["get", "point_count"],
            18,
            20,
            24,
            40,
            32,
            70,
            40,
          ],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "hotels",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "hotels",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#FFEA00",
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#000000",
        },
      });

      map.addLayer({
        id: "hotel-pins",
        type: "symbol",
        source: "hotels",
        filter: ["!", ["has", "point_count"]],
        layout: {
          "icon-image": "marker-15",
          "icon-size": 1.2,
          "icon-allow-overlap": true,
          "icon-anchor": "bottom",
        },
        paint: {
          "icon-color": "#FFEA00",
        },
      });

      const showHotelPopup = (e: mapboxgl.MapLayerMouseEvent) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const coordinates = (
          feature.geometry as GeoJSON.Point
        ).coordinates.slice() as [number, number];

        const popUpMarkup = feature.properties?.popUpMarkup;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(popUpMarkup || "")
          .addTo(map);
      };

      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });

        const feature = features[0];

        if (!feature) return;

        const clusterId = feature.properties?.cluster_id;
        if (typeof clusterId !== "number") return;

        const source = map.getSource("hotels") as mapboxgl.GeoJSONSource;

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom === null) return;

          const geometry = feature.geometry as GeoJSON.Point;

          map.easeTo({
            center: geometry.coordinates as [number, number],
            zoom,
          });
        });
      });

      map.on("click", "unclustered-point", showHotelPopup);
      map.on("click", "hotel-pins", showHotelPopup);

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "hotel-pins", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "hotel-pins", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      mapInstanceRef.current = null;
      map.remove();
    };
  }, [hotels, mapToken]);

  useEffect(() => {
    mapInstanceRef.current?.resize();
  }, [resizeTrigger]);

  return (
    <div ref={mapRef} className="h-full w-full overflow-hidden rounded-2xl" />
  );
};
