import HeroSection from "./home/HeroSection";
import FeaturedDestinations from "./home/FeaturedDestinations";
import type { GlobeData } from "@/lib/globe/types";

type Props = {
  globeData: GlobeData;
};

export default function HomePage({ globeData }: Props) {
  return (
    <section className="space-y-10">
      <HeroSection globeData={globeData} />
      <FeaturedDestinations />
    </section>
  );
}
