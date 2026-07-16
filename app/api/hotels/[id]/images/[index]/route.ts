import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isStoredHotelImage } from "@/lib/hotels/storedHotelImage";
import { getHotelImageRecords } from "@/lib/types/hotel";

type RouteContext = {
  params: Promise<{ id: string; index: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
  const { id, index: indexParam } = await context.params;
  const index = Number.parseInt(indexParam, 10);

  if (!Number.isInteger(index) || index < 0) {
    return NextResponse.json({ message: "Invalid image index" }, { status: 400 });
  }

  const hotel = await prisma.hotel.findFirst({
    where: { id },
    select: { images: true },
  });

  if (!hotel) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const images = getHotelImageRecords({ images: hotel.images as never });
  const image = images[index];

  if (!image || !isStoredHotelImage(image)) {
    return NextResponse.json({ message: "Image not found" }, { status: 404 });
  }

  const binary = Buffer.from(image.data, "base64");

  return new NextResponse(binary, {
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
