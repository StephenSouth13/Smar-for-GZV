/**
 * Standalone Firebase Admin init for CLI scripts (seed, create-admin), run via
 * tsx/plain Node — NOT through Next.js. Deliberately does not import
 * "server-only" (unlike src/lib/firebase/admin.ts): that package always throws
 * outside the Next.js server-component bundler, so scripts need their own copy.
 */
import { getApps, initializeApp, cert, applicationDefault, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Must be set before getFirestore() constructs its client below. Set here
// (a plain statement, not an import) rather than relying solely on
// .env.local + dotenv: esbuild/tsx hoists `import` statements above other
// top-level code, so a dotenv config() call elsewhere in the entry file can
// run *after* this module's imports already executed.
process.env.FIRESTORE_ENABLE_TRACING ??= "false";

function createAdminApp(): App {
  if (getApps().length) return getApps()[0]!;

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

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
