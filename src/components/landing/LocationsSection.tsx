import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Mail, MapPin, Navigation, Phone, Snowflake, Truck } from "lucide-react";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { Button } from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import SplitText from "@/components/motion/SplitText";
import mark from "@/assets/olive-mark.svg";
import { LANES, whatsappHref, whatsappMessage } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";
import { HOURS, fmtHour, openStatus, useColomboNow } from "@/lib/hours";
import StatusPill from "@/components/StatusPill";

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
 * Dark section: Google's embed has no dark style, so the map is inverted and
 * hue-rotated back (invert + hue-rotate(180°) keeps every hue — Google's red pin
 * stays red — while flipping light to dark), then washed in forest green.
 *
 * Desktop: map fills the section; heading + contact card float on the left over
 * a forest wash, the pin card sits above the pin, two fact cards bottom-right.
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

/**
 * The embed's own corner UI (top-left: an "Open in Maps" box, or on frames
 * wider than ~400px an address card ~110px tall; bottom-left: the satellite
 * thumbnail) looks like stray UI on a dark map, so the iframe is oversized to
 * the left and top (--crop-x / --crop-y, set on the map wrapper) and those
 * corners fall outside the frame. Phones crop more from the top: their frame
 * is wide enough to get the tall address card, and their top wash is short.
 * The bottom and right edges are never cropped: Google's logo and attribution
 * live there. Cropping moves the map's centre — and so Google's pin — half
 * the crop up and left, which is where PIN_X/PIN_Y put the overlays that
 * point at it.
 */
const CROP_VARS = "[--crop-x:64px] [--crop-y:124px] lg:[--crop-y:64px]";
const PIN_X = "calc(50% - var(--crop-x) / 2)";
const PIN_Y = "calc(50% - var(--crop-y) / 2)";

const ease = [0.22, 1, 0.36, 1] as const;

function ContactRow({ icon: Icon, label, value, href, copy, track }: { icon: ComponentType<{ className?: string }>; label: string; value: string; href: string; copy: string; track?: string }) {
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
    <div className="group relative flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-primary-foreground/[0.05]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary-foreground/10 bg-primary-foreground/[0.06] text-primary-foreground/80 transition-colors group-hover:border-transparent group-hover:bg-gold group-hover:text-forest-deep">
        <Icon className="h-4 w-4" />
      </span>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        data-track={track}
        data-track-item={track ? "find_us" : undefined}
        className="min-w-0 flex-1 after:absolute after:inset-0 after:content-['']"
      >
        <span className="block font-body text-[11px] font-medium uppercase tracking-[0.16em] text-primary-foreground/50">{label}</span>
        <span className="block truncate font-body text-[14.5px] font-medium text-primary-foreground/90">{value}</span>
      </a>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label.toLowerCase()}`}
        className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-primary-foreground/50 transition-colors hover:bg-primary-foreground/[0.08] hover:text-primary-foreground"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={copied ? "ok" : "copy"} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.16 }}>
            {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
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
        className="pointer-events-auto flex w-[280px] items-start gap-3 rounded-2xl p-4 border border-primary-foreground/10 bg-[hsl(150_40%_7%/0.78)] backdrop-blur-xl shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:-translate-y-0.5"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold text-forest-deep">
          <Icon className="h-5 w-5" />
        </span>
        <span>
          <span className="block font-display text-[15px] font-semibold leading-tight text-primary-foreground">{title}</span>
          <span className="mt-1 block font-body text-[13px] leading-snug text-primary-foreground/60">{text}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

const LocationsSection = () => {
  const reduced = !!useReducedMotion();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInView = useInView(mapRef, { once: true, margin: "-20% 0px" });
  const now = useColomboNow();
  const status = openStatus(now.day, now.hour);
  const shown = reduced || mapInView;

  // The map ignores the pointer until it's clicked, so scrolling over it scrolls
  // the page and Google never shows its "use ctrl + scroll to zoom" overlay (or
  // the "use two fingers" one on phones). Desktop: click to drag/zoom; it lets
  // go again when the pointer leaves. Touch screens: it stays a static map
  // (Directions and "Open in Google Maps" cover the rest).
  const [mapActive, setMapActive] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section id="find-us" aria-labelledby="find-us-title" className="relative isolate overflow-hidden bg-[hsl(150_40%_5%)] lg:flex lg:min-h-[820px] lg:flex-col lg:justify-center lg:py-20">
      {/* ── Heading ── */}
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 pt-section-base lg:px-8 lg:pb-6 lg:pt-0">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="pointer-events-auto max-w-xl lg:w-[400px] xl:w-[420px]"
        >
          <Eyebrow variant="pill" tone="white" className="mb-5">
            Where to find us
          </Eyebrow>
          <h2 id="find-us-title" className="font-display text-4xl font-bold leading-[1.04] tracking-tight text-primary-foreground sm:text-5xl">
            <SplitText text="Visit our" by="word" stagger={0.05} as="span" className="block" />
            <SplitText text="Colombo HQ" by="word" stagger={0.05} delay={0.15} as="span" className="block text-gradient-gold-dark" tokenClassName="text-gradient-gold-dark" />
          </h2>
          <p className="mt-4 font-body text-[15.5px] leading-relaxed text-primary-foreground/65">
            Office, bonded warehouse and cold store under one roof. Drop in, call or message — we reply within one business day.
          </p>
        </motion.div>
      </div>

      {/* ── Map: a band on phones, the whole section from lg ── */}
      <div ref={mapRef} onPointerLeave={() => setMapActive(false)} className={`group/map relative h-[460px] sm:h-[540px] lg:absolute lg:inset-0 lg:z-0 lg:h-auto ${CROP_VARS}`}>
        <motion.div
          className="absolute inset-0 overflow-hidden bg-[hsl(150_30%_9%)]"
          initial={false}
          animate={
            shown
              ? { clipPath: "circle(85% at 50% 50%)", scale: 1 }
              : { clipPath: "circle(0% at 50% 50%)", scale: 1.06 }
          }
          transition={{ duration: reduced ? 0 : 1.5, ease }}
        >
          {/* No allowFullScreen: without it Google drops its fullscreen button too. */}
          <iframe
            src={MAP_EMBED}
            title="Map: Olive Foods, 292 Sea Street, Colombo 11"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute border-0"
            style={{
              left: "calc(-1 * var(--crop-x))",
              top: "calc(-1 * var(--crop-y))",
              width: "calc(100% + var(--crop-x))",
              height: "calc(100% + var(--crop-y))",
              filter: "invert(0.9) hue-rotate(180deg) saturate(0.9) brightness(0.98) contrast(0.92)",
              pointerEvents: mapActive ? "auto" : "none",
            }}
          />
          {finePointer && !mapActive && (
            <button
              type="button"
              onClick={() => setMapActive(true)}
              aria-label="Use the map: drag to move, scroll to zoom"
              className="absolute inset-0 cursor-grab"
            />
          )}
        </motion.div>
        {/* Hint, desktop only, while the map is idle and hovered. */}
        {finePointer && !mapActive && (
          <span className="pointer-events-none absolute bottom-16 left-1/2 z-10 -translate-x-1/2 rounded-full border border-primary-foreground/10 bg-[hsl(150_40%_7%/0.8)] px-3 py-1.5 font-body text-[11px] font-medium text-primary-foreground/80 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover/map:opacity-100">
            Click the map to move around
          </span>
        )}

        {/* Washes for legibility. The side wash fades out before the bottom
            edge, where Google's logo and attribution live. */}
        {/* Forest tint over the darkened map (light: the pin keeps its red). */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[hsl(150_45%_14%)] opacity-15 mix-blend-multiply" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[hsl(150_40%_5%)] to-transparent lg:h-36" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[58%] bg-gradient-to-r from-[hsl(150_40%_5%)] via-[hsl(150_40%_5%/0.85)] to-transparent [mask-image:linear-gradient(to_bottom,black_78%,transparent_97%)] lg:block" />

        {/* Ground ripple under Google's pin (the pin tip is the map centre). */}
        {!reduced && (
          <div aria-hidden className="pointer-events-none absolute" style={{ left: PIN_X, top: PIN_Y }}>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute left-0 top-0 rounded-[50%] border-2 border-gold/70"
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
          style={{ left: PIN_X, top: PIN_Y }}
          className="group absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+60px)] sm:-translate-x-[52px]"
          aria-label="Open Olive Foods HQ in Google Maps"
        >
          <span className="flex w-[248px] items-center gap-3 rounded-2xl p-3 pr-4 border border-primary-foreground/10 bg-[hsl(150_40%_7%/0.78)] backdrop-blur-xl shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold">
              <img src={mark} alt="" className="h-7 w-7 brightness-0" width={28} height={28} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate font-display text-[15px] font-semibold text-primary-foreground">Olive Foods HQ</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-primary-foreground/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-foreground" />
              </span>
              <span className="block truncate font-body text-xs text-primary-foreground/60">292 Sea Street, Colombo 11</span>
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
            className="absolute left-1/2 top-full block h-[14px] w-px origin-top bg-gold/70 sm:left-[52px]"
          />
        </motion.a>

        {/* Top-right: open in Maps (clear of the fixed navbar) */}
        <motion.a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={reduced ? false : { opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          className="absolute right-8 top-28 z-10 hidden h-10 items-center gap-1.5 rounded-full px-4 font-body text-xs font-semibold text-primary-foreground border border-primary-foreground/10 bg-[hsl(150_40%_7%/0.78)] backdrop-blur-xl shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] transition-colors hover:bg-[hsl(150_40%_10%/0.9)] lg:inline-flex"
        >
          <MapPin className="h-3.5 w-3.5 text-gold" /> Open in Google Maps <ArrowUpRight className="h-3.5 w-3.5" />
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
          className="pointer-events-auto rounded-3xl p-5 border border-primary-foreground/10 bg-[hsl(150_40%_7%/0.78)] backdrop-blur-xl shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] sm:p-6 lg:w-[400px] xl:w-[420px]"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <StatusPill open={status.open} label={status.label} reduced={reduced} />
            <span className="font-body text-[11px] text-primary-foreground/50">Colombo time</span>
          </div>

          <div className="mt-3 divide-y divide-primary-foreground/[0.07]">
            <ContactRow icon={MapPin} label="Address" value="292 Sea Street, Colombo 11" href={DIRECTIONS_URL} copy={`Olive Foods (Pvt) Ltd, ${ADDRESS}`} />
            {/* The two lines, each labelled by who it's for (lib/contact LANES). */}
            <ContactRow icon={WhatsAppIcon} label={LANES.business.label} value={LANES.business.display} href={whatsappHref(whatsappMessage())} copy={LANES.business.display} track="contact_business_whatsapp" />
            <ContactRow icon={Phone} label={LANES.general.label} value={LANES.general.display} href={LANES.general.tel} copy={LANES.general.display} track="contact_general_call" />
            <ContactRow icon={Mail} label="Email" value={EMAIL} href={`mailto:${EMAIL}`} copy={EMAIL} />
          </div>

          <dl className="mt-3 space-y-1 rounded-2xl border border-primary-foreground/[0.06] bg-primary-foreground/[0.03] p-3">
            {HOURS.map((h) => {
              const today = h.days.includes(now.day);
              return (
                <div key={h.label} className={`flex items-center justify-between rounded-lg px-2 py-1 font-body text-[13px] ${today ? "bg-primary-foreground/[0.08] font-semibold text-primary-foreground" : "text-primary-foreground/60"}`}>
                  <dt className="flex items-center gap-2">
                    {h.label}
                    {today && <span className="rounded-full bg-gold px-1.5 py-px text-[10px] font-semibold uppercase tracking-wider text-forest-deep">Today</span>}
                  </dt>
                  <dd className="tabular-nums">{h.open != null && h.close != null ? `${fmtHour(h.open)} – ${fmtHour(h.close)}` : "Closed"}</dd>
                </div>
              );
            })}
          </dl>

          <div className="mt-5 flex gap-2">
            <Button asChild size="pill" className="group min-w-0 flex-1 bg-primary-foreground px-5 font-body text-forest-deep hover:bg-primary-foreground/90 sm:px-7">
              <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                <Navigation className="mr-1 h-4 w-4" />
                Get directions
                <ArrowUpRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button asChild variant="heroOutline" size="pill" className="px-5 font-body sm:px-6">
              <a href={whatsappHref(whatsappMessage())} target="_blank" rel="noopener noreferrer" data-track="contact_business_whatsapp" data-track-item="find_us_button">
                <WhatsAppIcon className="mr-1 h-4 w-4 text-[#25D366]" /> Sales
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
            <div key={title} className="flex items-start gap-3 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold text-forest-deep">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-[15px] font-semibold text-primary-foreground">{title}</span>
                <span className="mt-0.5 block font-body text-[13px] leading-snug text-primary-foreground/60">{text}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
