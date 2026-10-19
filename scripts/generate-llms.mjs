/**
 * Build-time llms.txt + llms-full.txt (AEO / answer-engine optimisation).
 *
 *   dist/llms.txt       the index (llmstxt.org format): who Olive Foods is, the
 *                       facts an assistant should quote, and links to every
 *                       sector, brand, category and product page.
 *   dist/llms-full.txt  the same plus the content itself — brand profiles,
 *                       category intros, every product with its description,
 *                       pack size, brand and category — so an assistant can
 *                       answer "who sells X in Sri Lanka" from one fetch.
 *
 * Wording is neutral: Olive Foods "imports and distributes" a brand, never
 * "the official/exclusive distributor". Product country of origin is admin-only
 * and deliberately left out (as on the site).
 *
 * Runs after `vite build`, same env as the sitemap. If Supabase is unreachable
 * it keeps the static public/llms.txt (already copied into dist/ by Vite).
 */
import { writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { DIST, ROOT, SITE, supabaseClient, categorySlug, readSectors, readBrandProfiles, readGuides } from "./seo/config.mjs";

const company = JSON.parse(readFileSync(resolve(ROOT, "src/data/company.json"), "utf8"));
const sectors = readSectors();
const profiles = readBrandProfiles();
const guides = readGuides();

/** Must match packSize() in src/lib/products.ts. */
const UNITS = { kg: "kg", gr: "g", gm: "g", g: "g", ml: "ml", ltr: "L", l: "L", gal: "gal", oz: "oz", cm: "cm", mm: "mm" };
const packSize = (name) => {
  const parts = [];
  const measure = name.match(/(\d+(?:\.\d+)?)\s?(kg|gr|gm|g|ml|ltr|l|gal|oz|cm|mm)\b/i);
  if (measure) parts.push(`${measure[1]} ${UNITS[measure[2].toLowerCase()]}`);
  const inches = name.match(/(\d+(?:\.\d+)?)\s?"/);
  if (inches) parts.push(`${inches[1]} in`);
  const count = name.match(/(\d+)\s?'s\b/i);
  if (count) parts.push(`${count[1]} per pack`);
  return parts.length ? parts.join(" · ") : null;
};
const plain = (html) =>
  (html ?? "")
    .replace(/<\/(p|li|h\d)>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
const isHouseBrand = (name) => name?.trim().toLowerCase() === "olive foods";
const categoriesOf = (p) => (p.categories?.length ? p.categories : p.category ? [p.category] : []);

const supabase = supabaseClient();
if (!supabase) {
  console.warn("[llms] Supabase env not set — keeping static public/llms.txt.");
  process.exit(0);
}

const SUMMARY = `# ${company.legalName}

> Importer and distributor of food and consumer brands in Sri Lanka, supplying hotels, restaurants, cafés, caterers, supermarkets and retailers island-wide from Colombo.

Olive Foods imports international food brands into Sri Lanka and distributes them to the trade: importing, bonded warehousing, cold-chain storage for frozen lines and island-wide delivery. Businesses order through a quote — by phone, WhatsApp or the form on the website.`;

const FACTS = `## At a glance
${company.atAGlance.map(([k, v]) => `- ${k}: ${v}`).join("\n")}`;

const HOW_TO_ORDER = `## How to order
Olive Foods sells to businesses (hotels, restaurants, cafés, caterers, supermarkets, retailers). Send a quote request with the products and quantities you need — ${SITE}/contact, +94 11 207 1717 (phone or WhatsApp) or info@olivefoods.lk — and the team replies with trade pricing and delivery details, usually within one business day.`;

try {
  const [brandsRes, productsRes, categoriesRes] = await Promise.all([
    supabase.from("brands").select("id, name, slug, description, origin, established").order("name"),
    supabase.from("products").select("name, slug, category, categories, brand_id, description, sku").order("name"),
    supabase.from("categories").select("name, description").order("name"),
  ]);
  for (const r of [brandsRes, productsRes, categoriesRes]) if (r.error) throw r.error;
  const brands = brandsRes.data ?? [];
  const products = (productsRes.data ?? []).filter((p) => p.slug);
  const brandById = new Map(brands.map((b) => [b.id, b]));

  // Only what has a page: categories and brands with products (or a profile).
  const byCategory = new Map();
  for (const p of products) for (const c of categoriesOf(p)) (byCategory.get(c) ?? byCategory.set(c, []).get(c)).push(p);
  const liveCategories = (categoriesRes.data ?? []).filter((c) => byCategory.has(c.name));
  const byBrand = new Map();
  for (const p of products) if (p.brand_id) (byBrand.get(p.brand_id) ?? byBrand.set(p.brand_id, []).get(p.brand_id)).push(p);
  const liveBrands = brands.filter((b) => b.slug && (byBrand.has(b.id) || profiles[b.slug]?.about?.trim()));
  const importedBrands = liveBrands.filter((b) => !isHouseBrand(b.name));
  const ownRange = liveBrands.find((b) => isHouseBrand(b.name));

  const brandUrl = (b) => `${SITE}/brands/${b.slug}`;
  const count = (n) => `${n} product${n === 1 ? "" : "s"}`;
  const productLine = (p, withDetail) => {
    const b = brandById.get(p.brand_id);
    const by = b && !isHouseBrand(b.name) ? ` by ${b.name}` : "";
    const size = packSize(p.name);
    const head = `- [${p.name}${by}](${SITE}/products/${p.slug})`;
    if (!withDetail) return head;
    const facts = [size && `pack size ${size}`, p.sku && `SKU ${p.sku}`].filter(Boolean).join(", ");
    const desc = plain(p.description);
    return `${head}${facts ? ` (${facts})` : ""}${desc ? `: ${desc}` : ""}`;
  };

  // ─── llms.txt — the index ───
  const sectorsIndex = `## Who we supply
${sectors.map((s) => `- [${s.heading}](${SITE}/supply/${s.slug}): ${s.description}`).join("\n")}`;
  const brandsIndex = `## Brands Olive Foods imports and distributes in Sri Lanka
${importedBrands.map((b) => `- [${b.name}](${brandUrl(b)}): ${count(byBrand.get(b.id)?.length ?? 0)}`).join("\n")}${
    ownRange ? `\n- [Olive Foods own range](${brandUrl(ownRange)}): ${count(byBrand.get(ownRange.id)?.length ?? 0)} supplied under the Olive Foods name` : ""
  }`;
  const categoriesIndex = `## Product categories
${liveCategories.map((c) => `- [${c.name}](${SITE}/categories/${categorySlug(c.name)}): ${count(byCategory.get(c.name).length)}`).join("\n")}`;
  const productsIndex = `## Products (by category)
${liveCategories.map((c) => `### ${c.name}\n${byCategory.get(c.name).map((p) => productLine(p, false)).join("\n")}`).join("\n\n")}`;
  const keyPages = `## Key pages
- [Home](${SITE}/): Company overview.
- [About](${SITE}/about): Background, facts and how Olive Foods works.
- [Products](${SITE}/products): The full catalogue, filterable by category and brand.
- [Brands](${SITE}/brands): Every brand Olive Foods imports and distributes.
- [Categories](${SITE}/categories): Every product category.
- [Contact](${SITE}/contact): Request a quote or place an order.
- [Full catalogue for AI assistants](${SITE}/llms-full.txt): this file plus brand profiles and every product description.`;

  // Buying guides (only once published).
  const guidesIndex = guides.length
    ? `## Buying guides\n${guides.map((g) => `- [${g.title}](${SITE}/guides/${g.slug}): ${g.description}`).join("\n")}`
    : "";
  const guidesFull = guides.length
    ? `## Buying guides\n${guides
        .map((g) => [`### ${g.title}`, `${SITE}/guides/${g.slug}`, "", g.summary, "", ...g.faqs.map((f) => `**${f.q}** ${f.a}`)].join("\n"))
        .join("\n\n")}`
    : "";

  const index = [SUMMARY, FACTS, HOW_TO_ORDER, sectorsIndex, brandsIndex, categoriesIndex, guidesIndex, keyPages, productsIndex].filter(Boolean).join("\n\n") + "\n";
  writeFileSync(resolve(DIST, "llms.txt"), index, "utf8");

  // ─── llms-full.txt — the content ───
  const sectorsFull = `## Who we supply
${sectors
  .map((s) => `### ${s.heading}\n${SITE}/supply/${s.slug}\n\n${s.intro ?? s.description}`)
  .join("\n\n")}`;
  const brandBlock = (b) => {
    const profile = profiles[b.slug] ?? {};
    const items = byBrand.get(b.id) ?? [];
    const cats = [...new Set(items.flatMap(categoriesOf))];
    const lines = [
      `### ${isHouseBrand(b.name) ? "Olive Foods own range" : b.name}`,
      brandUrl(b),
      "",
      isHouseBrand(b.name)
        ? `Products Olive Foods supplies under its own name across Sri Lanka.`
        : `Olive Foods imports and distributes ${b.name} in Sri Lanka, supplying hotels, restaurants, cafés, caterers and retailers island-wide from Colombo.`,
    ];
    if (profile.aliases?.length) lines.push(`Also written: ${profile.aliases.join(", ")}.`);
    if (b.origin) lines.push(`Origin: ${b.origin}.`);
    const about = plain(profile.about) || (isHouseBrand(b.name) ? "" : plain(b.description));
    if (about) lines.push("", about);
    if (profile.website) lines.push(`Official website: ${profile.website}`);
    if (cats.length) lines.push("", `Categories: ${cats.join(", ")}.`);
    if (items.length) lines.push("", `Products (${items.length}):`, ...items.map((p) => productLine(p, false)));
    return lines.join("\n");
  };
  const brandsFull = `## Brands
${[...importedBrands, ...(ownRange ? [ownRange] : [])].map(brandBlock).join("\n\n")}`;
  const categoriesFull = `## Products by category
${liveCategories
  .map((c) => {
    const intro = plain(c.description);
    return [
      `### ${c.name}`,
      `${SITE}/categories/${categorySlug(c.name)}`,
      ...(intro ? ["", intro] : []),
      "",
      ...byCategory.get(c.name).map((p) => productLine(p, true)),
    ].join("\n");
  })
  .join("\n\n")}`;

  const full =
    [SUMMARY, FACTS, HOW_TO_ORDER, sectorsFull, brandsFull, categoriesFull, guidesFull, keyPages.replace(/\n- \[Full catalogue[^\n]*/, "")].filter(Boolean).join(
      "\n\n",
    ) + "\n";
  writeFileSync(resolve(DIST, "llms-full.txt"), full, "utf8");

  console.log(
    `[llms] llms.txt ${(index.length / 1024).toFixed(0)} KB + llms-full.txt ${(full.length / 1024).toFixed(0)} KB — ` +
      `${importedBrands.length} brands, ${liveCategories.length} categories, ${products.length} products.`,
  );
} catch (err) {
  console.warn("[llms] fetch failed — keeping static public/llms.txt:", err?.message ?? err);
  process.exit(0);
}
