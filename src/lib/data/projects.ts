import "server-only";
import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import type { ProjectInput } from "@/lib/schema/content";

export type ProjectDoc = ProjectInput & { id: string; createdAt: string; updatedAt: string };

function toProjectDoc(id: string, data: FirebaseFirestore.DocumentData): ProjectDoc {
  return {
    id,
    title: data.title ?? "",
    slug: data.slug ?? id,
    coverImageUrl: data.coverImageUrl ?? "",
    gallery: data.gallery ?? [],
    client: data.client ?? "",
    liveUrl: data.liveUrl ?? "",
    category: data.category ?? "",
    tags: data.tags ?? [],
    summary: data.summary ?? "",
    content: data.content ?? "",
    order: data.order ?? 0,
    featured: !!data.featured,
    published: !!data.published,
    seoTitle: data.seoTitle ?? "",
    seoDescription: data.seoDescription ?? "",
    seoKeywords: data.seoKeywords ?? "",
    ogImageUrl: data.ogImageUrl ?? "",
    createdAt: data.createdAt ?? "",
    updatedAt: data.updatedAt ?? "",
  };
}

export async function listProjects(opts?: { publishedOnly?: boolean; limit?: number; category?: string }): Promise<ProjectDoc[]> {
  let query: FirebaseFirestore.Query = adminDb.collection("projects").orderBy("order", "asc");
  if (opts?.publishedOnly) query = query.where("published", "==", true);
  if (opts?.limit && !opts?.category) query = query.limit(opts.limit);
  const snap = await query.get();
  const projects = snap.docs.map((d) => toProjectDoc(d.id, d.data()));
  const filtered = opts?.category ? projects.filter((project) => project.category === opts.category) : projects;
  return opts?.limit ? filtered.slice(0, opts.limit) : filtered;
}

export async function listProjectsByIds(ids: string[]): Promise<ProjectDoc[]> {
  if (ids.length === 0) return [];
  const docs = await Promise.all(ids.map((id) => adminDb.collection("projects").doc(id).get()));
  return docs.filter((d) => d.exists).map((d) => toProjectDoc(d.id, d.data()!));
}

export async function getProjectById(id: string): Promise<ProjectDoc | null> {
  const doc = await adminDb.collection("projects").doc(id).get();
  if (!doc.exists) return null;
  return toProjectDoc(id, doc.data()!);
}

// Slugs back the public /du-an/[slug] route; a duplicate would make one of
// the two projects silently unreachable (Firestore query just picks one).
export async function isProjectSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const snap = await adminDb.collection("projects").where("slug", "==", slug).limit(2).get();
  return snap.docs.some((doc) => doc.id !== excludeId);
}

// generateMetadata() and the page body both need this per request; cache()
// dedupes them into a single Firestore read.
export const getPublishedProjectBySlug = cache(async (slug: string): Promise<ProjectDoc | null> => {
  const snap = await adminDb.collection("projects").where("slug", "==", slug).where("published", "==", true).limit(1).get();
  if (snap.empty) return null;
  return toProjectDoc(snap.docs[0]!.id, snap.docs[0]!.data());
});

export async function createProject(data: ProjectInput): Promise<string> {
  const now = new Date().toISOString();
  const ref = await adminDb.collection("projects").add({ ...data, createdAt: now, updatedAt: now });
  return ref.id;
}

export async function updateProject(id: string, data: ProjectInput) {
  await adminDb
    .collection("projects")
    .doc(id)
    .set({ ...data, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function updateProjectOrder(id: string, order: number) {
  await adminDb.collection("projects").doc(id).set({ order, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function deleteProject(id: string) {
  await adminDb.collection("projects").doc(id).delete();
}
