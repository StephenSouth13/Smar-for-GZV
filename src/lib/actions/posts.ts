"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { postSchema, type PostInput } from "@/lib/schema/content";
import { createPost, updatePost, deletePost, listPosts, getPostById, isPostSlugTaken, type PostDoc } from "@/lib/data/posts";

export async function listPostsForPickerAction(): Promise<Pick<PostDoc, "id" | "title" | "published">[]> {
  await requireAdmin();
  const posts = await listPosts();
  return posts.map((p) => ({ id: p.id, title: p.title, published: p.published }));
}

export async function createPostAction(data: PostInput) {
  await requireAdmin();
  const parsed = postSchema.parse(data);
  if (await isPostSlugTaken(parsed.slug)) {
    throw new Error(`Đường dẫn "/chia-se/${parsed.slug}" đã được dùng cho bài viết khác.`);
  }
  const id = await createPost(parsed);
  revalidatePath("/chia-se");
  revalidatePath("/");
  return { id };
}

export async function updatePostAction(id: string, data: PostInput) {
  await requireAdmin();
  const parsed = postSchema.parse(data);
  if (await isPostSlugTaken(parsed.slug, id)) {
    throw new Error(`Đường dẫn "/chia-se/${parsed.slug}" đã được dùng cho bài viết khác.`);
  }
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

export async function duplicatePostAction(id: string) {
  await requireAdmin();
  const source = await getPostById(id);
  if (!source) throw new Error("Không tìm thấy bài viết.");

  let slug = `${source.slug}-ban-sao`;
  let suffix = 2;
  while (await isPostSlugTaken(slug)) {
    slug = `${source.slug}-ban-sao-${suffix}`;
    suffix += 1;
  }

  // postSchema.parse() strips unrecognized keys, so passing the full doc
  // (which also has id/createdAt/updatedAt) is safe.
  const parsed = postSchema.parse({ ...source, title: `${source.title} (Bản sao)`, slug, published: false });
  const newId = await createPost(parsed);
  revalidatePath("/chia-se");
  return { id: newId };
}
