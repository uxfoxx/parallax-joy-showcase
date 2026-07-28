/**
 * Category helpers for the SEO category landing pages (/categories/:slug).
 *
 * Categories are stored as strings on products (the `categories` array column),
 * so there's no separate slug in the DB — we derive a stable slug from the name.
 * These pages are intentionally NOT linked from the site's main navigation; they
 * exist to rank for "[category] importer / distributor Sri Lanka" queries and are
 * discovered by crawlers via the sitemap + the /categories hub page.
 */

/** Stable, URL-safe slug for a category name. "Frozen Meat" -> "frozen-meat". */
export const categorySlug = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/** Resolve a slug back to its category name from a list of known categories. */
export const categoryFromSlug = (slug: string, categories: string[]): string | undefined =>
  categories.find((c) => categorySlug(c) === slug);

/** Per-category SEO copy, templated so every page reads naturally and targets
 *  the "[category] importer / distributor in Sri Lanka" intent. */
export const categorySeo = (name: string) => {
  const lower = name.toLowerCase();
  return {
    title: `${name} Importer & Distributor in Sri Lanka`,
    h1: `${name} in Sri Lanka`,
    description: `Olive Foods imports and distributes ${lower} across Sri Lanka, supplying hotels, restaurants, supermarkets and retailers island-wide from Colombo.`,
    intro: `Olive Foods is a trusted importer and distributor of ${lower} in Sri Lanka. We bring in quality ${lower} through our global supplier network and deliver island-wide from our Colombo base, with warehousing and cold-chain storage that keeps everything in top condition for the hospitality and retail trade.`,
  };
};
