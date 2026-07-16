import type { HotelImageRecord } from "@/lib/types/hotel";

export const MAX_HOTEL_IMAGES = 10;
export const MAX_HOTEL_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_HOTEL_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type StoredHotelImage = {
  storage: "database";
  filename: string;
  mimeType: string;
  data: string;
};

export function isStoredHotelImage(
  image: HotelImageRecord,
): image is StoredHotelImage {
  return (
    typeof image === "object" &&
    image !== null &&
    "storage" in image &&
    image.storage === "database" &&
    typeof image.data === "string" &&
    typeof image.mimeType === "string"
  );
}

export function isLegacyUrlHotelImage(
  image: HotelImageRecord,
): image is { url: string; filename?: string } {
  return (
    typeof image === "object" &&
    image !== null &&
    "url" in image &&
    typeof image.url === "string" &&
    !("storage" in image)
  );
}

export function resolveHotelImageSrc(
  hotelId: string,
  image: HotelImageRecord,
  index: number,
): string | null {
  if (isStoredHotelImage(image)) {
    return `/api/hotels/${hotelId}/images/${index}`;
  }

  if (isLegacyUrlHotelImage(image)) {
    return image.url;
  }

  return null;
}

export async function fileToStoredHotelImage(file: File): Promise<StoredHotelImage> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    storage: "database",
    filename: file.name,
    mimeType: file.type,
    data: buffer.toString("base64"),
  };
}

export function validateUploadedImageFile(file: File): string | null {
  if (!ALLOWED_HOTEL_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_HOTEL_IMAGE_TYPES)[number])) {
    return `"${file.name}" must be JPEG, PNG, WebP, or GIF`;
  }

  if (file.size > MAX_HOTEL_IMAGE_BYTES) {
    return `"${file.name}" exceeds the 5 MB limit`;
  }

  return null;
}

export async function parseUploadedImageFiles(
  files: File[],
): Promise<{ images: StoredHotelImage[]; error: string | null }> {
  if (files.length === 0) {
    return { images: [], error: null };
  }

  if (files.length > MAX_HOTEL_IMAGES) {
    return {
      images: [],
      error: `You can upload up to ${MAX_HOTEL_IMAGES} images`,
    };
  }

  const images: StoredHotelImage[] = [];

  for (const file of files) {
    const validationError = validateUploadedImageFile(file);
    if (validationError) {
      return { images: [], error: validationError };
    }

    images.push(await fileToStoredHotelImage(file));
  }

  return { images, error: null };
}

export function parseKeptExistingIndices(value: FormDataEntryValue | null): number[] {
  if (typeof value !== "string" || !value.trim()) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is number => Number.isInteger(item) && item >= 0);
  } catch {
    return [];
  }
}

export function mergeHotelImages(
  existing: HotelImageRecord[],
  keptIndices: number[],
  uploaded: StoredHotelImage[],
): HotelImageRecord[] {
  const kept = keptIndices
    .map((index) => existing[index])
    .filter((image): image is HotelImageRecord => Boolean(image));

  return [...kept, ...uploaded];
}
