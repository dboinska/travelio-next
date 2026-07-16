import type { GlobeData } from "./types";

/** Domyślne dane globu — używane gdy baza nie zwróci hoteli z współrzędnymi. */
export const defaultGlobeData: GlobeData = {
  points: [
    { lat: 52.2297, lng: 21.0122, label: "Warszawa, Polska" },
    { lat: -8.3405, lng: 115.092, label: "Bali, Indonezja" },
    { lat: 3.2028, lng: 73.2207, label: "Malediwy" },
    { lat: 48.8566, lng: 2.3522, label: "Paryż, Francja" },
    { lat: 40.7128, lng: -74.006, label: "Nowy Jork, USA" },
  ],
  arcs: [
    {
      startLat: 52.2297,
      startLng: 21.0122,
      endLat: -8.3405,
      endLng: 115.092,
      label: "Warszawa → Bali",
    },
    {
      startLat: 52.2297,
      startLng: 21.0122,
      endLat: 3.2028,
      endLng: 73.2207,
      label: "Warszawa → Malediwy",
    },
  ],
};
