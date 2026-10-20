import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
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
    plugins: [react(), siteVerification(env), preloadFonts(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
  };
});
