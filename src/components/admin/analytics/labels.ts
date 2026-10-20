import type { Inspection } from "@/lib/insights";

export const LEAD_LABELS: Record<string, string> = {
  generate_lead: "Quote / contact form sent",
  request_quote: "“Request a quote” clicks",
  sourcing_request: "Sourcing request clicks",
  whatsapp_click: "WhatsApp taps",
  phone_click: "Phone taps",
  email_click: "Email taps",
};

export const isIndexed = (r: Inspection) => r.verdict === "PASS" || (/indexed/i.test(r.coverage) && !/not indexed/i.test(r.coverage));

/** Coverage state → tone and a plain-English explanation. */
export function coverageTone(r: Inspection): { tone: "good" | "warn" | "bad" | "neutral"; hint: string } {
  const c = r.coverage.toLowerCase();
  if (isIndexed(r)) return { tone: "good", hint: "In Google's index and can appear in results." };
  if (c.includes("crawled") && c.includes("not indexed"))
    return { tone: "warn", hint: "Google fetched it but chose not to index it yet — usually thin or very similar content. More unique text and internal links help." };
  if (c.includes("discovered")) return { tone: "warn", hint: "Google knows the URL but hasn't crawled it yet. New pages often sit here for days to weeks." };
  if (c.includes("unknown")) return { tone: "neutral", hint: "Google hasn't seen this URL yet. The sitemap and IndexNow will bring it in." };
  if (c.includes("noindex") || c.includes("redirect") || c.includes("404") || c.includes("duplicate") || c.includes("blocked"))
    return { tone: "bad", hint: "Excluded from the index — check the page." };
  return { tone: r.verdict === "FAIL" ? "bad" : "neutral", hint: r.coverage };
}
