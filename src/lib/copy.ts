/**
 * Reviewed copy that ships with the code and stands in for weak or missing
 * admin text: brand short descriptions (src/data/brand-profiles.json `summary`)
 * and product descriptions (src/data/product-descriptions.json). Drafts and
 * reviewer notes live in content/drafts/.
 *
 * Each entry records the admin text it was written to replace (`replaces`). It
 * applies only while the database still holds that text, or nothing, so the
 * moment someone edits the description in the admin, the admin wins.
 *
 * Applied in lib/api.ts as a React Query `select` — the cache keeps the raw
 * rows, and the admin pages ask for them raw.
 */
import productCopy from "@/data/product-descriptions.json";
import { brandProfile } from "@/lib/brands";
import type { Brand, Product } from "@/lib/api";

type Copy = { description: string; replaces?: string };
const products = productCopy as Record<string, Copy>;

/** Must match plain() in scripts/seo/config.mjs. */
const plain = (s?: string | null) =>
  (s ?? "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

/** True while the admin text is empty or still the text the copy replaces. */
export const copyApplies = (current: string | null | undefined, replaces?: string) => {
  const now = plain(current);
  return !now || (replaces !== undefined && now === plain(replaces));
};

export function withBrandCopy<T extends Brand>(brand: T): T {
  const p = brandProfile(brand.slug);
  const description = p.summary && copyApplies(brand.description, p.replaces) ? p.summary : brand.description;
  const origin = brand.origin?.trim() || p.origin || brand.origin;
  const established = brand.established ?? p.established ?? null;
  if (description === brand.description && origin === brand.origin && established === brand.established) return brand;
  return { ...brand, description, origin, established };
}

export function withProductCopy<T extends Product>(product: T): T {
  const c = products[product.slug];
  const description = c && copyApplies(product.description, c.replaces) ? c.description : product.description;
  const brands = product.brands ? withBrandCopy(product.brands) : product.brands;
  if (description === product.description && brands === product.brands) return product;
  return { ...product, description, brands };
}

export const selectBrands = (rows: Brand[]) => rows.map(withBrandCopy);
export const selectProducts = (rows: Product[]) => rows.map(withProductCopy);
