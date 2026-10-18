/**
 * Buyer-sector landing pages (/supply/:slug) — "Hotel food supplier in Sri
 * Lanka", "Frozen food supplier in Sri Lanka", etc. The data lives in
 * src/data/sectors.json so the sitemap, prerender and llms.txt build scripts
 * read the exact same list. Like the category pages, these aren't linked from
 * the main nav: they're found via the sitemap, prerendered for crawlers and
 * AI engines, and cross-linked to each other and to their categories.
 */
import data from "@/data/sectors.json";
import { lowerCategory, type Faq } from "@/lib/categories";

export type Sector = {
  slug: string;
  /** Short display name: "Hotels". */
  name: string;
  /** Plural noun used in sentences: "hotels", "bakeries and cafés". */
  audience: string;
  /** Optional override for the first FAQ question (for product-range pages
   *  like frozen food, where "Who supplies <audience>…" reads awkwardly). */
  primaryQuestion?: string;
  /** Visible H1. */
  heading: string;
  /** <title> (the brand suffix is appended by <Seo>). */
  title: string;
  description: string;
  intro: string;
  needs: { title: string; body: string }[];
  /** Exact category names (must match the categories table). */
  categories: string[];
};

export const SECTORS = data as Sector[];

export const sectorBySlug = (slug: string) => SECTORS.find((s) => s.slug === slug);

/** Sector FAQs — shown on the page and emitted as FAQPage JSON-LD. Only
 *  restates claims the site already makes. */
export const sectorFaqs = (s: Sector, brands: string[]): Faq[] => {
  const faqs: Faq[] = [
    {
      q: s.primaryQuestion ?? `Who supplies ${s.audience} with imported food in Sri Lanka?`,
      a: `Olive Foods (Pvt) Ltd imports and distributes food for ${s.audience} across Sri Lanka, delivering island-wide from our warehouse in Colombo with cold-chain storage for frozen and chilled lines.`,
    },
    {
      q: `What does Olive Foods supply to ${s.audience}?`,
      a: `Our range for ${s.audience} covers ${s.categories.slice(0, 6).map(lowerCategory).join(", ")} and more${
        brands.length ? `, from brands including ${brands.slice(0, 6).join(", ")}` : ""
      }.`,
    },
    {
      q: `Do you deliver outside Colombo?`,
      a: `Yes. Olive Foods distributes island-wide across Sri Lanka from our Colombo base.`,
    },
    {
      q: `How do I open a trade account or get pricing?`,
      a: `Request a quote through our contact page or WhatsApp with the products and volumes you need, and our team will get back to you within one business day.`,
    },
  ];
  return faqs;
};
