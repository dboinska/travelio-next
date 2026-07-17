import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { Hotel } from "@/lib/types/hotel";
import { getHotelImages } from "@/lib/types/hotel";
import HotelImage from "@/app/components/hotels/HotelImage";
import { cardInteractiveClassName } from "@/lib/design/classes";
import { cn } from "@/lib/cn";

interface Props {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: Props) {
  const coverImage = getHotelImages(hotel)[0];

  return (
    <Link
      href={`/hotels/${hotel.id}`}
      className={cn(
        cardInteractiveClassName,
        "group flex h-full flex-col overflow-hidden hover:shadow-[0_20px_50px_-24px_rgba(48,207,208,0.25)]",
      )}
    >
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-surface">
        {coverImage ? (
          <HotelImage
            src={coverImage.src}
            alt={hotel.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-600">
            No photo
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
        <span className="absolute right-3 top-3 rounded-full border border-[#30cfd0]/25 bg-background/85 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
          ${hotel.price}
          <span className="font-normal text-slate-400"> / night</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-2 text-slate-500">
          <MapPin size={14} className="mt-0.5 shrink-0 text-[#30cfd0]/70" />
          <p className="text-[11px] font-medium uppercase tracking-[0.18em]">
            {hotel.location}
          </p>
        </div>
        <h2 className="mt-2 line-clamp-2 text-xl font-semibold tracking-wide text-white transition group-hover:text-cyan-50">
          {hotel.title}
        </h2>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-slate-300 transition group-hover:gap-3 group-hover:text-white">
          View stay
          <ArrowRight size={15} strokeWidth={1.5} />
        </span>
      </div>
    </Link>
  );
}
