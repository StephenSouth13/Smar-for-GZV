/**
 * One-time setup script: creates (or reuses) a Firebase Auth user and grants
 * them access to /admin by adding an `admins/{uid}` Firestore doc.
 *
 * Requires FIREBASE_ADMIN_* credentials in .env.local (see .env.example).
 *
 * Usage:
 *   npm run create-admin -- --email=you@gzv.one --password=xxxxxxxx --name="Your Name"
 */
import { adminAuth, adminDb } from "./lib/admin";

function parseArgs() {
  const args = new Map<string, string>();
  for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) args.set(match[1]!, match[2]!);
  }
  return args;
}

async function main() {
  const args = parseArgs();
  const email = args.get("email");
  const password = args.get("password");
  const name = args.get("name") || email;

  if (!email || !password) {
    console.error('Usage: npm run create-admin -- --email=you@gzv.one --password=xxxxxxxx --name="Your Name"');
    process.exit(1);
  }

  let user;
  try {
    user = await adminAuth.getUserByEmail(email);
    console.log(`User ${email} already exists (uid=${user.uid}), reusing it.`);
  } catch {
    user = await adminAuth.createUser({ email, password, displayName: name });
    console.log(`Created new Firebase Auth user ${email} (uid=${user.uid}).`);
  }

  await adminDb.collection("admins").doc(user.uid).set({
    email,
    name,
    role: "admin",
    createdAt: new Date().toISOString(),
  });

  console.log(`Granted admin access to ${email}. You can now log in at /admin/login.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
