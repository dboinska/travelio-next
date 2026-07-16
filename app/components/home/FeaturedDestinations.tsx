import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DestinationCard from "./DestinationCard";
import { featuredDestinations } from "@/lib/featuredDestinations";

export default function FeaturedDestinations() {
  const [primary, ...secondary] = featuredDestinations;

  return (
    <section className="py-16 md:py-24">
      <header className="mb-10 flex flex-col gap-6 border-b border-border/70 pb-8 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
            Curated collections
          </p>
          <h2 className="text-3xl font-semibold tracking-[0.14em] text-white md:text-[2.35rem] md:leading-tight">
            Featured destinations
          </h2>
          <p className="max-w-lg text-[15px] leading-relaxed text-slate-400">
            A considered edit of places to stay — chosen for setting, character
            and the kind of trip they inspire.
          </p>
        </div>

        <Link
          href="/hotels"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-medium tracking-wide text-slate-300 transition hover:gap-3 hover:text-white"
        >
          View all hotels
          <ArrowRight size={15} strokeWidth={1.5} />
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <DestinationCard destination={primary} index={0} featured />
        <div className="grid gap-4 lg:col-span-5 lg:grid-rows-2 lg:gap-5">
          {secondary.map((destination, index) => (
            <DestinationCard
              key={destination.title}
              destination={destination}
              index={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
