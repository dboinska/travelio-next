import { MapPinned } from "lucide-react";
import { Logo } from "./Logo";
import Image from "next/image";
import { AppLink } from "./AppLink";

const destinations = [
  {
    title: "Tropical escape",
    description: "Beachfront hotels with sea views and luxury amenities.",
    imageUrl:
      "https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?_gl=1*lt9dpr*_ga*MTA0MTMxNTE4My4xNzc5MzYzNzIw*_ga_8JE65Q40S6*czE3Nzk5MTE5NjkkbzIkZzEkdDE3Nzk5MTI0MzkkajMyJGwwJGgw",
    alt: "Tropical escape",
  },
  {
    title: "City stays",
    description: "Modern downtown spots close to nightlife and dining.",
    imageUrl:
      "https://images.pexels.com/photos/3716670/pexels-photo-3716670.jpeg",
    alt: "City stays",
  },
  {
    title: "Mountain retreats",
    description: "Quiet lodges surrounded by nature and hiking trails.",
    imageUrl:
      "https://images.pexels.com/photos/31665649/pexels-photo-31665649.jpeg",
    alt: "Mountain retreats",
  },
];

export default function HomePage() {
  return (
    <section className="space-y-10">
      <div className="max-w-4xl space-y-8 h-[80vh] justify-center flex flex-col">
        <div className="space-y-4 text-center sm:text-left max-w-[50vw]">
          <Logo />
          <h1 className="text-[48px] my-4 leading-[calc(1em+0.75rem)] font-semibold tracking-[0.2rem] drop-shadow-[0_0.5rem_0.1rem_rgba(0,0,0,0.2)] ">
            Discover hotels and places made for your{" "}
            <span className=" text-transparent [-webkit-text-stroke:1px_white]">
              next trip.
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-slate-400">
            A modern travel experience with curated listings, rich hotel details
            and easy browsing to help you plan your stay.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <AppLink href="/hotels">Browse hotels</AppLink>
          <AppLink href="/hotels/new" variant="secondary">
            Add hotel
          </AppLink>
        </div>
      </div>

      <div className="rounded-[1em] border border-slate-800 p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <MapPinned className="text-cyan-400" />

          <h2 className="text-2xl font-bold text-white">
            Featured destinations
          </h2>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {destinations.map((item) => (
            <div
              key={item.title}
              className="overflow-hidden rounded-3xl border border-slate-800  shadow-lg"
            >
              {/* <div className="h-48 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950" /> */}
              <div className="h-[220px] w-full overflow-hidden relative">
                <Image
                  src={item.imageUrl}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-3 p-5">
                <h3 className="text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
