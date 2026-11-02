import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FileText, Phone, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import ContactLanes from "@/components/ContactLanes";
import { quoteHref, whatsappHref, whatsappMessage, type EnquiryTarget } from "@/lib/contact";

/**
 * Mobile-only sticky enquiry bar for product and category pages: one primary
 * "Request a quote" / "Request sourcing" action, WhatsApp (the line for bulk
 * enquiries), and "Call", which opens both lines — bulk and general — since
 * retail customers read these pages too (see LANES in lib/contact). On
 * desktop the in-page CTA card does this job, so the bar is hidden there.
 * Sits below dialogs (z-40 < Radix z-50) so it never covers a quick-view modal.
 * Clicks are tracked by the delegated listener in lib/analytics.
 */
const EnquiryBar = ({ target }: { target: EnquiryTarget }) => {
  const isSourcing = target.kind === "category";
  const reduced = useReducedMotion();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => setOpen(false), [pathname]);
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

  return (
    <aside ref={ref} aria-label="Request a quote" className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] print:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            id="enquiry-bar-lines"
            role="dialog"
            aria-label="Call: bulk and general lines"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-3 bottom-full mb-2 rounded-2xl border border-border bg-background p-3 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-display text-sm font-semibold">Which line?</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ContactLanes layout="compact" enquiry={target} source="enquiry_bar" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-2">
        <Link
          to={quoteHref(target)}
          data-track={isSourcing ? "sourcing_request" : "request_quote"}
          data-track-item={target.name}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-accent text-accent-foreground font-body text-sm font-semibold active:scale-[0.98] transition-transform"
        >
          <FileText className="w-4 h-4" /> {isSourcing ? "Request sourcing" : "Request a quote"}
        </Link>
        <a
          href={whatsappHref(whatsappMessage(target))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp for bulk enquiries"
          data-track="contact_business_whatsapp"
          data-track-item="enquiry_bar"
          className="w-11 h-11 shrink-0 rounded-lg bg-[#25D366] text-white inline-flex items-center justify-center active:scale-95 transition-transform"
        >
          <WhatsAppIcon className="w-6 h-6" />
        </a>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="enquiry-bar-lines"
          data-track="contact_panel_open"
          data-track-item="enquiry_bar"
          className="h-11 shrink-0 rounded-lg border border-border bg-background px-3 text-foreground inline-flex items-center justify-center gap-1.5 font-body text-sm font-semibold active:scale-95 transition-transform"
        >
          <Phone className="w-4 h-4" /> Call
        </button>
      </div>
    </aside>
  );
};

export default EnquiryBar;
