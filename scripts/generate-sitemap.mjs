/**
 * Build-time sitemap generator.
 *
 * Writes dist/sitemap.xml with the static routes plus every product and brand
 * slug pulled live from Supabase, so the sitemap is always current on each
 * deploy. Runs after `vite build` (see package.json "build").
 *
 * Reads the same env the Vite build uses:
 *   VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY
 * If those aren't set (e.g. a local build without env), it still emits the
 * static routes so the file always exists and robots.txt never 404s.
 */
import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://www.olivefoods.lk";
const __dirname = dirname(fileURLToPath(import.meta.url));
// Load the same env Vite uses so the sitemap can pull live product/brand slugs.
// (Runs as its own node process, so it doesn't inherit Vite's loaded .env.)
loadEnv({ path: resolve(__dirname, "../.env") });
loadEnv({ path: resolve(__dirname, "../.env.local") });
const OUT = resolve(__dirname, "../dist/sitemap.xml");

const STATIC_ROUTES = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/about", priority: "0.8", changefreq: "monthly" },
  { loc: "/products", priority: "0.9", changefreq: "weekly" },
  { loc: "/brands", priority: "0.8", changefreq: "weekly" },
  { loc: "/categories", priority: "0.7", changefreq: "monthly" },
  { loc: "/contact", priority: "0.7", changefreq: "monthly" },
];

// Must match categorySlug() in src/lib/categories.ts.
const categorySlug = (name) =>
  name.toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const today = new Date().toISOString().slice(0, 10);
const entry = ({ loc, priority = "0.6", changefreq = "weekly", lastmod = today }) =>
  `  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

async function dynamicRoutes() {
  if (!url || !key) {
    console.warn("[sitemap] Supabase env not set — emitting static routes only.");
    return [];
  }
  const supabase = createClient(url, key);
  const routes = [];
  try {
    const { data: products, error: pErr } = await supabase.from("products").select("slug, created_at, categories");
    if (pErr) console.warn("[sitemap] products query failed:", pErr.message);
    const catCounts = {};
    for (const p of products ?? []) {
      if (p.slug) routes.push({ loc: `/products/${p.slug}`, priority: "0.7", changefreq: "weekly", lastmod: (p.created_at ?? today).slice(0, 10) });
      for (const c of p.categories ?? []) if (c) catCounts[c] = (catCounts[c] ?? 0) + 1;
    }
    const { data: brands } = await supabase.from("brands").select("slug");
    for (const b of brands ?? []) {
      if (b.slug) routes.push({ loc: `/brands/${b.slug}`, priority: "0.6", changefreq: "monthly" });
    }
    // Category landing pages — only categories that actually have products.
    const { data: categories } = await supabase.from("categories").select("name");
    for (const c of categories ?? []) {
      if (c.name && (catCounts[c.name] ?? 0) > 0) routes.push({ loc: `/categories/${categorySlug(c.name)}`, priority: "0.7", changefreq: "weekly" });
    }
  } catch (err) {
    console.warn("[sitemap] Supabase fetch failed — static routes only:", err?.message ?? err);
  }
  return routes;
}

const all = [...STATIC_ROUTES, ...(await dynamicRoutes())];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all.map(entry).join("\n")}\n</urlset>\n`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, xml, "utf8");
console.log(`[sitemap] Wrote ${all.length} URLs → dist/sitemap.xml`);
