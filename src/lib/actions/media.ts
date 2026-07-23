"use server";

import { requireAdmin } from "@/lib/auth/session";
import { deleteMedia, listMedia, uploadMedia } from "@/lib/data/media";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();

  try {
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return { error: "Không có tệp nào được gửi lên." };
    }
    if (file.size > MAX_SIZE) {
      return { error: "Ảnh tối đa 8MB." };
    }
    if (!file.type.startsWith("image/")) {
      return { error: "Chỉ hỗ trợ tệp hình ảnh." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const item = await uploadMedia(buffer, file.name, file.type);
    return { item };
  } catch (err) {
    console.error("uploadMediaAction failed", err);
    return { error: err instanceof Error ? err.message : "Tải ảnh lên thất bại." };
  }
}

export async function deleteMediaAction(path: string) {
  await requireAdmin();
  await deleteMedia(path);
}

export async function listMediaAction() {
  await requireAdmin();

  try {
    return { items: await listMedia() };
  } catch (err) {
    console.error("listMediaAction failed", err);
    return { error: err instanceof Error ? err.message : "Không tải được thư viện ảnh.", items: [] };
  }
}
