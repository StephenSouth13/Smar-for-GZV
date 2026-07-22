"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { pageSchema, type PageInput } from "@/lib/schema/content";
import { savePage, deletePage, renamePage, getPageBySlug } from "@/lib/data/pages";
import type { Section } from "@/lib/schema/sections";

function publicPathForSlug(slug: string) {
  if (slug === "home") return "/";
  return `/${slug}`;
}

export async function savePageAction(originalSlug: string | null, data: PageInput) {
  await requireAdmin();
  const parsed = pageSchema.parse(data);

  if (originalSlug && originalSlug !== parsed.slug) {
    const existing = await getPageBySlug(parsed.slug);
    if (existing) throw new Error("Đã tồn tại trang khác với slug này.");
  }

  await savePage(parsed.slug, {
    title: parsed.title,
    seoTitle: parsed.seoTitle,
    seoDescription: parsed.seoDescription,
    published: parsed.published,
    sections: parsed.sections as unknown as Section[],
  });

  if (originalSlug && originalSlug !== parsed.slug) {
    await renamePage(originalSlug, parsed.slug);
    revalidatePath(publicPathForSlug(originalSlug));
  }

  revalidatePath(publicPathForSlug(parsed.slug));
  return { slug: parsed.slug };
}

export async function deletePageAction(slug: string) {
  await requireAdmin();
  await deletePage(slug);
  revalidatePath(publicPathForSlug(slug));
}
