export type PixelCrop = { x: number; y: number; width: number; height: number };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const SKIP_RESIZE_BELOW_BYTES = 2 * 1024 * 1024;

/**
 * For fields that upload the original image as-is (no forced-ratio crop —
 * see ImageField), a source straight out of a design tool can easily be
 * 10-20MB and get rejected by the upload size cap. Downscale (never
 * upscale/crop) to a sane max dimension and re-encode, preserving the
 * original format for PNG/WebP so transparent logos don't get flattened.
 * Small files are returned untouched.
 */
export async function resizeImageIfNeeded(file: File, maxDimension = 2400): Promise<Blob> {
  if (file.size <= SKIP_RESIZE_BELOW_BYTES) return file;

  const src = URL.createObjectURL(file);
  try {
    const image = await loadImage(src);
    const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
    if (scale >= 1) return file;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const mimeType = file.type === "image/png" || file.type === "image/webp" ? file.type : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType, 0.9));
    return blob ?? file;
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(src);
  }
}

export async function getCroppedImageBlob(imageSrc: string, crop: PixelCrop, mimeType = "image/jpeg"): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Crop failed"))),
      mimeType,
      0.92,
    );
  });
}
