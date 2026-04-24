import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import SplitText from "@/components/motion/SplitText";

/**
 * "Global Origins" — an interactive sourcing map.
 *
 * A stylized equirectangular canvas with 8 origin countries, each
 * connected to the Sri Lankan hub by an arc that draws itself in on
 * scroll. Hovering (or tapping) a point selects it: the arc lifts to
 * gold, a radar ping fires, and the right-hand info panel crossfades
 * to that country's details. If the user doesn't interact, the
 * selection auto-cycles every 3.2s so the section breathes.
 *
 * File name kept as StatsSection.tsx so Index.tsx's import doesn't
 * churn — the component renders a fully different section.
 */

type Origin = {
  key: string;
  country: string;
  region: string;
  specialty: string;
  pos: { x: number; y: number };
};

// Equirectangular-ish positions in the SVG's 1000×500 space.
const HUB = { x: 725, y: 231 }; // Sri Lanka

const origins: Origin[] = [
  { key: "netherlands", country: "Netherlands", region: "Northern Europe", specialty: "Butter · Dairy · Confectionery", pos: { x: 514, y: 106 } },
  { key: "italy",       country: "Italy",       region: "Southern Europe", specialty: "Olive oil · Pasta · Aged cheese", pos: { x: 534, y: 133 } },
  { key: "uae",         country: "UAE",         region: "Middle East",     specialty: "Dates · Confectionery",           pos: { x: 650, y: 183 } },
  { key: "india",       country: "India",       region: "South Asia",      specialty: "Spices · Grains · Pulses",        pos: { x: 717, y: 189 } },
  { key: "china",       country: "China",       region: "East Asia",       specialty: "Seafood · Noodles · Staples",     pos: { x: 792, y: 153 } },
  { key: "thailand",    country: "Thailand",    region: "South-East Asia", specialty: "Fragrant rice · Frozen seafood",  pos: { x: 778, y: 208 } },
  { key: "singapore",   country: "Singapore",   region: "South-East Asia", specialty: "Sauces · Processed staples",      pos: { x: 786, y: 247 } },
  { key: "australia",   country: "Australia",   region: "Oceania",         specialty: "Premium meat · Dairy · Grain",    pos: { x: 875, y: 319 } },
];

/** Quadratic curve from `from` to `to`, lifted perpendicular to the line
 *  so the arc always bows "up" (toward negative y). */
function arcPath(from: { x: number; y: number }, to: { x: number; y: number }) {
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) { nx = -nx; ny = -ny; } // force upward bow
  const lift = len * 0.22;
  const cp = { x: mid.x + nx * lift, y: mid.y + ny * lift };
  return `M ${from.x} ${from.y} Q ${cp.x} ${cp.y} ${to.x} ${to.y}`;
}

/** Simple label offset so text doesn't sit on top of the dot. */
function labelAnchor(o: Origin): { x: number; y: number; anchor: "start" | "end" } {
  // Countries on the right half anchor right-of-dot, left half left-of-dot.
  const anchor = o.pos.x > 780 ? "end" : "start";
  return {
    x: anchor === "end" ? o.pos.x - 10 : o.pos.x + 10,
    y: o.pos.y - 8,
    anchor,
  };
}

const StatsSection = () => {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(mapRef, { once: true, margin: "-80px" });

  const [active, setActive] = useState(3); // start on India — closest neighbour
  const [userInteracted, setUserInteracted] = useState(false);

  // Auto-cycle selection every ~3.2s until the user touches the map.
  useEffect(() => {
    if (userInteracted || reduced) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % origins.length),
      3200,
    );
    return () => window.clearInterval(id);
  }, [userInteracted, reduced]);

  // Subtle parallax on a backdrop watermark.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const watermarkX = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const current = origins[active];
  const pick = (i: number) => {
    setActive(i);
    setUserInteracted(true);
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28 lg:py-40">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(150 40% 8%), hsl(140 50% 16%), hsl(150 40% 9%))",
        }}
      />

      {/* Parallaxed ATLAS watermark */}
      <motion.div
        aria-hidden
        style={{ x: reduced ? 0 : watermarkX, y: reduced ? 0 : watermarkY }}
        className="absolute inset-x-0 top-[38%] -translate-y-1/2 pointer-events-none select-none text-center"
      >
        <span className="font-display font-black text-[22vw] leading-none tracking-[-0.05em] text-primary-foreground/[0.03] whitespace-nowrap">
          ATLAS
        </span>
      </motion.div>

      {/* Orbs */}
      <div
        className="absolute w-[520px] h-[520px] -top-24 -left-24 rounded-full opacity-[0.08] pointer-events-none animate-orb"
        style={{ background: "radial-gradient(circle, hsl(140 55% 25%), transparent 70%)" }}
      />
      <div
        className="absolute w-[360px] h-[360px] bottom-10 right-0 rounded-full opacity-[0.06] pointer-events-none animate-orb"
        style={{
          background: "radial-gradient(circle, hsl(80 50% 28%), transparent 70%)",
          animationDelay: "7s",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-body text-sm tracking-[0.3em] uppercase text-accent mb-6"
          >
            Global origins
          </motion.p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-[64px] font-bold text-primary-foreground leading-[1.02] tracking-tight">
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
            className="font-body text-[17px] leading-relaxed text-primary-foreground/65 max-w-xl mt-8"
          >
            Trace the path from farm, press, and port to the Sri Lankan shelf —
            hover or tap any origin to follow its line home.
          </motion.p>
        </div>

        {/* Map + panel */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16 items-center">
          {/* ── Interactive map ── */}
          <motion.div
            ref={mapRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Compass-rose corner mark (kept from prior design, smaller) */}
            <svg
              aria-hidden
              viewBox="0 0 120 120"
              className="absolute -top-6 -right-2 w-16 h-16 opacity-25 text-accent pointer-events-none"
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
              viewBox="300 50 700 350"
              className="w-full h-auto"
              role="img"
              aria-label="Global sourcing map: eight origin countries connected to Sri Lanka"
            >
              {/* Faint grid — latitude/longitude scaffold */}
              <g stroke="hsl(var(--primary-foreground) / 0.07)" strokeWidth="0.5" fill="none">
                {[100, 150, 200, 250, 300, 350].map((y) => (
                  <line key={`h${y}`} x1="300" x2="1000" y1={y} y2={y} />
                ))}
                {[400, 500, 600, 700, 800, 900].map((x) => (
                  <line key={`v${x}`} y1="50" y2="400" x1={x} x2={x} />
                ))}
              </g>

              {/* Concentric radar rings around Sri Lanka — gentle pulse */}
              {!reduced &&
                [0, 1, 2].map((i) => (
                  <motion.circle
                    key={`ring-${i}`}
                    cx={HUB.x}
                    cy={HUB.y}
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="0.6"
                    initial={{ r: 8, opacity: 0 }}
                    animate={{ r: [8, 160], opacity: [0.3, 0] }}
                    transition={{
                      duration: 4,
                      delay: i * 1.3,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                ))}

              {/* Non-active arcs (dashed, faint) */}
              {origins.map((o, i) => {
                if (i === active) return null;
                return (
                  <motion.path
                    key={`arc-${o.key}`}
                    d={arcPath(o.pos, HUB)}
                    fill="none"
                    stroke="hsl(var(--primary-foreground) / 0.28)"
                    strokeWidth="0.8"
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

              {/* Active arc (gold, solid, drawn on top) */}
              <motion.path
                key={`active-arc-${current.key}`}
                d={arcPath(current.pos, HUB)}
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="1.8"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Travelling gold packet along the active arc */}
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
                    aria-label={`${o.country} — ${o.specialty}`}
                  >
                    {/* Generous invisible hit area */}
                    <circle cx={o.pos.x} cy={o.pos.y} r={14} fill="transparent" />

                    {/* Radar ping on the active dot */}
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
                          : "hsl(var(--primary-foreground) / 0.85)"
                      }
                    />

                    <text
                      x={lbl.x}
                      y={lbl.y}
                      textAnchor={lbl.anchor}
                      className="font-body select-none"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.05em",
                        fontWeight: isActive ? 600 : 400,
                        fill: isActive
                          ? "hsl(var(--accent))"
                          : "hsl(var(--primary-foreground) / 0.6)",
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
                <circle cx={HUB.x} cy={HUB.y} r="10" fill="hsl(var(--accent) / 0.18)" />
                <circle cx={HUB.x} cy={HUB.y} r="5" fill="hsl(var(--accent))" />
                <circle cx={HUB.x} cy={HUB.y} r="2" fill="hsl(150 40% 8%)" />
                <text
                  x={HUB.x}
                  y={HUB.y + 24}
                  textAnchor="middle"
                  className="font-body select-none"
                  style={{
                    fontSize: 9.5,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fill: "hsl(var(--accent))",
                    fontWeight: 600,
                  }}
                >
                  Sri Lanka
                </text>
              </g>
            </svg>

            {/* Footer caption under the map */}
            <p className="mt-6 font-body text-[11px] tracking-[0.25em] uppercase text-primary-foreground/40">
              {origins.length} origins · one cold-chain · one bonded warehouse
            </p>
          </motion.div>

          {/* ── Info panel ── */}
          <div className="relative">
            <div className="relative min-h-[260px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-body text-[11px] tracking-[0.3em] uppercase text-primary-foreground/45 mb-4">
                    {current.region}
                  </p>
                  <h3 className="font-display text-4xl lg:text-5xl font-bold leading-[0.95] tracking-tight mb-6">
                    <span className="text-gradient-gold">{current.country}</span>
                  </h3>
                  <motion.div
                    key={`rule-${current.key}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "left" }}
                    className="h-px w-20 bg-accent mb-6"
                  />
                  <p className="font-body text-[15px] text-primary-foreground/70 leading-relaxed mb-8">
                    {current.specialty}
                  </p>
                  <p className="font-body text-[12px] tracking-[0.2em] uppercase text-primary-foreground/45 tabular-nums">
                    /{String(active + 1).padStart(2, "0")} &nbsp;·&nbsp; of {origins.length}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Chip navigation */}
            <div className="flex flex-wrap gap-2 mt-10">
              {origins.map((o, i) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => pick(i)}
                  onMouseEnter={() => pick(i)}
                  aria-pressed={i === active}
                  className={`px-3 py-1.5 rounded-full font-body text-[11px] tracking-[0.15em] uppercase border transition-all duration-300 ${
                    i === active
                      ? "bg-accent/15 text-accent border-accent/45"
                      : "text-primary-foreground/55 border-primary-foreground/15 hover:text-primary-foreground/90 hover:border-primary-foreground/30"
                  }`}
                >
                  {o.country}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
