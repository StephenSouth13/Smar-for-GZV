import "server-only";
import { adminStorage } from "@/lib/firebase/admin";

const UPLOAD_PREFIX = "uploads/";

export type MediaItem = {
  path: string;
  url: string;
  contentType: string;
  size: number;
  createdAt: string;
};

export async function listMedia(): Promise<MediaItem[]> {
  const bucket = adminStorage.bucket();
  const [files] = await bucket.getFiles({ prefix: UPLOAD_PREFIX });
  const items = await Promise.all(
    files
      .filter((f) => !f.name.endsWith("/"))
      .map(async (f) => {
        const [meta] = await f.getMetadata();
        return {
          path: f.name,
          url: `https://storage.googleapis.com/${bucket.name}/${f.name}`,
          contentType: meta.contentType ?? "application/octet-stream",
          size: Number(meta.size ?? 0),
          createdAt: meta.timeCreated ?? "",
        };
      }),
  );
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function uploadMedia(buffer: Buffer, filename: string, contentType: string): Promise<MediaItem> {
  const bucket = adminStorage.bucket();
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${UPLOAD_PREFIX}${Date.now()}-${safeName}`;
  const file = bucket.file(path);
  await file.save(buffer, { metadata: { contentType }, public: true });
  const [meta] = await file.getMetadata();
  return {
    path,
    url: `https://storage.googleapis.com/${bucket.name}/${path}`,
    contentType,
    size: Number(meta.size ?? buffer.length),
    createdAt: meta.timeCreated ?? new Date().toISOString(),
  };
}

export async function deleteMedia(path: string) {
  await adminStorage.bucket().file(path).delete({ ignoreNotFound: true });
}
