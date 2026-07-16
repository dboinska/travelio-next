import {
  hotelListingFieldsSchema,
  type HotelListingFields,
} from "@/lib/hotels/createHotelSchema";
import {
  MAX_HOTEL_IMAGES,
  mergeHotelImages,
  parseKeptExistingIndices,
  parseUploadedImageFiles,
  type StoredHotelImage,
} from "@/lib/hotels/storedHotelImage";
import type { HotelImageRecord } from "@/lib/types/hotel";

type ParsedListingForm =
  | {
      ok: true;
      fields: HotelListingFields;
      images: HotelImageRecord[];
    }
  | {
      ok: false;
      message: string;
      errors?: Record<string, string[]>;
    };

function listingFieldsFromFormData(formData: FormData) {
  return hotelListingFieldsSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    price: formData.get("price"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
  });
}

export async function parseCreateHotelFormData(
  formData: FormData,
): Promise<ParsedListingForm> {
  const parsedFields = listingFieldsFromFormData(formData);
  if (!parsedFields.success) {
    return {
      ok: false,
      message: "Validation failed",
      errors: parsedFields.error.flatten().fieldErrors,
    };
  }

  const uploadFiles = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (uploadFiles.length === 0) {
    return {
      ok: false,
      message: "Add at least one photo",
      errors: { images: ["Add at least one photo"] },
    };
  }

  const uploaded = await parseUploadedImageFiles(uploadFiles);
  if (uploaded.error) {
    return {
      ok: false,
      message: uploaded.error,
      errors: { images: [uploaded.error] },
    };
  }

  return {
    ok: true,
    fields: parsedFields.data,
    images: uploaded.images,
  };
}

export async function parseUpdateHotelFormData(
  formData: FormData,
  existingImages: HotelImageRecord[],
): Promise<ParsedListingForm> {
  const parsedFields = listingFieldsFromFormData(formData);
  if (!parsedFields.success) {
    return {
      ok: false,
      message: "Validation failed",
      errors: parsedFields.error.flatten().fieldErrors,
    };
  }

  const keptExistingIndices = parseKeptExistingIndices(
    formData.get("keptExistingIndices"),
  );
  const uploadFiles = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const uploaded = await parseUploadedImageFiles(uploadFiles);
  if (uploaded.error) {
    return {
      ok: false,
      message: uploaded.error,
      errors: { images: [uploaded.error] },
    };
  }

  const images = mergeHotelImages(
    existingImages,
    keptExistingIndices,
    uploaded.images,
  );

  if (images.length === 0) {
    return {
      ok: false,
      message: "Keep at least one photo or upload a new one",
      errors: { images: ["Keep at least one photo or upload a new one"] },
    };
  }

  if (images.length > MAX_HOTEL_IMAGES) {
    return {
      ok: false,
      message: `You can have up to ${MAX_HOTEL_IMAGES} images`,
      errors: { images: [`You can have up to ${MAX_HOTEL_IMAGES} images`] },
    };
  }

  return {
    ok: true,
    fields: parsedFields.data,
    images,
  };
}
