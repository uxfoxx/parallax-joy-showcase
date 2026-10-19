/**
 * Post-deploy audit of what search engines actually receive from the live
 * site. Reads robots.txt, the sitemap index and every child sitemap, then
 * fetches every listed URL and checks that it:
 *   - answers 200 directly (no redirect),
 *   - declares itself as canonical,
 *   - is not noindexed and has a <title>.
 * Also checks that the redirect stubs in /sitemap-state.json send old URLs to
 * their new address, and that trailing-slash URLs 301 to the clean URL.
 *
 *   npm run seo:check      (exits 1 if anything is wrong)
 */
import { SITE, STATE_PATH } from "./config.mjs";

const CONCURRENCY = 8;
const UA = "OliveFoods-SEO-Check/1.0 (+https://www.olivefoods.lk)";
const problems = [];

const get = async (url) => {
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": UA }, signal: AbortSignal.timeout(30000) });
  return { status: res.status, location: res.headers.get("location"), type: res.headers.get("content-type") ?? "", body: await res.text() };
};
const unxml = (s) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i")) ?? [])[1] ?? null;
const headOf = (html) => html.slice(0, Math.max(0, html.search(/<\/head>/i)) || html.length);

async function pool(items, fn) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (i < items.length) await fn(items[i++]);
    }),
  );
}

// robots.txt
const robots = await get(`${SITE}/robots.txt`);
if (robots.status !== 200 || !robots.body.includes(`Sitemap: ${SITE}/sitemap.xml`))
  problems.push(`robots.txt: HTTP ${robots.status}, sitemap line ${robots.body.includes("Sitemap:") ? "wrong" : "missing"}`);

// Sitemap index → children → URLs
const index = await get(`${SITE}/sitemap.xml`);
if (index.status !== 200 || !index.body.includes("<sitemapindex")) {
  console.error(`[seo:check] ✗ /sitemap.xml: HTTP ${index.status}, not a sitemap index`);
  process.exit(1);
}
const childUrls = [...index.body.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)].map((m) => unxml(m[1]));
const urls = [];
let images = 0;
for (const child of childUrls) {
  const res = await get(child);
  if (res.status !== 200 || !res.body.includes("<urlset")) {
    problems.push(`${child}: HTTP ${res.status}, not a urlset`);
    continue;
  }
  urls.push(...[...res.body.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((m) => unxml(m[1])));
  images += (res.body.match(/<image:loc>/g) ?? []).length;
}

let ok = 0;
await pool(urls, async (url) => {
  try {
    const res = await get(url);
    if (res.status !== 200) return problems.push(`${url}: HTTP ${res.status}${res.location ? ` → ${res.location}` : ""}`);
    const head = headOf(res.body);
    const canonicalTag = (head.match(/<link\b[^>]*>/gi) ?? []).find((l) => /\srel="canonical"/i.test(l));
    const canonical = canonicalTag ? unxml(attr(canonicalTag, "href") ?? "") : null;
    // Every robots/googlebot tag counts — engines apply the most restrictive.
    const robotsTags = (head.match(/<meta\b[^>]*>/gi) ?? []).filter((m) => /\sname="(robots|googlebot)"/i.test(m));
    if (canonical !== url) return problems.push(`${url}: canonical ${canonical ?? "missing"}`);
    if (robotsTags.some((m) => /noindex/i.test(attr(m, "content") ?? ""))) return problems.push(`${url}: noindex`);
    if (robotsTags.length > 1) problems.push(`${url}: ${robotsTags.length} robots tags (should be one)`);
    if (!/<title[^>]*>[^<]+<\/title>/i.test(head)) return problems.push(`${url}: no <title>`);
    ok++;
  } catch (e) {
    problems.push(`${url}: ${e.message}`);
  }
});

// Redirect stubs for renamed slugs
let redirects = {};
try {
  const state = await get(`${SITE}${STATE_PATH}`);
  if (state.type.includes("json")) redirects = JSON.parse(state.body).redirects ?? {};
} catch { /* no state yet */ }
await pool(Object.entries(redirects), async ([from, to]) => {
  const res = await get(SITE + from);
  if (!res.body.includes(`url=${SITE}${to}`)) problems.push(`redirect ${from} → ${to}: stub missing (HTTP ${res.status})`);
});

// One address per page: /x/ must 301 to /x
const sample = urls.find((u) => new URL(u).pathname.length > 1);
if (sample) {
  const res = await get(`${sample}/`);
  if (res.status !== 301 || res.location !== sample)
    problems.push(`trailing slash: ${sample}/ → HTTP ${res.status} ${res.location ?? ""} (expected 301 → ${sample})`);
}

// The other cases Search Console reports on: what a crawler gets for a URL
// that isn't a page, for the SPA shell and the homepage file, and for every
// non-canonical origin (one hop to https://www, never a chain).
const expectations = [
  ["unknown URL (Soft 404 if 200)", `${SITE}/this-page-does-not-exist-${Date.now()}`, 404],
  ["SPA shell", `${SITE}/200.html`, 404],
  ["dotfile", `${SITE}/.env`, 404],
  ["homepage file", `${SITE}/index.html`, 301, `${SITE}/`],
  ["http://www", "http://www.olivefoods.lk/about", 301, `${SITE}/about`],
  ["bare domain", "https://olivefoods.lk/about", 301, `${SITE}/about`],
  ["http:// bare domain", "http://olivefoods.lk/about", 301, `${SITE}/about`],
];
await pool(expectations, async ([label, url, status, location]) => {
  try {
    const res = await get(url);
    if (res.status !== status || (location && res.location !== location))
      problems.push(`${label}: ${url} → HTTP ${res.status}${res.location ? ` ${res.location}` : ""} (expected ${status}${location ? ` → ${location}` : ""})`);
  } catch (e) {
    const bare = new URL(url).hostname === "olivefoods.lk";
    problems.push(`${label}: ${url} → ${e.message}${bare ? " (the bare domain still has a dead A record at nic.lk — Search Console reports this as a server error)" : ""}`);
  }
});

console.log(
  `[seo:check] ${ok}/${urls.length} URLs OK across ${childUrls.length} sitemaps, ${images} images, ${Object.keys(redirects).length} redirects`,
);
if (problems.length) {
  console.warn(`[seo:check] ${problems.length} problem(s):`);
  for (const p of problems.slice(0, 40)) console.warn(`  - ${p}`);
  if (problems.length > 40) console.warn(`  … and ${problems.length - 40} more`);
  process.exitCode = 1;
}
