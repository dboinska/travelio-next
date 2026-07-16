import type { Prisma } from "@prisma/client";
import type { HotelListingFields } from "@/lib/hotels/createHotelSchema";
import type { HotelImageRecord } from "@/lib/types/hotel";

export function toHotelCreateData(
  input: HotelListingFields,
  authorId: string,
  images: HotelImageRecord[],
): Prisma.HotelCreateInput {
  return {
    title: input.title,
    description: input.description,
    location: input.location,
    price: input.price,
    authorId,
    date: new Date(),
    geometry: {
      type: "Point",
      coordinates: [input.longitude, input.latitude],
    },
    images,
    reviews: [],
  };
}
