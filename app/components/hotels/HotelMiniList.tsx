import Link from "next/link";
import { Hotel } from "@/lib/types/hotel";

interface Props {
  hotels: Hotel[];
}

export default function HotelMiniList({ hotels }: Props) {
  const featuredHotels = hotels.slice(0, 5);

  return (
    <aside className="h-full flex flex-col overflow-hidden">
      <div className="shrink-0 space-y-2 pb-2">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          Top hotele
        </p>
        <h2 className="text-lg font-bold text-white">
          Znaleziono {hotels.length} wyników
        </h2>
      </div>

      <div className="flex-1 min-h-0 space-y-3 overflow-y-auto pr-2">
        {featuredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {hotel.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">{hotel.location}</p>
              </div>
              <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
                ${hotel.price}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-sm text-zinc-400">
              <span>
                {hotel.date
                  ? new Date(hotel.date).toLocaleDateString()
                  : "Brak daty"}
              </span>
              <Link
                href={`/hotels/${hotel.id}`}
                className="rounded-full bg-white/5 px-3 py-1 font-medium text-white transition hover:bg-white/10"
              >
                Zobacz
              </Link>
            </div>
          </div>
        ))}
      </div>

      {hotels.length > featuredHotels.length && (
        <p className="shrink-0 pt-2 text-xs text-zinc-500">
          +{hotels.length - featuredHotels.length} więcej
        </p>
      )}
    </aside>
  );
}
