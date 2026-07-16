import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Navbar from "../../components/Navbar";
import HotelMap from "../../components/hotels/HotelMap";
import type { Hotel } from "@/lib/types/hotel";
import { getHotelImages, getHotelReviews } from "@/lib/types/hotel";
import HotelGallery from "@/app/components/hotels/HotelGallery";
import {
  cardInteractiveClassName,
  inputClassName,
  brandGradientBg,
} from "@/lib/design/classes";
import { extractHotelCoordinates } from "@/lib/hotels/extractHotelCoordinates";
import { cn } from "@/lib/cn";

function extractCoordinates(hotel: Hotel): [number, number] | null {
  const coords = extractHotelCoordinates(hotel);
  return coords ? [coords.lng, coords.lat] : null;
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pb-20">
        <div className="relative h-96 w-full overflow-hidden bg-surface">
          {images.length > 0 ? (
            <Image
              src={images[0].url}
              alt={hotel.title}
              width={1000}
              height={1000}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">
              No image available
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/80" />

          {/* Back Button */}
          <div className="absolute left-4 top-4 z-10">
            <Link
              href="/hotels"
              className="inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-black/60 active:scale-95"
            >
              <span>←</span> Back
            </Link>
          </div>

          {/* Rating Badge */}
          <div className="absolute right-4 top-4 z-10">
            <div className="rounded-lg bg-black/50 backdrop-blur-md px-4 py-2 text-sm font-semibold text-white">
              4.9 • {reviews.length} reviews
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
              Hotel details
            </p>
            <h1 className="text-4xl font-semibold tracking-wide text-white md:text-5xl">
              {hotel.title}
            </h1>
            <p className="text-slate-300 text-base">{hotel.location}</p>
          </div>
        </div>

        {/* Gallery Section */}
        <HotelGallery title={hotel.title} images={images} />

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Left Column */}
            <section className="space-y-6">
              {/* About Section */}
              <div className={cn(cardInteractiveClassName, "p-8")}>
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  About this hotel
                </h2>
                <p className="text-base leading-relaxed text-slate-300">
                  {hotel.description}
                </p>
              </div>

              <div className={cn(cardInteractiveClassName, "p-8")}>
                <h2 className="mb-6 text-2xl font-semibold text-white">
                  What this place offers
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[
                    "Comfortable beds",
                    "Shower",
                    "Breakfast included",
                    "Smart TV",
                    "Fast WiFi",
                    "Air conditioning",
                  ].map((amenity, index) => (
                    <div
                      key={index}
                      className="group/item flex items-center gap-2 rounded-lg bg-background/80 px-3 py-2.5 transition hover:bg-background"
                    >
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#30cfd0]/80 transition-transform group-hover/item:scale-125" />
                      <span className="text-sm font-medium text-slate-300">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cn(cardInteractiveClassName, "p-8")}>
                <h2 className="mb-6 text-2xl font-semibold text-white">
                  Reviews ({reviews.length})
                </h2>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map((review, index) => (
                      <div
                        key={index}
                        className="rounded-lg border-l-2 border-[#30cfd0]/50 bg-surface/50 px-4 py-3 transition hover:border-[#30cfd0]/70 hover:bg-surface"
                      >
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                          <span>{review.rating || 5}/5 stars</span>
                        </div>
                        <p className="text-sm text-slate-300">
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

            {/* Right Column - Booking Card */}
            <aside>
              <div className="sticky top-6 space-y-4">
                {/* Booking Card */}
                <div
                  className={cn(
                    cardInteractiveClassName,
                    "border-[#30cfd0]/20 p-8",
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
                    <div className="mt-3 flex gap-3 text-xs text-slate-500">
                      <span>Instant book</span>
                      <span>Free cancellation</span>
                    </div>
                  </div>

                  <div className="mb-6 space-y-3">
                    <input type="date" className={inputClassName} />
                    <input type="date" className={inputClassName} />
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
                  <p className="mt-3 text-sm text-slate-300">
                    {hotel.location}
                  </p>
                </div>

                {/* Host Info */}
                <div className={cn(cardInteractiveClassName, "p-6")}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                        Hosted by
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {hotel.authorId || "Unknown host"}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-linear-to-br from-[#30cfd0] to-[#0c5eb6] shadow-lg transition group-hover:scale-105" />
                  </div>
                </div>

                <div className={cn(cardInteractiveClassName, "p-6")}>
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Stay information
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex items-start gap-3 transition hover:text-[#30cfd0]/90">
                      <span className="font-medium text-slate-600">•</span>
                      <span>Check-in: 15:00 (Flexible)</span>
                    </li>
                    <li className="flex items-start gap-3 transition hover:text-[#30cfd0]/90">
                      <span className="font-medium text-slate-600">•</span>
                      <span>Check-out: 11:00</span>
                    </li>
                    <li className="flex items-start gap-3 transition hover:text-[#30cfd0]/90">
                      <span className="font-medium text-slate-600">•</span>
                      <span>Free cancellation up to 48 hours</span>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
