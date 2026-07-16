import type { Hotel } from "@/lib/types/hotel";
import type { CreateHotelFormInput } from "@/lib/hotels/createHotelSchema";
import { extractHotelCoordinates } from "@/lib/hotels/extractHotelCoordinates";
import { getHotelImages } from "@/lib/types/hotel";

export type ExistingHotelImage = {
  index: number;
  src: string;
  filename?: string;
};

export function hotelToFormDefaults(hotel: Hotel): CreateHotelFormInput {
  const coords = extractHotelCoordinates(hotel);

  return {
    title: hotel.title,
    description: hotel.description,
    location: hotel.location,
    price: String(hotel.price),
    latitude: coords ? String(coords.lat) : "",
    longitude: coords ? String(coords.lng) : "",
  };
}

export function hotelToExistingImages(hotel: Hotel): ExistingHotelImage[] {
  return getHotelImages(hotel).map((image) => ({
    index: image.index,
    src: image.src,
    filename: image.filename,
  }));
}
