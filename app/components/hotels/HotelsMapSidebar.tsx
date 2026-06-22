"use client";

import { useMemo, useState } from "react";
import { Hotel } from "@/lib/types/hotel";
import { ClusterMap } from "./ClusterMap";
import HotelMiniList from "./HotelMiniList";
import { hotelsToGeoJSON } from "@/lib/hotelsToGeoJSON";

interface Props {
  hotels: Hotel[];
  geoJSONData: GeoJSON.FeatureCollection<
    GeoJSON.Point,
    {
      popUpMarkup?: string;
      cluster?: boolean;
      cluster_id?: number;
      point_count?: number;
    }
  >;
}
export default function HotelsMapSidebar({ hotels, geoJSONData }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredHotels = useMemo(() => {
    if (!normalizedQuery) return hotels;
    return hotels.filter((hotel) => {
      const title = hotel.title?.toString().toLowerCase() ?? "";
      const location = hotel.location?.toString().toLowerCase() ?? "";
      const description = hotel.description?.toString().toLowerCase() ?? "";
      return (
        title.includes(normalizedQuery) ||
        location.includes(normalizedQuery) ||
        description.includes(normalizedQuery)
      );
    });
  }, [hotels, normalizedQuery]);

  const filteredGeoJSON = useMemo(() => {
    if (!normalizedQuery) return geoJSONData;
    return hotelsToGeoJSON(filteredHotels);
  }, [normalizedQuery, geoJSONData, filteredHotels]);

  const miniListItems = normalizedQuery ? filteredHotels : hotels.slice(0, 5);

  const SearchForm = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSearchQuery(searchTerm.trim());
      }}
      className="flex gap-2"
    >
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Nazwa, lokalizacja..."
        className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
      >
        Szukaj
      </button>
    </form>
  );

  return (
    <>
      {/* ── Desktop ── */}
      <div className="relative hidden h-110 mah-[calc(100vh-64px)] w-full overflow-hidden lg:block">
        <div className="absolute inset-0">
          <ClusterMap hotels={filteredGeoJSON} resizeTrigger={sidebarOpen} />
        </div>

        {sidebarOpen ? (
          <div className="absolute bottom-4 right-4 top-4 z-10 flex w-80 flex-col overflow-hidden max-h-95 rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl backdrop-blur-md">
            <div className="shrink-0 border-b border-zinc-800 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  {filteredHotels.length} hoteli
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-xs text-zinc-500 transition hover:text-zinc-300"
                >
                  Zwiń ✕
                </button>
              </div>
              {SearchForm}
            </div>
            <div className="min-h-0 flex-1 p-2">
              <HotelMiniList hotels={miniListItems} />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute right-4 top-4 z-10 rounded-xl border border-zinc-700 bg-zinc-950/90 px-4 py-2.5 text-sm font-medium text-white shadow-xl backdrop-blur-md transition hover:bg-zinc-900"
          >
            Pokaż listę
          </button>
        )}
      </div>

      {/* ── Mobile ── */}
      <div className="flex flex-col lg:hidden">
        <div className="h-[50vh] w-full">
          <ClusterMap hotels={filteredGeoJSON} resizeTrigger={false} />
        </div>

        <div className="flex flex-col border-t border-zinc-800 bg-zinc-950">
          <div className="shrink-0 border-b border-zinc-800 p-3 space-y-2">
            <p className="text-xs text-zinc-500">
              {filteredHotels.length} hoteli
            </p>
            {SearchForm}
          </div>
          <div className="overflow-y-auto p-2" style={{ maxHeight: "50vh" }}>
            <HotelMiniList hotels={miniListItems} />
          </div>
        </div>
      </div>
    </>
  );
}
