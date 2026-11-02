import { useEffect, useRef, useState } from "react";
import { useLocation, useMatch } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useProducts } from "@/lib/api";
import ContactLanes from "@/components/ContactLanes";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

// Re-exported: most components import the glyph from here.
export { WhatsAppIcon };

/**
 * Floating "Enquiries" button, on every public page. Business buyers and
 * retail customers both use it, so it isn't labelled for one of them: it
 * opens a small panel with both lines at equal weight (ContactLanes
 * "compact"), each with its number, who it's for and its actions — bulk
 * enquiries on the WhatsApp mobile, general enquiries on the landline. On a
 * product page the WhatsApp message names the product.
 *
 * `hideOnMobile`: pages that show the sticky EnquiryBar (which carries the
 * same two lines) hide this one on mobile so the two don't overlap.
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

  const enquiry = matchedProduct
    ? ({ kind: "product", name: matchedProduct.name, sku: matchedProduct.sku, path: `/products/${matchedProduct.slug}` } as const)
    : undefined;

  return (
    // z-40: below dialogs (z-50), so it never covers a quick view's close button.
    <aside
      ref={ref}
      aria-label="Enquiries"
      className={`fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-3 sm:right-6 print:hidden ${hideOnMobile ? "max-md:hidden" : ""}`}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            id="enquiries-panel"
            role="dialog"
            aria-label="Enquiries: bulk and general lines"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-[min(21rem,calc(100vw-2rem))] origin-bottom-right rounded-2xl border border-border bg-background p-4 text-foreground shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-semibold leading-tight">How can we help?</p>
                <p className="mt-0.5 font-body text-xs text-muted-foreground">
                  {matchedProduct ? `Ordering ${matchedProduct.name} in bulk? Use the first line.` : "Two lines, so your enquiry reaches the right team."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ContactLanes layout="compact" enquiry={enquiry} source="floating" className="mt-3" />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="enquiries-panel"
        data-track="contact_panel_open"
        data-track-item={open ? "close" : "open"}
        className="group relative inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] pl-3 pr-4 text-white shadow-lg shadow-[#25D366]/30 transition-transform duration-300 hover:scale-[1.04] sm:h-14 sm:pl-4 sm:pr-5"
      >
        {/* Pulse ring — throttled: ~2s burst every 12s instead of continuous */}
        {!open && <span aria-hidden className="absolute inset-0 rounded-full bg-[#25D366] opacity-0 animate-wa-pulse" />}
        <WhatsAppIcon className="relative h-7 w-7" />
        <span className="relative font-body text-sm font-semibold">Enquiries</span>
      </button>
    </aside>
  );
};

export default FloatingWhatsApp;
