import { startTransition } from "react";
import { createRoot } from "react-dom/client";
// Self-hosted variable fonts (one file per font covers every weight), bundled
// into /assets/ with the rest of the build: no third-party request in the way
// of the first paint, and cached for a year like any other asset.
import "@fontsource-variable/sora";
import "@fontsource-variable/inter";
import App, { preloadRoute } from "./App.tsx";
import "./index.css";
import { initAnalytics } from "@/lib/analytics";
import { exposeDehydrate, seedFromPrerender } from "@/lib/query-client";

initAnalytics();

// Mount only once the first render can reproduce the page already on screen:
// the data it was prerendered with is in the cache, and this route's chunk
// (with its lazy sections) has loaded. Until then the static HTML stays up.
seedFromPrerender();
if (navigator.webdriver) exposeDehydrate(); // build-time prerender

const mount = () => {
  if (navigator.webdriver) {
    // The prerender keeps only these modulepreload links in the HTML it
    // writes: what the first render needs, not chunks loaded later (toasts,
    // the quick-view), which would compete with the first paint.
    (window as Window & { __oliveBootChunks?: string[] }).__oliveBootChunks = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="modulepreload"]'),
      (l) => new URL(l.href).pathname,
    );
  }
  const root = createRoot(document.getElementById("root")!);
  // A transition renders in slices that yield to the browser, instead of one
  // long task for the whole page (the static HTML stays up meanwhile).
  startTransition(() => root.render(<App />));
};
preloadRoute(window.location.pathname).then(mount, mount);
