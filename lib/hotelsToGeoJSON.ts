import { Hotel } from "@/lib/types/hotel";

type HotelInput = Hotel & {
  createdAt?: Date | null
  updatedAt? : Date | null
}

export function hotelsToGeoJSON(hotels: HotelInput[]): GeoJSON.FeatureCollection<
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
      // Try several places for coordinates: geometry (GeoJSON), or latitude/longitude
      let coords: [number, number] | null = null;

      // geometry might be a GeoJSON-like object
      try {
        const geom = hotel.geometry as { coordinates?: unknown } | null | undefined;
        if (geom && Array.isArray(geom.coordinates) && geom.coordinates.length >= 2) {
          const [lng, lat] = geom.coordinates;
          if (typeof lng === "number" && typeof lat === "number") coords = [lng, lat];
        }
      } catch (e) {
        throw new Error(`Error parsing geometry for hotel ${hotel.id}: ${e}`);
      }

      // fallback to top-level lat/lng fields if present
      if (!coords) {
        const hotelRecord = hotel as Record<string, unknown>;
        const maybeLng = hotelRecord.longitude ?? hotelRecord.lng ?? hotelRecord.lon;
        const maybeLat = hotelRecord.latitude ?? hotelRecord.lat;
        if (typeof maybeLng === "number" && typeof maybeLat === "number") {
          coords = [maybeLng, maybeLat];
        }
      }

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
          coordinates: coords,
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

