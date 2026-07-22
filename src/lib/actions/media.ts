"use server";

import { requireAdmin } from "@/lib/auth/session";
import { uploadMedia, deleteMedia, listMedia } from "@/lib/data/media";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();

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
}

export async function deleteMediaAction(path: string) {
  await requireAdmin();
  await deleteMedia(path);
}

export async function listMediaAction() {
  await requireAdmin();
  return listMedia();
}
