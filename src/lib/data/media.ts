import "server-only";
import { unstable_cache } from "next/cache";
import { cloudinary, CLOUDINARY_FOLDER } from "@/lib/cloudinary";

export const MEDIA_LIST_TAG = "media-list";

export type MediaItem = {
  path: string; // Cloudinary public_id
  url: string;
  contentType: string;
  size: number;
  createdAt: string;
};

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
  created_at: string;
};

function assertCloudinaryConfigured() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary chưa được cấu hình đủ CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.");
  }
}

// Cloudinary's Admin API list call takes ~1s round-trip, and the media
// picker dialog re-fetches on every open. Cache the result for a minute
// (server-side, shared across requests) and bust it explicitly whenever
// something uploads or deletes, so browsing the library feels instant while
// still staying correct right after a change.
export const listMedia = unstable_cache(
  async (): Promise<MediaItem[]> => {
    assertCloudinaryConfigured();
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      prefix: `${CLOUDINARY_FOLDER}/`,
      max_results: 200,
    });

    return (result.resources as CloudinaryResource[])
      .map((r) => ({
        path: r.public_id,
        url: r.secure_url,
        contentType: `image/${r.format}`,
        size: r.bytes,
        createdAt: r.created_at,
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  ["media-list"],
  { tags: [MEDIA_LIST_TAG], revalidate: 60 },
);

export async function uploadMedia(buffer: Buffer, filename: string, contentType: string): Promise<MediaItem> {
  assertCloudinaryConfigured();
  const dataUri = `data:${contentType};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: CLOUDINARY_FOLDER,
    resource_type: "image",
    filename_override: filename,
  });

  return {
    path: result.public_id,
    url: result.secure_url,
    contentType: `image/${result.format}`,
    size: result.bytes,
    createdAt: result.created_at,
  };
}

export async function deleteMedia(path: string) {
  assertCloudinaryConfigured();
  await cloudinary.uploader.destroy(path, { resource_type: "image" });
}
