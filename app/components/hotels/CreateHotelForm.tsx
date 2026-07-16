"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DeleteHotelButton from "@/app/components/hotels/DeleteHotelButton";
import HotelImage from "@/app/components/hotels/HotelImage";
import {
  brandGradientBg,
  cardClassName,
  inputClassName,
  labelClassName,
} from "@/lib/design/classes";
import {
  createHotelFormSchema,
  type CreateHotelFormInput,
  toHotelListingFields,
} from "@/lib/hotels/createHotelSchema";
import type { ExistingHotelImage } from "@/lib/hotels/hotelToFormDefaults";
import {
  MAX_HOTEL_IMAGES,
  MAX_HOTEL_IMAGE_BYTES,
  validateUploadedImageFile,
} from "@/lib/hotels/storedHotelImage";
import { cn } from "@/lib/cn";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function fieldError(message?: string) {
  if (!message) return null;
  return <p className="mt-1.5 text-sm text-red-400">{message}</p>;
}

const emptyDefaults: CreateHotelFormInput = {
  title: "",
  description: "",
  location: "",
  price: "",
  latitude: "",
  longitude: "",
};

type Props = {
  hotelId?: string;
  defaultValues?: CreateHotelFormInput;
  existingImages?: ExistingHotelImage[];
};

export default function CreateHotelForm({
  hotelId,
  defaultValues,
  existingImages = [],
}: Props) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [keptExistingIndices, setKeptExistingIndices] = useState<number[]>(() =>
    existingImages.map((image) => image.index),
  );
  const isEditing = Boolean(hotelId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateHotelFormInput>({
    resolver: zodResolver(createHotelFormSchema),
    defaultValues: defaultValues ?? emptyDefaults,
  });

  const newFilePreviews = useMemo(
    () =>
      newFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [newFiles],
  );

  useEffect(() => {
    return () => {
      for (const preview of newFilePreviews) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [newFilePreviews]);

  const visibleExistingImages = existingImages.filter((image) =>
    keptExistingIndices.includes(image.index),
  );
  const totalSelectedImages = visibleExistingImages.length + newFiles.length;

  function handleFilesSelected(fileList: FileList | null) {
    setImageError(null);
    if (!fileList?.length) return;

    const incoming = Array.from(fileList);
    const combined = [...newFiles, ...incoming];

    if (totalSelectedImages - newFiles.length + combined.length > MAX_HOTEL_IMAGES) {
      setImageError(`You can upload up to ${MAX_HOTEL_IMAGES} images`);
      return;
    }

    for (const file of incoming) {
      const validationError = validateUploadedImageFile(file);
      if (validationError) {
        setImageError(validationError);
        return;
      }
    }

    setNewFiles(combined);
  }

  function removeNewFile(index: number) {
    setNewFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
  }

  function removeExistingImage(index: number) {
    setKeptExistingIndices((current) => current.filter((value) => value !== index));
  }

  async function onSubmit(values: CreateHotelFormInput) {
    setSubmitError(null);
    setImageError(null);

    if (totalSelectedImages === 0) {
      setImageError(
        isEditing
          ? "Keep at least one photo or upload a new one"
          : "Add at least one photo",
      );
      return;
    }

    try {
      toHotelListingFields(values);

      const formData = new FormData();
      formData.set("title", values.title);
      formData.set("description", values.description);
      formData.set("location", values.location);
      formData.set("price", values.price);
      formData.set("latitude", values.latitude);
      formData.set("longitude", values.longitude);

      if (isEditing) {
        formData.set("keptExistingIndices", JSON.stringify(keptExistingIndices));
      }

      for (const file of newFiles) {
        formData.append("images", file);
      }

      const response = await fetch(
        isEditing ? `/api/hotels/${hotelId}` : "/api/hotels",
        {
          method: isEditing ? "PATCH" : "POST",
          credentials: "same-origin",
          body: formData,
        },
      );

      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
        errors?: Record<string, string[]>;
        hotel?: { id?: string };
      };

      if (!response.ok) {
        setSubmitError(body.message ?? "Could not save listing");
        if (body.errors?.images?.[0]) {
          setImageError(body.errors.images[0]);
        }
        return;
      }

      const nextId = body.hotel?.id ?? hotelId;
      if (nextId) {
        router.push(`/hotels/${nextId}`);
        router.refresh();
        return;
      }

      router.push("/hotels");
      router.refresh();
    } catch {
      setSubmitError("Connection error");
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(cardClassName, "space-y-8 p-6 md:p-8")}
      >
        {submitError ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {submitError}
          </div>
        ) : null}

        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Listing details</h2>
            <p className="mt-1 text-sm text-slate-400">
              Basic information shown on the hotel card and detail page.
            </p>
          </div>

          <div>
            <label className={labelClassName} htmlFor="title">
              Title
            </label>
            <input
              id="title"
              className={inputClassName}
              placeholder="Seaside retreat in Santorini"
              {...register("title")}
            />
            {fieldError(errors.title?.message)}
          </div>

          <div>
            <label className={labelClassName} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              className={cn(inputClassName, "resize-y")}
              placeholder="Describe the stay, amenities, and what makes this place special."
              {...register("description")}
            />
            {fieldError(errors.description?.message)}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClassName} htmlFor="location">
                Location
              </label>
              <input
                id="location"
                className={inputClassName}
                placeholder="Santorini, Greece"
                {...register("location")}
              />
              {fieldError(errors.location?.message)}
            </div>

            <div>
              <label className={labelClassName} htmlFor="price">
                Price per night (USD)
              </label>
              <input
                id="price"
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                className={inputClassName}
                placeholder="250"
                {...register("price")}
              />
              {fieldError(errors.price?.message)}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Map coordinates</h2>
            <p className="mt-1 text-sm text-slate-400">
              Used for the hotels map and the home page globe marker.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClassName} htmlFor="latitude">
                Latitude
              </label>
              <input
                id="latitude"
                type="number"
                step="any"
                className={inputClassName}
                placeholder="36.3932"
                {...register("latitude")}
              />
              {fieldError(errors.latitude?.message)}
            </div>

            <div>
              <label className={labelClassName} htmlFor="longitude">
                Longitude
              </label>
              <input
                id="longitude"
                type="number"
                step="any"
                className={inputClassName}
                placeholder="25.4615"
                {...register("longitude")}
              />
              {fieldError(errors.longitude?.message)}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Photos</h2>
            <p className="mt-1 text-sm text-slate-400">
              Upload JPEG, PNG, WebP, or GIF files up to 5 MB each. Images are
              stored in the database with your listing.
            </p>
          </div>

          {visibleExistingImages.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-white/80">Current photos</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {visibleExistingImages.map((image) => (
                  <div
                    key={image.index}
                    className="relative overflow-hidden rounded-xl border border-border bg-surface"
                  >
                    <div className="relative aspect-[4/3]">
                      <HotelImage
                        src={image.src}
                        alt={image.filename ?? "Hotel photo"}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.index)}
                      className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white transition hover:bg-black/90"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <label className={labelClassName} htmlFor="images">
              Upload photos
            </label>
            <input
              id="images"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={(event) => {
                handleFilesSelected(event.target.files);
                event.target.value = "";
              }}
              className={cn(
                inputClassName,
                "cursor-pointer file:mr-4 file:rounded-lg file:border-0 file:bg-[#30cfd0]/15 file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#30cfd0]",
              )}
            />
            <p className="mt-2 text-xs text-slate-500">
              Max {MAX_HOTEL_IMAGES} images, {Math.round(MAX_HOTEL_IMAGE_BYTES / (1024 * 1024))} MB each.
              Selected: {totalSelectedImages}/{MAX_HOTEL_IMAGES}
            </p>
            {fieldError(imageError ?? undefined)}
          </div>

          {newFilePreviews.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {newFilePreviews.map((preview, index) => (
                <div
                  key={`${preview.file.name}-${index}`}
                  className="relative overflow-hidden rounded-xl border border-border bg-surface"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.url}
                    alt={preview.file.name}
                    className="aspect-[4/3] h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewFile(index)}
                    className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white transition hover:bg-black/90"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <div className="flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push(isEditing ? `/hotels/${hotelId}` : "/hotels")}
            className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-white/85 transition hover:border-white/20 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "rounded-xl px-6 py-3 text-sm font-semibold shadow transition hover:brightness-110 disabled:opacity-50",
              brandGradientBg,
            )}
          >
            {isSubmitting
              ? isEditing
                ? "Saving..."
                : "Publishing..."
              : isEditing
                ? "Save changes"
                : "Publish listing"}
          </button>
        </div>
      </form>

      {isEditing && hotelId ? (
        <DeleteHotelButton hotelId={hotelId} hotelTitle={defaultValues?.title} />
      ) : null}
    </div>
  );
}
