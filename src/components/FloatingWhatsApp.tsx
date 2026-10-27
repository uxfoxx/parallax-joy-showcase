import { useEffect, useRef, useState } from "react";
import { useLocation, useMatch } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Phone, X } from "lucide-react";
import { useProducts } from "@/lib/api";
import { LANES, whatsappHref, whatsappMessage } from "@/lib/contact";

/** Official WhatsApp glyph (phone-receiver inside a speech bubble). */
export const WhatsAppIcon =({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" aria-hidden className={className} fill="currentColor">
    <path d="M16.001 3.2C8.93 3.2 3.2 8.93 3.2 16c0 2.273.6 4.45 1.738 6.378L3.2 28.8l6.59-1.711A12.755 12.755 0 0 0 16 28.8c7.07 0 12.8-5.73 12.8-12.8S23.07 3.2 16.001 3.2zM16 26.27c-1.95 0-3.86-.522-5.532-1.51l-.397-.236-3.91 1.015 1.043-3.81-.258-.41A10.21 10.21 0 0 1 5.73 16c0-5.66 4.61-10.27 10.27-10.27S26.27 10.34 26.27 16c0 5.66-4.61 10.27-10.27 10.27zm5.626-7.69c-.308-.155-1.823-.9-2.106-1.003-.282-.103-.487-.155-.692.155-.205.31-.795 1.003-.974 1.21-.18.205-.36.232-.667.077-.308-.155-1.3-.479-2.476-1.527-.915-.817-1.532-1.825-1.713-2.135-.18-.31-.02-.477.135-.632.139-.139.308-.36.462-.54.155-.18.205-.31.308-.515.103-.205.052-.387-.026-.541-.077-.155-.692-1.668-.949-2.286-.25-.6-.504-.518-.692-.527-.18-.008-.387-.01-.594-.01-.205 0-.54.077-.821.387-.282.31-1.077 1.052-1.077 2.566 0 1.514 1.103 2.977 1.257 3.182.155.205 2.171 3.314 5.26 4.65.736.318 1.31.508 1.757.65.738.235 1.41.202 1.94.123.592-.088 1.823-.745 2.08-1.464.257-.72.257-1.336.18-1.464-.077-.13-.282-.205-.59-.36z"/>
  </svg>
);

/**
 * Floating "Bulk enquiries" button, on every public page. It names who it's
 * for and opens a small panel rather than jumping straight to WhatsApp: "For
 * bulk enquiries" with the sales number (WhatsApp or call), and one line
 * underneath, "For general enquiries, call +94 11 207 1717", so personal
 * enquiries stop landing on the sales WhatsApp. On a product page the WhatsApp message names the product.
 *
 * `hideOnMobile`: pages that show the sticky EnquiryBar (which has its own
 * WhatsApp button) hide this one on mobile so the two don't overlap.
 */
const FloatingWhatsApp = ({ hideOnMobile = false }: { hideOnMobile?: boolean }) => {
  const location = useLocation();
  const productMatch = useMatch("/products/:slug");
  const { data: products = [] } = useProducts();
  const matchedProduct = productMatch ? products.find((p) => p.slug === productMatch.params.slug) : undefined;
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Close on route change, outside click and Escape.
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const message = whatsappMessage(
    matchedProduct ? { kind: "product", name: matchedProduct.name, sku: matchedProduct.sku, path: `/products/${matchedProduct.slug}` } : undefined,
  );
  const b = LANES.business;
  const g = LANES.general;

  return (
    // z-40: below dialogs (z-50), so it never covers a quick view's close button.
    <aside
      ref={ref}
      aria-label={b.label}
      className={`fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-3 sm:right-6 print:hidden ${hideOnMobile ? "max-md:hidden" : ""}`}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            id="bulk-orders-panel"
            role="dialog"
            aria-label={b.label}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-[min(19rem,calc(100vw-2rem))] origin-bottom-right rounded-2xl border border-border bg-background p-4 text-foreground shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-base font-semibold leading-tight">{b.heading}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-0.5 font-display text-xl font-bold tabular-nums">{b.display}</p>
            <p className="mt-1 font-body text-sm leading-snug text-muted-foreground">
              {matchedProduct ? `WhatsApp or call for a quote on ${matchedProduct.name}.` : "WhatsApp or call for quotes and bulk orders."}
            </p>
            <a
              href={whatsappHref(message)}
              target="_blank"
              rel="noopener noreferrer"
              data-track="contact_business_whatsapp"
              data-track-item="floating"
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] font-body text-sm font-semibold text-white transition-colors hover:bg-[#1fb757]"
            >
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp
            </a>
            <a
              href={b.tel}
              data-track="contact_business_call"
              data-track-item="floating"
              className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border font-body text-sm font-semibold transition-colors hover:border-foreground/30"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
            <p className="mt-3 border-t border-border pt-3 font-body text-[13px] text-muted-foreground">
              {g.heading}, call{" "}
              <a href={g.tel} data-track="contact_general_call" data-track-item="floating" className="font-semibold text-foreground underline decoration-foreground/30 underline-offset-2">
                {g.display}
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="bulk-orders-panel"
        data-track="contact_panel_open"
        data-track-item={open ? "close" : "open"}
        className="group relative inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] pl-3 pr-4 text-white shadow-lg shadow-[#25D366]/30 transition-transform duration-300 hover:scale-[1.04] sm:h-14 sm:pl-4 sm:pr-5"
      >
        {/* Pulse ring — throttled: ~2s burst every 12s instead of continuous */}
        {!open && <span aria-hidden className="absolute inset-0 rounded-full bg-[#25D366] opacity-0 animate-wa-pulse" />}
        <WhatsAppIcon className="relative h-7 w-7" />
        <span className="relative font-body text-sm font-semibold">{b.label}</span>
      </button>
    </aside>
  );
};

export default FloatingWhatsApp;
