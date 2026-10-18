/**
 * GA4 analytics + conversion tracking.
 *
 * Active only when VITE_GA_ID (e.g. "G-XXXXXXX") is set at build time — with
 * no ID every call is a no-op, so local and ID-less builds send nothing.
 *
 * - Page views are sent manually on each SPA route change (trackPageView).
 * - One delegated click listener tracks every tel:, WhatsApp and mailto: link
 *   site-wide, plus any element carrying data-track="<event>" (optional
 *   data-track-item="<label>"). Components opt in with attributes instead of
 *   importing this module.
 * - Skipped entirely for the build-time prerender (headless Chrome reports
 *   navigator.webdriver), so the GA tag is never baked into static HTML.
 *
 * Mark these as key events in GA4 to count them as conversions:
 *   generate_lead, request_quote, sourcing_request, whatsapp_click, phone_click
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
let started = false;

type Params = Record<string, string | number | undefined>;

export function track(event: string, params: Params = {}) {
  if (!started || !window.gtag) return;
  window.gtag("event", event, { page_path: window.location.pathname, ...params });
}

export function trackPageView(path: string) {
  if (!started || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

function onClick(e: MouseEvent) {
  const target = e.target as Element | null;
  if (!target?.closest) return;

  const tagged = target.closest<HTMLElement>("[data-track]");
  if (tagged?.dataset.track) {
    track(tagged.dataset.track, { item: tagged.dataset.trackItem });
    return;
  }

  const a = target.closest("a");
  const href = a?.getAttribute("href") ?? "";
  if (href.startsWith("tel:")) track("phone_click");
  else if (/wa\.me\/|api\.whatsapp\.com/.test(href)) track("whatsapp_click");
  else if (href.startsWith("mailto:")) track("email_click");
}

export function initAnalytics() {
  if (!GA_ID || started || typeof window === "undefined") return;
  if (navigator.webdriver) return; // build-time prerender bot
  started = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js requires the real `arguments` object, not a rest array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false }); // SPA: we send page_view per route

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  document.addEventListener("click", onClick, { capture: true });
}
