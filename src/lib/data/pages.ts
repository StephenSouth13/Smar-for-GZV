import "server-only";
import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import { sectionDataSchemas, type Section, type SectionType } from "@/lib/schema/sections";

export type PageDoc = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string;
  published: boolean;
  sections: Section[];
  updatedAt: string;
};

/**
 * Older documents predate fields added to a section's schema later on (e.g.
 * `customFields` on contactForm) and would otherwise crash renderers that
 * assume the current shape. Re-parsing through the current schema fills in
 * any missing fields with their defaults.
 */
function normalizeSectionData(section: Section): Section {
  const schema = sectionDataSchemas[section.type as SectionType];
  if (!schema) return section;
  const result = schema.safeParse(section.data);
  return result.success ? ({ ...section, data: result.data } as Section) : section;
}

// `projectBrandGrid`/`projectProductGrid` used to be dedicated section types
// hardcoded to the "Nhân hiệu"/"Phẩm hiệu" categories. They were merged into
// the generic `projectGrid` (category picked from the editable category
// list). Old pages may still have sections saved with these type strings —
// remap them so they keep rendering instead of silently disappearing.
const LEGACY_SECTION_TYPE_ALIASES: Record<string, SectionType> = {
  projectBrandGrid: "projectGrid",
  projectProductGrid: "projectGrid",
};

function toPageDoc(slug: string, data: FirebaseFirestore.DocumentData): PageDoc {
  const sections = ((data.sections ?? []) as Section[]).map((section) => {
    const type = LEGACY_SECTION_TYPE_ALIASES[section.type as string] ?? section.type;
    return normalizeSectionData({
      ...section,
      type,
      title: section.title ?? "",
      hidden: section.hidden ?? false,
      backgroundColor: section.backgroundColor ?? "",
      textColor: section.textColor ?? "",
      accentColor: section.accentColor ?? "",
    } as Section);
  });

  return {
    slug,
    title: data.title ?? "",
    seoTitle: data.seoTitle ?? "",
    seoDescription: data.seoDescription ?? "",
    seoKeywords: data.seoKeywords ?? "",
    ogImageUrl: data.ogImageUrl ?? "",
    published: !!data.published,
    sections,
    updatedAt: data.updatedAt ?? "",
  };
}

// generateMetadata() and the page body both need this per request; cache()
// dedupes them into a single Firestore read.
export const getPageBySlug = cache(async (slug: string): Promise<PageDoc | null> => {
  const doc = await adminDb.collection("pages").doc(slug).get();
  if (!doc.exists) return null;
  return toPageDoc(slug, doc.data()!);
});

export async function getPublishedPageBySlug(slug: string): Promise<PageDoc | null> {
  const page = await getPageBySlug(slug);
  if (!page || !page.published) return null;
  return page;
}

export async function listPages(): Promise<PageDoc[]> {
  const snap = await adminDb.collection("pages").orderBy("title").get();
  return snap.docs.map((d) => toPageDoc(d.id, d.data()));
}

export async function savePage(slug: string, data: Omit<PageDoc, "slug" | "updatedAt">) {
  await adminDb
    .collection("pages")
    .doc(slug)
    .set({ ...data, updatedAt: new Date().toISOString() }, { merge: false });
}

export async function deletePage(slug: string) {
  await adminDb.collection("pages").doc(slug).delete();
}

export async function renamePage(oldSlug: string, newSlug: string) {
  if (oldSlug === newSlug) return;
  const doc = await adminDb.collection("pages").doc(oldSlug).get();
  if (!doc.exists) throw new Error("Page not found");
  const data = doc.data()!;
  await adminDb.collection("pages").doc(newSlug).set(data);
  await adminDb.collection("pages").doc(oldSlug).delete();
}
