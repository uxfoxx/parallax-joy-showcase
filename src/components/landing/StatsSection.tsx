import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import SplitText from "@/components/motion/SplitText";
import CountUp from "@/components/motion/CountUp";
import Eyebrow from "@/components/ui/eyebrow";

/**
 * Global Origins — combined sourcing-map + headline stats.
 *
 * Three zones in one composition:
 *   1. Header — H2 + sub-copy on the left, four headline stats on the
 *      right (folded in from the deleted DarkStatsBanner).
 *   2. Map + info panel — bigger map, dotted-continent backdrop,
 *      richer right-rail with region, specialty, lead time, and
 *      the brand tags shipped from that country.
 *   3. Country strip — eight numbered chips along the bottom acting
 *      as both navigation and table-of-contents.
 *
 * File name kept as StatsSection.tsx so Index.tsx imports don't churn.
 */

type Origin = {
  key: string;
  country: string;
  flag: string;
  region: string;
  brands: string[];
  pos: { x: number; y: number };
};

const HUB = { x: 725, y: 231 };

const origins: Origin[] = [
  {
    key: "netherlands", country: "Netherlands", flag: "🇳🇱",
    region: "Northern Europe",
    brands: ["Remia", "Daily Dairy", "Snorre Foods"],
    pos: { x: 514, y: 106 },
  },
  {
    key: "belgium", country: "Belgium", flag: "🇧🇪",
    region: "Western Europe",
    brands: ["BON VEGATO", "HUNGRITOS"],
    pos: { x: 524, y: 118 },
  },
  {
    key: "italy", country: "Italy", flag: "🇮🇹",
    region: "Southern Europe",
    brands: ["Granoro", "Donna Chiara", "Mizkan"],
    pos: { x: 544, y: 138 },
  },
  {
    key: "uae", country: "UAE", flag: "🇦🇪",
    region: "Middle East",
    brands: ["Falcon", "Royal Arm", "Super Chef"],
    pos: { x: 650, y: 183 },
  },
  {
    key: "india", country: "India", flag: "🇮🇳",
    region: "South Asia",
    brands: ["AZIZAA"],
    pos: { x: 717, y: 189 },
  },
  {
    key: "china", country: "China", flag: "🇨🇳",
    region: "East Asia",
    brands: ["Wai Wai", "Fletcher"],
    pos: { x: 792, y: 153 },
  },
  {
    key: "thailand", country: "Thailand", flag: "🇹🇭",
    region: "South-East Asia",
    brands: ["Hungritos"],
    pos: { x: 778, y: 208 },
  },
  {
    key: "singapore", country: "Singapore", flag: "🇸🇬",
    region: "South-East Asia",
    brands: ["BON VEGATO", "ABC"],
    pos: { x: 786, y: 247 },
  },
  {
    key: "australia", country: "Australia", flag: "🇦🇺",
    region: "Oceania",
    brands: ["WAGU"],
    pos: { x: 875, y: 319 },
  },
  {
    key: "brazil", country: "Brazil", flag: "🇧🇷",
    region: "South America",
    brands: ["Imported"],
    pos: { x: 470, y: 248 },
  },
];

type HeadlineStat = {
  value: number;
  suffix: string;
  label: string;
  isText?: boolean;
  displayText?: string;
};

const HEADLINE_STATS: HeadlineStat[] = [
  { value: 10, suffix: "", label: "Source countries" },
  { value: 4, suffix: "+", label: "Trade channels" },
  {
    value: 0, suffix: "", label: "Delivery coverage",
    isText: true, displayText: "Island-wide",
  },
  {
    value: 0, suffix: "", label: "Cold-chain certified",
    isText: true, displayText: "−18 °C",
  },
];

/** Quadratic curve from `from` to `to`, lifted perpendicular so it bows up. */
function arcPath(from: { x: number; y: number }, to: { x: number; y: number }) {
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) { nx = -nx; ny = -ny; }
  const lift = len * 0.22;
  const cp = { x: mid.x + nx * lift, y: mid.y + ny * lift };
  return `M ${from.x} ${from.y} Q ${cp.x} ${cp.y} ${to.x} ${to.y}`;
}

function labelAnchor(o: Origin): { x: number; y: number; anchor: "start" | "end" } {
  const anchor = o.pos.x > 780 ? "end" : "start";
  return {
    x: anchor === "end" ? o.pos.x - 12 : o.pos.x + 12,
    y: o.pos.y - 10,
    anchor,
  };
}

/** Stippled "world" backdrop — pseudo-continents drawn as dot densities.
 *  Not real cartography; gives the map a sense of land vs ocean. The
 *  dots cluster around continent centroids that line up with the eight
 *  origin positions, so the visual ties to the data. */
const CONTINENT_BLOBS = [
  // Europe
  { cx: 524, cy: 120, r: 65, density: 0.65 },
  // Middle East / N. Africa
  { cx: 600, cy: 200, r: 55, density: 0.45 },
  // South Asia
  { cx: 715, cy: 195, r: 50, density: 0.55 },
  // East Asia
  { cx: 800, cy: 165, r: 70, density: 0.6 },
  // SE Asia
  { cx: 785, cy: 230, r: 45, density: 0.5 },
  // Oceania
  { cx: 870, cy: 320, r: 55, density: 0.45 },
  // South America
  { cx: 470, cy: 250, r: 60, density: 0.5 },
];

const Stipple = () => {
  const dots: { x: number; y: number; r: number }[] = [];
  // Deterministic random with a seeded LCG so SSR/CSR match.
  let seed = 1337;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (const blob of CONTINENT_BLOBS) {
    const count = Math.round(blob.r * blob.density * 2.2);
    for (let i = 0; i < count; i++) {
      // Polar sample biased toward center for a soft falloff.
      const angle = rand() * Math.PI * 2;
      const dist = Math.pow(rand(), 0.6) * blob.r;
      dots.push({
        x: blob.cx + Math.cos(angle) * dist,
        y: blob.cy + Math.sin(angle) * dist,
        r: 0.6 + rand() * 0.6,
      });
    }
  }

  return (
    <g fill="hsl(var(--forest-mid) / 0.32)">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} />
      ))}
    </g>
  );
};

const StatsSection = () => {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(mapRef, { once: true, margin: "-80px" });

  const [active, setActive] = useState(3);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    if (userInteracted || reduced) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % origins.length),
      4200,
    );
    return () => window.clearInterval(id);
  }, [userInteracted, reduced]);

  const current = origins[active];
  const pick = (i: number) => {
    setActive(i);
    setUserInteracted(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-section-base lg:py-section-base-lg bg-background"
    >
      {/* Editorial dot-grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--forest-mid) / 0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="absolute w-[520px] h-[520px] -top-24 -left-24 rounded-full opacity-[0.05] pointer-events-none animate-orb"
        style={{ background: "radial-gradient(circle, hsl(140 55% 25%), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute w-[360px] h-[360px] bottom-10 right-0 rounded-full opacity-[0.04] pointer-events-none animate-orb"
        style={{
          background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)",
          animationDelay: "7s",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* ── Zone 1: Header + headline stats ── */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-end mb-14 lg:mb-20">
          <div>
            <Eyebrow variant="pill" tone="accent" className="mb-7">
              Global Origins
            </Eyebrow>
            <h2 className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-[64px] font-bold text-foreground leading-[1.02] tracking-tight">
              <SplitText text="Sourced where" by="word" stagger={0.05} as="span" className="block" />
              <span className="text-gradient-gold block">
                <SplitText text="it grows best" by="word" stagger={0.05} delay={0.2} as="span" />
              </span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-body text-[17px] leading-relaxed text-muted-foreground max-w-xl mt-7"
            >
              Every origin is a relationship — built over thirty-plus
              years between our team and the producers we source from.
              Hover any country to see what we bring in.
            </motion.p>
          </div>

          {/* Headline stats — 2×2 grid that absorbs the old DarkStatsBanner. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-7 lg:gap-y-9 lg:pl-8 lg:border-l lg:border-border">
            {HEADLINE_STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative"
              >
                <span
                  aria-hidden
                  className="block w-7 h-[2px] bg-accent rounded-full mb-3"
                />
                <div className={`font-display font-bold text-foreground leading-none tracking-tight ${
                  s.isText ? "text-[28px] lg:text-[36px]" : "text-[44px] lg:text-[56px] tabular-nums"
                }`}>
                  {s.isText ? (
                    <span>{s.displayText}</span>
                  ) : (
                    <CountUp to={s.value} suffix={s.suffix} duration={2.5} />
                  )}
                </div>
                <p className="font-body text-[11px] tracking-[0.22em] uppercase text-muted-foreground mt-3">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hairline rule between header and map */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}
          className="h-px w-full bg-gradient-to-r from-border via-border/60 to-transparent mb-12 lg:mb-16"
        />

        {/* ── Zone 2: Map + info panel ── */}
        <div className="grid lg:grid-cols-[1.55fr_1fr] gap-10 lg:gap-14 items-start">
          <motion.div
            ref={mapRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Top-left coordinate label — adds editorial detail. */}
            <div className="absolute -top-2 left-0 font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/70 select-none pointer-events-none">
              06°55′N · 79°51′E · Colombo
            </div>

            {/* Compass-rose corner mark */}
            <svg
              aria-hidden
              viewBox="0 0 120 120"
              className="absolute -top-4 -right-2 w-14 h-14 opacity-30 text-foreground/40 pointer-events-none"
            >
              <g fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="60" cy="60" r="40" />
                <circle cx="60" cy="60" r="28" strokeDasharray="2 4" />
                <line x1="60" y1="20" x2="60" y2="100" />
                <line x1="20" y1="60" x2="100" y2="60" />
              </g>
              <circle cx="60" cy="60" r="2.5" fill="currentColor" />
            </svg>

            <svg
              viewBox="430 70 510 320"
              className="w-full h-auto mt-6"
              role="img"
              aria-label="Global sourcing map: eight origin countries connected to Sri Lanka"
            >
              <defs>
                {/* Gold glow for the active arc */}
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Stippled continent backdrop */}
              <Stipple />

              {/* Faint lat/long scaffold */}
              <g stroke="hsl(var(--foreground) / 0.06)" strokeWidth="0.5" fill="none">
                {[100, 150, 200, 250, 300, 350].map((y) => (
                  <line key={`h${y}`} x1="430" x2="940" y1={y} y2={y} />
                ))}
                {[500, 600, 700, 800, 900].map((x) => (
                  <line key={`v${x}`} y1="70" y2="360" x1={x} x2={x} />
                ))}
              </g>

              {/* Concentric radar rings around hub */}
              {!reduced &&
                [0, 1, 2].map((i) => (
                  <motion.circle
                    key={`ring-${i}`}
                    cx={HUB.x}
                    cy={HUB.y}
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="0.5"
                    initial={{ r: 8, opacity: 0 }}
                    animate={{ r: [8, 90], opacity: [0.35, 0] }}
                    transition={{
                      duration: 4,
                      delay: i * 1.3,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                ))}

              {/* Non-active arcs */}
              {origins.map((o, i) => {
                if (i === active) return null;
                return (
                  <motion.path
                    key={`arc-${o.key}`}
                    d={arcPath(o.pos, HUB)}
                    fill="none"
                    stroke="hsl(var(--forest-mid) / 0.5)"
                    strokeWidth="0.7"
                    strokeDasharray="2 3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{
                      duration: 1.2,
                      delay: 0.25 + i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                );
              })}

              {/* Active arc — gold + glow */}
              <motion.path
                key={`active-arc-${current.key}`}
                d={arcPath(current.pos, HUB)}
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="1.6"
                strokeLinecap="round"
                filter="url(#goldGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Travelling gold packet */}
              {!reduced && (
                <motion.circle
                  key={`packet-${current.key}`}
                  r="2.6"
                  fill="hsl(var(--accent))"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.6, ease: "easeInOut" }}
                >
                  <animateMotion
                    key={`motion-${current.key}`}
                    dur="1.6s"
                    fill="freeze"
                    path={arcPath(current.pos, HUB)}
                  />
                </motion.circle>
              )}

              {/* Origin dots + labels */}
              {origins.map((o, i) => {
                const isActive = i === active;
                const lbl = labelAnchor(o);
                return (
                  <g
                    key={o.key}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => pick(i)}
                    onFocus={() => pick(i)}
                    onClick={() => pick(i)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${o.country} — ${o.region}`}
                  >
                    <circle cx={o.pos.x} cy={o.pos.y} r={14} fill="transparent" />

                    {isActive && !reduced && (
                      <motion.circle
                        cx={o.pos.x}
                        cy={o.pos.y}
                        fill="none"
                        stroke="hsl(var(--accent))"
                        strokeWidth="1"
                        initial={{ r: 5, opacity: 0.75 }}
                        animate={{ r: 22, opacity: 0 }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}

                    <motion.circle
                      cx={o.pos.x}
                      cy={o.pos.y}
                      animate={{ r: isActive ? 5.5 : 3 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      fill={
                        isActive
                          ? "hsl(var(--accent))"
                          : "hsl(var(--forest-deep) / 0.85)"
                      }
                    />

                    <text
                      x={lbl.x}
                      y={lbl.y}
                      textAnchor={lbl.anchor}
                      className="font-body select-none"
                      style={{
                        fontSize: 10.5,
                        letterSpacing: "0.05em",
                        fontWeight: isActive ? 600 : 400,
                        fill: isActive
                          ? "hsl(var(--accent))"
                          : "hsl(var(--forest-mid) / 0.9)",
                        transition: "fill 0.3s, font-weight 0.3s",
                      }}
                    >
                      {o.country}
                    </text>
                  </g>
                );
              })}

              {/* Hub — Sri Lanka */}
              <g>
                <circle cx={HUB.x} cy={HUB.y} r="11" fill="hsl(var(--accent) / 0.18)" />
                <circle cx={HUB.x} cy={HUB.y} r="5.5" fill="hsl(var(--accent))" />
                <circle cx={HUB.x} cy={HUB.y} r="2" fill="hsl(var(--background))" />
                <text
                  x={HUB.x}
                  y={HUB.y + 22}
                  textAnchor="middle"
                  className="font-body select-none"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    fill: "hsl(var(--accent))",
                    fontWeight: 600,
                  }}
                >
                  Sri Lanka
                </text>
              </g>
            </svg>
          </motion.div>

          {/* Info panel — richer card */}
          <div className="relative">
            <div className="relative rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-7 lg:p-8 shadow-card h-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Region + index */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-body text-[10px] tracking-[0.32em] uppercase text-muted-foreground">
                      {current.region}
                    </p>
                    <p className="font-body text-[10px] tracking-[0.22em] uppercase text-muted-foreground tabular-nums">
                      {String(active + 1).padStart(2, "0")} / {String(origins.length).padStart(2, "0")}
                    </p>
                  </div>

                  {/* Country + flag */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-3xl" aria-hidden>{current.flag}</span>
                    <h3 className="font-display text-3xl lg:text-4xl font-bold leading-[0.95] tracking-tight text-gradient-gold">
                      {current.country}
                    </h3>
                  </div>

                  <motion.div
                    key={`rule-${current.key}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "left" }}
                    className="h-px w-16 bg-accent mb-7"
                  />

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default StatsSection;
