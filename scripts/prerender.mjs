/**
 * Post-build prerender.
 *
 * The site is a client-rendered SPA, so crawlers and AI answer engines that
 * don't execute JS would otherwise see an empty shell. This step loads each
 * route in headless Chrome, lets React + react-helmet render, and writes the
 * finished HTML (with per-route <title>/description/canonical, full body
 * content and JSON-LD) to dist/<route>/index.html. nginx/sirv serve those
 * static files directly (try_files $uri $uri/index.html /200.html); the client
 * bundle still loads and takes over for interactivity.
 *
 * What gets prerendered: every route in .seo-cache/routes.json, written by
 * scripts/seo/collect-routes.mjs — the fixed pages plus EVERY sector,
 * category, product and brand page, straight from the live data.
 * Prerendering the detail pages is what lets a search for a single product
 * ("Frozen Coconut Puree Sri Lanka") or a brand ("Marvees Sri Lanka") surface
 * Olive Foods — AI crawlers don't run JS, so a JS-only detail page is invisible
 * to them, and Google ranks server-rendered content more reliably.
 *
 * Runs after `vite build` + collect-routes (see package.json "build").
 * Requires: puppeteer (dev dependency).
 *
 * Env knobs (optional):
 *   PRERENDER_CONCURRENCY  parallel pages (default 4)
 *   PRERENDER_LIMIT        cap total routes — for quick smoke builds
 */
import http from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { resolve, dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");
const PORT = 4189;
const CONCURRENCY = Math.max(1, Number(process.env.PRERENDER_CONCURRENCY) || 4);
const LIMIT = Number(process.env.PRERENDER_LIMIT) || 0;
const NAV_TIMEOUT = 45000;

// `waitFor` blocks until data-driven content has loaded (from Supabase) so we
// don't capture a loading skeleton. It is a CSS selector or a predicate run in
// the page. Product cards render as <button> (they open a modal), so listing
// pages wait on their Supabase-hosted images rather than on anchor links.
const hasProductImages = () => document.querySelectorAll('img[src*="supabase.co/storage"]').length >= 4;
// Category + detail pages are ready once their real content (an image, or a
// substantial body of text / an empty-state message) has rendered.
const categoryReady = () =>
  document.querySelectorAll('img[src*="supabase.co/storage"]').length >= 1 ||
  /Ask us to source|No .* listed/.test(document.body.innerText);
const detailReady = () => {
  if (document.getElementById("boot-splash")) return false;
  if (/Product Not Found|Brand Not Found/i.test(document.body.innerText)) return true;
  const main = document.querySelector("main") || document.body;
  return (
    document.querySelectorAll('img[src*="supabase.co/storage"]').length >= 1 ||
    main.innerText.trim().length > 400
  );
};

// Fixed pages that need a specific signal; the rest of the fixed pages are
// static content and need no wait.
const PAGE_WAIT = {
  "/": hasProductImages,
  "/products": hasProductImages,
  "/brands": 'a[href^="/brands/"]',
  "/categories": 'a[href^="/categories/"]',
  // Every product is listed; wait until the catalogue has loaded.
  "/site-map": () => document.querySelectorAll('a[href^="/products/"]').length >= 20,
};
// Data-driven kinds. Sector pages show a product grid, like category pages.
// A future kind with no entry here falls back to detailReady.
const KIND_WAIT = { sector: categoryReady, category: categoryReady, product: detailReady, brand: detailReady };

let ROUTES;
try {
  const { routes } = JSON.parse(await readFile(resolve(__dirname, "../.seo-cache/routes.json"), "utf8"));
  ROUTES = routes.map((r) => ({
    path: r.loc,
    waitFor: r.kind === "page" ? (PAGE_WAIT[r.loc] ?? null) : (KIND_WAIT[r.kind] ?? detailReady),
  }));
  const byKind = routes.reduce((m, r) => ((m[r.kind] = (m[r.kind] ?? 0) + 1), m), {});
  console.log(`[prerender] ${routes.length} routes — ${Object.entries(byKind).map(([k, n]) => `${n} ${k}`).join(", ")}`);
} catch {
  console.warn("[prerender] no .seo-cache/routes.json — prerendering the fixed pages only");
  ROUTES = ["/", "/about", "/products", "/brands", "/contact"].map((p) => ({ path: p, waitFor: PAGE_WAIT[p] ?? null }));
}

const ALL = LIMIT > 0 ? ROUTES.slice(0, LIMIT) : ROUTES;

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2",
  ".woff": "font/woff", ".txt": "text/plain", ".xml": "application/xml",
  ".webmanifest": "application/manifest+json", ".mp4": "video/mp4", ".pdf": "application/pdf",
};

async function serveFile(res, filePath) {
  try {
    const s = await stat(filePath);
    if (s.isFile()) {
      res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
      createReadStream(filePath).pipe(res);
      return true;
    }
  } catch { /* not found */ }
  return false;
}

// Preserve the clean, un-prerendered shell as the SPA fallback BEFORE we start
// overwriting dist/index.html with the rendered homepage. Every client-side
// route (including the detail pages we're about to render) boots from this.
await mkdir(DIST, { recursive: true });
await writeFile(join(DIST, "200.html"), await readFile(join(DIST, "index.html")));
const SHELL = await readFile(join(DIST, "200.html"));

// Static file server for dist/ with SPA fallback to the clean shell.
const server = http.createServer(async (req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath !== "/" && (await serveFile(res, join(DIST, urlPath)))) return;
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(SHELL);
});
await new Promise((r) => server.listen(PORT, r));

// ─── Headless Chrome, with crash resilience ───
// A single browser is shared across a small pool of pages. A big run (~220
// pages) makes a transient Chrome crash likely; when the browser disconnects,
// a "Connection closed" / "Target closed" error used to kill the whole run.
// ensureBrowser() relaunches it (once, even under concurrency) and the page is
// retried.
// The anti-backgrounding flags keep timers and rendering running in the tabs
// that aren't in front — we render several pages at once.
const launch = () =>
  puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
    ],
  });
let browser = null;
let launching = null;
async function ensureBrowser() {
  const alive = browser && (browser.connected ?? browser.isConnected?.());
  if (alive) return browser;
  if (!launching) launching = launch().then((b) => { browser = b; launching = null; return b; });
  return launching;
}
const isCrash = (msg = "") =>
  /Connection closed|Target closed|Protocol error|Session closed|frame was detached|browser has disconnected|Navigating frame/i.test(msg);

const scrollThrough = () =>
  new Promise((res) => {
    let y = 0;
    const step = () => {
      window.scrollBy(0, 700);
      y += 700;
      if (y < document.body.scrollHeight + 1600) setTimeout(step, 110);
      else { window.scrollTo(0, 0); res(); }
    };
    step();
  });

async function renderOnce(route, waitFor) {
  const b = await ensureBrowser();
  const page = await b.newPage();
  page.on("pageerror", () => {});
  try {
    await page.setViewport({ width: 1280, height: 1600 });
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle2", timeout: NAV_TIMEOUT });
    await page
      .waitForFunction(
        () => { const r = document.getElementById("root"); return r && r.children.length > 0 && !document.getElementById("boot-splash"); },
        { timeout: 20000 }
      )
      .catch(() => {});
    if (typeof waitFor === "function") await page.waitForFunction(waitFor, { timeout: 20000 }).catch(() => {});
    else if (waitFor) await page.waitForSelector(waitFor, { timeout: 20000 }).catch(() => {});
    await page.evaluate(scrollThrough);
    await new Promise((r) => setTimeout(r, 1200));
    // Every prerendered route renders <Seo>; don't capture until its tags
    // (title, canonical, description, JSON-LD) are actually in <head>.
    // Throwing here makes the worker retry the page.
    await page
      .waitForFunction(() => !!document.head.querySelector('[data-rh="true"]'), { timeout: 8000 })
      .catch(() => { throw new Error("head tags (react-helmet) never applied"); });
    const html = await page.content();
    const outPath = route === "/" ? join(DIST, "index.html") : join(DIST, route.replace(/^\//, ""), "index.html");
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");
    return html.length;
  } finally {
    try { await page.close(); } catch { /* browser already gone */ }
  }
}

let ok = 0, fail = 0, done = 0;
const failed = [];
const total = ALL.length;
const queue = [...ALL];

async function worker() {
  for (;;) {
    const item = queue.shift();
    if (!item) return;
    let lastErr;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const size = await renderOnce(item.path, item.waitFor);
        ok++;
        console.log(`[prerender] ✓ ${item.path} (${(size / 1024).toFixed(0)} KB) [${++done}/${total}]`);
        lastErr = null;
        break;
      } catch (e) {
        lastErr = e;
        if (attempt < 2) {
          if (isCrash(e.message)) await ensureBrowser();
          continue; // one retry for crashes and for pages whose head tags didn't apply
        }
        break;
      }
    }
    if (lastErr) {
      fail++;
      failed.push(item.path);
      console.warn(`[prerender] ✗ ${item.path}: ${lastErr.message} [${++done}/${total}]`);
    }
  }
}

await ensureBrowser();
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, total) }, worker));

try { await browser?.close(); } catch { /* already gone */ }
server.close();
console.log(`[prerender] done — ${ok} rendered, ${fail} failed, ${total} total`);
// A failed route still works (it falls back to the SPA shell), it just isn't
// prerendered — so list them instead of failing the deploy over one flake.
if (failed.length) console.warn(`[prerender] not prerendered (served as SPA shell): ${failed.join(", ")}`);
if (ok === 0) process.exitCode = 1; // don't ship a build where prerender totally failed
