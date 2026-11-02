import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { activeTools, getConsent, isPrivatePath, setConsent, type Consent } from "@/lib/analytics";

/**
 * A small, non-blocking analytics notice (Sri Lanka PDPA; Clarity's consent
 * requirement for EEA/UK/CH visitors). Until someone answers, analytics runs
 * without cookies (see lib/analytics.ts); "Accept" allows full sessions,
 * "No thanks" keeps it cookieless. Shown once, only when an analytics tool is
 * actually running on this host, never in the prerender or on /admin.
 */
const AnalyticsConsent = () => {
  const { pathname } = useLocation();
  const [tools] = useState(activeTools);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!tools.length || getConsent() !== null) return;
    // It's a footnote, not a gate: it appears once the visitor starts using
    // the page (first scroll, tap or key), not on a timer. Shown during
    // load, its paragraph was the largest thing to paint on /products on a
    // phone, so PageSpeed timed the page's LCP by it (~7 s). Until an answer,
    // analytics is cookieless anyway (lib/analytics.ts).
    let t = 0;
    const events = ["scroll", "pointerdown", "keydown", "touchstart"] as const;
    const show = () => {
      for (const e of events) window.removeEventListener(e, show);
      t = window.setTimeout(() => setOpen(true), 1200);
    };
    for (const e of events) window.addEventListener(e, show, { passive: true, once: true });
    return () => {
      for (const e of events) window.removeEventListener(e, show);
      window.clearTimeout(t);
    };
  }, [tools]);

  if (!open || isPrivatePath(pathname)) return null;

  const answer = (c: Consent) => {
    setConsent(c);
    setOpen(false);
  };

  return (
    <section
      aria-label="Analytics cookies"
      className="fixed z-[46] inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-sm rounded-xl border border-border bg-background/95 backdrop-blur-md p-4 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] print:hidden"
    >
      <p className="font-body text-sm leading-relaxed text-foreground">
        We use cookies from {tools.join(" and ")} to see how visitors use this site, so we can improve it. What you
        type into forms is never recorded.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => answer("granted")}
          className="inline-flex items-center h-10 rounded-md bg-primary px-4 font-body text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => answer("denied")}
          className="inline-flex items-center h-10 rounded-md border border-border px-4 font-body text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          No thanks
        </button>
      </div>
    </section>
  );
};

export default AnalyticsConsent;
