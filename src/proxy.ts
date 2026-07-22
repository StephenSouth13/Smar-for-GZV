import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

// Optimistic check only: is a session cookie present at all? The authoritative
// check (verify the cookie + confirm admin membership) happens in
// requireAdmin() inside src/app/admin/(protected)/layout.tsx and inside every
// server action, since Firestore reads don't belong on every proxy'd request.
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
