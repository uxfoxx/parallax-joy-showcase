/**
 * Shared contact details + enquiry links, so every "Request a quote",
 * WhatsApp and call button across the site points at the same place.
 *
 * Two lanes (decided with the client, 2026-10-23): business and bulk
 * enquiries go to the sales mobile (WhatsApp AND calls), everything else to
 * the office landline. A number is never shown without its lane's label —
 * render them through <ContactLanes> so the wording can't drift.
 */
import { SITE_URL } from "@/components/Seo";

export const PHONE_DISPLAY = "+94 11 207 1717";
export const PHONE_TEL = "tel:+94112071717";
/** WhatsApp is a mobile number, separate from the office landline above. */
export const WHATSAPP_NUMBER = "94773300700";
export const WHATSAPP_DISPLAY = "+94 77 330 0700";
/** The same mobile takes calls: the sales line for business and bulk orders. */
export const SALES_TEL = `tel:+${WHATSAPP_NUMBER}`;
export const SALES_DISPLAY = WHATSAPP_DISPLAY;
export const EMAIL = "info@olivefoods.lk";

export type Lane = "business" | "general";
/** Who each line is for — the labels every contact surface uses. */
export const LANES: Record<Lane, { label: string; who: string; display: string; tel: string }> = {
  business: {
    label: "Business and bulk orders",
    who: "Hotels, restaurants, cafés, caterers, shops and bulk buyers",
    display: SALES_DISPLAY,
    tel: SALES_TEL,
  },
  general: {
    label: "General enquiries",
    who: "Personal purchases, suppliers, careers and questions",
    display: PHONE_DISPLAY,
    tel: PHONE_TEL,
  },
};

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

/** Prefilled WhatsApp message for an enquiry target. WhatsApp is the
 *  business line, so every message ends with the two things sales needs to
 *  quote (the business and the quantities) for the sender to fill in. Uses
 *  the canonical SITE_URL (not window.location) so prerendered HTML never
 *  bakes in a localhost URL. */
export const whatsappMessage = (t?: EnquiryTarget) => {
  const ask = "\nBusiness name: \nProducts and quantities: ";
  if (!t) return `Hi Olive Foods, I'd like a quote for my business.${ask}`;
  const url = t.path ? ` (${SITE_URL}${t.path})` : "";
  if (t.kind === "product") return `Hi Olive Foods, I'd like a quote for ${t.name}${t.sku ? ` (SKU ${t.sku})` : ""}${url}.\nBusiness name: \nQuantity: `;
  if (t.kind === "sector") return `Hi Olive Foods, I'm interested in supply for ${t.name.toLowerCase()}${url}.${ask}`;
  if (t.kind === "brand") return `Hi Olive Foods, I'd like to order ${t.name} products${url}.${ask}`;
  return `Hi Olive Foods, I'm looking to source ${t.name} products${url}.${ask}`;
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
