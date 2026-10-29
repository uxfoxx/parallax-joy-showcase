/**
 * Build step 0 (before `vite build`): every catalogue image, resized once and
 * served from olivefoods.lk itself.
 *
 * Why: product/brand photos were served through Supabase's image-transform
 * endpoint. Its CDN edge is close (Colombo), but a transform is only cached
 * for an hour and per width, and on a site with modest traffic most visits
 * missed: ~1.2 s per image while it was resized on demand. Here each image is
 * downloaded once, encoded to WebP at the fixed IMAGE_WIDTHS, and shipped in
 * dist/img/ with a one-year immutable cache (nginx /img/).
 *
 *   .image-cache/src/<key>          original download (kept between builds)
 *   .image-cache/out/<key>-<w>.webp encoded sizes (kept between builds)
 *   .image-cache/manifest.json      the keys of every image this build ships
 *
 * <key> is imageKey(url) — the same FNV-1a hash src/lib/img.ts computes in the
 * browser, so cdnImg() can map a Supabase URL to its local file without
 * shipping a URL table. vite.config.ts (image-pipeline plugin) exposes the
 * manifest to the client and copies the files into dist/img/, keeping their
 * timestamps so the deploy can hard-link unchanged files instead of
 * uploading them again.
 *
 * Images uploaded after a build aren't in the manifest; cdnImg() sends them
 * to the transform endpoint as before until the next deploy picks them up.
 * Without Supabase env (or with IMAGES_SKIP=1) this writes an empty manifest
 * and the site behaves exactly as before.
 */
import { existsSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import { ROOT, ensureDir, supabaseClient } from "./seo/config.mjs";

export const IMAGE_WIDTHS = [128, 256, 400, 600, 800, 1200];
const MARKER = "/storage/v1/object/public/";
const CACHE = resolve(ROOT, ".image-cache");
const SRC = resolve(CACHE, "src");
const OUT = resolve(CACHE, "out");
const MANIFEST = resolve(CACHE, "manifest.json");
const QUALITY = 76;
const CONCURRENCY = 6;

/** FNV-1a (32-bit) of the URL, as 8 hex chars. Must match imageKey() in src/lib/img.ts. */
export const imageKey = (url) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < url.length; i++) {
    h ^= url.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
};

ensureDir(SRC);
ensureDir(OUT);

const supabase = process.env.IMAGES_SKIP ? null : supabaseClient();
if (!supabase) {
  console.warn("[images] no Supabase env (or IMAGES_SKIP) — no local images this build.");
  writeFileSync(MANIFEST, "[]\n");
  process.exit(0);
}

// Same retry-then-stop policy as collect-routes: a half-read catalogue would
// quietly send images back to the slow path.
const read = async (name, query, { optional = false } = {}) => {
  for (let attempt = 1; ; attempt++) {
    const res = await query();
    if (!res.error) return res.data ?? [];
    if (attempt >= 4 && optional) {
      console.warn(`[images] ${name}: ${res.error.message} — its images stay on the transform endpoint.`);
      return [];
    }
    if (attempt >= 4) {
      console.error(`[images] ${name} query failed ${attempt} times: ${res.error.message}`);
      process.exit(1);
    }
    await new Promise((r) => setTimeout(r, attempt * 1500));
  }
};
const [products, gallery, brands, logos, profiles, settings] = await Promise.all([
  read("products", () => supabase.from("products").select("image_url")),
  read("product_images", () => supabase.from("product_images").select("image_url")),
  read("brands", () => supabase.from("brands").select("image_url")),
  read("partner_logos", () => supabase.from("partner_logos").select("image_url"), { optional: true }),
  read("business_profiles", () => supabase.from("business_profiles").select("photo_url"), { optional: true }),
  read("brochure_settings", () => supabase.from("brochure_settings").select("certificate_url"), { optional: true }),
]);
const urls = [
  ...new Set(
    [
      ...products.map((r) => r.image_url),
      ...gallery.map((r) => r.image_url),
      ...brands.map((r) => r.image_url),
      ...logos.map((r) => r.image_url),
      ...profiles.map((r) => r.photo_url),
      ...settings.map((r) => r.certificate_url),
    ].filter((u) => typeof u === "string" && u.includes(MARKER)),
  ),
];

let fetched = 0, encoded = 0, failed = 0;
const keys = [];
async function processOne(url) {
  const key = imageKey(url);
  const src = resolve(SRC, key);
  try {
    if (!existsSync(src)) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      writeFileSync(src, Buffer.from(await res.arrayBuffer()));
      fetched++;
    }
    for (const w of IMAGE_WIDTHS) {
      const out = resolve(OUT, `${key}-${w}.webp`);
      if (existsSync(out) && statSync(out).size > 0) continue;
      // `rotate()` applies EXIF orientation; never upscale past the original.
      await sharp(src).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY, effort: 5 }).toFile(out);
      encoded++;
    }
    keys.push(key);
  } catch (e) {
    failed++;
    console.warn(`[images] skipped ${url.split("/").pop()}: ${e.message}`);
  }
}
const queue = [...urls];
await Promise.all(Array.from({ length: CONCURRENCY }, async () => { for (let u; (u = queue.shift()); ) await processOne(u); }));

keys.sort();
const previous = existsSync(MANIFEST) ? readFileSync(MANIFEST, "utf8") : "";
const next = JSON.stringify(keys) + "\n";
if (next !== previous) writeFileSync(MANIFEST, next);
console.log(`[images] ${keys.length} images × ${IMAGE_WIDTHS.length} sizes (${fetched} downloaded, ${encoded} encoded, ${failed} skipped)`);
