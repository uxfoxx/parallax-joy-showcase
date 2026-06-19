import type { Area } from "react-easy-crop";

/**
 * Load an image URL into an <img> for canvas use. Sets crossOrigin so the
 * canvas isn't tainted — works for Supabase public-bucket URLs and any CDN
 * that returns `Access-Control-Allow-Origin`. External hosts that don't send
 * CORS headers will reject the export (caught by the caller).
 */
const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load the image for cropping."));
    img.src = src;
  });

/**
 * Render the cropped region of `src` (in natural-pixel coordinates supplied by
 * react-easy-crop's `croppedAreaPixels`) onto a canvas and return it as a File
 * ready to hand to `uploadImage`.
 *
 * @param src     Source image URL.
 * @param crop    `croppedAreaPixels` from react-easy-crop.
 * @param fileName Base name for the produced File.
 * @param mime    Output type. PNG keeps transparency; JPEG is smaller.
 */
export const getCroppedFile = async (
  src: string,
  crop: Area,
  fileName = "cropped",
  mime: "image/png" | "image/jpeg" | "image/webp" = "image/webp",
): Promise<File> => {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported in this browser.");

  canvas.width = Math.round(crop.width);
  canvas.height = Math.round(crop.height);

  ctx.drawImage(
    image,
    Math.round(crop.x),
    Math.round(crop.y),
    Math.round(crop.width),
    Math.round(crop.height),
    0,
    0,
    Math.round(crop.width),
    Math.round(crop.height),
  );

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Crop export failed — the image may be from a host that blocks editing. Re-upload it and try again."))),
      mime,
      0.92,
    );
  });

  const ext = mime.split("/")[1];
  return new File([blob], `${fileName}.${ext}`, { type: mime });
};
