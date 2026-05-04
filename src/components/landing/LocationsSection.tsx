import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MapPin, Phone, Mail, Copy, Check, ArrowUpRight, Navigation,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SplitText from "@/components/motion/SplitText";
import Eyebrow from "@/components/ui/eyebrow";

/**
 * "Where to Find Us" — editorial split layout.
 *
 * Left column: a contact card with live "open / closed" status (computed
 * from current Sri Lanka time, UTC+5:30), copy-to-clipboard rows for
 * address / phone / email, a days-of-week strip with today highlighted,
 * and a "Get Directions" CTA.
 *
 * Right column: a framed Google Maps iframe with a custom decorative
 * pin overlay (drop-in animation + radar pulse) positioned approximately
 * over the office. A small "Open in Google Maps" pill anchors the
 * bottom-right corner for the real-utility action.
 */

const ADDRESS = "Olive Foods (Pvt) Ltd\nColombo, Sri Lanka";
const PHONE = "+94 11 207 1717";
const EMAIL = "info@olivefoods.lk";
const MAPS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Olive+Foods+Pvt+Ltd+Colombo+Sri+Lanka";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// Office hours in Sri Lanka local time. Mon-Fri only.
const OPEN_HOUR = 8.5;   // 08:30
const CLOSE_HOUR = 17.5; // 17:30

/** Compute current Colombo (Asia/Colombo, UTC+5:30) day & decimal hour. */
function colomboNow() {
  const now = new Date();
  // Convert to UTC+5:30 by adding offset then formatting as if UTC.
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  const lk = new Date(utc + 5.5 * 60 * 60_000);
  return {
    dayIdx: (lk.getDay() + 6) % 7, // 0=Mon ... 6=Sun
    hour: lk.getHours() + lk.getMinutes() / 60,
  };
}

function formatStatus(dayIdx: number, hour: number) {
  const isWeekday = dayIdx <= 4;
  if (isWeekday && hour >= OPEN_HOUR && hour < CLOSE_HOUR) {
    const left = CLOSE_HOUR - hour;
    if (left < 1) {
      const mins = Math.round(left * 60);
      return { open: true, label: `Closes in ${mins} min` };
    }
    return { open: true, label: `Open · Closes 5:30 PM` };
  }
  // Closed — work out next opening
  let nextDay = dayIdx;
  let dayDelta = 0;
  if (isWeekday && hour < OPEN_HOUR) {
    return { open: false, label: `Opens 8:30 AM today` };
  }
  // Skip to next weekday
  for (let i = 1; i <= 7; i++) {
    const d = (dayIdx + i) % 7;
    if (d <= 4) { nextDay = d; dayDelta = i; break; }
  }
  const dayName = DAYS[nextDay];
  return {
    open: false,
    label: dayDelta === 1
      ? `Opens 8:30 AM tomorrow`
      : `Opens 8:30 AM ${dayName}`,
  };
}

const ContactRow = ({
  icon: Icon,
  label,
  value,
  href,
  copyText,
  multiline,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  href?: string;
  copyText?: string;
  multiline?: boolean;
}) => {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(copyText ?? value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — silently noop */
    }
  };

  const Inner = (
    <div className="relative flex items-start gap-4 px-4 py-4 -mx-4 rounded-xl transition-colors duration-300">
      {/* Hover bg */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-xl bg-primary-foreground/[0.04] pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      {/* Active bar on hover */}
      <motion.span
        aria-hidden
        className="absolute left-0 top-3 bottom-3 w-[2px] rounded-r-full bg-primary-foreground/60 origin-top"
        animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative w-10 h-10 rounded-xl bg-primary-foreground/[0.06] border border-primary-foreground/10 flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5 text-primary-foreground/75" strokeWidth={1.6} />
      </div>

      <div className="relative min-w-0 flex-1">
        <p className="font-body text-[10.5px] tracking-[0.28em] uppercase text-primary-foreground/45 mb-1">
          {label}
        </p>
        <p
          className={`font-body text-[14.5px] text-primary-foreground/90 leading-snug ${
            multiline ? "whitespace-pre-line" : ""
          }`}
        >
          {value}
        </p>
      </div>

      {copyText && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${label.toLowerCase()}`}
          className="relative shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-primary-foreground/55 hover:text-primary-foreground hover:bg-primary-foreground/[0.06] transition-colors duration-200"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="ok"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18 }}
                className="text-primary-foreground"
              >
                <Check className="w-4 h-4" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18 }}
              >
                <Copy className="w-4 h-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      )}

      {href && !copyText && (
        <ArrowUpRight className="relative w-4 h-4 text-primary-foreground/45 group-hover:text-primary-foreground transition-colors" />
      )}
    </div>
  );

  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block group"
    >
      {Inner}
    </a>
  ) : (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group"
    >
      {Inner}
    </div>
  );
};

/** Decorative pin marker (drop-in + radar pulse). Position passed via style. */
const AnimatedPin = ({ reduced }: { reduced: boolean }) => (
  <motion.div
    initial={reduced ? false : { y: -120, opacity: 0 }}
    whileInView={reduced ? undefined : { y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ type: "spring", stiffness: 280, damping: 16, mass: 0.7, delay: 0.4 }}
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full pointer-events-none"
  >
    {/* Radar pulses on the ground */}
    {!reduced && (
      <div className="absolute left-1/2 top-full -translate-x-1/2 w-1 h-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/70"
            initial={{ width: 8, height: 8, opacity: 0 }}
            animate={{
              width: [8, 80],
              height: [8, 80],
              opacity: [0.7, 0],
            }}
            transition={{
              duration: 2.6,
              delay: 1 + i * 0.9,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    )}

    {/* Pin */}
    <div className="relative flex flex-col items-center">
      <div className="relative">
        <div
          className="w-12 h-12 rounded-full bg-primary border-2 border-primary-foreground flex items-center justify-center shadow-[0_10px_30px_-6px_rgba(0,0,0,0.7)]"
          style={{ boxShadow: "0 12px 32px -8px hsl(150 40% 6% / 0.7)" }}
        >
          <MapPin className="w-5 h-5 text-primary-foreground" strokeWidth={2} fill="currentColor" />
        </div>
        {/* Pin tail (triangle below the circle) */}
        <div
          aria-hidden
          className="absolute left-1/2 top-full -translate-x-1/2 -mt-1 w-0 h-0"
          style={{
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "14px solid hsl(var(--primary-foreground))",
          }}
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-full -translate-x-1/2 -mt-1 w-0 h-0"
          style={{
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "12px solid hsl(var(--primary))",
            transform: "translate(-50%, -1px)",
          }}
        />
      </div>
    </div>
  </motion.div>
);

const LocationsSection = () => {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [now, setNow] = useState(colomboNow);

  // Tick once a minute so the live status stays fresh while the user lingers.
  useEffect(() => {
    const id = window.setInterval(() => setNow(colomboNow()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const status = formatStatus(now.dayIdx, now.hour);

  return (
    <section
      ref={sectionRef}
      data-navbar-theme="dark"
      className="relative overflow-hidden py-section-base lg:py-section-base-lg"
    >
      {/* Dark gradient background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, hsl(140 50% 19% / 0.5) 0%, transparent 55%),
            radial-gradient(ellipse at 75% 80%, hsl(150 40% 14% / 0.4) 0%, transparent 55%),
            linear-gradient(180deg, hsl(150 40% 6%), hsl(140 50% 13%), hsl(150 40% 9%))
          `,
        }}
      />

      {/* Wireframe street-grid texture — subtle SVG lines suggesting a map. */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="street-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            <path d="M 0 40 L 80 40 M 40 0 L 40 80" fill="none" stroke="white" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#street-grid)" />
      </svg>

      {/* Decorative orbs */}
      <div
        aria-hidden
        className="absolute w-[500px] h-[500px] -top-40 -left-40 rounded-full opacity-[0.06] pointer-events-none animate-orb"
        style={{ background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute w-[350px] h-[350px] bottom-0 right-0 rounded-full opacity-[0.05] pointer-events-none animate-orb"
        style={{
          background: "radial-gradient(circle, hsl(140 55% 22%), transparent 70%)",
          animationDelay: "9s",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mb-14 lg:mb-20"
        >
          <Eyebrow variant="pill" tone="white" className="mb-7">
            Where to Find Us
          </Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-[64px] font-bold text-primary-foreground leading-[1.02] tracking-tight">
            <SplitText text="Visit our" by="word" stagger={0.05} as="span" className="block" />
            
              <SplitText className="text-gradient-gold block" text="Colombo HQ" by="word" stagger={0.05} delay={0.18} as="span" />
            
          </h2>
          <p className="font-body text-[16.5px] leading-relaxed text-primary-foreground/65 mt-7 max-w-xl">
            One bonded warehouse, one cold-chain, one office that ties the
            whole network together. Drop in or reach out — we keep the kettle
            on.
          </p>
        </motion.div>

        {/* Two-col split */}
        <div className="grid lg:grid-cols-[5fr_7fr] gap-10 lg:gap-12 items-stretch">
          {/* ── LEFT: Contact card ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl border border-primary-foreground/10 p-7 lg:p-9 backdrop-blur-sm"
            style={{
              background:
                "linear-gradient(155deg, hsl(140 50% 19% / 0.45), hsl(150 40% 9% / 0.6))",
            }}
          >
            {/* Live status badge */}
            <div className="flex items-center justify-between mb-7">
              <div
                className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border text-[11px] font-body font-semibold tracking-[0.18em] uppercase ${
                  status.open
                    ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-300"
                    : "bg-amber-400/10 border-amber-400/30 text-amber-300"
                }`}
              >
                <span className="relative flex w-2 h-2">
                  {!reduced && (
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        status.open ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      status.open ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                </span>
                {status.label}
              </div>
              <span className="font-body text-[10.5px] tracking-[0.28em] uppercase text-primary-foreground/40">
                Local · UTC+5:30
              </span>
            </div>

            {/* Office name */}
            <h3 className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground leading-tight tracking-tight mb-1">
              Olive Foods (Pvt) Ltd
            </h3>
            <p className="font-body text-[13px] tracking-[0.18em] uppercase text-primary-foreground/55 mb-6">
              Headquarters · Colombo, Sri Lanka
            </p>

            <div className="h-px bg-gradient-to-r from-primary-foreground/20 via-primary-foreground/5 to-transparent mb-3" />

            {/* Contact rows */}
            <div className="divide-y divide-primary-foreground/5">
              <ContactRow
                icon={MapPin}
                label="Address"
                value={ADDRESS}
                href={MAPS_URL}
                copyText="Olive Foods (Pvt) Ltd, Colombo, Sri Lanka"
                multiline
              />
              <ContactRow
                icon={Phone}
                label="Phone"
                value={PHONE}
                href={`tel:${PHONE.replace(/\s+/g, "")}`}
                copyText={PHONE}
              />
              <ContactRow
                icon={Mail}
                label="Email"
                value={EMAIL}
                href={`mailto:${EMAIL}`}
                copyText={EMAIL}
              />
            </div>

            <div className="h-px bg-gradient-to-r from-primary-foreground/20 via-primary-foreground/5 to-transparent mt-3 mb-7" />

            {/* Days strip */}
            <div className="mb-8">
              <p className="font-body text-[10.5px] tracking-[0.28em] uppercase text-primary-foreground/45 mb-3">
                Open hours · 8:30 — 17:30
              </p>
              <div className="flex gap-1.5">
                {DAYS.map((d, i) => {
                  const isToday = i === now.dayIdx;
                  const isWeekday = i <= 4;
                  return (
                    <div
                      key={d}
                      className={`relative flex-1 text-center py-2.5 rounded-lg font-body text-[11px] tracking-[0.16em] uppercase transition-colors ${
                        isWeekday
                          ? "bg-primary-foreground/[0.06] text-primary-foreground/85"
                          : "text-primary-foreground/30"
                      }`}
                    >
                      {d}
                      {isToday && (
                        <motion.span
                          layoutId="today-bar"
                          className="absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full bg-primary-foreground"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <Link to={MAPS_URL.replace("https://www.google.com", "")} className="hidden" />
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button variant="hero" size="pill" className="font-body group">
                <Navigation className="w-4 h-4 mr-1" />
                Get Directions
                <ArrowUpRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </a>
          </motion.div>

          {/* ── RIGHT: Map card with overlay pin ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden border border-primary-foreground/10 shadow-2xl shadow-black/40 min-h-[460px] lg:min-h-[560px]"
          >
            {/* The map iframe — slightly desaturated to feel editorial */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585953498!2d79.7861!3d6.9271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0, filter: "saturate(0.85) contrast(0.95) brightness(0.92)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Olive Foods Location"
            />

            {/* Top-edge gradient for top-left chip legibility */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-24 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, hsl(150 40% 6% / 0.7), transparent)",
              }}
            />
            {/* Bottom-edge gradient */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
              style={{
                background:
                  "linear-gradient(0deg, hsl(150 40% 6% / 0.7), transparent)",
              }}
            />

            {/* Top-left "Live HQ" chip */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute top-5 left-5 inline-flex items-center gap-2.5 px-3 py-2 rounded-full bg-primary-foreground/[0.08] backdrop-blur-md border border-primary-foreground/15"
            >
              <span className="relative flex w-1.5 h-1.5">
                {!reduced && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground/70 opacity-70" />
                )}
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-foreground" />
              </span>
              <span className="font-body text-[10.5px] tracking-[0.28em] uppercase text-primary-foreground/95 font-semibold">
                Olive Foods · HQ
              </span>
            </motion.div>

            {/* Decorative animated pin centered over the map */}
            <AnimatedPin reduced={!!reduced} />

            {/* Bottom-left coordinates chip + bottom-right open-in-maps link */}
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
              <div className="font-body text-[10.5px] tracking-[0.28em] uppercase text-primary-foreground/65 leading-tight">
                <div>06°55′N · 79°51′E</div>
                <div className="text-primary-foreground/40">Colombo · Western Province</div>
              </div>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary-foreground/[0.08] backdrop-blur-md border border-primary-foreground/15 hover:bg-primary-foreground/[0.14] transition-colors"
              >
                <span className="font-body text-[11px] font-semibold text-primary-foreground/95">
                  Open in Maps
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-primary-foreground/95" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
