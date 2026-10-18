/**
 * SEO build step 3 (after the prerender): build the sitemaps from the
 * collected routes and the prerendered pages, and keep them honest.
 *
 *  - Honest <lastmod>. Every prerendered page is fingerprinted (title,
 *    description, canonical, robots, JSON-LD and main text, minus the nav and
 *    footer chrome) and compared with the fingerprints of the LIVE site, which
 *    each deploy publishes at /sitemap-state.json. A page keeps its previous
 *    date unless its content really changed. Google stops trusting lastmod
 *    that moves on every deploy, so this is what makes it count.
 *  - A sitemap index (/sitemap.xml) with one child sitemap per page kind, so
 *    Search Console reports indexing per kind. Children split at 45,000 URLs.
 *  - Image entries: product photos (main + gallery), brand logos, the
 *    homepage hero.
 *  - Only indexable URLs. A page whose prerendered canonical points elsewhere,
 *    or that says noindex, is left out and reported.
 *  - Renamed slugs keep working. The state remembers each page's database id;
 *    when a product, brand or category comes back under a new slug, its old
 *    address gets a redirect stub (instant meta refresh + canonical, which
 *    Google treats as a permanent redirect). Redirects are carried forward
 *    from build to build, and chains are collapsed.
 *  - Writes the new/changed/removed URLs for IndexNow (scripts/seo/indexnow.mjs).
 *  - Warns when src/App.tsx declares a public route the sitemap doesn't cover.
 *
 * Env: SEO_PREV_STATE=<file path | URL | none>  where to read the previous
 *        state from (default: the live site)
 *      SEO_STRICT=1  exit non-zero if there are errors
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import {
  ROOT, SITE, DIST, ROUTES_FILE, INDEXNOW_FILE, STATE_PATH, STATIC_PAGES, ROUTE_PATTERNS,
  EXCLUDED_ROUTES, SITEMAP_GROUPS, ensureDir, xml, absUrl, distFileFor, w3cNow, CACHE,
} from "./config.mjs";

const MAX_URLS_PER_SITEMAP = 45000; // protocol limit: 50,000 URLs / 50 MB per file
const MAX_IMAGES_PER_URL = 1000; // Google's limit
const FILE_NAMES = { page: "pages", sector: "sectors", category: "categories", product: "products", brand: "brands" };
const EXPECTED_SCHEMA = { product: "Product", brand: "Brand", category: "CollectionPage", sector: "Service" };
const NOW = w3cNow();
const errors = [];
const warnings = [];

const isoDate = (s) => {
  const d = s ? new Date(s) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toISOString().replace(/\.\d{3}Z$/, "+00:00") : null;
};
const safePath = (p) => typeof p === "string" && /^\/[\w\-/]*$/.test(p) && !p.includes("..");

// ─── Previous state (what's live) ───
async function loadPreviousState() {
  const src = process.env.SEO_PREV_STATE;
  if (src === "none") return null;
  try {
    let state;
    if (src && !/^https?:\/\//.test(src)) state = JSON.parse(readFileSync(src, "utf8"));
    else {
      const res = await fetch(src || `${SITE}${STATE_PATH}`, { signal: AbortSignal.timeout(10000) });
      if (!res.ok || !(res.headers.get("content-type") ?? "").includes("json")) return null;
      state = await res.json();
    }
    return state?.version === 1 && state.pages && typeof state.pages === "object" ? state : null;
  } catch {
    return null;
  }
}

// ─── Reading a prerendered page ───
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
  return m ? decode(m[1]) : null;
};

function analyse(html) {
  const headEnd = html.search(/<\/head>/i);
  const head = headEnd > 0 ? html.slice(0, headEnd) : html;
  const metas = head.match(/<meta\b[^>]*>/gi) ?? [];
  const meta = (name) => {
    const tag = metas.find((m) => attr(m, "name")?.toLowerCase() === name);
    return tag ? attr(tag, "content") : null;
  };
  // Every robots/googlebot tag counts: search engines apply the most
  // restrictive one, so a single "noindex" anywhere makes the page noindex.
  const robots = metas
    .filter((m) => ["robots", "googlebot"].includes(attr(m, "name")?.toLowerCase()))
    .map((m) => attr(m, "content") ?? "")
    .join(", ")
    .toLowerCase();
  const canonicalTag = (head.match(/<link\b[^>]*>/gi) ?? []).find((l) => attr(l, "rel")?.toLowerCase() === "canonical");
  const jsonld = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1].trim());
  const types = new Set();
  let invalidJsonLd = 0;
  for (const block of jsonld) {
    try {
      for (const node of [].concat(JSON.parse(block))) for (const t of [].concat(node?.["@type"] ?? [])) types.add(t);
    } catch {
      invalidJsonLd++;
    }
  }
  // Main text for the fingerprint: drop code, icons and the nav/footer chrome
  // (a footer tweak must not "change" every page), and digits — count-up
  // animations are captured mid-count, so numbers vary between renders.
  let body = (html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i) ?? [])[1] ?? "";
  body = body
    .replace(/<(script|style|svg|noscript|template)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<(nav|footer)\b[\s\S]*?<\/\1>/gi, " ");
  const text = decode(body.replace(/<[^>]+>/g, " ")).replace(/\d+/g, "#").replace(/\s+/g, " ").trim();
  return {
    title: decode((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) ?? [])[1] ?? "").trim(),
    description: meta("description"),
    robots,
    canonical: canonicalTag ? attr(canonicalTag, "href") : null,
    jsonld,
    types,
    invalidJsonLd,
    text,
  };
}
const fingerprint = (a) =>
  createHash("sha256")
    .update(JSON.stringify([a.title, a.description, a.canonical, a.robots, a.jsonld, a.text]))
    .digest("hex")
    .slice(0, 20);

// ─── Main ───
const { routes } = JSON.parse(readFileSync(ROUTES_FILE, "utf8"));
const prev = await loadPreviousState();
const prevPages = prev?.pages ?? {};
const heroAsset = (() => {
  try {
    return readdirSync(resolve(DIST, "assets")).find((f) => /^hero-spread-wide-.*\.webp$/.test(f)) ?? null;
  } catch {
    return null;
  }
})();

const included = [];
const statePages = {};
const titles = new Map();
const stats = { baseline: 0, new: 0, changed: 0, unchanged: 0, unrendered: 0 };
const changedLocs = [];

for (const r of routes) {
  const url = SITE + r.loc;
  const file = distFileFor(r.loc);
  const p = prevPages[r.loc];
  const idPart = r.id != null ? { id: r.id } : {};

  if (!existsSync(file)) {
    // The app still serves it (SPA fallback) — keep it listed, keep its date.
    warnings.push(`${r.loc}: not prerendered — listed anyway, lastmod kept`);
    const lastmod = p?.lastmod ?? isoDate(r.seed) ?? NOW;
    statePages[r.loc] = { ...(p ?? {}), kind: r.kind, ...idPart, lastmod };
    included.push({ r, lastmod });
    stats.unrendered++;
    continue;
  }

  const a = analyse(readFileSync(file, "utf8"));
  if (a.canonical !== url) {
    errors.push(`${r.loc}: canonical is ${a.canonical ?? "missing"} — left out of the sitemap`);
    continue;
  }
  if (/\bnoindex\b/.test(a.robots)) {
    errors.push(`${r.loc}: page is noindex — left out of the sitemap`);
    continue;
  }
  if (!a.title) warnings.push(`${r.loc}: no <title>`);
  if (!a.description) warnings.push(`${r.loc}: no meta description`);
  if (a.invalidJsonLd) errors.push(`${r.loc}: ${a.invalidJsonLd} JSON-LD block(s) are not valid JSON`);
  const expected = EXPECTED_SCHEMA[r.kind];
  if (expected && !a.types.has(expected)) warnings.push(`${r.loc}: no ${expected} structured data`);
  if (a.title) (titles.get(a.title) ?? titles.set(a.title, []).get(a.title)).push(r.loc);

  const hash = fingerprint(a);
  let status;
  let lastmod;
  if (!prev) [status, lastmod] = ["baseline", NOW];
  else if (!p) [status, lastmod] = ["new", NOW];
  else if (p.hash === hash) [status, lastmod] = ["unchanged", p.lastmod];
  else [status, lastmod] = ["changed", NOW];
  stats[status]++;
  if (status !== "unchanged") changedLocs.push(r.loc);
  statePages[r.loc] = { hash, lastmod, kind: r.kind, ...idPart };
  included.push({ r, lastmod });
}

for (const [title, locs] of titles)
  if (locs.length > 1)
    warnings.push(`duplicate title "${title}" on ${locs.length} pages: ${locs.slice(0, 4).join(", ")}${locs.length > 4 ? " …" : ""}`);

// ─── Redirects for renamed slugs ───
const current = new Set(routes.map((r) => r.loc));
const byId = new Map(routes.filter((r) => r.id != null).map((r) => [`${r.kind}:${r.id}`, r.loc]));
const prevRedirects = prev?.redirects ?? {};
const redirects = { ...prevRedirects };
for (const [loc, p] of Object.entries(prevPages)) {
  if (current.has(loc) || p?.id == null || !p.kind) continue;
  const moved = byId.get(`${p.kind}:${p.id}`);
  if (moved && moved !== loc) redirects[loc] = moved;
}
const finalTarget = (to, hops = 0) =>
  current.has(to) ? to : redirects[to] && hops < 10 ? finalTarget(redirects[to], hops + 1) : null;
for (const from of Object.keys(redirects)) {
  const to = finalTarget(redirects[from]);
  if (current.has(from) || !to || !safePath(from) || !safePath(to)) delete redirects[from];
  else redirects[from] = to;
}
let stubs = 0;
for (const [from, to] of Object.entries(redirects)) {
  const file = distFileFor(from);
  if (existsSync(file)) {
    warnings.push(`redirect ${from} → ${to} skipped: a page already exists at ${from}`);
    continue;
  }
  const target = xml(SITE + to);
  ensureDir(dirname(file));
  writeFileSync(
    file,
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Moved | Olive Foods</title>
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0; url=${target}">
</head>
<body>
<p>This page has moved to <a href="${target}">${target}</a>.</p>
<script>location.replace(${JSON.stringify(SITE + to)})</script>
</body>
</html>
`,
  );
  stubs++;
}

// ─── Sitemaps ───
const imagesFor = (r) => {
  const urls = (r.images ?? []).map((i) => absUrl(i.loc));
  if (r.loc === "/" && heroAsset) urls.push(`${SITE}/assets/${heroAsset}`);
  return [...new Set(urls.filter(Boolean))].slice(0, MAX_IMAGES_PER_URL);
};
let imageCount = 0;
const urlEntry = ({ r, lastmod }) => {
  const images = imagesFor(r);
  imageCount += images.length;
  // Language alternates (hreflang) — none today; supported for a future
  // Sinhala/Tamil version: give a route `alternates: [{ hreflang, href }]`.
  const alternates = (r.alternates ?? [])
    .map((alt) => [alt.hreflang, absUrl(alt.href)])
    .filter(([lang, href]) => lang && href)
    .map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${xml(lang)}" href="${xml(href)}"/>`);
  return [
    "  <url>",
    `    <loc>${xml(SITE + r.loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    ...alternates,
    ...images.map((src) => `    <image:image><image:loc>${xml(src)}</image:loc></image:image>`),
    "  </url>",
  ].join("\n");
};

const groups = new Map(SITEMAP_GROUPS.map((g) => [g, []]));
for (const entry of included) {
  if (!groups.has(entry.r.kind)) groups.set(entry.r.kind, []);
  groups.get(entry.r.kind).push(entry);
}
const latest = (entries) =>
  entries.reduce((max, e) => (new Date(e.lastmod) > new Date(max) ? e.lastmod : max), entries[0].lastmod);

const children = [];
for (const [kind, entries] of groups) {
  if (!entries.length) continue;
  const base = FILE_NAMES[kind] ?? `${kind}s`;
  const chunks = [];
  for (let i = 0; i < entries.length; i += MAX_URLS_PER_SITEMAP) chunks.push(entries.slice(i, i + MAX_URLS_PER_SITEMAP));
  chunks.forEach((chunk, i) => {
    const name = chunks.length > 1 ? `sitemap-${base}-${i + 1}.xml` : `sitemap-${base}.xml`;
    const usesAlternates = chunk.some((e) => e.r.alternates?.length);
    const ns = [
      'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
      ...(usesAlternates ? ['xmlns:xhtml="http://www.w3.org/1999/xhtml"'] : []),
    ].join(" ");
    writeFileSync(
      resolve(DIST, name),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${ns}>\n${chunk.map(urlEntry).join("\n")}\n</urlset>\n`,
    );
    children.push({ name, lastmod: latest(chunk), count: chunk.length });
  });
}
writeFileSync(
  resolve(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${children.map((c) => `  <sitemap>\n    <loc>${SITE}/${c.name}</loc>\n    <lastmod>${c.lastmod}</lastmod>\n  </sitemap>`).join("\n")}
</sitemapindex>
`,
);

// ─── State for the next build, and the IndexNow list ───
writeFileSync(
  resolve(DIST, STATE_PATH.slice(1)),
  JSON.stringify({ version: 1, site: SITE, generatedAt: NOW, pages: statePages, redirects }, null, 1),
);
const removed = Object.keys(prevPages).filter((loc) => !current.has(loc));
const newRedirects = Object.keys(redirects).filter((from) => !prevRedirects[from]);
const indexnow = [...new Set([...changedLocs, ...removed, ...newRedirects])].map((loc) => SITE + loc);
ensureDir(CACHE);
writeFileSync(INDEXNOW_FILE, JSON.stringify({ generatedAt: NOW, urls: indexnow }, null, 2));

// ─── Coverage: every public app route must be in the sitemap or excluded ───
try {
  const app = readFileSync(resolve(ROOT, "src/App.tsx"), "utf8");
  const declared = [...app.matchAll(/<Route\b[^>]*\bpath="(\/[^"]*)"/g)].map((m) => m[1]);
  const covered = new Set([...STATIC_PAGES, ...Object.values(ROUTE_PATTERNS)]);
  for (const path of declared)
    if (!covered.has(path) && !(path in EXCLUDED_ROUTES))
      warnings.push(
        `app route ${path} is public but not in the sitemap — add it to scripts/seo/config.mjs (STATIC_PAGES / ROUTE_PATTERNS) or EXCLUDED_ROUTES`,
      );
  for (const [kind, pattern] of Object.entries(ROUTE_PATTERNS))
    if (!routes.some((r) => r.kind === kind)) warnings.push(`no ${kind} URLs collected for ${pattern} (data unavailable?)`);
} catch {
  warnings.push("could not read src/App.tsx for the route coverage check");
}
try {
  const robots = readFileSync(resolve(DIST, "robots.txt"), "utf8");
  if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) warnings.push("robots.txt does not point at the sitemap index");
} catch {
  warnings.push("no robots.txt in dist/");
}

// ─── Report ───
const list = (label, items) => {
  if (!items.length) return;
  console.warn(`[sitemap] ${items.length} ${label}:`);
  for (const i of items.slice(0, 25)) console.warn(`  - ${i}`);
  if (items.length > 25) console.warn(`  … and ${items.length - 25} more`);
};
console.log(
  `[sitemap] ${included.length} URLs in ${children.length} sitemaps (${children.map((c) => `${c.name} ${c.count}`).join(", ")}), ${imageCount} images`,
);
console.log(
  `[sitemap] lastmod vs ${prev ? "previous deploy" : "no previous state (baseline)"}: ` +
    Object.entries(stats).filter(([, n]) => n).map(([k, n]) => `${n} ${k}`).join(", "),
);
console.log(`[sitemap] redirects: ${Object.keys(redirects).length} (${stubs} stubs written); IndexNow queue: ${indexnow.length} URLs`);
list("error(s)", errors);
list("warning(s)", warnings);
if (errors.length && process.env.SEO_STRICT === "1") process.exitCode = 1;
