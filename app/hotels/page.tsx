import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppLink } from "../components/AppLink";
import HotelsMapSidebar from "../components/hotels/HotelsMapSidebar";
import HotelsGrid from "../components/hotels/HotelsGrid";
import HotelsPagination from "../components/hotels/HotelsPagination";
import { prisma } from "@/lib/prisma";
import Navbar from "../components/Navbar";
import { hotelsToGeoJSON } from "@/lib/hotelsToGeoJSON";

const HOTELS_PER_PAGE = 12;

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
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
    total,
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
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8">
        <header className="mb-8 flex flex-col gap-6 border-b border-border/70 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
              Browse stays
            </p>
            <h1 className="text-3xl font-semibold tracking-[0.12em] text-white md:text-4xl">
              All hotels
            </h1>
            <p className="max-w-xl text-[15px] leading-relaxed text-slate-400">
              {data.total} curated listings across the globe — explore on the
              map or browse the grid below.
            </p>
          </div>
          <AppLink href="/hotels/new" className="shrink-0">
            Add hotel
          </AppLink>
        </header>

        <div className="mb-10">
          <HotelsMapSidebar hotels={data.hotels} geoJSONData={geoJSONData} />
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Page {currentPage} of {data.totalPages}
          </h2>
          <div className="flex items-center gap-2">
            {currentPage > 1 ? (
              <Link
                href={`/hotels?page=${currentPage - 1}`}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-muted transition hover:border-white/20 hover:text-white"
              >
                <ChevronLeft size={14} />
                Prev
              </Link>
            ) : null}
            {currentPage < data.totalPages ? (
              <Link
                href={`/hotels?page=${currentPage + 1}`}
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-muted transition hover:border-white/20 hover:text-white"
              >
                Next
                <ChevronRight size={14} />
              </Link>
            ) : null}
          </div>
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
