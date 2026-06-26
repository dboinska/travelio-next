"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Hotel } from "@/lib/types/hotel";
import { ClusterMap } from "./ClusterMap";
import HotelMiniList from "./HotelMiniList";
import { hotelsToGeoJSON } from "@/lib/hotelsToGeoJSON";
import { inputClassName } from "@/lib/design/classes";

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

  const miniListItems = normalizedQuery ? filteredHotels : hotels;

  const SearchForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSearchQuery(searchTerm.trim());
      }}
      className="flex gap-2"
    >
      <div className="relative flex-1">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Name or location..."
          className={`${inputClassName} pl-9`}
        />
      </div>
      <button
        type="submit"
        className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-white/90 transition hover:border-[#30cfd0]/30 hover:text-white"
      >
        Search
      </button>
    </form>
  );

  const sidebarPanel = (
    <div className="flex shrink-0 flex-col gap-2 border-b border-border p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          {filteredHotels.length} on map
        </span>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="hidden text-xs text-muted transition hover:text-white lg:block"
        >
          Collapse
        </button>
      </div>
      {SearchForm}
    </div>
  );

  return (
    <>
      <div className="relative hidden h-[min(28rem,calc(100vh-12rem))] w-full overflow-hidden rounded-2xl border border-border lg:block">
        <div className="absolute inset-0">
          <ClusterMap hotels={filteredGeoJSON} resizeTrigger={sidebarOpen} />
        </div>

        {sidebarOpen ? (
          <div className="absolute bottom-4 right-4 top-4 z-10 flex w-[min(100%,20rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-md">
            {sidebarPanel}
            <div className="min-h-0 flex-1 p-2">
              <HotelMiniList hotels={miniListItems.slice(0, 8)} />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="absolute right-4 top-4 z-10 rounded-xl border border-border bg-background/90 px-4 py-2.5 text-sm font-medium text-white shadow-xl backdrop-blur-md transition hover:border-[#30cfd0]/30"
          >
            Show list
          </button>
        )}
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl border border-border lg:hidden">
        <div className="h-[45vh] min-h-[240px] w-full">
          <ClusterMap hotels={filteredGeoJSON} resizeTrigger={false} />
        </div>
        <div className="flex flex-col bg-background">
          {sidebarPanel}
          <div className="custom-scrollbar max-h-[40vh] overflow-y-auto p-2">
            <HotelMiniList hotels={miniListItems.slice(0, 6)} />
          </div>
        </div>
      </div>
    </>
  );
}
