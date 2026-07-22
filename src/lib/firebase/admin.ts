import "server-only";
import { getApps, initializeApp, cert, applicationDefault, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Works around a @google-cloud/firestore default: it enables OpenTelemetry
// tracing unless told otherwise, which tries to auto-detect a GCP project ID
// via Application Default Credentials (unrelated to our explicit service
// account below) and throws when ADC isn't available.
process.env.FIRESTORE_ENABLE_TRACING ??= "false";

function createAdminApp(): App {
  if (getApps().length) return getApps()[0]!;

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  // Local dev: explicit service account credentials from .env.local.
  // Production (Firebase App Hosting): falls back to the backend's default service account.
  // Media/Storage is handled by Cloudinary (see src/lib/cloudinary.ts), not Firebase Storage.
  if (clientEmail && privateKey) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  }

  return initializeApp({ credential: applicationDefault(), projectId });
}

const adminApp = createAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
