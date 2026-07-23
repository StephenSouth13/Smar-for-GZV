import "server-only";
import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import type { PostInput } from "@/lib/schema/content";

export type PostDoc = PostInput & { id: string; createdAt: string; updatedAt: string };

function toPostDoc(id: string, data: FirebaseFirestore.DocumentData): PostDoc {
  return {
    id,
    title: data.title ?? "",
    slug: data.slug ?? id,
    coverImageUrl: data.coverImageUrl ?? "",
    category: data.category ?? "",
    excerpt: data.excerpt ?? "",
    content: data.content ?? "",
    author: data.author ?? "GZV",
    published: !!data.published,
    publishedAt: data.publishedAt ?? "",
    seoTitle: data.seoTitle ?? "",
    seoDescription: data.seoDescription ?? "",
    seoKeywords: data.seoKeywords ?? "",
    ogImageUrl: data.ogImageUrl ?? "",
    createdAt: data.createdAt ?? "",
    updatedAt: data.updatedAt ?? "",
  };
}

export async function listPosts(opts?: { publishedOnly?: boolean; limit?: number }): Promise<PostDoc[]> {
  let query: FirebaseFirestore.Query = adminDb.collection("posts").orderBy("publishedAt", "desc");
  if (opts?.publishedOnly) query = query.where("published", "==", true);
  if (opts?.limit) query = query.limit(opts.limit);
  const snap = await query.get();
  return snap.docs.map((d) => toPostDoc(d.id, d.data()));
}

export async function listPostsByIds(ids: string[]): Promise<PostDoc[]> {
  if (ids.length === 0) return [];
  const docs = await Promise.all(ids.map((id) => adminDb.collection("posts").doc(id).get()));
  return docs.filter((d) => d.exists).map((d) => toPostDoc(d.id, d.data()!));
}

export async function getPostById(id: string): Promise<PostDoc | null> {
  const doc = await adminDb.collection("posts").doc(id).get();
  if (!doc.exists) return null;
  return toPostDoc(id, doc.data()!);
}

// Slugs back the public /chia-se/[slug] route; a duplicate would make one of
// the two posts silently unreachable (Firestore query just picks one).
export async function isPostSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const snap = await adminDb.collection("posts").where("slug", "==", slug).limit(2).get();
  return snap.docs.some((doc) => doc.id !== excludeId);
}

// generateMetadata() and the page body both need this per request; cache()
// dedupes them into a single Firestore read.
export const getPublishedPostBySlug = cache(async (slug: string): Promise<PostDoc | null> => {
  const snap = await adminDb.collection("posts").where("slug", "==", slug).where("published", "==", true).limit(1).get();
  if (snap.empty) return null;
  return toPostDoc(snap.docs[0]!.id, snap.docs[0]!.data());
});

export async function createPost(data: PostInput): Promise<string> {
  const now = new Date().toISOString();
  const ref = await adminDb.collection("posts").add({ ...data, createdAt: now, updatedAt: now });
  return ref.id;
}

export async function updatePost(id: string, data: PostInput) {
  await adminDb
    .collection("posts")
    .doc(id)
    .set({ ...data, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function deletePost(id: string) {
  await adminDb.collection("posts").doc(id).delete();
}
