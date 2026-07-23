import "server-only";
import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import { settingsSchema, type SettingsInput } from "@/lib/schema/content";

const SETTINGS_DOC = adminDb.collection("settings").doc("site");

// Both the layout and generateMetadata() call this on every request; cache()
// dedupes them into a single Firestore read per request instead of two.
export const getSiteSettings = cache(async (): Promise<SettingsInput> => {
  const doc = await SETTINGS_DOC.get();
  if (!doc.exists) return settingsSchema.parse({});
  return settingsSchema.parse(doc.data());
});

export async function saveSiteSettings(data: SettingsInput) {
  await SETTINGS_DOC.set(data, { merge: false });
}
