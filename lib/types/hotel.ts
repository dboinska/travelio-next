import { JsonValue } from "@prisma/client/runtime/library";

export type HotelImage = {
  url: string;
  filename?: string;
};

export type HotelReview = {
  body?: string;
  comment?: string;
  rating?: number;
  date?: Date | string | null;
};

export type Hotel = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  date?: Date | null;
  geometry?: JsonValue;
  authorId?: string | null;
  images?: HotelImage[] | JsonValue | null;
  reviews?: HotelReview[] | JsonValue | null;
};

export function getHotelImages(hotel: Pick<Hotel, "images">): HotelImage[] {
  if (!hotel.images || !Array.isArray(hotel.images)) return [];
  return (hotel.images as unknown[]).filter(
    (image): image is HotelImage =>
      typeof image === "object" &&
      image !== null &&
      "url" in image &&
      typeof (image as HotelImage).url === "string",
  );
}

export function getHotelReviews(hotel: Pick<Hotel, "reviews">): HotelReview[] {
  if (!hotel.reviews || !Array.isArray(hotel.reviews)) return [];
  return (hotel.reviews as unknown[]).filter(
    (review): review is HotelReview =>
      typeof review === "object" && review !== null,
  );
}
