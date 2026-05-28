import { JsonValue } from "@prisma/client/runtime/library";

export type Hotel = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  date?: Date | null;
  geometry?: JsonValue;
  authorId?: string | null;

  images?: any;
  reviews?: any;
};