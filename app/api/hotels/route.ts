import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/getServerSession";
import { prisma } from "@/lib/prisma";
import { parseCreateHotelFormData } from "@/lib/hotels/parseHotelFormData";
import { toHotelCreateData } from "@/lib/hotels/toHotelCreateData";

export async function GET() {
  const hotels = await prisma.hotel.findMany({
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ hotels });
}

export async function POST(req: Request) {
  const session = await getServerSession();
  const authorId = session?.user?.id;

  if (!authorId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
  }

  const parsed = await parseCreateHotelFormData(formData);
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
    const hotel = await prisma.hotel.create({
      data: toHotelCreateData(parsed.fields, authorId, parsed.images),
      select: {
        id: true,
        title: true,
        location: true,
        price: true,
      },
    });

    return NextResponse.json({ hotel }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
