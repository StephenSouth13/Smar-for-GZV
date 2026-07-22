import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export const SESSION_COOKIE_NAME = "__session";
const SESSION_EXPIRES_IN_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export type AdminProfile = {
  uid: string;
  email: string;
  name: string;
};

export async function createSessionCookie(idToken: string) {
  return adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_IN_MS });
}

/**
 * Verifies the session cookie and confirms the user is in the `admins` collection.
 * Memoized per-request so it's cheap to call from layouts, pages, and server actions alike.
 */
export const verifySession = cache(async (): Promise<AdminProfile | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const adminDoc = await adminDb.collection("admins").doc(decoded.uid).get();
    if (!adminDoc.exists) return null;

    const data = adminDoc.data();
    return {
      uid: decoded.uid,
      email: decoded.email ?? "",
      name: (data?.name as string) || decoded.email || "Admin",
    };
  } catch {
    return null;
  }
});

export async function requireAdmin(): Promise<AdminProfile> {
  const session = await verifySession();
  if (!session) redirect("/admin/login");
  return session;
}
