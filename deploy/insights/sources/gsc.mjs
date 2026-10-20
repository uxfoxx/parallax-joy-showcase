// Google Search Console: search performance, sitemaps, and per-page index
// status (URL Inspection API — 2,000 inspections a day per property; a full
// sweep of the sitemap is ~240, once a day).
import { google } from "../lib/google.mjs";

const enc = encodeURIComponent;
const day = (offset) => new Date(Date.now() - offset * 86_400_000).toISOString().slice(0, 10);

async function query(site, body) {
  const res = await google(`https://www.googleapis.com/webmasters/v3/sites/${enc(site)}/searchAnalytics/query`, {
    dataState: "all", // include the freshest (not yet final) days
    ...body,
  });
  return (res.rows ?? []).map((r) => ({
    keys: r.keys ?? [],
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));
}

export async function searchReport(site, days) {
  const end = day(0);
  const start = day(days - 1);
  const prevEnd = day(days);
  const prevStart = day(days * 2 - 1);
  const top = (dimension, rowLimit) => query(site, { startDate: start, endDate: end, dimensions: [dimension], rowLimit });

  const [daily, totals, previous, queries, pages, countries, devices] = await Promise.all([
    query(site, { startDate: start, endDate: end, dimensions: ["date"], rowLimit: 500 }),
    query(site, { startDate: start, endDate: end }),
    query(site, { startDate: prevStart, endDate: prevEnd }),
    top("query", 50),
    top("page", 50),
    top("country", 10),
    top("device", 5),
  ]);
  const strip = ({ keys, ...rest }) => ({ name: keys[0], ...rest });
  const sum = (r) => {
    const { keys, ...m } = r?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    return m;
  };
  return {
    days,
    totals: sum(totals),
    previous: sum(previous),
    // Today's row is only hours old and drags the chart's last point to ~0.
    daily: daily.map(({ keys: [date], ...m }) => ({ date, ...m })).filter((d) => d.date < end),
    queries: queries.map(strip),
    pages: pages.map(strip),
    countries: countries.map(strip),
    devices: devices.map(strip),
  };
}

export async function sitemaps(site) {
  const res = await google(`https://www.googleapis.com/webmasters/v3/sites/${enc(site)}/sitemaps`);
  return (res.sitemap ?? []).map((s) => ({
    path: s.path,
    isIndex: Boolean(s.isSitemapsIndex),
    lastSubmitted: s.lastSubmitted ?? null,
    lastDownloaded: s.lastDownloaded ?? null,
    pending: Boolean(s.isPending),
    errors: Number(s.errors ?? 0),
    warnings: Number(s.warnings ?? 0),
    submitted: (s.contents ?? []).reduce((n, c) => n + Number(c.submitted ?? 0), 0),
  }));
}

/** Every <loc> in the live sitemap index and its child sitemaps. */
export async function sitemapUrls(siteUrl) {
  const locs = async (url) => {
    const res = await fetch(url, { headers: { "user-agent": "olivefoods-insights" } });
    if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
    return [...(await res.text()).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  };
  const top = await locs(`${siteUrl}/sitemap.xml`);
  const children = top.filter((u) => u.endsWith(".xml"));
  if (!children.length) return top;
  return (await Promise.all(children.map(locs))).flat().filter((u) => !u.endsWith(".xml"));
}

export async function inspect(site, url) {
  const res = await google("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    inspectionUrl: url,
    siteUrl: site,
  });
  const r = res.inspectionResult?.indexStatusResult ?? {};
  return {
    url,
    verdict: r.verdict ?? "VERDICT_UNSPECIFIED",
    coverage: r.coverageState ?? "Unknown",
    lastCrawl: r.lastCrawlTime ?? null,
    fetch: r.pageFetchState ?? null,
    robots: r.robotsTxtState ?? null,
    indexing: r.indexingState ?? null,
    crawledAs: r.crawledAs ?? null,
    googleCanonical: r.googleCanonical ?? null,
    userCanonical: r.userCanonical ?? null,
    link: res.inspectionResult?.inspectionResultLink ?? null,
    checkedAt: new Date().toISOString(),
  };
}
