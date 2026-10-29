import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { readFileSync } from "fs";
import { componentTagger } from "lovable-tagger";

/**
 * Injects Google Search Console / Bing Webmaster verification <meta> tags when
 * their tokens are set (VITE_GSC_VERIFICATION / VITE_BING_VERIFICATION in
 * .env). index.html is prerendered into every route, so the tag is present on
 * whichever page the verifier checks. With no token, nothing is emitted.
 */
const siteVerification = (env: Record<string, string>): Plugin => ({
  name: "site-verification",
  transformIndexHtml() {
    const tags: HtmlTagDescriptor[] = [];
    if (env.VITE_GSC_VERIFICATION)
      tags.push({ tag: "meta", attrs: { name: "google-site-verification", content: env.VITE_GSC_VERIFICATION }, injectTo: "head" });
    if (env.VITE_BING_VERIFICATION)
      tags.push({ tag: "meta", attrs: { name: "msvalidate.01", content: env.VITE_BING_VERIFICATION }, injectTo: "head" });
    return tags;
  },
});

/**
 * Preloads the Latin variable-font files (Sora + Inter) so the browser fetches
 * them alongside the CSS instead of discovering them after it parses. Only the
 * Latin subsets: the others are behind unicode-range and almost never used.
 * Build only — the file names carry a content hash.
 */
const preloadFonts = (): Plugin => ({
  name: "preload-fonts",
  apply: "build",
  transformIndexHtml(_html, ctx) {
    return Object.keys(ctx.bundle ?? {})
      .filter((f) => /\/(sora|inter)-latin-wght-normal-[\w-]+\.woff2$/.test(f))
      .map((f) => ({
        tag: "link",
        attrs: { rel: "preload", href: `/${f}`, as: "font", type: "font/woff2", crossorigin: "" },
        injectTo: "head-prepend" as const,
      }));
  },
});

/**
 * font-display: block for the Latin Sora + Inter faces (the preloaded ones),
 * swap for the rest.
 *
 * Every page is prerendered, then createRoot replaces that HTML with an
 * identical React tree. With `swap`, the hero text first paints in the
 * fallback font a few tens of ms before the (preloaded) fonts land; the
 * React copy painted seconds later in the real font is a hair larger, so
 * Chrome records it as a new, much later LCP — 4.8–5.9 s on mobile instead
 * of ~2 s. Waiting the few ms for the font keeps the first paint the final
 * one. The browser caps the block at 3 s and swaps after that, so a slow font
 * still never hides text for longer.
 */
const blockLatinFonts = (): Plugin => ({
  name: "block-latin-fonts",
  enforce: "pre",
  transform(code, id) {
    if (!/@fontsource-variable\/(inter|sora)\/index\.css/.test(id)) return;
    return code.replace(/(\/\* (?:inter|sora)-latin-wght-normal \*\/\s*@font-face \{[^}]*?)font-display: swap;/g, "$1font-display: block;");
  },
});

/**
 * `virtual:content-index` — footer-sized summaries of the content JSON: the
 * sector names + slugs, and whether any buying guide is published. The
 * footer is on every page; importing lib/sectors and lib/guides for this put
 * the full guide articles (~40 KB) and sector copy into every visit.
 */
const contentIndex = (): Plugin => {
  const id = "virtual:content-index";
  return {
    name: "content-index",
    resolveId: (source) => (source === id ? `\0${id}` : undefined),
    load(resolved) {
      if (resolved !== `\0${id}`) return;
      const read = (file: string) => {
        const abs = path.resolve(__dirname, file);
        this.addWatchFile(abs);
        return JSON.parse(readFileSync(abs, "utf8"));
      };
      const sectors = (read("src/data/sectors.json") as { slug: string; name: string }[]).map(({ slug, name }) => ({ slug, name }));
      const guides = read("src/data/guides.json") as unknown[];
      return `export const SECTOR_LINKS = ${JSON.stringify(sectors)};\nexport const HAS_GUIDES = ${guides.length > 0};\n`;
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    server: {
      host: "::",
      port: 8080,
      strictPort: true,
      hmr: {
        overlay: false,
      },
      // Admin analytics: run `node deploy/insights/server.mjs` alongside the dev
      // server (production: nginx proxies /api/insights/ to the same service).
      proxy: {
        "/api/insights": "http://127.0.0.1:4101",
      },
    },
    build: {
      rollupOptions: {
        output: {
          // The framework code every page needs gets its own chunks. It changes
          // far less often than the site does, so a returning visitor keeps it
          // cached across deploys instead of re-downloading it inside a new
          // entry hash every time.
          manualChunks(id) {
            if (!id.includes("/node_modules/")) return;
            if (/\/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom|@remix-run\/router)\//.test(id)) return "react";
            if (/\/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return "motion";
            if (/\/node_modules\/@tanstack\//.test(id)) return "query";
            // One chunk for every icon, not one tiny chunk per icon per page.
            if (/\/node_modules\/lucide-react\//.test(id)) return "icons";
          },
        },
      },
    },
    plugins: [react(), siteVerification(env), preloadFonts(), blockLatinFonts(), contentIndex(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
  };
});
