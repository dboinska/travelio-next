import Link from "next/link";
import { ChevronLeft, Images, MapPin, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Navbar from "../../components/Navbar";
import HotelMap from "../../components/hotels/HotelMap";
import { AppLink } from "@/app/components/AppLink";
import type { Hotel, HotelReview } from "@/lib/types/hotel";
import { getHotelImages, getHotelReviews } from "@/lib/types/hotel";
import HotelGallery from "@/app/components/hotels/HotelGallery";
import { getServerSession } from "@/lib/auth/getServerSession";
import { isHotelAuthor } from "@/lib/hotels/requireHotelAuthor";
import {
  cardInteractiveClassName,
  inputClassName,
  labelClassName,
  brandGradientBg,
} from "@/lib/design/classes";
import { extractHotelCoordinates } from "@/lib/hotels/extractHotelCoordinates";
import { formatPhotoCount } from "@/lib/hotels/hotelGalleryLayout";
import { cn } from "@/lib/cn";

function extractCoordinates(hotel: Hotel): [number, number] | null {
  const coords = extractHotelCoordinates(hotel);
  return coords ? [coords.lng, coords.lat] : null;
}

function getAverageRating(reviews: HotelReview[]): number | null {
  const ratings = reviews
    .map((review) => review.rating)
    .filter((rating): rating is number => typeof rating === "number");

  if (!ratings.length) return null;

  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return Math.round(average * 10) / 10;
}

interface Props {
  params: Promise<{
    id?: string | string[];
  }>;
}

async function getHotel(id: string): Promise<Hotel | null> {
  const hotel = await prisma.hotel.findFirst({
    where: { id },
  });
  return hotel as unknown as Hotel | null;
}

const AMENITIES = [
  "Comfortable beds",
  "Shower",
  "Breakfast included",
  "Smart TV",
  "Fast WiFi",
  "Air conditioning",
] as const;

export default async function HotelPage({ params }: Props) {
  const resolvedParams = (await params) as { id?: string | string[] };
  const id = Array.isArray(resolvedParams?.id)
    ? resolvedParams.id[0]
    : resolvedParams?.id;

  if (!id) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 text-white">
        <h1 className="text-3xl font-bold">Missing hotel id</h1>
        <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-border bg-surface p-4 text-sm text-white/70">
          {JSON.stringify(resolvedParams, null, 2)}
        </pre>
      </main>
    );
  }

  const hotel = await getHotel(id);

  if (!hotel) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 text-white">
        <h1 className="text-3xl font-bold">Hotel not found</h1>
        <p className="mt-4">Requested id: {id}</p>
        <p className="mt-4">
          This means the server either cannot find the hotel or is using a
          different database.
        </p>
      </main>
    );
  }

  const coords = extractCoordinates(hotel);
  const images = getHotelImages(hotel);
  const reviews = getHotelReviews(hotel);
  const averageRating = getAverageRating(reviews);
  const session = await getServerSession();
  const canManage = await isHotelAuthor(id, session?.user?.id);

  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-x-hidden bg-background pb-28 md:pb-20">
        <div className="mx-auto max-w-6xl px-4 pt-6">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ChevronLeft size={16} strokeWidth={1.75} />
            Back to hotels
          </Link>
        </div>

        <header className="mx-auto max-w-6xl border-b border-border/70 px-4 pb-8 pt-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                Hotel details
              </p>
              <h1 className="break-words text-3xl font-semibold tracking-[0.08em] text-white md:text-4xl lg:text-5xl">
                {hotel.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
                <span className="inline-flex items-center gap-1.5 text-slate-300">
                  <MapPin size={15} className="shrink-0 text-[#30cfd0]/80" />
                  <span className="break-words">{hotel.location}</span>
                </span>
                {images.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Images size={15} className="shrink-0 text-[#30cfd0]/80" />
                    <span>{formatPhotoCount(images.length)}</span>
                  </span>
                ) : null}
                {averageRating !== null ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Star
                      size={15}
                      className="fill-[#30cfd0]/90 text-[#30cfd0]/90"
                    />
                    <span className="font-medium text-white">{averageRating}</span>
                    <span>· {reviews.length} reviews</span>
                  </span>
                ) : (
                  <span>No reviews yet</span>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
              <div className="rounded-2xl border border-[#30cfd0]/25 bg-surface/80 px-5 py-3 backdrop-blur-sm">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#30cfd0]/80">
                  From
                </p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-white">
                    ${hotel.price}
                  </span>
                  <span className="text-sm text-slate-400">/ night</span>
                </div>
              </div>
              {canManage ? (
                <AppLink
                  href={`/hotels/${id}/edit`}
                  variant="secondary"
                  className="border-[#30cfd0]/35 px-5 py-2.5 text-[#30cfd0] hover:border-[#30cfd0]/55 hover:bg-[#30cfd0]/10"
                >
                  Edit listing
                </AppLink>
              ) : null}
            </div>
          </div>
        </header>

        <HotelGallery title={hotel.title} images={images} />

        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid min-w-0 gap-8 lg:grid-cols-[2fr_1fr]">
            <section className="min-w-0 space-y-6">
              <div className={cn(cardInteractiveClassName, "p-6 md:p-8")}>
                <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                  About this hotel
                </h2>
                <p className="break-words text-base leading-relaxed text-slate-300">
                  {hotel.description}
                </p>
              </div>

              <div className={cn(cardInteractiveClassName, "p-6 md:p-8")}>
                <h2 className="mb-6 text-xl font-semibold text-white md:text-2xl">
                  What this place offers
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {AMENITIES.map((amenity) => (
                    <div
                      key={amenity}
                      className="group/item flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/60 px-3.5 py-3 transition hover:border-[#30cfd0]/25 hover:bg-background"
                    >
                      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#30cfd0]/80 transition-transform group-hover/item:scale-125" />
                      <span className="text-sm font-medium text-slate-300">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cn(cardInteractiveClassName, "p-6 md:p-8")}>
                <h2 className="mb-6 text-xl font-semibold text-white md:text-2xl">
                  Reviews ({reviews.length})
                </h2>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map((review, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-border/60 border-l-2 border-l-[#30cfd0]/50 bg-surface/50 px-4 py-4 transition hover:border-[#30cfd0]/30 hover:bg-surface"
                      >
                        <div className="mb-2 flex items-center gap-1.5 text-sm text-slate-400">
                          <Star
                            size={14}
                            className="fill-[#30cfd0]/80 text-[#30cfd0]/80"
                          />
                          <span>{review.rating ?? 5}/5</span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-300">
                          {review.body ||
                            review.comment ||
                            "No review text provided."}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">
                    No reviews yet. Be the first to review.
                  </p>
                )}
              </div>
            </section>

            <aside className="min-w-0">
              <div className="space-y-4 lg:sticky lg:top-24">
                <div
                  className={cn(
                    cardInteractiveClassName,
                    "hidden border-[#30cfd0]/20 p-6 md:block lg:p-8",
                  )}
                >
                  <div className="mb-6">
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#30cfd0]/80">
                      Price per night
                    </p>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-4xl font-semibold text-white">
                        ${hotel.price}
                      </span>
                      <span className="font-medium text-slate-400">/night</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>Instant book</span>
                      <span aria-hidden>·</span>
                      <span>Free cancellation</span>
                    </div>
                  </div>

                  <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <div>
                      <label htmlFor="check-in" className={labelClassName}>
                        Check-in
                      </label>
                      <input
                        id="check-in"
                        type="date"
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label htmlFor="check-out" className={labelClassName}>
                        Check-out
                      </label>
                      <input
                        id="check-out"
                        type="date"
                        className={inputClassName}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-xl py-3 text-sm font-semibold transition hover:brightness-110",
                      brandGradientBg,
                    )}
                  >
                    Reserve now
                  </button>
                </div>

                <div className={cn(cardInteractiveClassName, "p-6")}>
                  <h3 className="mb-3 text-lg font-semibold text-white">
                    Location
                  </h3>
                  <HotelMap lngLat={coords} title={hotel.title} height="h-56" />
                  <p className="mt-3 break-words text-sm text-slate-300">
                    {hotel.location}
                  </p>
                </div>

                <div className={cn(cardInteractiveClassName, "p-6")}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                        Hosted by
                      </p>
                      <p className="mt-2 truncate text-base font-semibold text-white">
                        {hotel.authorId || "Unknown host"}
                      </p>
                    </div>
                    <div
                      className="h-12 w-12 shrink-0 rounded-full bg-linear-to-br from-[#30cfd0] to-[#0c5eb6] shadow-lg shadow-[#30cfd0]/10"
                      aria-hidden
                    />
                  </div>
                </div>

                <div className={cn(cardInteractiveClassName, "p-6")}>
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Stay information
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex items-start gap-3">
                      <span className="font-medium text-[#30cfd0]/60">•</span>
                      <span>Check-in: 15:00 (Flexible)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-medium text-[#30cfd0]/60">•</span>
                      <span>Check-out: 11:00</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="font-medium text-[#30cfd0]/60">•</span>
                      <span>Free cancellation up to 48 hours</span>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 p-4 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                From
              </p>
              <p className="text-xl font-semibold text-white">
                ${hotel.price}
                <span className="text-sm font-normal text-slate-400"> / night</span>
              </p>
            </div>
            <button
              type="button"
              className={cn(
                "shrink-0 rounded-xl px-6 py-3 text-sm font-semibold transition hover:brightness-110",
                brandGradientBg,
              )}
            >
              Reserve now
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
