import { cookies } from "next/headers";
import type { Session } from "next-auth";
import { decode } from "@auth/core/jwt";
import { auth, authSecret } from "@/auth";

const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
] as const;

function cookieRecord(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return Object.fromEntries(
    cookieStore.getAll().map(({ name, value }) => [name, value]),
  );
}

function resolveSessionCookiePrefix(record: Record<string, string>) {
  if (Object.keys(record).some((name) => name.startsWith("__Secure-authjs.session-token"))) {
    return "__Secure-authjs.session-token";
  }
  return "authjs.session-token";
}

function readSessionToken(record: Record<string, string>): string | null {
  const prefix = resolveSessionCookiePrefix(record);

  if (record[prefix]) return record[prefix];

  const chunks = Object.entries(record)
    .filter(([name]) => name.startsWith(`${prefix}.`))
    .sort(([a], [b]) => {
      const aIdx = Number.parseInt(a.split(".").pop() ?? "0", 10);
      const bIdx = Number.parseInt(b.split(".").pop() ?? "0", 10);
      return aIdx - bIdx;
    });

  if (chunks.length === 0) return null;
  return chunks.map(([, value]) => value).join("");
}

function clearSessionCookies(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  for (const { name } of cookieStore.getAll()) {
    if (!SESSION_COOKIE_NAMES.some((prefix) => name.startsWith(prefix))) continue;
    cookieStore.delete({ name, path: "/" });
  }
}

/** Validates JWT before auth() so stale cookies do not trigger JWTSessionError logs. */
export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const record = cookieRecord(cookieStore);
  const token = readSessionToken(record);
  const salt = resolveSessionCookiePrefix(record);

  if (!token) return null;

  try {
    await decode({
      token,
      secret: authSecret,
      salt,
    });
  } catch {
    clearSessionCookies(cookieStore);
    return null;
  }

  return auth();
}
