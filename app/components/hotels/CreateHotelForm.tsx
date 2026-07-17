"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Check, ImagePlus, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteHotelButton from "@/app/components/hotels/DeleteHotelButton";
import HotelImage from "@/app/components/hotels/HotelImage";
import {
  brandGradientBg,
  cardInteractiveClassName,
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
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const STEPS = [
  {
    id: 1,
    label: "Details",
    description: "Title, description, location, and price",
  },
  {
    id: 2,
    label: "Map",
    description: "Coordinates for the globe and hotels map",
  },
  {
    id: 3,
    label: "Photos",
    description: "Upload images for your listing",
  },
] as const;

const STEP_FIELDS: Record<number, (keyof CreateHotelFormInput)[]> = {
  1: ["title", "description", "location", "price"],
  2: ["latitude", "longitude"],
};

function fieldErrorId(field: keyof CreateHotelFormInput) {
  return `${field}-error`;
}

function fieldAriaProps(
  field: keyof CreateHotelFormInput,
  errors: FieldErrors<CreateHotelFormInput>,
  describedBy?: string,
) {
  const message = errors[field]?.message;
  const errorId = fieldErrorId(field);
  const describedByIds = [describedBy, message ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  return {
    errorId,
    message,
    inputProps: {
      "aria-invalid": message ? (true as const) : undefined,
      "aria-describedby": describedByIds || undefined,
    },
  };
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-red-400">
      {message}
    </p>
  );
}

function StepLegend({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <legend className="float-left mb-5 w-full border-b border-border/60 pb-5 text-xl font-semibold text-white">
        {title}
      </legend>
      <p className="mb-6 clear-both text-sm leading-relaxed text-slate-400">
        {description}
      </p>
    </>
  );
}

function FormProgressBar({
  step,
  onStepClick,
}: {
  step: number;
  onStepClick: (nextStep: number) => void;
}) {
  const progressLabelId = useId();
  const progressPercent = Math.round((step / STEPS.length) * 100);
  const progressWidthClass =
    step === 1 ? "w-1/3" : step === 2 ? "w-2/3" : "w-full";

  return (
    <nav
      aria-label="Listing form progress"
      className={cn(cardInteractiveClassName, "p-5 md:p-6")}
    >
      <div className="mb-4 flex items-center justify-between gap-4 text-sm">
        <p id={progressLabelId} className="font-medium text-white">
          Step {step} of {STEPS.length}
        </p>
        <p className="text-slate-500" aria-hidden="true">
          {progressPercent}% complete
        </p>
      </div>

      <div
        role="progressbar"
        aria-labelledby={progressLabelId}
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-valuenow={step}
        aria-valuetext={`Step ${step} of ${STEPS.length}`}
        className="h-2 overflow-hidden rounded-full bg-background"
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            brandGradientBg,
            progressWidthClass,
          )}
        />
      </div>

      <ol
        className="mt-5 grid auto-rows-fr gap-3 sm:grid-cols-3"
        aria-label="Steps"
      >
        {STEPS.map((item) => {
          const isComplete = step > item.id;
          const isActive = step === item.id;
          const isClickable = item.id < step;
          const stepStatus = isActive
            ? "current step"
            : isComplete
              ? "completed step"
              : "upcoming step";

          return (
            <li key={item.id} className="h-full">
              <button
                type="button"
                disabled={!isClickable}
                aria-current={isActive ? "step" : undefined}
                aria-disabled={!isClickable}
                aria-label={`${item.label}, ${stepStatus}${isClickable ? ", go back to this step" : ""}`}
                onClick={() => isClickable && onStepClick(item.id)}
                className={cn(
                  "flex h-full min-h-28 w-full items-center gap-3 rounded-xl border px-4 py-4 text-left transition",
                  isActive && "border-[#30cfd0]/35 bg-[#30cfd0]/8",
                  isComplete && "border-border/80 bg-surface/40",
                  !isActive &&
                    !isComplete &&
                    "border-border/60 bg-background/30",
                  isClickable &&
                    "hover:border-[#30cfd0]/25 hover:bg-[#30cfd0]/5",
                  !isClickable && "cursor-default",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    isActive && brandGradientBg,
                    isComplete && "bg-[#30cfd0]/15 text-[#30cfd0]",
                    !isActive && !isComplete && "bg-surface text-slate-500",
                  )}
                >
                  {isComplete ? <Check size={14} strokeWidth={2.5} /> : item.id}
                </span>
                <span className="flex min-w-0 flex-1 flex-col items-start gap-1 text-left">
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      isActive || isComplete ? "text-white" : "text-slate-400",
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="block text-xs leading-snug text-slate-500">
                    {item.description}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
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
  headingId?: string;
};

export default function CreateHotelForm({
  hotelId,
  defaultValues,
  existingImages = [],
  headingId,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [keptExistingIndices, setKeptExistingIndices] = useState<number[]>(() =>
    existingImages.map((image) => image.index),
  );
  const isEditing = Boolean(hotelId);
  const stepStatusId = useId();
  const photosHelpId = useId();
  const mapTipId = useId();
  const priceHintId = useId();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CreateHotelFormInput>({
    resolver: zodResolver(createHotelFormSchema),
    defaultValues: defaultValues ?? emptyDefaults,
    mode: "onTouched",
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
  const currentStepMeta = STEPS[step - 1];

  const titleField = fieldAriaProps("title", errors);
  const descriptionField = fieldAriaProps("description", errors);
  const locationField = fieldAriaProps("location", errors);
  const priceField = fieldAriaProps("price", errors, priceHintId);
  const latitudeField = fieldAriaProps("latitude", errors, mapTipId);
  const longitudeField = fieldAriaProps("longitude", errors, mapTipId);

  function handleFilesSelected(fileList: FileList | null) {
    setImageError(null);
    if (!fileList?.length) return;

    const incoming = Array.from(fileList);
    const combined = [...newFiles, ...incoming];

    if (
      totalSelectedImages - newFiles.length + combined.length >
      MAX_HOTEL_IMAGES
    ) {
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
    setNewFiles((current) =>
      current.filter((_, fileIndex) => fileIndex !== index),
    );
  }

  function removeExistingImage(index: number) {
    setKeptExistingIndices((current) =>
      current.filter((value) => value !== index),
    );
  }

  function goToStep(nextStep: number) {
    setStep(Math.min(STEPS.length, Math.max(1, nextStep)));
  }

  async function handleNext() {
    setSubmitError(null);

    if (step === 3) return;

    const fields = STEP_FIELDS[step];
    if (fields) {
      const valid = await trigger(fields);
      if (!valid) return;
    }

    goToStep(step + 1);
  }

  function handleBack() {
    setSubmitError(null);
    setImageError(null);
    goToStep(step - 1);
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
        formData.set(
          "keptExistingIndices",
          JSON.stringify(keptExistingIndices),
        );
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

  const photosDescribedBy = [
    photosHelpId,
    imageError ? "photos-error" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <FormProgressBar step={step} onStepClick={goToStep} />

      <p
        id={stepStatusId}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Step {step} of {STEPS.length}: {currentStepMeta.label}
      </p>

      <form
        noValidate
        {...(headingId
          ? { "aria-labelledby": headingId }
          : {
              "aria-label": isEditing
                ? "Edit hotel listing"
                : "Create hotel listing",
            })}
        aria-describedby={stepStatusId}
        onSubmit={(event) => {
          event.preventDefault();
          if (step < 3) {
            void handleNext();
            return;
          }
          void handleSubmit(onSubmit)(event);
        }}
        className="space-y-6"
      >
        {submitError ? (
          <div
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {submitError}
          </div>
        ) : null}

        {step === 1 ? (
          <fieldset
            className={cn(cardInteractiveClassName, "min-w-0 p-6 md:p-8")}
          >
            <StepLegend
              title={currentStepMeta.label}
              description={currentStepMeta.description}
            />

            <div className="space-y-5">
              <div>
                <label className={labelClassName} htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  autoComplete="off"
                  className={inputClassName}
                  placeholder="Seaside retreat in Santorini"
                  {...register("title")}
                  {...titleField.inputProps}
                />
                <FieldError
                  id={titleField.errorId}
                  message={titleField.message}
                />
              </div>

              <div>
                <label className={labelClassName} htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={6}
                  className={cn(inputClassName, "min-h-40 resize-y")}
                  placeholder="Describe the stay, amenities, and what makes this place special."
                  {...register("description")}
                  {...descriptionField.inputProps}
                />
                <FieldError
                  id={descriptionField.errorId}
                  message={descriptionField.message}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClassName} htmlFor="location">
                    Location
                  </label>
                  <input
                    id="location"
                    autoComplete="address-level2"
                    className={inputClassName}
                    placeholder="Santorini, Greece"
                    {...register("location")}
                    {...locationField.inputProps}
                  />
                  <FieldError
                    id={locationField.errorId}
                    message={locationField.message}
                  />
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
                    {...priceField.inputProps}
                  />
                  <p id={priceHintId} className="mt-1.5 text-xs text-slate-500">
                    Enter a whole number in US dollars.
                  </p>
                  <FieldError
                    id={priceField.errorId}
                    message={priceField.message}
                  />
                </div>
              </div>
            </div>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset
            className={cn(cardInteractiveClassName, "min-w-0 p-6 md:p-8")}
          >
            <StepLegend
              title={currentStepMeta.label}
              description={currentStepMeta.description}
            />

            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClassName} htmlFor="latitude">
                    Latitude
                  </label>
                  <input
                    id="latitude"
                    type="number"
                    step="any"
                    inputMode="decimal"
                    className={inputClassName}
                    placeholder="36.3932"
                    {...register("latitude")}
                    {...latitudeField.inputProps}
                  />
                  <FieldError
                    id={latitudeField.errorId}
                    message={latitudeField.message}
                  />
                </div>

                <div>
                  <label className={labelClassName} htmlFor="longitude">
                    Longitude
                  </label>
                  <input
                    id="longitude"
                    type="number"
                    step="any"
                    inputMode="decimal"
                    className={inputClassName}
                    placeholder="25.4615"
                    {...register("longitude")}
                    {...longitudeField.inputProps}
                  />
                  <FieldError
                    id={longitudeField.errorId}
                    message={longitudeField.message}
                  />
                </div>
              </div>

              <aside
                id={mapTipId}
                className="flex items-start gap-3 rounded-xl border border-[#30cfd0]/15 bg-[#30cfd0]/5 px-4 py-3 text-sm text-slate-300"
              >
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-[#30cfd0]/80"
                  aria-hidden="true"
                  strokeWidth={1.75}
                />
                <p>
                  Tip: right-click a spot in Google Maps and copy the
                  coordinates to place your marker accurately.
                </p>
              </aside>
            </div>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset
            className={cn(cardInteractiveClassName, "min-w-0 p-6 md:p-8")}
          >
            <StepLegend
              title={currentStepMeta.label}
              description={currentStepMeta.description}
            />

            <div className="space-y-4">
              <label
                htmlFor="images"
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-2xl",
                  "border-2 border-dashed border-border/80 bg-background/40 px-4 py-10",
                  "text-center transition hover:border-[#30cfd0]/35 hover:bg-background/70",
                )}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#30cfd0]/10 text-[#30cfd0]"
                >
                  <ImagePlus size={22} strokeWidth={1.75} />
                </span>
                <span className="mt-4 text-sm font-semibold text-white">
                  Upload photos
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  JPEG, PNG, WebP, or GIF · up to{" "}
                  {Math.round(MAX_HOTEL_IMAGE_BYTES / (1024 * 1024))} MB each
                </span>
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  aria-describedby={photosDescribedBy}
                  aria-invalid={imageError ? true : undefined}
                  aria-required="true"
                  onChange={(event) => {
                    handleFilesSelected(event.target.files);
                    event.target.value = "";
                  }}
                  className="sr-only"
                />
              </label>

              <p id={photosHelpId} className="text-xs text-slate-500">
                {totalSelectedImages}/{MAX_HOTEL_IMAGES} photos selected · first
                image becomes the cover
              </p>
              <FieldError id="photos-error" message={imageError ?? undefined} />

              {visibleExistingImages.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-white/80">
                    Current photos
                  </h3>
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {visibleExistingImages.map((image) => (
                      <li
                        key={image.index}
                        className="relative overflow-hidden rounded-xl border border-border bg-surface"
                      >
                        <figure className="relative aspect-[4/3]">
                          <HotelImage
                            src={image.src}
                            alt={image.filename ?? "Hotel photo"}
                            fill
                            sizes="200px"
                            className="object-cover"
                          />
                        </figure>
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image.index)}
                          aria-label={`Remove ${image.filename ?? "hotel photo"}`}
                          className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white transition hover:bg-black/90"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {newFilePreviews.length > 0 ? (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {newFilePreviews.map((preview, index) => (
                    <li
                      key={`${preview.file.name}-${index}`}
                      className="relative overflow-hidden rounded-xl border border-border bg-surface"
                    >
                      <figure>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview.url}
                          alt={preview.file.name}
                          className="aspect-[4/3] h-full w-full object-cover"
                        />
                      </figure>
                      {index === 0 && visibleExistingImages.length === 0 ? (
                        <span
                          aria-hidden="true"
                          className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white"
                        >
                          Cover
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => removeNewFile(index)}
                        aria-label={`Remove ${preview.file.name}`}
                        className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white transition hover:bg-black/90"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </fieldset>
        ) : null}

        <nav
          aria-label="Form actions"
          className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <button
            type="button"
            onClick={() =>
              router.push(isEditing ? `/hotels/${hotelId}` : "/hotels")
            }
            className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-white/85 transition hover:border-white/20 hover:text-white"
          >
            Cancel
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-white/85 transition hover:border-white/20 hover:text-white"
              >
                Back
              </button>
            ) : null}

            {step < 3 ? (
              <button
                type="submit"
                className={cn(
                  "rounded-xl px-6 py-3 text-sm font-semibold shadow transition hover:brightness-110",
                  brandGradientBg,
                )}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
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
            )}
          </div>
        </nav>
      </form>

      {isEditing && hotelId ? (
        <DeleteHotelButton
          hotelId={hotelId}
          hotelTitle={defaultValues?.title}
        />
      ) : null}
    </div>
  );
}
