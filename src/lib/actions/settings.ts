"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { settingsSchema, type SettingsInput } from "@/lib/schema/content";
import { saveSiteSettings } from "@/lib/data/settings";

export async function saveSiteSettingsAction(data: SettingsInput) {
  await requireAdmin();
  const parsed = settingsSchema.parse(data);
  await saveSiteSettings(parsed);
  revalidatePath("/", "layout");
}
