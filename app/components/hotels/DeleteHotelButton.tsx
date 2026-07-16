"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cardClassName } from "@/lib/design/classes";
import { cn } from "@/lib/cn";

type Props = {
  hotelId: string;
  hotelTitle?: string;
};

export default function DeleteHotelButton({ hotelId, hotelTitle }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/hotels/${hotelId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        setError(body.message ?? "Could not delete listing");
        setLoading(false);
        return;
      }

      router.push("/hotels");
      router.refresh();
    } catch {
      setError("Connection error");
      setLoading(false);
    }
  }

  return (
    <section className={cn(cardClassName, "border-red-500/20 p-6 md:p-8")}>
      <h2 className="text-lg font-semibold text-white">Delete listing</h2>
      <p className="mt-2 text-sm text-slate-400">
        Permanently remove{" "}
        <span className="text-white/85">{hotelTitle ?? "this hotel"}</span> from
        Travelio. This action cannot be undone.
      </p>

      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-5 rounded-xl border border-red-500/40 px-6 py-3 text-sm font-semibold text-red-300 transition hover:border-red-400/60 hover:bg-red-500/10"
        >
          Delete listing
        </button>
      ) : (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={loading}
            className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-white/85 transition hover:border-white/20 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Confirm delete"}
          </button>
        </div>
      )}
    </section>
  );
}
