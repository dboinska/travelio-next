import type { HotelImage } from "@/lib/types/hotel";

/** Main tile + up to two side previews in the desktop mosaic. */
export const HOTEL_GALLERY_MOSAIC_SLOTS = 3;

/** Index of the first photo included in the blurred "more" tile (0-based). */
export const HOTEL_GALLERY_MORE_START_INDEX = 2;

export type HotelGalleryLayout = {
  total: number;
  main: HotelImage;
  sidePreviews: HotelImage[];
  /** Photos from the blurred tile onward (inclusive). */
  morePhotosCount: number;
  morePhotosStartIndex: number;
  slides: { src: string }[];
};

export function getHotelGalleryLayout(
  images: HotelImage[],
): HotelGalleryLayout | null {
  if (!images.length) return null;

  const total = images.length;
  const main = images[0];
  const sidePreviews = images.slice(1, HOTEL_GALLERY_MOSAIC_SLOTS);
  const morePhotosCount = Math.max(0, total - HOTEL_GALLERY_MORE_START_INDEX);
  const showMoreOverlay = total > HOTEL_GALLERY_MOSAIC_SLOTS;

  return {
    total,
    main,
    sidePreviews,
    morePhotosCount: showMoreOverlay ? morePhotosCount : 0,
    morePhotosStartIndex: HOTEL_GALLERY_MORE_START_INDEX,
    slides: images.map((image) => ({ src: image.src })),
  };
}

export function formatPhotoCount(count: number): string {
  return count === 1 ? "1 photo" : `${count} photos`;
}

export function formatMorePhotosLabel(count: number): string {
  return count === 1 ? "1 more photo" : `${count} more photos`;
}
