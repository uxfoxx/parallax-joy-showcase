import { Link } from "react-router-dom";
import { ArrowUpRight, FileText, Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";
import { cn } from "@/lib/utils";
import { EMAIL, LANES, whatsappHref, whatsappMessage, type EnquiryTarget } from "@/lib/contact";

/**
 * The two ways to reach Olive Foods, always together and always labelled by
 * who they're for (see LANES in lib/contact):
 *  - Business and bulk orders → the sales mobile, WhatsApp or call (primary)
 *  - General enquiries → the office landline or email (secondary)
 * People pick by who they are ("I run a café") rather than by which number,
 * so the business line gets business enquiries and the office the rest.
 *
 * `layout="cards"`: two side-by-side cards (contact page, landing pages).
 * `layout="rows"`: two compact rows (footer, phone menu).
 * `tone` follows the section the block sits on. Every action is tracked as
 * contact_<lane>_<channel> with `source` as the item.
 */
type Props = {
  layout?: "cards" | "rows";
  tone?: "light" | "dark";
  /** What the visitor is looking at, for the prefilled WhatsApp message. */
  enquiry?: EnquiryTarget;
  /** Adds "or send a quote request" under the business actions. */
  showQuote?: boolean;
  /** Analytics label for where the block is (e.g. "footer"). */
  source: string;
  className?: string;
};

const WA_GREEN = "bg-[#25D366] text-white hover:bg-[#1fb757]";

export default function ContactLanes({ layout = "cards", tone = "light", enquiry, showQuote = false, source, className }: Props) {
  const dark = tone === "dark";
  const b = LANES.business;
  const g = LANES.general;
  const wa = whatsappHref(whatsappMessage(enquiry));

  const outline = dark
    ? "border border-white/20 text-primary-foreground hover:bg-white/10"
    : "border border-border bg-background text-foreground hover:border-foreground/30";
  const muted = dark ? "text-primary-foreground/60" : "text-muted-foreground";
  const strong = dark ? "text-primary-foreground" : "text-foreground";
  const btn = "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 font-body text-sm font-semibold transition-colors";

  const businessActions = (
    <div className="flex flex-wrap gap-2">
      <a href={wa} target="_blank" rel="noopener noreferrer" data-track="contact_business_whatsapp" data-track-item={source} className={cn(btn, WA_GREEN)}>
        <WhatsAppIcon className="h-4 w-4" /> WhatsApp
      </a>
      <a href={b.tel} data-track="contact_business_call" data-track-item={source} className={cn(btn, outline)}>
        <Phone className="h-4 w-4" /> Call sales
      </a>
    </div>
  );
  const generalActions = (
    <div className="flex flex-wrap gap-2">
      <a href={g.tel} data-track="contact_general_call" data-track-item={source} className={cn(btn, outline)}>
        <Phone className="h-4 w-4" /> Call the office
      </a>
      <a href={`mailto:${EMAIL}`} data-track="contact_general_email" data-track-item={source} className={cn(btn, outline)}>
        <Mail className="h-4 w-4" /> Email
      </a>
    </div>
  );
  const quote = showQuote && (
    <Link
      to="/contact"
      data-track="request_quote"
      data-track-item={source}
      className={cn("mt-3 inline-flex items-center gap-1.5 font-body text-sm font-semibold transition-colors", dark ? "text-gold-light hover:text-primary-foreground" : "text-accent hover:underline")}
    >
      <FileText className="h-4 w-4" /> or send a quote request
      <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  );

  if (layout === "rows") {
    return (
      <div className={cn("grid gap-3", className)}>
        <div className={cn("rounded-2xl border p-4 sm:p-5", dark ? "border-gold-light/30 bg-[hsl(75_40%_45%/0.1)]" : "border-accent/40 bg-accent/[0.05]")}>
          <p className={cn("font-body text-[11px] font-semibold uppercase tracking-[0.2em]", dark ? "text-gold-light" : "text-accent")}>{b.label}</p>
          <p className={cn("mt-1 font-body text-[13px]", muted)}>{b.who}</p>
          <p className={cn("mt-2 font-display text-xl font-semibold tabular-nums", strong)}>{b.display}</p>
          <div className="mt-3">{businessActions}</div>
          {quote}
        </div>
        <div className={cn("rounded-2xl border p-4 sm:p-5", dark ? "border-white/10 bg-white/[0.03]" : "border-border bg-card")}>
          <p className={cn("font-body text-[11px] font-semibold uppercase tracking-[0.2em]", muted)}>{g.label}</p>
          <p className={cn("mt-1 font-body text-[13px]", muted)}>{g.who}</p>
          <p className={cn("mt-2 font-display text-lg font-semibold tabular-nums", strong)}>{g.display}</p>
          <div className="mt-3">{generalActions}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      <div className={cn("rounded-2xl border-2 p-5", dark ? "border-gold-light/40 bg-white/[0.04]" : "border-accent/50 bg-card")}>
        <span className={cn("inline-block rounded-full px-2.5 py-0.5 font-body text-[11px] font-semibold", dark ? "bg-gold-light/15 text-gold-light" : "bg-accent/10 text-accent")}>
          For businesses
        </span>
        <p className={cn("mt-3 font-display text-lg font-bold", strong)}>{b.label}</p>
        <p className={cn("mt-1 font-body text-[13px] leading-snug", muted)}>{b.who}</p>
        <p className={cn("mt-3 font-display text-xl font-semibold tabular-nums", strong)}>{b.display}</p>
        <p className={cn("font-body text-xs", muted)}>WhatsApp or call</p>
        <div className="mt-4">{businessActions}</div>
        {quote}
      </div>
      <div className={cn("rounded-2xl border p-5", dark ? "border-white/10 bg-white/[0.03]" : "border-border bg-card")}>
        <span className={cn("inline-block rounded-full px-2.5 py-0.5 font-body text-[11px] font-semibold", dark ? "bg-white/10 text-primary-foreground/70" : "bg-muted text-muted-foreground")}>
          Everything else
        </span>
        <p className={cn("mt-3 font-display text-lg font-bold", strong)}>{g.label}</p>
        <p className={cn("mt-1 font-body text-[13px] leading-snug", muted)}>{g.who}</p>
        <p className={cn("mt-3 font-display text-xl font-semibold tabular-nums", strong)}>{g.display}</p>
        <p className={cn("font-body text-xs", muted)}>Office line · {EMAIL}</p>
        <div className="mt-4">{generalActions}</div>
      </div>
    </div>
  );
}
