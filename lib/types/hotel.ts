import { JsonValue } from "@prisma/client/runtime/library";
import {
  isLegacyUrlHotelImage,
  isStoredHotelImage,
  resolveHotelImageSrc,
} from "@/lib/hotels/storedHotelImage";
import { isAllowedHotelImageUrl } from "@/lib/hotels/allowedImageUrls";

export type StoredHotelImageRecord = {
  storage: "database";
  filename: string;
  mimeType: string;
  data: string;
};

export type LegacyUrlHotelImage = {
  url: string;
  filename?: string;
};

export type HotelImageRecord = StoredHotelImageRecord | LegacyUrlHotelImage;

export type HotelImage = {
  src: string;
  filename?: string;
  index: number;
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
  images?: HotelImageRecord[] | JsonValue | null;
  reviews?: HotelReview[] | JsonValue | null;
};

export function getHotelImageRecords(
  hotel: Pick<Hotel, "images">,
): HotelImageRecord[] {
  if (!hotel.images || !Array.isArray(hotel.images)) return [];

  return (hotel.images as unknown[]).filter(
    (image): image is HotelImageRecord =>
      typeof image === "object" &&
      image !== null &&
      (isStoredHotelImage(image as HotelImageRecord) ||
        isLegacyUrlHotelImage(image as HotelImageRecord)),
  );
}

export function getHotelImages(
  hotel: Pick<Hotel, "id" | "images">,
): HotelImage[] {
  const views: HotelImage[] = [];

  for (const [index, record] of getHotelImageRecords(hotel).entries()) {
    const src = resolveHotelImageSrc(hotel.id, record, index);
    if (!src) continue;

    if (isLegacyUrlHotelImage(record) && !isAllowedHotelImageUrl(src)) {
      continue;
    }

    views.push({
      src,
      filename: isStoredHotelImage(record) ? record.filename : record.filename,
      index,
    });
  }

  return views;
}

export function getHotelReviews(hotel: Pick<Hotel, "reviews">): HotelReview[] {
  if (!hotel.reviews || !Array.isArray(hotel.reviews)) return [];
  return (hotel.reviews as unknown[]).filter(
    (review): review is HotelReview =>
      typeof review === "object" && review !== null,
  );
}

/** @deprecated Use getHotelImages */
export function getHotelImagesLegacy(hotel: Pick<Hotel, "images">) {
  return getHotelImageRecords(hotel)
    .filter(isLegacyUrlHotelImage)
    .map((image, index) => ({
      url: image.url,
      filename: image.filename,
      index,
    }));
}
