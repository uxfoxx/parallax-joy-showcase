// Bing Webmaster Tools API (API key). Bing search results also feed ChatGPT
// search and Copilot, so this is the closest thing to "AI search" numbers.
const BASE = "https://ssl.bing.com/webmaster/api.svc/json";

// Bing dates look like "/Date(1760918400000-0700)/".
const date = (v) => {
  const ms = Number(/\/Date\((-?\d+)/.exec(v ?? "")?.[1]);
  return Number.isFinite(ms) ? new Date(ms).toISOString().slice(0, 10) : null;
};

async function call(method, key, site) {
  const res = await fetch(`${BASE}/${method}?siteUrl=${encodeURIComponent(site)}&apikey=${key}`);
  const text = await res.text();
  if (!res.ok) throw new Error(`Bing ${method} ${res.status}: ${text.replace(/apikey=\w+/g, "").slice(0, 160)}`);
  return JSON.parse(text).d ?? [];
}

export async function bingReport(key, site) {
  const [traffic, queries, pages, crawl] = await Promise.all([
    call("GetRankAndTrafficStats", key, site),
    call("GetQueryStats", key, site),
    call("GetPageStats", key, site),
    call("GetCrawlStats", key, site),
  ]);
  const top = (rows) =>
    rows
      .map((r) => ({ name: r.Query, clicks: Number(r.Clicks ?? 0), impressions: Number(r.Impressions ?? 0), position: Number(r.AvgImpressionPosition ?? 0) }))
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 25);
  return {
    daily: traffic
      .map((r) => ({ date: date(r.Date), clicks: Number(r.Clicks ?? 0), impressions: Number(r.Impressions ?? 0) }))
      .filter((r) => r.date)
      .sort((a, b) => a.date.localeCompare(b.date)),
    queries: top(queries),
    pages: top(pages),
    crawl: crawl
      .map((r) => ({
        date: date(r.Date),
        crawled: Number(r.CrawledPages ?? 0),
        errors: Number(r.CrawlErrors ?? 0),
        inIndex: Number(r.InIndex ?? 0),
        inLinks: Number(r.InLinks ?? 0),
      }))
      .filter((r) => r.date)
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}
