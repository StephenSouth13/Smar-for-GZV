import "server-only";
import { cloudinary, CLOUDINARY_FOLDER } from "@/lib/cloudinary";

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

export async function listMedia(): Promise<MediaItem[]> {
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
}

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
