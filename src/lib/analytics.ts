/**
 * Analytics: GA4 (traffic + conversions) and Microsoft Clarity (heatmaps +
 * session recordings).
 *
 * Each tool is active only when its ID is set at build time — VITE_GA_ID
 * ("G-XXXXXXX") and VITE_CLARITY_ID (the Clarity project ID) — and only on the
 * live site (*.olivefoods.lk). Local and ID-less builds send nothing; set
 * localStorage "of-analytics-debug" = "1" to test on another host.
 *
 * Never runs:
 *   - in the build-time prerender (headless Chrome reports navigator.webdriver),
 *     so no tag is baked into the static HTML;
 *   - on /admin and /profile (the admin panel and personal e-business cards).
 *
 * Privacy / consent (Sri Lanka PDPA; Clarity requires a consent signal for
 * EEA/UK/CH visitors): until a visitor accepts, both tools run without
 * cookies — Clarity in no-consent mode (each page view anonymous, heatmaps
 * still work), GA4 in consent mode. "Accept" in AnalyticsConsent switches
 * them to full sessions; the choice is remembered in localStorage.
 * Clarity masks everything typed into inputs; the contact form is also marked
 * data-clarity-mask.
 *
 * Tracking:
 *   - Page views on each SPA route change (trackPageView) — GA page_view, and
 *     a Clarity "page_type" tag so recordings/heatmaps can be filtered.
 *   - One delegated click listener tracks every tel:, WhatsApp and mailto:
 *     link, plus any element with data-track="<event>" (optional
 *     data-track-item). Each becomes a GA event and a Clarity event.
 *
 * Mark these as key events in GA4 to count them as conversions:
 *   generate_lead, request_quote, sourcing_request, whatsapp_click, phone_click
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID as string | undefined;

const CONSENT_KEY = "of-analytics-consent";
const DEBUG_KEY = "of-analytics-debug";
export type Consent = "granted" | "denied";

/** Actions worth finding in recordings — tagged so sessions can be filtered. */
const LEAD_EVENTS = new Set(["generate_lead", "request_quote", "sourcing_request", "whatsapp_click", "phone_click", "email_click"]);

let gaStarted = false;
let clarityStarted = false;

const store = {
  get(key: string) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* private mode / blocked storage: the choice just isn't remembered */
    }
  },
};

/** Paths that are never measured. */
export const isPrivatePath = (path: string) => /^\/(admin|profile)(\/|$)/.test(path);

/** Analytics runs on the live site only (or with the debug flag). */
function onLiveSite() {
  return /(^|\.)olivefoods\.lk$/.test(window.location.hostname) || store.get(DEBUG_KEY) === "1";
}

/** The tools that will actually run here, by display name (for the consent notice). */
export function activeTools(): string[] {
  if (typeof window === "undefined" || navigator.webdriver || !onLiveSite()) return [];
  return [CLARITY_ID && "Microsoft Clarity", GA_ID && "Google Analytics"].filter(Boolean) as string[];
}

export function getConsent(): Consent | null {
  const v = store.get(CONSENT_KEY);
  return v === "granted" || v === "denied" ? v : null;
}

function applyConsent(c: Consent | null) {
  const analytics = c === "granted" ? "granted" : "denied";
  window.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: analytics });
  window.gtag?.("consent", "update", { analytics_storage: analytics });
}

/** Records the visitor's choice and tells both tools straight away. */
export function setConsent(c: Consent) {
  store.set(CONSENT_KEY, c);
  applyConsent(c);
}

type Params = Record<string, string | number | undefined>;

export function track(event: string, params: Params = {}) {
  if (gaStarted && window.gtag) window.gtag("event", event, { page_path: window.location.pathname, ...params });
  if (clarityStarted && window.clarity) {
    window.clarity("event", event);
    if (LEAD_EVENTS.has(event)) window.clarity("set", "lead_action", event);
  }
}

/** Coarse page type from a path — a Clarity tag for filtering heatmaps. */
function pageType(path: string) {
  const p = path.split("?")[0];
  if (p === "/") return "home";
  const [, first, second] = p.split("/");
  const map: Record<string, [string, string]> = {
    products: ["catalogue", "product"],
    brands: ["brands", "brand"],
    categories: ["categories", "category"],
    guides: ["guides", "guide"],
    supply: ["sector", "sector"],
  };
  if (map[first]) return second ? map[first][1] : map[first][0];
  return first || "home";
}

export function trackPageView(path: string) {
  if (isPrivatePath(path)) return;
  if (gaStarted && window.gtag) {
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
  if (clarityStarted && window.clarity) window.clarity("set", "page_type", pageType(path));
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

function startGa(id: string, consent: Consent | null) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js requires the real `arguments` object, not a rest array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  // Consent mode: cookieless until the visitor accepts.
  window.gtag("consent", "default", {
    analytics_storage: consent === "granted" ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false }); // SPA: we send page_view per route

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
  gaStarted = true;
}

function startClarity(id: string, consent: Consent | null) {
  // Official queue stub: calls made before the tag loads are replayed by it.
  window.clarity =
    window.clarity ||
    function clarity() {
      // eslint-disable-next-line prefer-rest-params
      (window.clarity!.q = window.clarity!.q || []).push(arguments);
    };
  window.clarity("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: consent === "granted" ? "granted" : "denied",
  });
  clarityStarted = true;

  // Load the recorder once the page has settled, so it never competes with
  // the first paint (PageSpeed) — the queue above keeps anything said earlier.
  const load = () => {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${id}`;
    document.head.appendChild(s);
  };
  const idle = () => {
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(load, { timeout: 4000 });
    else globalThis.setTimeout(load, 1500);
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

export function initAnalytics() {
  if (typeof window === "undefined" || (gaStarted || clarityStarted)) return;
  if (navigator.webdriver) return; // build-time prerender bot
  if (!onLiveSite()) return;
  if (isPrivatePath(window.location.pathname)) return;
  if (!GA_ID && !CLARITY_ID) return;

  const consent = getConsent();
  if (GA_ID) startGa(GA_ID, consent);
  if (CLARITY_ID) startClarity(CLARITY_ID, consent);
  document.addEventListener("click", onClick, { capture: true });
}
