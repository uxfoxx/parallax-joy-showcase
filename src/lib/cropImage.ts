import type { Area } from "react-easy-crop";

/**
 * Load an image URL into an <img> for canvas use.
 *
 * `crossOrigin="anonymous"` keeps the canvas un-tainted so we can export it.
 * We also append a cache-buster: the on-page preview <img> may have already
 * cached this URL WITHOUT CORS, and the browser would otherwise reuse that
 * non-CORS response for our anonymous request — tainting the canvas and making
 * toBlob() throw. A fresh query param forces a clean CORS fetch. Supabase
 * validates the `token` param specifically, so an extra param is harmless on
 * both public and signed URLs.
 */
const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load the image for cropping."));
    const sep = src.includes("?") ? "&" : "?";
    img.src = `${src}${sep}cb=${Date.now()}`;
  });

/** Bounding-box size of `w × h` after rotating by `deg` degrees. */
const rotatedSize = (w: number, h: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(rad) * w) + Math.abs(Math.sin(rad) * h),
    height: Math.abs(Math.sin(rad) * w) + Math.abs(Math.cos(rad) * h),
  };
};

/**
 * Render the cropped region of `src` to a canvas and return it as a File ready
 * for `uploadImage`.
 *
 * - Applies `rotation` (react-easy-crop reports `croppedAreaPixels` in the
 *   rotated frame, so we must rotate the source the same way before extracting).
 * - Fills the output with WHITE first, so when the crop frame extends beyond the
 *   image (image smaller than the crop), the surrounding area is white rather
 *   than transparent.
 *
 * @param src      Source image URL.
 * @param crop     `croppedAreaPixels` from react-easy-crop.
 * @param rotation Rotation in degrees applied in the cropper (default 0).
 * @param fileName Base name for the produced File.
 * @param mime     Output type — JPEG by default (flat white bg, smaller).
 */
export const getCroppedFile = async (
  src: string,
  crop: Area,
  rotation = 0,
  fileName = "cropped",
  mime: "image/png" | "image/jpeg" | "image/webp" = "image/jpeg",
): Promise<File> => {
  const image = await loadImage(src);

  // 1 — Draw the (rotated) image onto a bounding-box canvas.
  const bbox = rotatedSize(image.width, image.height, rotation);
  const bboxCanvas = document.createElement("canvas");
  bboxCanvas.width = Math.round(bbox.width);
  bboxCanvas.height = Math.round(bbox.height);
  const bctx = bboxCanvas.getContext("2d");
  if (!bctx) throw new Error("Canvas not supported in this browser.");
  bctx.translate(bboxCanvas.width / 2, bboxCanvas.height / 2);
  bctx.rotate((rotation * Math.PI) / 180);
  bctx.translate(-image.width / 2, -image.height / 2);
  bctx.drawImage(image, 0, 0);

  // 2 — Extract the crop region onto a white-filled output canvas. Areas the
  // image doesn't cover (crop larger than the image) stay white.
  const w = Math.round(crop.width);
  const h = Math.round(crop.height);
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d");
  if (!octx) throw new Error("Canvas not supported in this browser.");
  octx.fillStyle = "#ffffff";
  octx.fillRect(0, 0, w, h);
  octx.drawImage(bboxCanvas, Math.round(crop.x), Math.round(crop.y), w, h, 0, 0, w, h);

  const blob: Blob = await new Promise((resolve, reject) => {
    out.toBlob(
      (b) =>
        b
          ? resolve(b)
          : reject(
              new Error(
                "Crop export failed. The image may be from a host that blocks editing. Re-upload it and try again.",
              ),
            ),
      mime,
      0.92,
    );
  });

  const ext = mime === "image/jpeg" ? "jpg" : mime.split("/")[1];
  return new File([blob], `${fileName}.${ext}`, { type: mime });
};
