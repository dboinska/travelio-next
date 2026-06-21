import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const hotels = await prisma.hotel.findMany();

  return Response.json({ hotels });
}
