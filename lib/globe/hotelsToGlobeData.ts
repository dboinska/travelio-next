import type { Hotel } from "@/lib/types/hotel";
import { defaultGlobeData } from "./globeData";
import type { GlobeArc, GlobeData, GlobePoint } from "./types";
import {
  buildGlobeArcs,
  extractHotelCoordinates,
  selectGlobePoints,
} from "@/lib/hotels/extractHotelCoordinates";

type HotelGlobeInput = {
  id: string;
  title: string;
  location: string;
  geometry?: Hotel["geometry"];
};

export function hotelsToGlobeData(hotels: HotelGlobeInput[]): GlobeData {
  const points: GlobePoint[] = hotels.flatMap((hotel) => {
    const coords = extractHotelCoordinates(hotel);
    if (!coords) return [];

    return [
      {
        lat: coords.lat,
        lng: coords.lng,
        label: hotel.location || hotel.title,
        hotelId: hotel.id,
      },
    ];
  });

  if (points.length === 0) {
    return defaultGlobeData;
  }

  const selectedPoints = selectGlobePoints(points);
  const arcs: GlobeArc[] = buildGlobeArcs(selectedPoints);

  return {
    points: selectedPoints,
    arcs: arcs.length > 0 ? arcs : defaultGlobeData.arcs,
  };
}
