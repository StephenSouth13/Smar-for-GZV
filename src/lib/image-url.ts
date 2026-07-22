/**
 * Inserts Cloudinary delivery transformations into an image URL so we always
 * request an appropriately-sized, correctly-cropped, auto-optimized asset
 * instead of shipping the original upload and letting the browser scale it
 * (which is what was making images look soft/out of focus).
 *
 * No-op for any URL that isn't a Cloudinary delivery URL (e.g. placehold.co).
 */
export type CldCrop = "fill" | "fit" | "thumb" | "scale";
export type CldGravity = "auto" | "center" | "face" | "faces";

export function cld(
  url: string,
  opts: { width?: number; height?: number; crop?: CldCrop; gravity?: CldGravity } = {},
): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;

  const { width, height, crop = "fill", gravity = "auto" } = opts;
  const parts = [`q_auto`, `f_auto`];
  if (width) parts.push(`w_${Math.round(width)}`);
  if (height) parts.push(`h_${Math.round(height)}`);
  if (width || height) {
    parts.push(`c_${crop}`);
    if (crop === "fill" || crop === "thumb") parts.push(`g_${gravity}`);
  }

  return url.replace("/upload/", `/upload/${parts.join(",")}/`);
}
