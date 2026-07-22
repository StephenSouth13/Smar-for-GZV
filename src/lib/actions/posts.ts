"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { postSchema, type PostInput } from "@/lib/schema/content";
import { createPost, updatePost, deletePost, listPosts, type PostDoc } from "@/lib/data/posts";

export async function listPostsForPickerAction(): Promise<Pick<PostDoc, "id" | "title" | "published">[]> {
  await requireAdmin();
  const posts = await listPosts();
  return posts.map((p) => ({ id: p.id, title: p.title, published: p.published }));
}

export async function createPostAction(data: PostInput) {
  await requireAdmin();
  const parsed = postSchema.parse(data);
  const id = await createPost(parsed);
  revalidatePath("/chia-se");
  revalidatePath("/");
  return { id };
}

export async function updatePostAction(id: string, data: PostInput) {
  await requireAdmin();
  const parsed = postSchema.parse(data);
  await updatePost(id, parsed);
  revalidatePath("/chia-se");
  revalidatePath(`/chia-se/${parsed.slug}`);
  revalidatePath("/");
}

export async function deletePostAction(id: string) {
  await requireAdmin();
  await deletePost(id);
  revalidatePath("/chia-se");
  revalidatePath("/");
}
