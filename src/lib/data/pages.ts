import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { Section } from "@/lib/schema/sections";

export type PageDoc = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  sections: Section[];
  updatedAt: string;
};

function toPageDoc(slug: string, data: FirebaseFirestore.DocumentData): PageDoc {
  return {
    slug,
    title: data.title ?? "",
    seoTitle: data.seoTitle ?? "",
    seoDescription: data.seoDescription ?? "",
    published: !!data.published,
    sections: (data.sections ?? []) as Section[],
    updatedAt: data.updatedAt ?? "",
  };
}

export async function getPageBySlug(slug: string): Promise<PageDoc | null> {
  const doc = await adminDb.collection("pages").doc(slug).get();
  if (!doc.exists) return null;
  return toPageDoc(slug, doc.data()!);
}

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
