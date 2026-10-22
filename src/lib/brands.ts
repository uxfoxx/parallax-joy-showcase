/**
 * Brand-page content helpers for the "[Brand] in Sri Lanka" pages.
 *
 * Long-form brand profiles live in src/data/brand-profiles.json, keyed by brand
 * slug — reviewed in pull requests (they can move to admin-editable columns
 * later). Wording is deliberately neutral: Olive Foods "imports and
 * distributes" a brand; no "official" or "exclusive" claims.
 */
import data from "@/data/brand-profiles.json";
import type { Faq } from "@/lib/categories";

export type BrandProfile = {
  /** Long-form profile, paragraphs separated by blank lines (plain text). */
  about?: string;
  /** The brand owner's official website (Brand schema sameAs). */
  website?: string;
  /** Genuine alternative spellings people search for (Brand alternateName). */
  aliases?: string[];
  /** Reviewed short description: stands in for the admin one (see lib/copy.ts). */
  summary?: string;
  /** The admin description `summary` was written to replace. */
  replaces?: string;
  /** Used only while the admin's Origin / Established fields are empty. */
  origin?: string;
  established?: number;
};

const profiles = data as Record<string, BrandProfile>;
export const brandProfile = (slug: string): BrandProfile => profiles[slug] ?? {};

/** The brand that lists Olive Foods' own range. */
export const isHouseBrand = (name: string) => name.trim().toLowerCase() === "olive foods";

/** "a", "a and b", "a, b and c". */
export const listOf = (items: string[]) =>
  items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : items[0] ?? "";

export const ORDER_ANSWER =
  "Request a quote on this page or contact the sales line for business and bulk orders, +94 77 330 0700 (WhatsApp or call), with the products and quantities you need; the team replies within one business day.";

export const brandFaqs = (name: string, productNames: string[]): Faq[] => {
  const n = productNames.length;
  const examples = listOf(productNames.slice(0, 3));
  if (isHouseBrand(name)) {
    return [
      {
        q: "What products does Olive Foods supply under its own name?",
        a: `Olive Foods supplies ${n} product${n === 1 ? "" : "s"} under its own name in Sri Lanka${examples ? `, including ${examples}` : ""}, delivered island-wide from Colombo.`,
      },
      { q: "How do I order these products wholesale?", a: ORDER_ANSWER },
    ];
  }
  return [
    {
      q: `Is ${name} available in Sri Lanka?`,
      a: `Yes. Olive Foods imports and distributes ${name} in Sri Lanka and supplies it to hotels, restaurants, cafés and retailers island-wide from Colombo.`,
    },
    {
      q: `Who distributes ${name} in Sri Lanka?`,
      a: `Olive Foods (Pvt) Ltd, 292 Sea Street, Colombo 11, imports and distributes ${name} products in Sri Lanka.`,
    },
    ...(n
      ? [
          {
            q: `Which ${name} products can I buy in Sri Lanka?`,
            a: `Olive Foods currently supplies ${n} ${name} product${n === 1 ? "" : "s"} in Sri Lanka${examples ? `, including ${examples}` : ""}.`,
          },
        ]
      : []),
    { q: `How do I order ${name} wholesale in Sri Lanka?`, a: ORDER_ANSWER },
  ];
};
