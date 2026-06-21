// Map a free-text origin (country name) to a flag emoji. Origins in the data
// are country names like "Italy", "Australia", "UAE" — plus the occasional
// region ("Alaska") that has no national flag. Returns 🌍 for anything we can't
// resolve so the caller always has something to show.

const NAME_TO_ISO2: Record<string, string> = {
  australia: "AU",
  austria: "AT",
  belgium: "BE",
  brazil: "BR",
  canada: "CA",
  china: "CN",
  denmark: "DK",
  egypt: "EG",
  finland: "FI",
  france: "FR",
  germany: "DE",
  greece: "GR",
  india: "IN",
  indonesia: "ID",
  iran: "IR",
  ireland: "IE",
  italy: "IT",
  japan: "JP",
  malaysia: "MY",
  mexico: "MX",
  netherlands: "NL",
  "new zealand": "NZ",
  norway: "NO",
  pakistan: "PK",
  philippines: "PH",
  poland: "PL",
  portugal: "PT",
  russia: "RU",
  "saudi arabia": "SA",
  singapore: "SG",
  "south africa": "ZA",
  "south korea": "KR",
  korea: "KR",
  spain: "ES",
  "sri lanka": "LK",
  sweden: "SE",
  switzerland: "CH",
  thailand: "TH",
  turkey: "TR",
  uae: "AE",
  "united arab emirates": "AE",
  uk: "GB",
  "united kingdom": "GB",
  "great britain": "GB",
  england: "GB",
  usa: "US",
  "united states": "US",
  "united states of america": "US",
  america: "US",
  vietnam: "VN",
};

/** ISO 3166-1 alpha-2 → regional-indicator flag emoji. */
const iso2ToFlag = (iso2: string): string =>
  iso2
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

/** Resolve an origin name to a flag emoji, or 🌍 when unknown. */
export const originToFlag = (origin?: string | null): string => {
  if (!origin) return "🌍";
  const iso = NAME_TO_ISO2[origin.trim().toLowerCase()];
  return iso ? iso2ToFlag(iso) : "🌍";
};

/** True when we recognised the origin as a country (vs. region/unknown). */
export const hasFlag = (origin?: string | null): boolean =>
  !!origin && origin.trim().toLowerCase() in NAME_TO_ISO2;
