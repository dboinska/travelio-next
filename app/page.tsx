import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import { defaultGlobeData } from "@/lib/globe/globeData";
import { hotelsToGlobeData } from "@/lib/globe/hotelsToGlobeData";
import { prisma } from "@/lib/prisma";

async function getGlobeData() {
  try {
    const hotels = await prisma.hotel.findMany({
      orderBy: { date: "desc" },
    });
    return hotelsToGlobeData(hotels);
  } catch {
    return defaultGlobeData;
  }
}

export default async function Page() {
  const globeData = await getGlobeData();

  return (
    <div className="flex min-h-screen flex-col text-white">
      <Navbar />

      <main className="container mx-auto flex-1 px-4 py-10">
        <HomePage globeData={globeData} />
      </main>
      <Footer />
    </div>
  );
}
