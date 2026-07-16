import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseUpdateHotelFormData } from "@/lib/hotels/parseHotelFormData";
import { requireHotelAuthor } from "@/lib/hotels/requireHotelAuthor";
import { toHotelUpdateData } from "@/lib/hotels/toHotelUpdateData";
import { getHotelImageRecords } from "@/lib/types/hotel";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, context: RouteContext) {
  const { id } = await context.params;
  const auth = await requireHotelAuthor(id);

  if (!auth.ok) {
    return auth.response;
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
  }

  const existingHotel = await prisma.hotel.findFirst({
    where: { id },
    select: { images: true },
  });

  const existingImages = getHotelImageRecords({
    images: existingHotel?.images as never,
  });

  const parsed = await parseUpdateHotelFormData(formData, existingImages);
  if (!parsed.ok) {
    return NextResponse.json(
      {
        message: parsed.message,
        errors: parsed.errors,
      },
      { status: 400 },
    );
  }

  try {
    const hotel = await prisma.hotel.update({
      where: { id },
      data: toHotelUpdateData(parsed.fields, parsed.images),
      select: {
        id: true,
        title: true,
        location: true,
        price: true,
      },
    });

    return NextResponse.json({ hotel });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const { id } = await context.params;
  const auth = await requireHotelAuthor(id);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    await prisma.hotel.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
