import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import CreateHotelForm from "@/app/components/hotels/CreateHotelForm";
import { getServerSession } from "@/lib/auth/getServerSession";
import { hotelToExistingImages, hotelToFormDefaults } from "@/lib/hotels/hotelToFormDefaults";
import { isHotelAuthor } from "@/lib/hotels/requireHotelAuthor";
import type { Hotel } from "@/lib/types/hotel";
import { linkAccentClassName } from "@/lib/design/classes";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Edit hotel | Travelio",
  description: "Update your hotel listing on Travelio.",
};

type Props = {
  params: Promise<{ id: string }>;
};

async function getHotel(id: string): Promise<Hotel | null> {
  const hotel = await prisma.hotel.findFirst({ where: { id } });
  return hotel as unknown as Hotel | null;
}

export default async function EditHotelPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession();

  if (!session?.user) {
    redirect(`/login?callbackUrl=/hotels/${id}/edit`);
  }

  const hotel = await getHotel(id);
  if (!hotel) {
    notFound();
  }

  const canEdit = await isHotelAuthor(id, session.user.id);
  if (!canEdit) {
    redirect(`/hotels/${id}`);
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        <Link
          href={`/hotels/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ChevronLeft size={16} strokeWidth={1.75} />
          Back to listing
        </Link>

        <header className="mt-6 border-b border-border/70 pb-8">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
              Host listing
            </p>
            <h1
              id="edit-hotel-title"
              className="text-3xl font-semibold tracking-[0.12em] text-white md:text-4xl"
            >
              Edit hotel
            </h1>
            <p className="max-w-2xl text-[15px] leading-relaxed text-slate-400">
              Update details for{" "}
              <span className="text-white/85">{hotel.title}</span>.
            </p>
          </div>
        </header>

        <div className="pt-8">
          <CreateHotelForm
            key={id}
            headingId="edit-hotel-title"
            hotelId={id}
            defaultValues={hotelToFormDefaults(hotel)}
            existingImages={hotelToExistingImages(hotel)}
          />
        </div>

        <p className="mt-8 text-sm text-slate-400">
          <Link href={`/hotels/${id}`} className={linkAccentClassName}>
            View public listing
          </Link>
        </p>
      </main>
    </>
  );
}
