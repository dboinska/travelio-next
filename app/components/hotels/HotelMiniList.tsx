import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hotel, getHotelImages } from "@/lib/types/hotel";

interface Props {
  hotels: Hotel[];
}

export default function HotelMiniList({ hotels }: Props) {
  return (
    <aside className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-1 pb-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500">
          On this page
        </p>
        <h2 className="text-base font-semibold tracking-wide text-white">
          {hotels.length} {hotels.length === 1 ? "stay" : "stays"}
        </h2>
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto pr-1.5">
        {hotels.map((hotel) => {
          const coverImage = getHotelImages(hotel)[0];

          return (
            <Link
              key={hotel.id}
              href={`/hotels/${hotel.id}`}
              className="group flex gap-3 rounded-xl border border-border bg-surface/60 p-2.5 transition hover:border-[#30cfd0]/30 hover:bg-surface"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-background">
                {coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverImage.src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-white group-hover:text-cyan-50">
                  {hotel.title}
                </h3>
                <p className="truncate text-xs text-slate-500">{hotel.location}</p>
                <p className="mt-1 text-xs font-medium text-[#30cfd0]/90">
                  ${hotel.price} / night
                </p>
              </div>
              <ArrowRight
                size={14}
                className="mt-1 shrink-0 text-muted transition group-hover:text-[#30cfd0]"
              />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
