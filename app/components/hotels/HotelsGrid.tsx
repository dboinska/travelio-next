import { Hotel } from "@/lib/types/hotel";
import HotelCard from "./HotelCard";

interface Props {
  hotels: Hotel[];
}

export default function HotelsGrid({ hotels }: Props) {
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </section>
  );
}
