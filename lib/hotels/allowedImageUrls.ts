export const HOTEL_IMAGE_REMOTE_HOSTS = [
  "images.pexels.com",
  "res.cloudinary.com",
] as const;

export const HOTEL_IMAGE_URL_ERROR =
  "Use a direct image URL from images.pexels.com or res.cloudinary.com (copy image address, not the gallery page link).";

export function isAllowedHotelImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      HOTEL_IMAGE_REMOTE_HOSTS.includes(
        parsed.hostname as (typeof HOTEL_IMAGE_REMOTE_HOSTS)[number],
      )
    );
  } catch {
    return false;
  }
}

export function filterAllowedHotelImages<T extends { url: string }>(
  images: T[],
): T[] {
  return images.filter((image) => isAllowedHotelImageUrl(image.url));
}
