import { z } from "zod";

export const hotelListingFieldsSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(5000),
  location: z.string().trim().min(2, "Location is required").max(200),
  price: z.coerce
    .number()
    .int("Price must be a whole number")
    .positive("Price must be greater than 0")
    .max(1_000_000),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export type HotelListingFields = z.infer<typeof hotelListingFieldsSchema>;

export const createHotelFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(5000),
  location: z.string().trim().min(2, "Location is required").max(200),
  price: z.string().trim().min(1, "Price is required"),
  latitude: z.string().trim().min(1, "Latitude is required"),
  longitude: z.string().trim().min(1, "Longitude is required"),
}).superRefine((data, ctx) => {
  const numericFields = ["price", "latitude", "longitude"] as const;

  for (const field of numericFields) {
    const result = hotelListingFieldsSchema.shape[field].safeParse(data[field]);
    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({
          ...issue,
          path: [field],
        });
      }
    }
  }
});

export type CreateHotelFormInput = z.infer<typeof createHotelFormSchema>;

export function toHotelListingFields(form: CreateHotelFormInput): HotelListingFields {
  return hotelListingFieldsSchema.parse({
    title: form.title,
    description: form.description,
    location: form.location,
    price: form.price,
    latitude: form.latitude,
    longitude: form.longitude,
  });
}

/** @deprecated Use hotelListingFieldsSchema */
export const createHotelSchema = hotelListingFieldsSchema;

/** @deprecated Use HotelListingFields */
export type CreateHotelInput = HotelListingFields;

/** @deprecated Use toHotelListingFields */
export const toCreateHotelPayload = toHotelListingFields;
