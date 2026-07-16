import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/getServerSession";
import { prisma } from "@/lib/prisma";

type AuthorResult =
  | {
      ok: true;
      userId: string;
      hotel: { id: string; authorId: string | null };
    }
  | { ok: false; response: NextResponse };

export async function requireHotelAuthor(hotelId: string): Promise<AuthorResult> {
  const session = await getServerSession();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const hotel = await prisma.hotel.findFirst({
    where: { id: hotelId },
    select: { id: true, authorId: true },
  });

  if (!hotel) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Not found" }, { status: 404 }),
    };
  }

  if (!hotel.authorId || hotel.authorId !== userId) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, userId, hotel };
}

export async function isHotelAuthor(
  hotelId: string,
  userId: string | undefined,
): Promise<boolean> {
  if (!userId) return false;

  const hotel = await prisma.hotel.findFirst({
    where: { id: hotelId },
    select: { authorId: true },
  });

  return Boolean(hotel?.authorId && hotel.authorId === userId);
}
