import { Hotel } from "@/lib/types/hotel";
import HotelCard from "./HotelCard";

interface Props {
  hotels: Hotel[];
}

export default function HotelsGrid({ hotels }: Props) {
  if (hotels.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
        <p className="text-lg font-medium text-white">No hotels found</p>
        <p className="mt-2 text-sm text-slate-400">
          Try adjusting your search or browse all listings.
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </section>
  );
}
