import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Navbar from "../../components/Navbar";
import HotelMap from "../../components/hotels/HotelMap";
import type { Hotel } from "@/lib/types/hotel";
import HotelGallery from "@/app/components/hotels/HotelGallery";

type GeometryType = {
  longitude?: number;
  latitude?: number;
  coordinates?: [number, number];
};

// Extract coordinates helper
function extractCoordinates(hotel: Hotel): [number, number] | null {
  const geom = hotel.geometry as GeometryType | null;

  const lng = geom?.longitude;
  const lat = geom?.latitude;

  if (typeof lng === "number" && typeof lat === "number") {
    return [lng, lat];
  }

  return null;
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
        <pre className="mt-4 whitespace-pre-wrap bg-zinc-950 p-4 text-sm text-slate-300">
          {JSON.stringify(resolvedParams, null, 2)}
        </pre>
      </main>
    );
  }

  const hotel = await getHotel(id);
  console.log({ hotel });

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-b from-zinc-950 to-black pb-20">
        {/* Hero Section */}
        <div className="relative h-96 w-full overflow-hidden bg-zinc-900">
          {hotel.images?.length ? (
            <Image
              src={hotel.images[0]?.url}
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
              4.9 • {hotel.reviews?.length ?? 0} reviews
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-3">
            <p className="text-sm uppercase tracking-[0.15em] text-slate-400 font-medium">
              Hotel Details
            </p>
            <h1 className="text-5xl font-bold text-white leading-tight">
              {hotel.title}
            </h1>
            <p className="text-slate-300 text-base">{hotel.location}</p>
          </div>
        </div>

        {/* Gallery Section */}
        <HotelGallery title={hotel.title} images={hotel.images ?? undefined} />

        {/* Main Content */}
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Left Column */}
            <section className="space-y-6">
              {/* About Section */}
              <div className="group rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-8 shadow-xl transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/50">
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  About this hotel
                </h2>
                <p className="leading-relaxed text-slate-300 text-base">
                  {hotel.description}
                </p>
              </div>

              {/* Amenities Section */}
              <div className="group rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-8 shadow-xl transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/50">
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
                      className="group/item flex items-center gap-2 rounded-lg bg-zinc-800/20 px-3 py-2.5 transition-all duration-200 hover:bg-zinc-800/40 cursor-default"
                    >
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400 transition-transform group-hover/item:scale-125" />
                      <span className="text-sm text-slate-300 font-medium">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="group rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-8 shadow-xl transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/50">
                <h2 className="mb-6 text-2xl font-semibold text-white">
                  Reviews ({hotel.reviews?.length ?? 0})
                </h2>
                {(hotel.reviews?.length ?? 0) > 0 ? (
                  <div className="space-y-4">
                    {hotel.reviews?.slice(0, 3).map((review, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-500/50 bg-blue-500/5 rounded px-4 py-3 transition-all duration-200 hover:border-blue-500 hover:bg-blue-500/15 hover:shadow-md cursor-default"
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
                <div className="rounded-2xl border border-blue-500/30 bg-linear-to-br from-blue-950/80 to-blue-900/60 backdrop-blur-sm p-8 shadow-2xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/20">
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-wider text-blue-300 font-semibold">
                      Price per night
                    </p>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-white">
                        ${hotel.price}
                      </span>
                      <span className="text-slate-300 font-medium">/night</span>
                    </div>
                    <div className="mt-3 flex gap-2 text-xs text-blue-200">
                      <span>✓ Instant book</span>
                      <span>✓ Free cancellation</span>
                    </div>
                  </div>

                  <div className="mb-6 space-y-3">
                    <input
                      type="date"
                      className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-white placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white/20 focus:ring-2 focus:ring-blue-400/50 hover:bg-white/15"
                      placeholder="Check-in"
                    />
                    <input
                      type="date"
                      className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-white placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white/20 focus:ring-2 focus:ring-blue-400/50 hover:bg-white/15"
                      placeholder="Check-out"
                    />
                  </div>

                  <button className="w-full rounded-lg bg-linear-to-r from-blue-600 to-blue-500 py-3 font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-blue-400 active:scale-95 shadow-lg hover:shadow-blue-500/40 hover:shadow-xl">
                    Reserve now
                  </button>
                </div>

                {/* Location Card */}
                <div className="group rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-6 shadow-xl transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/50">
                  <h3 className="mb-3 text-lg font-semibold text-white">
                    Location
                  </h3>
                  <HotelMap lngLat={coords} title={hotel.title} height="h-56" />
                  <p className="mt-3 text-sm text-slate-300">
                    {hotel.location}
                  </p>
                </div>

                {/* Host Info */}
                <div className="group rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-6 shadow-xl transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                        Hosted by
                      </p>
                      <p className="mt-2 font-bold text-white text-base">
                        {hotel.authorId || "Unknown host"}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-purple-600 shadow-lg transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>

                {/* Stay Info */}
                <div className="group rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-6 shadow-xl transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/50">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Stay information
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-3 transition-all duration-200 hover:text-blue-400">
                      <span className="text-slate-500 font-medium">•</span>
                      <span>Check-in: 15:00 (Flexible)</span>
                    </li>
                    <li className="flex items-start gap-3 transition-all duration-200 hover:text-blue-400">
                      <span className="text-slate-500 font-medium">•</span>
                      <span>Check-out: 11:00</span>
                    </li>
                    <li className="flex items-start gap-3 transition-all duration-200 hover:text-blue-400">
                      <span className="text-slate-500 font-medium">•</span>
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
