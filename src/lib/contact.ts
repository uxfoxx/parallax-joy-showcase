/**
 * Shared contact details + enquiry links, so every "Request a quote",
 * WhatsApp and call button across the site points at the same place.
 */
import { SITE_URL } from "@/components/Seo";

export const PHONE_DISPLAY = "+94 11 207 1717";
export const PHONE_TEL = "tel:+94112071717";
export const WHATSAPP_NUMBER = "94112071717";

/** What a visitor is enquiring about: one product, a whole category, or
 *  supply for a buyer sector (hotels, restaurants…). */
export type EnquiryTarget =
  | { kind: "product"; name: string; sku?: string | null; path?: string }
  | { kind: "category"; name: string; path?: string }
  | { kind: "sector"; name: string; path?: string }
  | { kind: "brand"; name: string; path?: string };

/** wa.me link with a prefilled message. */
export const whatsappHref = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

/** Prefilled WhatsApp message for an enquiry target. Uses the canonical
 *  SITE_URL (not window.location) so prerendered HTML never bakes in a
 *  localhost URL. */
export const whatsappMessage = (t?: EnquiryTarget) => {
  if (!t) return "Hi Olive Foods, I'd like to ask about your products and services.";
  const url = t.path ? ` (${SITE_URL}${t.path})` : "";
  if (t.kind === "product") return `Hi Olive Foods, I'd like a quote for ${t.name}${t.sku ? ` (SKU ${t.sku})` : ""}${url}.`;
  if (t.kind === "sector") return `Hi Olive Foods, I'm interested in supply for ${t.name.toLowerCase()}${url}.`;
  if (t.kind === "brand") return `Hi Olive Foods, I'd like to order ${t.name} products${url}.`;
  return `Hi Olive Foods, I'm looking to source ${t.name} products${url}.`;
};

/** /contact link that opens the form prefilled for this enquiry. */
export const quoteHref = (t: EnquiryTarget) => {
  const params =
    t.kind === "product"
      ? { subject: "Request a Quote", product: t.name, ...(t.sku ? { sku: t.sku } : {}) }
      : t.kind === "sector"
        ? { subject: "Request a Quote", sector: t.name }
        : t.kind === "brand"
          ? { subject: "Brand Inquiry", brand: t.name }
          : { subject: "Sourcing Request", category: t.name };
  return `/contact?${new URLSearchParams(params).toString()}`;
};
