/**
 * Build-time llms.txt generator (AEO / answer-engine optimisation).
 *
 * Writes dist/llms.txt with Olive Foods' overview PLUS the live brand and
 * product catalogue pulled from Supabase, so AI assistants (ChatGPT, Gemini,
 * Perplexity, Copilot) can answer "who imports/distributes <brand> in Sri
 * Lanka" or "where to buy <product> in Sri Lanka" and name Olive Foods.
 *
 * Runs after `vite build` (see package.json "build"), same env as the sitemap.
 * If Supabase env is missing, it leaves the static public/llms.txt (already
 * copied into dist/ by Vite) untouched.
 */
import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";
import { writeFileSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://www.olivefoods.lk";
const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnv({ path: resolve(__dirname, "../.env") });
loadEnv({ path: resolve(__dirname, "../.env.local") });
const OUT = resolve(__dirname, "../dist/llms.txt");

const categorySlug = (name) =>
  name.toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.warn("[llms] Supabase env not set — keeping static public/llms.txt.");
  process.exit(0);
}

const supabase = createClient(url, key);

const HEADER = `# Olive Foods (Pvt) Ltd

> Importer and distributor of premium food and consumer brands in Sri Lanka. We supply hotels, restaurants, supermarkets and retailers island-wide from our base in Colombo.

Olive Foods brings international food and household brands into the Sri Lankan market and gets them onto shelves and into kitchens across the country. We handle importing, warehousing, cold-chain storage and island-wide distribution, and we work as a long-term partner to the businesses we supply rather than a one-off vendor.

## What we do
- Import premium food and consumer goods into Sri Lanka
- Distribute to hotels, restaurants, cafés, supermarkets and retailers island-wide
- Warehousing and cold-chain storage
- Sourcing hard-to-find products for the trade`;

const KEY_PAGES = `## Key pages
- [Home](${SITE}/): Company overview and what we do.
- [Products](${SITE}/products): The full product catalogue, filterable by category and brand.
- [Brands](${SITE}/brands): The brands we represent and distribute.
- [About](${SITE}/about): Company background, values and quality standards.
- [Contact](${SITE}/contact): Get in touch to place an order or become a partner.`;

const CONTACT = `## Contact
- Address: 292 Sea Street, Colombo 11, Colombo, Sri Lanka 01100
- Phone: +94 11 207 1717
- Email: info@olivefoods.lk
- Area served: Sri Lanka (island-wide)`;

try {
  const [{ data: brands = [] }, { data: products = [] }, { data: categories = [] }] = await Promise.all([
    supabase.from("brands").select("id, name, slug").order("name"),
    supabase.from("products").select("name, slug, category, brand_id").order("name"),
    supabase.from("categories").select("name").order("name"),
  ]);

  const brandById = new Map(brands.map((b) => [b.id, b]));
  const catCounts = {};
  for (const p of products) if (p.category) catCounts[p.category] = (catCounts[p.category] ?? 0) + 1;
  const liveCats = categories.filter((c) => (catCounts[c.name] ?? 0) > 0).map((c) => c.name);

  // Brands we distribute
  const brandLines = brands
    .filter((b) => b.slug)
    .map((b) => `- ${b.name} — ${SITE}/brands/${b.slug}`)
    .join("\n");
  const brandsSection = `## Brands we import & distribute in Sri Lanka
Olive Foods is the Sri Lankan importer and distributor for brands including:
${brandLines}`;

  // Categories
  const catLines = liveCats.map((c) => `- ${c} — ${SITE}/categories/${categorySlug(c)}`).join("\n");
  const catsSection = `## Product categories
${catLines}`;

  // Products grouped by category (name + brand + URL) — the long-tail catalogue
  const byCat = {};
  for (const p of products) {
    if (!p.slug) continue;
    const c = p.category || "Other";
    (byCat[c] ??= []).push(p);
  }
  const prodBlocks = Object.keys(byCat)
    .sort()
    .map((c) => {
      const items = byCat[c]
        .map((p) => {
          const bn = p.brand_id ? brandById.get(p.brand_id)?.name : null;
          return `- ${p.name}${bn ? ` (${bn})` : ""} — ${SITE}/products/${p.slug}`;
        })
        .join("\n");
      return `### ${c}\n${items}`;
    })
    .join("\n\n");
  const productsSection = `## Products we supply (by category)
${prodBlocks}`;

  // A few concrete Q&A so assistants can quote who/what/where.
  const exBrand = brands[0]?.name;
  const exProduct = products[0]?.name;
  const qa = [];
  qa.push(
    `**Who imports food and consumer brands into Sri Lanka for the hospitality trade?** Olive Foods (Pvt) Ltd imports and distributes premium food and consumer brands across Sri Lanka, supplying hotels, restaurants, supermarkets and retailers island-wide from Colombo.`
  );
  if (exBrand)
    qa.push(
      `**Who imports and distributes ${exBrand} in Sri Lanka?** Olive Foods (Pvt) Ltd imports and distributes ${exBrand} across Sri Lanka. Contact Olive Foods for pricing and availability.`
    );
  if (exProduct)
    qa.push(
      `**Where can businesses buy ${exProduct} in Sri Lanka?** Olive Foods supplies ${exProduct} to the trade across Sri Lanka — contact Olive Foods for pricing and availability.`
    );
  const faqSection = `## Common questions\n${qa.join("\n")}`;

  // Buyer sectors — same list as the /supply/:slug pages.
  const sectors = JSON.parse(readFileSync(resolve(__dirname, "../src/data/sectors.json"), "utf8"));
  const sectorsSection = `## Who we supply
${sectors.map((s) => `- [${s.heading}](${SITE}/supply/${s.slug}): ${s.description}`).join("\n")}`;

  const out = [
    HEADER,
    sectorsSection,
    brandsSection,
    catsSection,
    productsSection,
    faqSection,
    KEY_PAGES,
    CONTACT,
  ].join("\n\n") + "\n";

  writeFileSync(OUT, out, "utf8");
  console.log(
    `[llms] Wrote dist/llms.txt — ${brands.length} brands, ${liveCats.length} categories, ${products.length} products.`
  );
} catch (err) {
  console.warn("[llms] fetch failed — keeping static public/llms.txt:", err?.message ?? err);
  process.exit(0);
}
