import Link from "next/link";
import { Hotel } from "@/lib/types/hotel";

interface Props {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg transition hover:scale-[1.01] hover:border-zinc-700">
      <div className="relative aspect-[4/3] overflow-hidden">
        {hotel.images?.[0]?.url && (
          <img
            src={hotel.images[0].url}
            alt={hotel.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-bold text-white">{hotel.title}</h2>

          <p className="text-zinc-400">{hotel.location}</p>

          <div className="flex items-center justify-center gap-1 text-yellow-400">
            ⭐ 1
          </div>

          <p className="text-sm text-zinc-400">
            From{" "}
            <span className="font-semibold text-white">${hotel.price}</span> /
            night
          </p>
        </div>

        <Link
          href={`/hotels/${hotel.id}`}
          className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-medium text-white transition hover:bg-blue-500"
        >
          View Hotel
        </Link>
      </div>
    </article>
  );
}
