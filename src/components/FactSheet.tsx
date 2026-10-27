import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Award, Clock, Globe2, MapPin, Package, Phone, Snowflake, Truck, Users } from "lucide-react";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";
import { useProducts } from "@/lib/api";
import { useSuppliedCategories } from "@/hooks/useSuppliedCategories";
import { isHouseBrand } from "@/lib/brands";
import { SECTORS } from "@/lib/sectors";
import { AT_A_GLANCE } from "@/lib/site";
import { HOURS, fmtHour, openStatus, useColomboNow } from "@/lib/hours";
import { EMAIL, LANES, whatsappHref, whatsappMessage } from "@/lib/contact";
import { cn } from "@/lib/utils";

/**
 * "Olive Foods at a glance" — the company fact sheet on the About page and the
 * importer pillar page. The sentences come verbatim from src/data/company.json
 * (search engines and AI assistants quote them), laid out as a spec sheet
 * rather than a plain list:
 *  - lead row: what we do + the live range as numbers
 *  - four headline figures (experience, sourcing, coverage, cold chain)
 *  - who we supply, as links to the sector pages
 *  - visit: address with directions, hours with today highlighted + open now
 *  - contact: the two lines, worded as the client asked (lib/contact LANES)
 */
const fact = (label: string) => AT_A_GLANCE.find(([k]) => k === label)?.[1] ?? "";

const FIGURES: { label: string; icon: ComponentType<{ className?: string }>; value: string; unit: string }[] = [
  { label: "Experience", icon: Award, value: "30+", unit: "years" },
  { label: "Sourcing", icon: Globe2, value: "30+", unit: "countries" },
  { label: "Coverage", icon: Truck, value: "25", unit: "districts" },
  { label: "Cold chain", icon: Snowflake, value: "−18\u00a0°C", unit: "frozen lines" },
];

const DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=292+Sea+Street%2C+Colombo+11%2C+Sri+Lanka";
const ease = [0.22, 1, 0.36, 1] as const;

function Label({ icon: Icon, children }: { icon: ComponentType<{ className?: string }>; children: string }) {
  return (
    <p className="flex items-center gap-2 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-accent" />
      {children}
    </p>
  );
}

export default function FactSheet({ headingLevel = "h2", className }: { headingLevel?: "h2" | "h3"; className?: string }) {
  const reduced = !!useReducedMotion();
  const { data: products = [] } = useProducts();
  const categories = useSuppliedCategories();
  const brandCount = new Set(products.map((p) => p.brands?.name).filter((b): b is string => !!b && !isHouseBrand(b))).size;
  const now = useColomboNow();
  const status = openStatus(now.day, now.hour);
  const Heading = headingLevel;

  const range = products.length
    ? [
        { value: products.length, unit: "products" },
        { value: categories.length, unit: "categories" },
        { value: brandCount, unit: "brands" },
      ]
    : [];

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease }}
      className={cn("overflow-hidden rounded-3xl border border-border bg-card shadow-card", className)}
    >
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-6 py-5 sm:px-8">
        <div>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Fact sheet</p>
          <Heading className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">Olive Foods at a glance</Heading>
        </div>
        <p className="font-body text-xs text-muted-foreground">Olive Foods (Pvt) Ltd · Colombo, Sri Lanka</p>
      </div>

      <div>
        {/* Lead: what we do + the live range */}
        <div className="grid border-b border-border lg:grid-cols-[1.4fr_1fr]">
          <div className="px-6 py-6 sm:px-8">
            <Label icon={Package}>What we do</Label>
            <div className="mt-2 font-display text-lg font-semibold leading-snug text-foreground md:text-xl">{fact("What we do")}</div>
          </div>
          {range.length > 0 && (
            <div className="border-t border-border bg-accent/[0.04] px-6 py-6 sm:px-8 lg:border-l lg:border-t-0">
              <Label icon={Package}>Range</Label>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {range.map((r) => (
                  <span key={r.unit} className="block">
                    <span className="block font-display text-3xl font-bold tabular-nums tracking-tight text-foreground">{r.value}</span>
                    <span className="block font-body text-xs text-muted-foreground">{r.unit}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Four headline figures */}
        <div className="grid grid-cols-2 border-b border-border lg:grid-cols-4">
          {FIGURES.map(({ label, icon, value, unit }, i) => (
            <div key={label} className={cn("px-6 py-6 sm:px-8", i % 2 === 1 && "border-l border-border", i >= 2 && "border-t border-border lg:border-t-0", i === 2 && "lg:border-l")}>
              <Label icon={icon}>{label}</Label>
              <div className="mt-3">
                <span className="flex flex-wrap items-baseline gap-x-1.5">
                  <span className="whitespace-nowrap font-display text-3xl font-bold tabular-nums tracking-tight text-gradient-gold">{value}</span>
                  <span className="font-body text-sm font-medium text-foreground">{unit}</span>
                </span>
                <span className="mt-1.5 block font-body text-[13px] leading-snug text-muted-foreground">{fact(label)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Who we supply */}
        <div className="border-b border-border px-6 py-6 sm:px-8">
          <Label icon={Users}>Who we supply</Label>
          <div className="mt-2">
            <span className="block font-body text-sm text-foreground">{fact("Who we supply")}</span>
            <span className="mt-3 flex flex-wrap gap-2">
              {SECTORS.map((s) => (
                <Link
                  key={s.slug}
                  to={`/supply/${s.slug}`}
                  className="group inline-flex h-8 items-center gap-1 rounded-full border border-border bg-background px-3 font-body text-[13px] text-foreground transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {s.name}
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-accent" />
                </Link>
              ))}
            </span>
          </div>
        </div>

        {/* Visit */}
        <div className="grid border-b border-border md:grid-cols-2">
          <div className="px-6 py-6 sm:px-8">
            <Label icon={MapPin}>Address</Label>
            <div className="mt-2 font-body text-sm text-foreground">
              {fact("Address")}
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex w-fit items-center gap-1 font-semibold text-accent hover:underline"
              >
                Get directions <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
          <div className="border-t border-border px-6 py-6 sm:px-8 md:border-l md:border-t-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label icon={Clock}>Hours</Label>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-body text-[11px] font-semibold",
                  status.open ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700",
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", status.open ? "bg-emerald-500" : "bg-amber-500")} />
                {status.label}
              </span>
            </div>
            {/* The sentence for crawlers and assistants; the table for people. */}
            <div className="mt-2">
              <span className="sr-only">{fact("Hours")}</span>
              <span aria-hidden className="block space-y-0.5 font-body text-sm">
                {HOURS.map((h) => {
                  const today = h.days.includes(now.day);
                  return (
                    <span key={h.label} className={cn("flex justify-between rounded-md px-2 py-1", today ? "bg-accent/10 font-semibold text-foreground" : "text-muted-foreground")}>
                      <span>{h.label}</span>
                      <span className="tabular-nums">{h.open != null && h.close != null ? `${fmtHour(h.open)} – ${fmtHour(h.close)}` : "Closed"}</span>
                    </span>
                  );
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Contact: the two lines */}
        <div className="grid md:grid-cols-2">
          <div className="px-6 py-6 sm:px-8">
            <Label icon={WhatsAppIcon}>{LANES.business.label}</Label>
            <div className="mt-2">
              <span className="block font-display text-2xl font-bold tabular-nums text-foreground">{LANES.business.display}</span>
              <span className="mt-1 block font-body text-[13px] text-muted-foreground">{LANES.business.who} · WhatsApp or call</span>
              <span className="mt-3 flex flex-wrap gap-2">
                <a
                  href={whatsappHref(whatsappMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="contact_business_whatsapp"
                  data-track-item="fact_sheet"
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#25D366] px-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-[#1fb757]"
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                </a>
                <a
                  href={LANES.business.tel}
                  data-track="contact_business_call"
                  data-track-item="fact_sheet"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3.5 font-body text-sm font-semibold text-foreground transition-colors hover:border-foreground/30"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
              </span>
            </div>
          </div>
          <div className="border-t border-border px-6 py-6 sm:px-8 md:border-l md:border-t-0">
            <Label icon={Phone}>{LANES.general.label}</Label>
            <div className="mt-2">
              <span className="block font-display text-2xl font-bold tabular-nums text-foreground">{LANES.general.display}</span>
              <span className="mt-1 block font-body text-[13px] text-muted-foreground">{LANES.general.who}</span>
              <span className="mt-3 flex flex-wrap gap-2">
                <a
                  href={LANES.general.tel}
                  data-track="contact_general_call"
                  data-track-item="fact_sheet"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3.5 font-body text-sm font-semibold text-foreground transition-colors hover:border-foreground/30"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  data-track="contact_general_email"
                  data-track-item="fact_sheet"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3.5 font-body text-sm font-semibold text-foreground transition-colors hover:border-foreground/30"
                >
                  {EMAIL}
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
