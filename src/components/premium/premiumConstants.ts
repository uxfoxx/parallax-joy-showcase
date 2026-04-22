// WhatsApp deep-link templates for premium concierge flow
const WA_NUMBER = "94112071717";

export const waLink = (message: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

export const CATALOGUE_MSG =
  "Hi Olive Foods, I'd like to see your premium catalogue — pricing, availability, and delivery details.";

export const ENQUIRE_MSG =
  "Hi Olive Foods, I'm interested in your premium selection. Please share more information.";

export const productMsg = (name: string) =>
  `Hi Olive Foods, I'd like to enquire about "${name}" from your premium selection.`;

// Edit this headline when the season changes (Christmas, Ramadan, New Year, etc.)
export const SEASONAL_HEADLINE = "Seasonal Selection";
export const SEASONAL_SUBTITLE =
  "Curated imports for the current season — limited availability, concierge delivery.";

// Country → flag mapping inferred from product origin
const FLAG_MAP: Record<string, string> = {
  australia: "AU",
  italy: "IT",
  france: "FR",
  spain: "ES",
  "new zealand": "NZ",
  netherlands: "NL",
  denmark: "DK",
  germany: "DE",
  switzerland: "CH",
  japan: "JP",
  uk: "GB",
  "united kingdom": "GB",
  usa: "US",
  "united states": "US",
  canada: "CA",
  greece: "GR",
  belgium: "BE",
  norway: "NO",
};

export const originToFlag = (origin: string | null | undefined): string => {
  if (!origin) return "";
  const key = origin.toLowerCase().trim();
  return FLAG_MAP[key] ?? origin.slice(0, 2).toUpperCase();
};

export const PROVENANCE_COUNTRIES = [
  "Italy",
  "Australia",
  "France",
  "Spain",
  "New Zealand",
  "Netherlands",
  "Denmark",
  "Switzerland",
  "Japan",
];
