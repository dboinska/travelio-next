import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import CreateHotelForm from "@/app/components/hotels/CreateHotelForm";
import { getServerSession } from "@/lib/auth/getServerSession";
import { linkAccentClassName } from "@/lib/design/classes";

export const metadata: Metadata = {
  title: "Add hotel | Travelio",
  description: "Create a new hotel listing on Travelio.",
};

export default async function NewHotelPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/hotels/new");
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        <Link
          href="/hotels"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ChevronLeft size={16} strokeWidth={1.75} />
          Back to hotels
        </Link>

        <header className="mt-6 border-b border-border/70 pb-8">
          <div className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
              Host listing
            </p>
            <h1
              id="add-hotel-title"
              className="text-3xl font-semibold tracking-[0.12em] text-white md:text-4xl"
            >
              Add hotel
            </h1>
            <p className="max-w-2xl text-[15px] leading-relaxed text-slate-400">
              Publish a new stay for travelers browsing the globe and hotels map.
              Signed in as{" "}
              <span className="text-white/85">
                {session.user.name ?? session.user.email}
              </span>
              .
            </p>
          </div>
        </header>

        <div className="pt-8">
          <CreateHotelForm headingId="add-hotel-title" />
        </div>

        <p className="mt-8 text-sm text-slate-400">
          Need a different account?{" "}
          <Link href="/login?callbackUrl=/hotels/new" className={linkAccentClassName}>
            Switch account
          </Link>
        </p>
      </main>
    </>
  );
}
