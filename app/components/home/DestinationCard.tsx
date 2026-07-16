import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FeaturedDestination } from "@/lib/featuredDestinations";

type Props = {
  destination: FeaturedDestination;
  index: number;
  featured?: boolean;
};

export default function DestinationCard({
  destination,
  index,
  featured = false,
}: Props) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <Link
      href="/hotels"
      className={`group relative block overflow-hidden rounded-2xl bg-background ${
        featured
          ? "min-h-[360px] lg:col-span-7 lg:min-h-[520px]"
          : "min-h-[280px] lg:col-span-5 lg:min-h-[250px]"
      }`}
    >
      <Image
        src={destination.imageUrl}
        alt={destination.alt}
        fill
        sizes={
          featured
            ? "(max-width: 1024px) 100vw, 58vw"
            : "(max-width: 1024px) 100vw, 42vw"
        }
        className="object-cover transition duration-[850ms] ease-out group-hover:scale-[1.04]"
      />

      <div className="absolute inset-0 bg-background/15 transition duration-500 group-hover:bg-background/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
            {destination.region}
          </span>
          <span className="text-xs tabular-nums tracking-widest text-white/35">
            {number}
          </span>
        </div>

        <div>
          <h3
            className={`font-semibold tracking-[0.12em] text-white ${
              featured ? "text-2xl md:text-[2rem]" : "text-xl md:text-2xl"
            }`}
          >
            {destination.title}
          </h3>
          <p
            className={`mt-3 max-w-md leading-relaxed text-white/60 ${
              featured ? "text-sm md:text-[15px]" : "text-sm"
            }`}
          >
            {destination.description}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-white/85 transition group-hover:gap-3 group-hover:text-white">
            View stays
            <ArrowRight size={15} strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}
