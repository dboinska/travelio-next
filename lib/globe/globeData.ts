import type { GlobeData } from "./types";

/** Default globe data when the database returns no hotels with coordinates. */
export const defaultGlobeData: GlobeData = {
  points: [
    { lat: 52.2297, lng: 21.0122, label: "Warsaw, Poland" },
    { lat: -8.3405, lng: 115.092, label: "Bali, Indonesia" },
    { lat: 3.2028, lng: 73.2207, label: "Maldives" },
    { lat: 48.8566, lng: 2.3522, label: "Paris, France" },
    { lat: 40.7128, lng: -74.006, label: "New York, USA" },
  ],
  arcs: [
    {
      startLat: 52.2297,
      startLng: 21.0122,
      endLat: -8.3405,
      endLng: 115.092,
      label: "Warsaw → Bali",
    },
    {
      startLat: 52.2297,
      startLng: 21.0122,
      endLat: 3.2028,
      endLng: 73.2207,
      label: "Warsaw → Maldives",
    },
  ],
};
