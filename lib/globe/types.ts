export type GlobePoint = {
  lat: number;
  lng: number;
  label: string;
  hotelId?: string;
};

export type GlobeArc = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  label?: string;
};

export type GlobeData = {
  points: GlobePoint[];
  arcs: GlobeArc[];
};
