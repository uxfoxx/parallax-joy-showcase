import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Mail, MapPin, Navigation, Phone, Snowflake, Truck } from "lucide-react";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { Button } from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import SplitText from "@/components/motion/SplitText";
import mark from "@/assets/olive-mark.svg";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact";

/**
 * "Where to find us" — a full-bleed Google map with the details floating over
 * it, like a map app.
 *
 * The map is Google's own embed, so the pin is Google's: the embed centres on
 * the address, which is why everything here is placed relative to the map's
 * centre (the pin card, the ground ripple) and the left column / right cards
 * keep the centre clear. Nothing covers the bottom edge, where Google's logo
 * and attribution sit.
 *
 * Desktop: map fills the section; heading + contact card float on the left over
 * a cream wash, the pin card sits above the pin, two fact cards bottom-right.
 * Phones: heading, then a map band with the pin card, then the contact card
 * overlapping the band's bottom edge.
 *
 * Motion: the map opens as a circle growing out of the pin, the pin card pops
 * in on a connector, fact cards drift gently; all of it is off for
 * prefers-reduced-motion.
 */

const EMAIL = "info@olivefoods.lk";
const ADDRESS = "292 Sea Street, Colombo 11, Sri Lanka 01100";
const DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=292+Sea+Street%2C+Colombo+11%2C+Sri+Lanka";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=292+Sea+Street%2C+Colombo+11%2C+Sri+Lanka";
const MAP_EMBED = "https://www.google.com/maps?q=292%20Sea%20Street%2C%20Colombo%2011%2C%20Sri%20Lanka&z=16&output=embed";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
/** Opening hours in Colombo time (src/data/company.json). Day 0 = Monday. */
const HOURS: { label: string; days: number[]; open?: number; close?: number }[] = [
  { label: "Mon – Fri", days: [0, 1, 2, 3, 4], open: 8.5, close: 17.5 },
  { label: "Saturday", days: [5], open: 8.5, close: 13 },
  { label: "Sunday", days: [6] },
];

const fmtHour = (h: number) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${hh < 12 ? "AM" : "PM"}`;
};

/** Current day (0 = Monday) and decimal hour in Asia/Colombo (UTC+5:30). */
function colomboNow() {
  const lk = new Date(Date.now() + 5.5 * 3_600_000);
  return { day: (lk.getUTCDay() + 6) % 7, hour: lk.getUTCHours() + lk.getUTCMinutes() / 60 };
}

function openStatus(day: number, hour: number) {
  const today = HOURS.find((h) => h.days.includes(day));
  if (today?.open != null && today.close != null) {
    if (hour >= today.open && hour < today.close) {
      const left = today.close - hour;
      return { open: true, label: left < 1 ? `Closes in ${Math.round(left * 60)} min` : `Open · closes ${fmtHour(today.close)}` };
    }
    if (hour < today.open) return { open: false, label: `Opens ${fmtHour(today.open)} today` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const h = HOURS.find((x) => x.days.includes(d));
    if (h?.open != null) return { open: false, label: `Opens ${fmtHour(h.open)} ${i === 1 ? "tomorrow" : DAY_NAMES[d]}` };
  }
  return { open: false, label: "Closed" };
}

const ease = [0.22, 1, 0.36, 1] as const;

function StatusPill({ open, label, reduced, compact = false }: { open: boolean; label: string; reduced: boolean; compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border font-body font-semibold ${
        compact ? "px-2 py-0.5 text-[11px]" : "px-3 py-1.5 text-xs"
      } ${open ? "border-emerald-600/20 bg-emerald-500/10 text-emerald-800" : "border-amber-600/20 bg-amber-500/10 text-amber-800"}`}
    >
      <span className="relative flex h-2 w-2">
        {!reduced && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${open ? "bg-emerald-500" : "bg-amber-500"}`} />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${open ? "bg-emerald-500" : "bg-amber-500"}`} />
      </span>
      {label}
    </span>
  );
}

function ContactRow({ icon: Icon, label, value, href, copy }: { icon: ComponentType<{ className?: string }>; label: string; value: string; href: string; copy: string }) {
  const [copied, setCopied] = useState(false);
  const external = href.startsWith("http");
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(copy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };
  return (
    <div className="group relative flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-primary/[0.045]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="min-w-0 flex-1 after:absolute after:inset-0 after:content-['']"
      >
        <span className="block font-body text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
        <span className="block truncate font-body text-[14.5px] font-medium text-foreground">{value}</span>
      </a>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label.toLowerCase()}`}
        className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/[0.08] hover:text-foreground"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={copied ? "ok" : "copy"} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.16 }}>
            {copied ? <Check className="h-4 w-4 text-emerald-700" /> : <Copy className="h-4 w-4" />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}

function FactCard({ icon: Icon, title, text, delay, drift, reduced }: { icon: ComponentType<{ className?: string }>; title: string; text: string; delay: number; drift: number; reduced: boolean }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -drift, 0] }}
        transition={{ duration: 6 + drift, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-auto flex w-[280px] items-start gap-3 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-[0_18px_44px_-26px_hsl(150_40%_10%/0.45)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Icon className="h-5 w-5" />
        </span>
        <span>
          <span className="block font-display text-[15px] font-semibold leading-tight text-foreground">{title}</span>
          <span className="mt-1 block font-body text-[13px] leading-snug text-muted-foreground">{text}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

const LocationsSection = () => {
  const reduced = !!useReducedMotion();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { once: true, margin: "-20% 0px" });
  const [now, setNow] = useState(colomboNow);
  useEffect(() => {
    const id = window.setInterval(() => setNow(colomboNow()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  const status = openStatus(now.day, now.hour);
  const shown = reduced || mapInView;

  return (
    <section id="find-us" aria-labelledby="find-us-title" className="relative isolate overflow-hidden bg-cream lg:flex lg:min-h-[820px] lg:flex-col lg:justify-center lg:py-20">
      {/* ── Heading ── */}
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 pt-section-base lg:px-8 lg:pb-6 lg:pt-0">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="pointer-events-auto max-w-xl lg:w-[400px] xl:w-[420px]"
        >
          <Eyebrow variant="pill" tone="accent" className="mb-5">
            Where to find us
          </Eyebrow>
          <h2 id="find-us-title" className="font-display text-4xl font-bold leading-[1.04] tracking-tight text-foreground sm:text-5xl">
            <SplitText text="Visit our" by="word" stagger={0.05} as="span" className="block" />
            <SplitText text="Colombo HQ" by="word" stagger={0.05} delay={0.15} as="span" className="block text-gradient-gold" tokenClassName="text-gradient-gold" />
          </h2>
          <p className="mt-4 font-body text-[15.5px] leading-relaxed text-muted-foreground">
            Office, bonded warehouse and cold store under one roof. Drop in, call or message — we reply within one business day.
          </p>
        </motion.div>
      </div>

      {/* ── Map: a band on phones, the whole section from lg ── */}
      <div ref={mapRef} className="relative h-[460px] sm:h-[540px] lg:absolute lg:inset-0 lg:z-0 lg:h-auto">
        <motion.div
          className="absolute inset-0 bg-[hsl(42_30%_90%)]"
          initial={false}
          animate={
            shown
              ? { clipPath: "circle(85% at 50% 50%)", scale: 1 }
              : { clipPath: "circle(0% at 50% 50%)", scale: 1.06 }
          }
          transition={{ duration: reduced ? 0 : 1.5, ease }}
        >
          <iframe
            src={MAP_EMBED}
            title="Map: Olive Foods, 292 Sea Street, Colombo 11"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
            style={{ filter: "saturate(0.7) contrast(0.96) brightness(1.02)" }}
          />
        </motion.div>

        {/* Washes for legibility. They stop short of the bottom edge, where
            Google's logo and attribution live. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cream to-transparent lg:h-36" />
        <div aria-hidden className="pointer-events-none absolute bottom-12 left-0 top-0 hidden w-[58%] bg-gradient-to-r from-cream via-cream/85 to-transparent lg:block" />

        {/* Ground ripple under Google's pin (the pin tip is the map centre). */}
        {!reduced && (
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute left-0 top-0 rounded-[50%] border-2 border-primary/50"
                initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0 }}
                animate={shown ? { width: [10, 120], height: [4, 48], x: [-5, -60], y: [-2, -24], opacity: [0.7, 0] } : undefined}
                transition={{ duration: 2.8, delay: 1.4 + i * 0.93, repeat: Infinity, ease: "easeOut" }}
              />
            ))}
          </div>
        )}

        {/* Pin card: sits above Google's pin, linked to it by a short line. */}
        <motion.a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={reduced ? false : { opacity: 0, y: 16, scale: 0.92 }}
          animate={shown ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ type: "spring", stiffness: 260, damping: 22, delay: reduced ? 0 : 1.05 }}
          className="group absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-[calc(100%+60px)] sm:-translate-x-[52px]"
          aria-label="Open Olive Foods HQ in Google Maps"
        >
          <span className="flex w-[248px] items-center gap-3 rounded-2xl border border-white/70 bg-white/90 p-3 pr-4 shadow-[0_20px_48px_-24px_hsl(150_40%_10%/0.55)] backdrop-blur-xl transition-transform duration-300 group-hover:-translate-y-0.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary">
              <img src={mark} alt="" className="h-7 w-7 brightness-0 invert" width={28} height={28} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate font-display text-[15px] font-semibold text-foreground">Olive Foods HQ</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </span>
              <span className="block truncate font-body text-xs text-muted-foreground">292 Sea Street, Colombo 11</span>
              <span className="mt-1.5 block">
                <StatusPill compact open={status.open} label={status.open ? "Open now" : "Closed now"} reduced={reduced} />
              </span>
            </span>
          </span>
          {/* connector: card → pin head */}
          <motion.span
            aria-hidden
            initial={reduced ? false : { scaleY: 0 }}
            animate={shown ? { scaleY: 1 } : undefined}
            transition={{ duration: 0.4, delay: reduced ? 0 : 1.35, ease }}
            className="absolute left-1/2 top-full block h-[14px] w-px origin-top bg-primary/50 sm:left-[52px]"
          />
        </motion.a>

        {/* Top-right: open in Maps */}
        <motion.a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={reduced ? false : { opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          className="absolute right-8 top-8 z-10 hidden h-10 items-center gap-1.5 rounded-full border border-white/70 bg-white/85 px-4 font-body text-xs font-semibold text-foreground shadow-[0_10px_30px_-18px_hsl(150_40%_10%/0.5)] backdrop-blur-xl transition-colors hover:bg-white lg:inline-flex"
        >
          <MapPin className="h-3.5 w-3.5 text-primary" /> Open in Google Maps <ArrowUpRight className="h-3.5 w-3.5" />
        </motion.a>

        {/* Bottom-right fact cards (desktop). Kept above Google's attribution. */}
        <div className="pointer-events-none absolute bottom-16 right-8 z-10 hidden flex-col items-end gap-3 lg:flex xl:right-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <FactCard icon={Snowflake} title="−18 °C cold chain" text="Frozen lines stored and delivered under cold chain." delay={0.7} drift={5} reduced={reduced} />
          <FactCard icon={Truck} title="All 25 districts" text="Island-wide delivery from our Colombo warehouse." delay={0.85} drift={7} reduced={reduced} />
        </div>
      </div>

      {/* ── Contact card ── */}
      <div className="pointer-events-none relative z-10 mx-auto mt-4 w-full max-w-7xl px-4 pb-section-base sm:px-6 lg:mt-0 lg:px-8 lg:pb-0">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.1, ease }}
          className="pointer-events-auto rounded-3xl border border-white/70 bg-white/90 p-5 shadow-[0_28px_70px_-36px_hsl(150_40%_10%/0.5)] backdrop-blur-xl sm:p-6 lg:w-[400px] xl:w-[420px]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <StatusPill open={status.open} label={status.label} reduced={reduced} />
            <span className="font-body text-[11px] text-muted-foreground">Colombo time</span>
          </div>

          <div className="mt-3 divide-y divide-border/70">
            <ContactRow icon={MapPin} label="Address" value="292 Sea Street, Colombo 11" href={DIRECTIONS_URL} copy={`Olive Foods (Pvt) Ltd, ${ADDRESS}`} />
            <ContactRow icon={Phone} label="Phone" value={PHONE_DISPLAY} href={PHONE_TEL} copy={PHONE_DISPLAY} />
            <ContactRow icon={Mail} label="Email" value={EMAIL} href={`mailto:${EMAIL}`} copy={EMAIL} />
          </div>

          <dl className="mt-3 space-y-1 rounded-2xl bg-primary/[0.04] p-3">
            {HOURS.map((h) => {
              const today = h.days.includes(now.day);
              return (
                <div key={h.label} className={`flex items-center justify-between rounded-lg px-2 py-1 font-body text-[13px] ${today ? "bg-white font-semibold text-foreground" : "text-muted-foreground"}`}>
                  <dt className="flex items-center gap-2">
                    {h.label}
                    {today && <span className="rounded-full bg-primary px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">Today</span>}
                  </dt>
                  <dd className="tabular-nums">{h.open != null && h.close != null ? `${fmtHour(h.open)} – ${fmtHour(h.close)}` : "Closed"}</dd>
                </div>
              );
            })}
          </dl>

          <div className="mt-5 flex gap-2">
            <Button asChild variant="hero" size="pill" className="group min-w-0 flex-1 px-5 font-body sm:px-7">
              <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                <Navigation className="mr-1 h-4 w-4" />
                Get directions
                <ArrowUpRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button asChild variant="brandOutline" size="pill" className="px-5 font-body sm:px-7">
              <a href={PHONE_TEL}>
                <Phone className="mr-1 h-4 w-4" /> Call
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Fact cards on phones and tablets */}
        <div className="pointer-events-auto mt-4 grid gap-3 sm:grid-cols-2 lg:hidden">
          {[
            { icon: Snowflake, title: "−18 °C cold chain", text: "Frozen lines stored and delivered under cold chain." },
            { icon: Truck, title: "All 25 districts", text: "Island-wide delivery from our Colombo warehouse." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3 rounded-2xl border border-border bg-white/70 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-[15px] font-semibold text-foreground">{title}</span>
                <span className="mt-0.5 block font-body text-[13px] leading-snug text-muted-foreground">{text}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
