/**
 * Product-page facts derived from data we already hold, for the specs list,
 * the answer-first summary and Product structured data. Nothing is invented:
 * pack size comes from the product name, storage only from a Frozen category.
 */
import type { Faq } from "@/lib/categories";
import { ORDER_ANSWER, isHouseBrand } from "@/lib/brands";

const UNITS: Record<string, string> = {
  kg: "kg", gr: "g", gm: "g", g: "g", ml: "ml", ltr: "L", l: "L", gal: "gal", oz: "oz", cm: "cm", mm: "mm",
};

/**
 * Pack size / size from the product name: "Basmati Rice 20Kg" → "20 kg",
 * "Albertos Flour Tortilla Wraps 10" 6'S" → "10 in · 6 per pack",
 * "Paper Cup 12 Oz White Hd 50'S" → "12 oz · 50 per pack". Percentages
 * ("Edam Cheese 40%") are fat/fruit content, not size, and are ignored.
 */
export const packSize = (name: string): string | null => {
  const parts: string[] = [];
  const measure = name.match(/(\d+(?:\.\d+)?)\s?(kg|gr|gm|g|ml|ltr|l|gal|oz|cm|mm)\b/i);
  if (measure) parts.push(`${measure[1]} ${UNITS[measure[2].toLowerCase()]}`);
  const inches = name.match(/(\d+(?:\.\d+)?)\s?"/);
  if (inches) parts.push(`${inches[1]} in`);
  const count = name.match(/(\d+)\s?'s\b/i);
  if (count) parts.push(`${count[1]} per pack`);
  return parts.length ? parts.join(" · ") : null;
};

/** Size, count and percentage tokens in a name — what tells variants apart. */
const VARIANT_TOKEN = /\s*(?:\d+(?:\.\d+)?\s?(?:kg|gr|gm|g|ml|ltr|l|gal|oz|cm|mm)\b|\d+(?:\.\d+)?\s?"|\d+\s?'s\b|\d+(?:\.\d+)?\s?%)/gi;

/** "Basmati Rice 20Kg" → "Basmati Rice" — the name shared by all its variants. */
export const variantGroupName = (name: string) => name.replace(VARIANT_TOKEN, " ").replace(/\s+/g, " ").trim();

/** What tells this variant apart, for display: "20 kg", "128 per pack", "50%". */
export const variantLabel = (name: string): string | null =>
  packSize(name) ?? ((name.match(VARIANT_TOKEN) ?? []).map((t) => t.trim()).join(" ") || null);

/**
 * Other versions of the same product — same brand, same name once sizes,
 * counts and percentages are removed ("Apple Pie Filling 50%" / "… 70%",
 * "Basmati Rice 5Kg" / "… 20Kg"). Their pages are near-identical, so they are
 * cross-linked and declared as one ProductGroup; otherwise Google tends to
 * treat one as a duplicate of the other ("Google chose different canonical").
 */
export const variantsOf = <T extends { id: string; name: string; brand_id: string | null }>(product: T, all: T[]): T[] => {
  const label = variantLabel(product.name);
  if (!label) return [];
  const group = variantGroupName(product.name).toLowerCase();
  return all.filter((p) => {
    // Both must name a size/percentage: "Honey" vs "Honey 1Kg" may be the same
    // jar, and the grouping has to read the same from either page.
    const other = variantLabel(p.name);
    return (
      p.id !== product.id &&
      p.brand_id === product.brand_id &&
      variantGroupName(p.name).toLowerCase() === group &&
      !!other &&
      other !== label
    );
  });
};

/** Storage — stated only where certain: products in a Frozen category. */
export const storageFor = (categories: string[]): string | null =>
  categories.some((c) => /frozen/i.test(c)) ? "Frozen — cold chain at −18 °C" : null;

export const productFaqs = (name: string, brandName: string): Faq[] => {
  const own = !brandName || isHouseBrand(brandName);
  return [
    {
      q: `Is ${name} available in Sri Lanka?`,
      a: own
        ? `Yes. Olive Foods supplies ${name} to hotels, restaurants, cafés and retailers across Sri Lanka from its Colombo warehouse.`
        : `Yes. Olive Foods imports ${name} by ${brandName} and supplies it to hotels, restaurants, cafés and retailers across Sri Lanka.`,
    },
    { q: `How can I buy ${name} wholesale in Sri Lanka?`, a: ORDER_ANSWER },
  ];
};

/**
 * Catalogue search shared by the navbar menu and /products?q=: a product
 * matches when every word of the query appears in its name, brand, category,
 * tags or SKU (so "mae ploy curry" finds Mae Ploy's curry pastes).
 */
export const searchProducts = <
  T extends { name: string; sku?: string | null; category?: string | null; categories?: string[] | null; tags?: string[] | null; brands?: { name: string } | null },
>(
  products: T[],
  query: string,
): T[] => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return products;
  return products.filter((p) => {
    const hay = [p.name, p.brands?.name, p.sku, p.category, ...(p.categories ?? []), ...(p.tags ?? [])].filter(Boolean).join(" ").toLowerCase();
    return words.every((w) => hay.includes(w));
  });
};
