import type { JsonValue } from "@prisma/client/runtime/library";
import { extractHotelCoordinates } from "@/lib/hotels/extractHotelCoordinates";

export type HotelGeoInput = {
  id: string;
  title: string;
  geometry?: JsonValue;
};

export function hotelsToGeoJSON(hotels: HotelGeoInput[]): GeoJSON.FeatureCollection<
  GeoJSON.Point,
  {
    id: string;
    title: string;
    popUpMarkup: string;
  }
> {
  const features: GeoJSON.Feature<
    GeoJSON.Point,
    {
      id: string;
      title: string;
      popUpMarkup: string;
    }
  >[] = hotels
    .map((hotel) => {
      const coords = extractHotelCoordinates(hotel);
      if (!coords) return null;

      return {
        type: "Feature" as const,
        properties: {
          id: hotel.id,
          title: hotel.title,
          popUpMarkup: `
            <div>
              <h3>${hotel.title}</h3>
            </div>
          `,
        },
        geometry: {
          type: "Point",
          coordinates: [coords.lng, coords.lat],
        },
      };
    })
    .filter((feature) => feature !== null) as GeoJSON.Feature<GeoJSON.Point, {
      id: string;
      title: string;
      popUpMarkup: string;
    }>[];

  return {
    type: "FeatureCollection" as const,
    features,
  };
}
