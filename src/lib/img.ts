import type { SyntheticEvent } from "react";
import LOCAL_IMAGES from "virtual:image-manifest";

/** The sizes every image exists in (scripts/build-images.mjs IMAGE_WIDTHS). */
export const IMAGE_WIDTHS = [128, 256, 400, 600, 800, 1200] as const;
const MARKER = "/storage/v1/object/public/";
const LOCAL = new Set(LOCAL_IMAGES);

/** FNV-1a (32-bit) of the URL, as 8 hex chars. Must match scripts/build-images.mjs. */
export const imageKey = (url: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < url.length; i++) {
    h ^= url.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
};

/** The smallest standard size that covers `width`. Snapping keeps the number
 *  of distinct variants small (local files, and CDN cache hits upstream). */
const snap = (width: number) => IMAGE_WIDTHS.find((w) => w >= width) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];

/**
 * A Supabase Storage image at (about) the size it's shown.
 *
 * Images that existed at build time are served from olivefoods.lk itself
 * (/img/<key>-<w>.webp, resized once by scripts/build-images.mjs, cached for
 * a year). Anything newer goes through Supabase's image-transform endpoint,
 * which works but resizes on demand (~1 s on a cache miss). Leaves
 * non-Supabase, signed, or empty URLs untouched, so it's safe to wrap any
 * `image_url`.
 *
 *   <img src={cdnImg(product.image_url, 600)} />
 */
export const cdnImg = (url: string, width: number, quality = 70): string => {
  if (!url || !url.includes(MARKER)) return url;
  const w = snap(width);
  const key = imageKey(url);
  if (LOCAL.has(key)) return `/img/${key}-${w}.webp`;
  const rendered = url.replace(MARKER, "/storage/v1/render/image/public/");
  const sep = rendered.includes("?") ? "&" : "?";
  return `${rendered}${sep}width=${w}&quality=${quality}&resize=contain`;
};

/** srcset over the standard sizes up to `max`, for an <img sizes=…>. */
export const cdnSrcSet = (url: string, max = 1200) =>
  url && url.includes(MARKER)
    ? IMAGE_WIDTHS.filter((w) => w <= max).map((w) => `${cdnImg(url, w)} ${w}w`).join(", ")
    : undefined;

/**
 * `onError` handler for `<img src={cdnImg(url, w)} />`: if the optimized
 * transform URL fails (the render endpoint occasionally rate-limits or errors
 * under load), fall back once to the original object URL, which is always
 * served. Guards against an error loop.
 *
 *   <img src={cdnImg(url, 600)} onError={fallbackToOriginal(url)} />
 */
export const fallbackToOriginal =
  (original: string) => (e: SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    if (!original || el.src === original) return;
    el.removeAttribute("srcset"); // a srcset candidate would win over src
    el.src = original;
  };
