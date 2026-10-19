/**
 * SEO build step 1 (after `vite build`): collect every public, indexable URL.
 *
 * Writes .seo-cache/routes.json — the list the prerender renders and the
 * sitemap is built from. Each route carries what the later steps need:
 *   kind     page | sector | category | product | brand (see config.mjs)
 *   id       database id, so a renamed slug can be redirected next build
 *   images   image URLs for the image sitemap
 *   seed     creation date — the starting lastmod when there is no history
 *
 * If Supabase is unreachable it still emits the fixed pages and sector pages,
 * so the build never produces an empty sitemap.
 */
import { writeFileSync } from "node:fs";
import {
  CACHE, ROUTES_FILE, STATIC_PAGES, ensureDir, supabaseClient, categorySlug, readSectors, readBrandProfiles,
} from "./config.mjs";

const routes = [];
const seen = new Set();
const add = (route) => {
  if (seen.has(route.loc)) return;
  seen.add(route.loc);
  routes.push({ images: [], ...route });
};
const imagesOf = (...urls) => [...new Set(urls.filter(Boolean))].map((loc) => ({ loc }));

for (const loc of STATIC_PAGES) add({ loc, kind: "page" });
for (const s of readSectors()) add({ loc: `/supply/${s.slug}`, kind: "sector", id: s.slug });

const supabase = supabaseClient();
if (!supabase) {
  console.warn("[routes] Supabase env not set — fixed pages and sectors only.");
} else {
  const [products, brands, categories, gallery] = await Promise.all([
    supabase.from("products").select("id, slug, image_url, category, categories, brand_id, created_at").order("name"),
    supabase.from("brands").select("id, slug, image_url, created_at").order("name"),
    supabase.from("categories").select("id, name, created_at").order("name"),
    supabase.from("product_images").select("product_id, image_url, sort_order").order("sort_order"),
  ]);
  for (const [name, res] of Object.entries({ products, brands, categories, gallery }))
    if (res.error) console.warn(`[routes] ${name} query failed: ${res.error.message}`);

  const galleryByProduct = {};
  for (const g of gallery.data ?? []) (galleryByProduct[g.product_id] ??= []).push(g.image_url);

  // Category landing pages exist only for categories that have products.
  const catCounts = {};
  for (const p of products.data ?? []) {
    const cats = p.categories?.length ? p.categories : p.category ? [p.category] : [];
    for (const c of cats) catCounts[c] = (catCounts[c] ?? 0) + 1;
  }
  for (const c of categories.data ?? []) {
    if (c.name && catCounts[c.name] > 0)
      add({ loc: `/categories/${categorySlug(c.name)}`, kind: "category", id: c.id, seed: c.created_at });
  }
  for (const p of products.data ?? []) {
    if (!p.slug) continue;
    add({
      loc: `/products/${p.slug}`,
      kind: "product",
      id: p.id,
      seed: p.created_at,
      images: imagesOf(p.image_url, ...(galleryByProduct[p.id] ?? [])),
    });
  }
  // A brand page with no products and no profile is thin (Google: "Soft 404")
  // and renders noindex — so it isn't listed or prerendered either. It
  // comes back automatically once it has products or a profile.
  const brandProductCount = {};
  for (const p of products.data ?? []) if (p.brand_id) brandProductCount[p.brand_id] = (brandProductCount[p.brand_id] ?? 0) + 1;
  const profiles = readBrandProfiles();
  for (const b of brands.data ?? []) {
    if (!b.slug) continue;
    if (!brandProductCount[b.id] && !profiles[b.slug]?.about?.trim()) {
      console.log(`[routes] skipping /brands/${b.slug}: no products and no profile (noindex)`);
      continue;
    }
    add({ loc: `/brands/${b.slug}`, kind: "brand", id: b.id, seed: b.created_at, images: imagesOf(b.image_url) });
  }
}

ensureDir(CACHE);
writeFileSync(ROUTES_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), routes }, null, 2));
const byKind = routes.reduce((m, r) => ((m[r.kind] = (m[r.kind] ?? 0) + 1), m), {});
console.log(
  `[routes] ${routes.length} URLs — ${Object.entries(byKind).map(([k, n]) => `${n} ${k}`).join(", ")}`,
);
