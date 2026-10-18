import { Link } from "react-router-dom";
import { FileText, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";
import { PHONE_TEL, quoteHref, whatsappHref, whatsappMessage, type EnquiryTarget } from "@/lib/contact";

/**
 * Mobile-only sticky enquiry bar for product and category pages: one primary
 * "Request a quote" / "Request sourcing" action plus WhatsApp and call. On
 * desktop the in-page CTA card does this job, so the bar is hidden there.
 * Sits below dialogs (z-40 < Radix z-50) so it never covers a quick-view modal.
 * Clicks are tracked by the delegated listener in lib/analytics.
 */
const EnquiryBar = ({ target }: { target: EnquiryTarget }) => {
  const isProduct = target.kind === "product";
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] print:hidden">
      <div className="flex items-center gap-2">
        <Link
          to={quoteHref(target)}
          data-track={isProduct ? "request_quote" : "sourcing_request"}
          data-track-item={target.name}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-accent text-accent-foreground font-body text-sm font-semibold active:scale-[0.98] transition-transform"
        >
          <FileText className="w-4 h-4" /> {isProduct ? "Request a quote" : "Request sourcing"}
        </Link>
        <a
          href={whatsappHref(whatsappMessage(target))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Enquire on WhatsApp"
          className="w-11 h-11 shrink-0 rounded-lg bg-[#25D366] text-white inline-flex items-center justify-center active:scale-95 transition-transform"
        >
          <WhatsAppIcon className="w-6 h-6" />
        </a>
        <a
          href={PHONE_TEL}
          aria-label="Call Olive Foods"
          className="w-11 h-11 shrink-0 rounded-lg border border-border bg-background text-foreground inline-flex items-center justify-center active:scale-95 transition-transform"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default EnquiryBar;
