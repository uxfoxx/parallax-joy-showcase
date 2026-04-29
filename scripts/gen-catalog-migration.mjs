import XLSX from 'xlsx';
import fs from 'node:fs';

const wb = XLSX.readFile('/Users/oftg/Downloads/Olive_Foods_Product_Catalog_with_Origin_SKU.xlsx');
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

const sqlEscape = (v) => {
  if (v === null || v === undefined) return 'NULL';
  return "'" + String(v).replace(/'/g, "''") + "'";
};

const slugify = (s) => String(s).toLowerCase()
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80);

// Dedup brands case-insensitively, preserve first-seen casing.
const brandMap = new Map(); // key=lower, val={name, origin}
for (const r of rows) {
  const key = r.Brand.toLowerCase();
  if (!brandMap.has(key)) {
    brandMap.set(key, { name: r.Brand, origin: r.Origin || 'Imported' });
  }
}
const brands = [...brandMap.values()];

// Ensure brand slugs are unique.
const usedBrandSlugs = new Set();
for (const b of brands) {
  let s = slugify(b.name);
  let n = 2;
  while (usedBrandSlugs.has(s)) s = `${slugify(b.name)}-${n++}`;
  usedBrandSlugs.add(s);
  b.slug = s;
}

// Categories: dedup
const cats = [...new Set(rows.map(r => r.Category))].sort();

// Products: ensure unique slug
const usedProductSlugs = new Set();
const products = rows.map(r => {
  let s = slugify(`${r.Brand}-${r['Product Name']}`);
  let n = 2;
  let base = s;
  while (usedProductSlugs.has(s)) s = `${base}-${n++}`;
  usedProductSlugs.add(s);

  const descParts = [r.Description].filter(Boolean);
  if (r['Key Specs']) descParts.push(`Key specs: ${r['Key Specs']}`);
  if (r['Pack Size']) descParts.push(`Pack: ${r['Pack Size']}${r.Unit ? ` ${r.Unit}` : ''}`);
  const description = descParts.join('\n\n');

  const tags = [];
  if (r.Unit) tags.push(String(r.Unit).toLowerCase());
  if (r['Pack Size']) tags.push(String(r['Pack Size']).toLowerCase());

  return {
    slug: s,
    name: r['Product Name'],
    brandKey: r.Brand.toLowerCase(),
    category: r.Category,
    description,
    origin: r.Origin || '',
    sku: r.SKU || '',
    tags,
  };
});

// Build SQL
let sql = `-- Replace product catalog with Olive Foods Product List (200 SKUs)
-- Generated from Olive_Foods_Product_Catalog_with_Origin_SKU.xlsx

BEGIN;

-- Wipe existing catalog (product_images cascade via FK).
DELETE FROM public.products;
DELETE FROM public.brands;

-- Brands
INSERT INTO public.brands (slug, name, description, origin) VALUES
`;

sql += brands.map(b =>
  `  (${sqlEscape(b.slug)}, ${sqlEscape(b.name)}, ${sqlEscape('')}, ${sqlEscape(b.origin)})`
).join(',\n') + ';\n\n';

// Categories — only insert if not exists (categories table has UNIQUE name)
sql += `-- Categories (skip if already present)\n`;
sql += `INSERT INTO public.categories (name, description) VALUES\n`;
sql += cats.map(c => `  (${sqlEscape(c)}, ${sqlEscape('')})`).join(',\n');
sql += `\nON CONFLICT (name) DO NOTHING;\n\n`;

// Products — resolve brand_id by slug subquery
sql += `-- Products\nINSERT INTO public.products (slug, name, brand_id, category, description, origin, sku, tags) VALUES\n`;
sql += products.map(p => {
  const brandSlug = brands.find(b => b.name.toLowerCase() === p.brandKey).slug;
  const tagsArr = p.tags.length
    ? `ARRAY[${p.tags.map(sqlEscape).join(',')}]::text[]`
    : `'{}'::text[]`;
  return `  (${sqlEscape(p.slug)}, ${sqlEscape(p.name)}, (SELECT id FROM public.brands WHERE slug = ${sqlEscape(brandSlug)}), ${sqlEscape(p.category)}, ${sqlEscape(p.description)}, ${sqlEscape(p.origin)}, ${sqlEscape(p.sku)}, ${tagsArr})`;
}).join(',\n');
sql += ';\n\nCOMMIT;\n';

const outPath = '/Users/oftg/Documents/Olive/parallax-joy-showcase/supabase/migrations/20260429120000_replace_products_catalog.sql';
fs.writeFileSync(outPath, sql);
console.log(`Wrote ${outPath}`);
console.log(`Brands: ${brands.length}, Categories: ${cats.length}, Products: ${products.length}`);
