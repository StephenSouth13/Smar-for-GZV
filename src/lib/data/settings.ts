import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { settingsSchema, type SettingsInput } from "@/lib/schema/content";

const SETTINGS_DOC = adminDb.collection("settings").doc("site");

export async function getSiteSettings(): Promise<SettingsInput> {
  const doc = await SETTINGS_DOC.get();
  if (!doc.exists) return settingsSchema.parse({});
  return settingsSchema.parse(doc.data());
}

export async function saveSiteSettings(data: SettingsInput) {
  await SETTINGS_DOC.set(data, { merge: false });
}
