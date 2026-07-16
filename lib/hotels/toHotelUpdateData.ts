import type { Prisma } from "@prisma/client";
import type { HotelListingFields } from "@/lib/hotels/createHotelSchema";
import type { HotelImageRecord } from "@/lib/types/hotel";

export function toHotelUpdateData(
  input: HotelListingFields,
  images: HotelImageRecord[],
): Prisma.HotelUpdateInput {
  return {
    title: input.title,
    description: input.description,
    location: input.location,
    price: input.price,
    geometry: {
      type: "Point",
      coordinates: [input.longitude, input.latitude],
    },
    images,
  };
}
