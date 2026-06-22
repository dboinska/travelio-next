import Link from "next/link";
import HotelsMapSidebar from "../components/hotels/HotelsMapSidebar";
import HotelsGrid from "../components/hotels/HotelsGrid";
import HotelsPagination from "../components/hotels/HotelsPagination";
import { prisma } from "@/lib/prisma";
import Navbar from "../components/Navbar";
import { hotelsToGeoJSON } from "@/lib/hotelsToGeoJSON";

const HOTELS_PER_PAGE = 12;

interface Props {
  searchParams: {
    page?: string;
  };
}

async function getHotels(page: number) {
  const [hotels, total] = await Promise.all([
    prisma.hotel.findMany({
      skip: (page - 1) * HOTELS_PER_PAGE,
      take: HOTELS_PER_PAGE,
      orderBy: { date: "desc" },
    }),

    prisma.hotel.count(),
  ]);

  return {
    hotels,
    totalPages: Math.ceil(total / HOTELS_PER_PAGE),
  };
}

export default async function Hotels({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);
  const data = await getHotels(currentPage);
  const geoJSONData = hotelsToGeoJSON(data.hotels);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-10 px-4 py-10">
        <HotelsMapSidebar hotels={data.hotels} geoJSONData={geoJSONData} />

        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">All Hotels</h1>

          <Link
            href="/hotels/new"
            className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
          >
            Add Hotel
          </Link>
        </div>

        <HotelsGrid hotels={data.hotels} />

        <HotelsPagination
          currentPage={currentPage}
          totalPages={data.totalPages}
        />
      </main>
    </>
  );
}
