/**
 * Post-build prerender.
 *
 * The site is a client-rendered SPA, so crawlers and AI answer engines that
 * don't execute JS would otherwise see an empty shell. This step loads each
 * key route in headless Chrome, lets React + react-helmet render, and writes
 * the finished HTML (with per-route <title>/description/canonical and full
 * body content) to dist/<route>/index.html. nginx serves those static files
 * directly (try_files $uri $uri/index.html /index.html); the client bundle
 * still loads and takes over for interactivity.
 *
 * Runs after `vite build` + the sitemap (see package.json "build").
 * Requires: puppeteer (dev dependency).
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

// The high-value marketing/listing routes. Detail pages (/products/:slug,
// /brands/:slug) stay on the SPA + sitemap; Google renders their JS.
// `waitFor` is a selector we block on so data-driven pages capture their
// content (loaded from Supabase) rather than a loading skeleton.
// `waitFor` is either a CSS selector or a predicate function evaluated in the
// page. Product cards render as <button> (they open a modal), so we wait on
// their Supabase-hosted images instead of on anchor links.
const hasProductImages = () => document.querySelectorAll('img[src*="supabase.co/storage"]').length >= 4;
const ROUTES = [
  { path: "/", waitFor: hasProductImages },
  { path: "/about", waitFor: null },
  { path: "/products", waitFor: hasProductImages },
  { path: "/brands", waitFor: 'a[href^="/brands/"]' },
  { path: "/contact", waitFor: null },
];

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

// Static file server for dist/ with SPA fallback to index.html.
const server = http.createServer(async (req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath !== "/" && (await serveFile(res, join(DIST, urlPath)))) return;
  const fallback = await readFile(join(DIST, "index.html"));
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(fallback);
});

await new Promise((r) => server.listen(PORT, r));

// Preserve the clean, un-prerendered shell as the SPA fallback for routes we
// don't prerender (product/brand detail pages), so they don't fall back to the
// full homepage HTML. nginx serves this via `try_files ... /200.html`.
await writeFile(join(DIST, "200.html"), await readFile(join(DIST, "index.html")));

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
let ok = 0, fail = 0;

for (const { path: route, waitFor } of ROUTES) {
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.warn(`[prerender]   page error on ${route}: ${e.message}`));
  try {
    await page.setViewport({ width: 1280, height: 1600 });
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle2", timeout: 45000 });
    // Wait until React has mounted and the boot splash is gone.
    await page
      .waitForFunction(
        () => {
          const root = document.getElementById("root");
          return root && root.children.length > 0 && !document.getElementById("boot-splash");
        },
        { timeout: 20000 }
      )
      .catch(() => {});
    // Block on real content (Supabase-loaded) so we don't capture a skeleton.
    if (typeof waitFor === "function") {
      await page.waitForFunction(waitFor, { timeout: 20000 }).catch(() => {
        console.warn(`[prerender]   ${route}: content did not load in time`);
      });
    } else if (waitFor) {
      await page.waitForSelector(waitFor, { timeout: 20000 }).catch(() => {
        console.warn(`[prerender]   ${route}: selector "${waitFor}" not found in time`);
      });
    }
    // Scroll through to trigger lazy-loaded sections + whileInView reveals,
    // then return to the top and let things settle.
    await page.evaluate(
      () =>
        new Promise((res) => {
          let y = 0;
          const step = () => {
            window.scrollBy(0, 700);
            y += 700;
            if (y < document.body.scrollHeight + 1600) setTimeout(step, 110);
            else {
              window.scrollTo(0, 0);
              res();
            }
          };
          step();
        })
    );
    await new Promise((r) => setTimeout(r, 1400));

    const html = await page.content();
    const outPath = route === "/" ? join(DIST, "index.html") : join(DIST, route.replace(/^\//, ""), "index.html");
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");
    console.log(`[prerender] ✓ ${route} -> ${outPath.replace(DIST, "dist")} (${(html.length / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (e) {
    console.warn(`[prerender] ✗ ${route}: ${e.message}`);
    fail++;
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();
console.log(`[prerender] done — ${ok} rendered, ${fail} failed`);
if (ok === 0) process.exitCode = 1; // don't ship a build where prerender totally failed
