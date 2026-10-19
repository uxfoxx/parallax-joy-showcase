/**
 * Buying guides (/guides, /guides/:slug) — informational articles that answer
 * the questions trade buyers and AI assistants ask ("how do hotels buy frozen
 * food", "which pasta for which sauce"), each tied to the brand, category and
 * product pages it mentions.
 *
 * Published guides live in src/data/guides.json. Drafts are written and
 * reviewed in content/drafts/guides.json and copied across once approved —
 * with an empty list, /guides is a 404 and nothing reaches the sitemap.
 */
import data from "@/data/guides.json";
import type { Faq } from "@/lib/categories";

export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  /** Bulleted list. */
  items?: string[];
  /** Numbered list — only for a real sequence. */
  steps?: string[];
  table?: { head: string[]; rows: string[][] };
};

export type Guide = {
  slug: string;
  /** H1 and Article headline. */
  title: string;
  /** <title> (the brand is appended by the page). */
  seoTitle: string;
  description: string;
  /** Answer-first opening paragraph — the passage search and AI engines quote. */
  summary: string;
  sections: GuideSection[];
  faqs: Faq[];
  links: { brands: string[]; categories: string[]; products: string[]; sectors: string[] };
  /** ISO dates. */
  published: string;
  updated?: string;
};

export const GUIDES = data as Guide[];
export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);

/** Guides that mention a category (by name) or a brand (by slug). */
export const guidesFor = ({ category, brand }: { category?: string; brand?: string }) =>
  GUIDES.filter((g) => (category && g.links.categories.includes(category)) || (brand && g.links.brands.includes(brand)));
