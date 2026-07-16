import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decode } from "@auth/core/jwt";
import { authSecret } from "@/lib/auth/secret";

const SESSION_PREFIXES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
] as const;

function readSessionToken(request: NextRequest) {
  for (const prefix of SESSION_PREFIXES) {
    const single = request.cookies.get(prefix)?.value;
    if (single) return { token: single, salt: prefix };

    const chunks = request.cookies
      .getAll()
      .filter(({ name }) => name.startsWith(`${prefix}.`))
      .sort((a, b) => {
        const aIdx = Number.parseInt(a.name.split(".").pop() ?? "0", 10);
        const bIdx = Number.parseInt(b.name.split(".").pop() ?? "0", 10);
        return aIdx - bIdx;
      });

    if (chunks.length > 0) {
      return {
        token: chunks.map(({ value }) => value).join(""),
        salt: prefix,
      };
    }
  }

  return null;
}

function clearSessionCookies(response: NextResponse, request: NextRequest) {
  for (const { name } of request.cookies.getAll()) {
    if (!SESSION_PREFIXES.some((prefix) => name.startsWith(prefix))) continue;
    response.cookies.delete(name);
  }
}

export async function proxy(request: NextRequest) {
  const session = readSessionToken(request);
  if (!session) return NextResponse.next();

  try {
    await decode({
      token: session.token,
      secret: authSecret,
      salt: session.salt,
    });
    return NextResponse.next();
  } catch {
    const response = NextResponse.next();
    clearSessionCookies(response, request);
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
