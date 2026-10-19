/**
 * Shared settings for the SEO build steps (scripts/seo/*, prerender, llms).
 *
 * The ROUTE REGISTRY below is the one place that says which kinds of public
 * page exist. To add a new kind of page (say, recipes at /recipes/:slug):
 *   1. add it to ROUTE_PATTERNS,
 *   2. emit its URLs in collect-routes.mjs,
 *   3. (optional) give it a wait condition in prerender.mjs.
 * build-sitemap.mjs warns whenever src/App.tsx declares a public route that
 * is neither covered here nor listed in EXCLUDED_ROUTES, so a forgotten page
 * type shows up in the build log instead of silently missing from Google.
 */
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { readFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
loadEnv({ path: resolve(ROOT, ".env"), quiet: true });
loadEnv({ path: resolve(ROOT, ".env.local"), quiet: true });

export const SITE = "https://www.olivefoods.lk";
export const DIST = resolve(ROOT, "dist");
/** Build intermediates — gitignored, never served. */
export const CACHE = resolve(ROOT, ".seo-cache");
export const ROUTES_FILE = resolve(CACHE, "routes.json");
export const INDEXNOW_FILE = resolve(CACHE, "indexnow.json");
/** Published with the site so the next build can compare against what's live. */
export const STATE_PATH = "/sitemap-state.json";

// ─── Route registry ───
/** Fixed public pages, in sitemap order. */
export const STATIC_PAGES = ["/", "/about", "/products", "/brands", "/categories", "/contact"];
/** Data-driven page kinds → the app route that renders them. */
export const ROUTE_PATTERNS = {
  sector: "/supply/:slug",
  category: "/categories/:slug",
  product: "/products/:slug",
  brand: "/brands/:slug",
};
/** Public routes in src/App.tsx that are deliberately NOT in the sitemap. */
export const EXCLUDED_ROUTES = {
  "/profile/:slug": "personal e-business cards (noindex)",
  "/admin": "admin panel",
  "/admin/login": "admin panel",
};
/** Child sitemap per kind, in index order. Unknown future kinds get their own file automatically. */
export const SITEMAP_GROUPS = ["page", "sector", "category", "product", "brand"];

// ─── Helpers ───
export const supabaseClient = () => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? createClient(url, key) : null;
};

/** Must match categorySlug() in src/lib/categories.ts. */
export const categorySlug = (name) =>
  name.toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

export const readSectors = () => JSON.parse(readFileSync(resolve(ROOT, "src/data/sectors.json"), "utf8"));
/** Brand profiles keyed by slug (src/data/brand-profiles.json). */
export const readBrandProfiles = () => {
  try {
    return JSON.parse(readFileSync(resolve(ROOT, "src/data/brand-profiles.json"), "utf8"));
  } catch {
    return {};
  }
};

export const ensureDir = (p) => mkdirSync(p, { recursive: true });

/** Escape text for XML element content / attribute values. */
export const xml = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** Absolute, correctly percent-encoded URL, or null if unusable. */
export const absUrl = (u) => {
  if (!u) return null;
  try {
    return new URL(u, SITE).href;
  } catch {
    return null;
  }
};

/** The dist/ file that serves a route ("/" → dist/index.html). */
export const distFileFor = (loc) =>
  loc === "/" ? resolve(DIST, "index.html") : resolve(DIST, loc.replace(/^\/+|\/+$/g, ""), "index.html");

/** W3C datetime (what <lastmod> expects), second precision, UTC. */
export const w3cNow = () => new Date().toISOString().replace(/\.\d{3}Z$/, "+00:00");
