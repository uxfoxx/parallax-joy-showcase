// PageSpeed Insights: Lighthouse lab scores plus Chrome's real-visitor (CrUX)
// field data, for the homepage on mobile and desktop, once a day. Called with
// the service account's token so it uses this project's own quota (the shared
// keyless quota is often exhausted). Field data appears only once Chrome has
// enough real visits to the site.
import { accessToken } from "../lib/google.mjs";

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

const FIELD = {
  LARGEST_CONTENTFUL_PAINT_MS: "lcp",
  INTERACTION_TO_NEXT_PAINT: "inp",
  CUMULATIVE_LAYOUT_SHIFT_SCORE: "cls",
  FIRST_CONTENTFUL_PAINT_MS: "fcp",
  EXPERIMENTAL_TIME_TO_FIRST_BYTE: "ttfb",
};

function field(exp) {
  if (!exp?.metrics) return null;
  const out = { overall: exp.overall_category ?? null };
  for (const [k, name] of Object.entries(FIELD)) {
    const m = exp.metrics[k];
    if (m) out[name] = { p75: name === "cls" ? m.percentile / 100 : m.percentile, category: m.category };
  }
  return out;
}

async function run(url, strategy) {
  const params = new URLSearchParams({ url, strategy });
  for (const c of ["performance", "accessibility", "best-practices", "seo"]) params.append("category", c);
  const res = await fetch(`${ENDPOINT}?${params}`, { headers: { authorization: `Bearer ${await accessToken()}` } });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || `PageSpeed HTTP ${res.status}`);
  const cats = json.lighthouseResult?.categories ?? {};
  const audit = (id) => json.lighthouseResult?.audits?.[id]?.displayValue ?? null;
  return {
    strategy,
    scores: Object.fromEntries(Object.entries(cats).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)])),
    lab: { fcp: audit("first-contentful-paint"), lcp: audit("largest-contentful-paint"), tbt: audit("total-blocking-time"), cls: audit("cumulative-layout-shift"), si: audit("speed-index") },
    page: field(json.loadingExperience),
    origin: field(json.originLoadingExperience),
  };
}

export async function speedReport(url) {
  // Sequential: PSI throttles keyless bursts.
  const mobile = await run(url, "mobile");
  const desktop = await run(url, "desktop");
  return { url, mobile, desktop };
}
