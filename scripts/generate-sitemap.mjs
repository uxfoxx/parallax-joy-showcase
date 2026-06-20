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
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://www.olivefoods.lk";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../dist/sitemap.xml");

const STATIC_ROUTES = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/about", priority: "0.8", changefreq: "monthly" },
  { loc: "/products", priority: "0.9", changefreq: "weekly" },
  { loc: "/brands", priority: "0.8", changefreq: "weekly" },
  { loc: "/contact", priority: "0.7", changefreq: "monthly" },
];

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
    const { data: products } = await supabase.from("products").select("slug, updated_at");
    for (const p of products ?? []) {
      if (p.slug) routes.push({ loc: `/products/${p.slug}`, priority: "0.7", changefreq: "weekly", lastmod: (p.updated_at ?? today).slice(0, 10) });
    }
    const { data: brands } = await supabase.from("brands").select("slug");
    for (const b of brands ?? []) {
      if (b.slug) routes.push({ loc: `/brands/${b.slug}`, priority: "0.6", changefreq: "monthly" });
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
