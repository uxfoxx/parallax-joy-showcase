import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, FileText, Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { EMAIL, LANES, whatsappHref, whatsappMessage, type EnquiryTarget } from "@/lib/contact";

/**
 * The two ways to reach Olive Foods, always together and always worded the
 * way the client asked (see LANES in lib/contact):
 *  - "For bulk enquiries" → +94 77 330 0700, WhatsApp or call (primary)
 *  - "For general enquiries" → +94 11 207 1717, call or email (secondary)
 * Each block leads with that sentence and the number, so nobody has to work
 * out which line is which.
 *
 * `layout="cards"`: two side-by-side cards (contact page, landing pages).
 * `layout="rows"`: two compact rows (footer, phone menu).
 * `layout="compact"`: two tight rows with icon actions (the floating
 *   Enquiries panel, the phone enquiry bar's call menu).
 * `layout="inline"`: two short lines under an enquiry block's buttons, so a page
 *   that offers WhatsApp (the bulk line) still names the general line.
 * `tone` follows the section the block sits on. Every action is tracked as
 * contact_<lane>_<channel> with `source` as the item.
 */
type Props = {
  layout?: "cards" | "rows" | "compact" | "inline";
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
        <Phone className="h-4 w-4" /> Call
      </a>
    </div>
  );
  const generalActions = (
    <div className="flex flex-wrap gap-2">
      <a href={g.tel} data-track="contact_general_call" data-track-item={source} className={cn(btn, outline)}>
        <Phone className="h-4 w-4" /> Call
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

  if (layout === "inline") {
    const num = cn("font-semibold tabular-nums underline decoration-current/30 underline-offset-2 hover:decoration-current", strong);
    return (
      <p className={cn("flex flex-col gap-1 font-body text-[13px]", muted, className)}>
        <span className="inline-flex items-center gap-1.5">
          <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
          {b.heading}:{" "}
          <a href={b.tel} data-track="contact_business_call" data-track-item={source} className={num}>{b.display}</a>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5" />
          {g.heading}:{" "}
          <a href={g.tel} data-track="contact_general_call" data-track-item={source} className={num}>{g.display}</a>
        </span>
      </p>
    );
  }

  if (layout === "compact") {
    const icon = "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors";
    const lane = (heading: string, display: string, who: string, actions: ReactNode, primary: boolean) => (
      <div className={cn("rounded-xl border p-3.5", primary ? "border-accent/40 bg-accent/[0.05]" : "border-border bg-card")}>
        <p className={cn("font-body text-[11px] font-semibold uppercase tracking-[0.16em]", primary ? "text-accent" : "text-muted-foreground")}>{heading}</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="font-display text-lg font-bold tabular-nums text-foreground">{display}</p>
          <div className="flex gap-1.5">{actions}</div>
        </div>
        <p className="mt-0.5 font-body text-xs leading-snug text-muted-foreground">{who}</p>
      </div>
    );
    return (
      <div className={cn("grid gap-2", className)}>
        {lane(
          b.heading,
          b.display,
          `${b.who} · WhatsApp or call`,
          <>
            <a href={wa} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${b.display}`} data-track="contact_business_whatsapp" data-track-item={source} className={cn(icon, WA_GREEN)}>
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a href={b.tel} aria-label={`Call ${b.display}`} data-track="contact_business_call" data-track-item={source} className={cn(icon, outline)}>
              <Phone className="h-4 w-4" />
            </a>
          </>,
          true,
        )}
        {lane(
          g.heading,
          g.display,
          g.who,
          <>
            <a href={g.tel} aria-label={`Call ${g.display}`} data-track="contact_general_call" data-track-item={source} className={cn(icon, outline)}>
              <Phone className="h-4 w-4" />
            </a>
            <a href={`mailto:${EMAIL}`} aria-label={`Email ${EMAIL}`} data-track="contact_general_email" data-track-item={source} className={cn(icon, outline)}>
              <Mail className="h-4 w-4" />
            </a>
          </>,
          false,
        )}
      </div>
    );
  }

  if (layout === "rows") {
    return (
      <div className={cn("grid gap-3", className)}>
        <div className={cn("rounded-2xl border p-4 sm:p-5", dark ? "border-gold-light/30 bg-[hsl(75_40%_45%/0.1)]" : "border-accent/40 bg-accent/[0.05]")}>
          <p className={cn("font-display text-base font-semibold", dark ? "text-gold-light" : "text-accent")}>{b.heading}</p>
          <p className={cn("mt-0.5 font-display text-2xl font-bold tabular-nums", strong)}>{b.display}</p>
          <p className={cn("mt-1 font-body text-[13px]", muted)}>{b.who} · WhatsApp or call</p>
          <div className="mt-3">{businessActions}</div>
          {quote}
        </div>
        <div className={cn("rounded-2xl border p-4 sm:p-5", dark ? "border-white/10 bg-white/[0.03]" : "border-border bg-card")}>
          <p className={cn("font-display text-base font-semibold", strong)}>{g.heading}</p>
          <p className={cn("mt-0.5 font-display text-2xl font-bold tabular-nums", strong)}>{g.display}</p>
          <p className={cn("mt-1 font-body text-[13px]", muted)}>{g.who}</p>
          <div className="mt-3">{generalActions}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      <div className={cn("rounded-2xl border-2 p-5", dark ? "border-gold-light/40 bg-white/[0.04]" : "border-accent/50 bg-card")}>
        <p className={cn("font-display text-lg font-bold", dark ? "text-gold-light" : "text-accent")}>{b.heading}</p>
        <p className={cn("mt-1 font-display text-2xl font-bold tabular-nums", strong)}>{b.display}</p>
        <p className={cn("mt-1 font-body text-[13px] leading-snug", muted)}>{b.who} · WhatsApp or call</p>
        <div className="mt-4">{businessActions}</div>
        {quote}
      </div>
      <div className={cn("rounded-2xl border p-5", dark ? "border-white/10 bg-white/[0.03]" : "border-border bg-card")}>
        <p className={cn("font-display text-lg font-bold", strong)}>{g.heading}</p>
        <p className={cn("mt-1 font-display text-2xl font-bold tabular-nums", strong)}>{g.display}</p>
        <p className={cn("mt-1 font-body text-[13px] leading-snug", muted)}>{g.who} · {EMAIL}</p>
        <div className="mt-4">{generalActions}</div>
      </div>
    </div>
  );
}
