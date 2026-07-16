import { Logo } from "../Logo";
import { AppLink } from "../AppLink";
import HeroGlobe from "./HeroGlobe";
import HeroGradients from "./HeroGradients";
import StarField from "./StarField";
import type { GlobeData } from "@/lib/globe/types";

type Props = {
  globeData: GlobeData;
};

export default function HeroSection({ globeData }: Props) {
  return (
    <section className="relative min-h-[500px] py-6 lg:h-[80vh] lg:py-0">
      <HeroGradients />
      <StarField />

      <div className="container relative z-10 mx-auto h-full min-h-[inherit] px-4">
        <div className="grid h-full min-h-[inherit] grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex max-w-xl flex-col justify-center space-y-8 lg:max-w-none">
            <div className="space-y-4 text-center sm:text-left">
              <Logo />
              <h1 className="my-4 text-[48px] font-semibold leading-[calc(1em+0.75rem)] tracking-[0.2rem] drop-shadow-[0_0.5rem_0.1rem_rgba(0,0,0,0.2)]">
                Discover hotels and places made for your{" "}
                <span className="text-transparent [-webkit-text-stroke:1px_white]">
                  next trip.
                </span>
              </h1>
              <p className="max-w-2xl text-lg text-muted">
                A modern travel experience with curated listings, rich hotel
                details and easy browsing to help you plan your stay.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <AppLink href="/hotels" variant="secondary">
                Browse hotels
              </AppLink>
              <AppLink href="/hotels/new">Add hotel</AppLink>
            </div>
          </div>

          <HeroGlobe globeData={globeData} />
        </div>
      </div>
    </section>
  );
}
