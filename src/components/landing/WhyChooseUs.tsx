import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { EASE_OUT_EXPO, softFadeUp } from "@/lib/motion";
import SplitText from "@/components/motion/SplitText";
import Eyebrow from "@/components/ui/eyebrow";

/* ─── Shared panel shell ─────────────────────────────────────────────── */

const PANEL = "relative overflow-hidden rounded-2xl flex flex-col group transition-all duration-500";
const PANEL_BG: React.CSSProperties = {
  background: "rgba(8, 20, 12, 0.72)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.08)",
};
const PANEL_HOVER_GLOW = "after:absolute after:inset-0 after:rounded-2xl after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-500 after:pointer-events-none";

/* ─── Panel 1 — Import route map ─────────────────────────────────────── */

const RouteMapPanel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
      className={`${PANEL} ${PANEL_HOVER_GLOW} lg:col-span-7 min-h-[320px]`}
      style={PANEL_BG}
    >
      {/* Top-left accent glow */}
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--accent)/0.18) 0%, transparent 70%)" }} />

      {/* SVG route illustration */}
      <div className="flex-1 flex items-center justify-center px-10 pt-10 pb-4">
        <svg viewBox="0 0 520 180" className="w-full max-w-[480px]" aria-hidden>
          {/* Dashed route path */}
          <motion.path
            d="M 40 90 C 100 30, 200 30, 260 90 C 320 150, 420 150, 480 90"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="1.5"
            strokeDasharray="6 5"
            strokeOpacity="0.35"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.6, ease: EASE_OUT_EXPO, delay: 0.3 }}
          />
          {/* Solid highlight on top */}
          <motion.path
            d="M 40 90 C 100 30, 200 30, 260 90 C 320 150, 420 150, 480 90"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="2"
            strokeOpacity="0.7"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.8, ease: EASE_OUT_EXPO, delay: 0.5 }}
          />

          {/* Origin node — ship/port */}
          <motion.circle cx="40" cy="90" r="7" fill="hsl(var(--accent))" fillOpacity="0.9"
            initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 16 }} />
          <motion.circle cx="40" cy="90" r="14" fill="none" stroke="hsl(var(--accent))" strokeOpacity="0.3" strokeWidth="1"
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2.4, repeat: Infinity }} />

          {/* Mid waypoint */}
          <motion.circle cx="260" cy="90" r="5" fill="hsl(var(--accent))" fillOpacity="0.5"
            initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 16 }} />

          {/* Destination node */}
          <motion.circle cx="480" cy="90" r="7" fill="hsl(var(--accent))" fillOpacity="0.9"
            initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}} transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 16 }} />
          <motion.circle cx="480" cy="90" r="14" fill="none" stroke="hsl(var(--accent))" strokeOpacity="0.3" strokeWidth="1"
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2.4, repeat: Infinity, delay: 0.8 }} />

          {/* Travelling dot along path */}
          <motion.circle r="4" fill="white" fillOpacity="0.9"
            animate={inView ? {
              offsetDistance: ["0%", "100%"],
            } : {}}
            style={{ offsetPath: "path('M 40 90 C 100 30, 200 30, 260 90 C 320 150, 420 150, 480 90')" } as React.CSSProperties}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay: 1.8 }}
          />

          {/* Labels */}
          <text x="40" y="118" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="Inter, sans-serif">Origin</text>
          <text x="260" y="72" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="Inter, sans-serif">Transit</text>
          <text x="480" y="118" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10" fontFamily="Inter, sans-serif">Sri Lanka</text>
        </svg>
      </div>

      {/* Text footer */}
      <div className="px-8 pb-8">
        <p className="font-body text-[10px] tracking-[0.28em] uppercase mb-2" style={{ color: "hsl(var(--accent)/0.65)" }}>
          Sourcing · Customs · Brand Rep
        </p>
        <h3 className="font-display text-xl font-bold text-white leading-snug">
          Integrated Import-to-Distribution
        </h3>
        <p className="font-body text-sm mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>
          End-to-end import and brand representation — from sourcing and customs clearance to shelf-ready distribution.
        </p>
      </div>
    </motion.div>
  );
};

/* ─── Panel 2 — 30 years stat + warehouse grid ───────────────────────── */

const WarehousePanel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !counterRef.current) return;
    const node = counterRef.current;
    const ctrl = animate(0, 30, {
      duration: 1.8,
      ease: EASE_OUT_EXPO,
      onUpdate: (v) => { if (node) node.textContent = Math.round(v).toString(); },
    });
    return () => ctrl.stop();
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.12 }}
      className={`${PANEL} ${PANEL_HOVER_GLOW} lg:col-span-5 min-h-[320px]`}
      style={PANEL_BG}
    >
      {/* Shelf grid watermark */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
        <svg width="100%" height="100%" aria-hidden>
          {[40, 90, 140, 190, 240].map((y) => (
            <line key={y} x1="0" y1={y} x2="100%" y2={y} stroke="white" strokeWidth="1" />
          ))}
          {[40, 90, 140, 190].map((x) => (
            <line key={x} x1={`${x * 1.6}px`} y1="0" x2={`${x * 1.6}px`} y2="100%" stroke="white" strokeWidth="1" />
          ))}
        </svg>
      </div>

      {/* Accent glow top-right */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--accent)/0.15) 0%, transparent 70%)" }} />

      <div className="flex-1 flex flex-col items-start justify-end px-8 pt-8 pb-4">
        {/* Big counter */}
        <div className="mb-2">
          <div className="flex items-end gap-1 leading-none">
            <span ref={counterRef} className="font-display text-[5.5rem] font-black text-white leading-none tabular-nums">0</span>
            <span className="font-display text-4xl font-black pb-4" style={{ color: "hsl(var(--accent))" }}>+</span>
          </div>
          <p className="font-body text-sm font-semibold tracking-widest uppercase mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Years of Experience
          </p>
        </div>
      </div>

      <div className="px-8 pb-8">
        <p className="font-body text-[10px] tracking-[0.28em] uppercase mb-2" style={{ color: "hsl(var(--accent)/0.65)" }}>
          Bonded · Duty-Optimised · Secure
        </p>
        <h3 className="font-display text-xl font-bold text-white leading-snug">Bonded Warehousing</h3>
        <p className="font-body text-sm mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.48)" }}>
          Customs-approved bonded facilities enabling duty optimisation, secure storage, and streamlined import processing.
        </p>
      </div>
    </motion.div>
  );
};

/* ─── Panel 3 — Cold-chain temperature gauge ─────────────────────────── */

const ColdChainPanel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const R = 72;
  const cx = 100;
  const cy = 110;
  const startAngle = -210;
  const endAngle = 30;
  const totalArc = endAngle - startAngle;
  const arcLen = (Math.PI * R * Math.abs(totalArc)) / 180;

  const polarToXY = (angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad) };
  };
  const s = polarToXY(startAngle);
  const e = polarToXY(endAngle);
  const arcPath = `M ${s.x} ${s.y} A ${R} ${R} 0 1 1 ${e.x} ${e.y}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.08 }}
      className={`${PANEL} ${PANEL_HOVER_GLOW} lg:col-span-4 min-h-[300px]`}
      style={PANEL_BG}
    >
      {/* Cool-tint glow */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-40 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(120,200,255,0.08) 0%, transparent 70%)" }} />

      <div className="flex-1 flex items-center justify-center pt-8 pb-2">
        <svg viewBox="0 0 200 140" className="w-48 h-auto" aria-hidden>
          {/* Track arc */}
          <path d={arcPath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
          {/* Filled arc */}
          <motion.path
            d={arcPath}
            fill="none"
            stroke="url(#coldGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={arcLen}
            initial={{ strokeDashoffset: arcLen }}
            animate={inView ? { strokeDashoffset: arcLen * 0.12 } : {}}
            transition={{ duration: 1.6, ease: EASE_OUT_EXPO, delay: 0.4 }}
          />
          <defs>
            <linearGradient id="coldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="rgba(130,210,255,0.9)" />
            </linearGradient>
          </defs>
          {/* Centre temperature */}
          <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="26" fontWeight="800" fontFamily="Sora, sans-serif">-18</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontFamily="Inter, sans-serif">°C Controlled</text>
          {/* Tick marks */}
          {[-210, -180, -150, -120, -90, -60, -30, 0, 30].map((a, idx) => {
            const p1 = polarToXY(a);
            const r2 = R - 10;
            const p2 = { x: cx + r2 * Math.cos(((a - 90) * Math.PI) / 180), y: cy + r2 * Math.sin(((a - 90) * Math.PI) / 180) };
            return <line key={idx} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />;
          })}
        </svg>
      </div>

      <div className="px-7 pb-7">
        <p className="font-body text-[10px] tracking-[0.28em] uppercase mb-2" style={{ color: "hsl(var(--accent)/0.65)" }}>
          Frozen · Chilled · -18°C
        </p>
        <h3 className="font-display text-lg font-bold text-white leading-snug">Cold-Chain Logistics</h3>
        <p className="font-body text-sm mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          Temperature-controlled storage and transport ensuring product quality from port to point of sale.
        </p>
      </div>
    </motion.div>
  );
};

/* ─── Panel 4 — Sri Lanka distribution map ───────────────────────────── */

const cities: Array<{ cx: number; cy: number; name: string; delay: number }> = [
  { cx: 72,  cy: 148, name: "Colombo",    delay: 0    },
  { cx: 108, cy: 96,  name: "Kandy",      delay: 0.25 },
  { cx: 60,  cy: 190, name: "Galle",      delay: 0.4  },
  { cx: 130, cy: 52,  name: "Jaffna",     delay: 0.55 },
  { cx: 148, cy: 135, name: "Batticaloa", delay: 0.7  },
  { cx: 54,  cy: 160, name: "Kalutara",   delay: 0.15 },
  { cx: 90,  cy: 175, name: "Matara",     delay: 0.5  },
];

const SriLankaMapPanel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.18 }}
      className={`${PANEL} ${PANEL_HOVER_GLOW} lg:col-span-8 min-h-[300px]`}
      style={PANEL_BG}
    >
      {/* Accent glow bottom-right */}
      <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--accent)/0.14) 0%, transparent 70%)" }} />

      <div className="flex flex-col lg:flex-row h-full">
        {/* Left text */}
        <div className="flex flex-col justify-end px-8 pt-8 pb-8 lg:w-[52%] shrink-0">
          <p className="font-body text-[10px] tracking-[0.28em] uppercase mb-3" style={{ color: "hsl(var(--accent)/0.65)" }}>
            HoReCa · Modern Trade · General Trade
          </p>
          <h3 className="font-display text-2xl lg:text-3xl font-bold text-white leading-snug mb-3">
            Island-Wide Distribution
          </h3>
          <p className="font-body text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.48)" }}>
            Comprehensive distribution network serving all trade channels across Sri Lanka with reliable, on-time delivery.
          </p>
          {/* Mini stats row */}
          <div className="flex gap-6">
            {[["25+", "Districts"], ["500+", "Outlets"], ["3", "Trade Channels"]].map(([val, lbl]) => (
              <div key={lbl}>
                <p className="font-display text-2xl font-black text-white">{val}</p>
                <p className="font-body text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — map SVG */}
        <div className="flex-1 flex items-center justify-center px-4 pb-6 pt-4 lg:pt-0">
          <svg viewBox="0 0 200 240" className="w-full max-w-[160px]" aria-hidden>
            {/* Sri Lanka rough outline */}
            <motion.path
              d="M 100 10 C 130 12, 155 28, 162 52 C 168 72, 165 92, 160 112 C 155 130, 158 148, 152 162 C 145 178, 130 192, 112 200 C 94 208, 72 206, 58 196 C 44 186, 36 170, 34 154 C 32 138, 38 120, 42 104 C 46 88, 40 68, 44 50 C 48 32, 70 8, 100 10 Z"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            />

            {/* Connection lines between cities */}
            {cities.map((c, i) =>
              cities.slice(i + 1, i + 3).map((c2) => (
                <motion.line
                  key={`${c.name}-${c2.name}`}
                  x1={c.cx} y1={c.cy} x2={c2.cx} y2={c2.cy}
                  stroke="hsl(var(--accent))"
                  strokeOpacity="0.18"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 0.6 + i * 0.05 }}
                />
              ))
            )}

            {/* City dots */}
            {cities.map((city) => (
              <g key={city.name}>
                {/* Ping ring */}
                <motion.circle
                  cx={city.cx} cy={city.cy} r="10"
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeOpacity="0.5"
                  strokeWidth="1"
                  animate={inView ? { r: [8, 16], opacity: [0.6, 0] } : {}}
                  transition={{ duration: 1.8, repeat: Infinity, delay: city.delay, ease: "easeOut" }}
                />
                {/* Dot */}
                <motion.circle
                  cx={city.cx} cy={city.cy} r="4"
                  fill="hsl(var(--accent))"
                  fillOpacity="0.9"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.4 + city.delay }}
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Mouse spotlight hook ───────────────────────────────────────────── */

function useMouseSpotlight() {
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const springX = useSpring(rawX, { stiffness: 45, damping: 18 });
  const springY = useSpring(rawY, { stiffness: 45, damping: 18 });
  const pctX = useTransform(springX, (v) => `${v * 100}%`);
  const pctY = useTransform(springY, (v) => `${v * 100}%`);
  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width);
    rawY.set((e.clientY - r.top) / r.height);
  };
  return { pctX, pctY, onMouseMove };
}

/* ─── Main section ───────────────────────────────────────────────────── */

const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { pctX, pctY, onMouseMove } = useMouseSpotlight();

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden py-section-base lg:py-section-base-lg"
      onMouseMove={onMouseMove as React.MouseEventHandler<HTMLElement>}
    >
      {/* Background image */}
      <img
        src="https://vqvspkuhqthvbtsgfgbo.supabase.co/storage/v1/object/public/olive-uploads/Backgrounds/pexels-freestocks-1366594.jpg"
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Dark overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.78) 50%, rgba(0,0,0,0.68) 100%)" }}
      />

      {/* Mouse spotlight */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 55% 45% at var(--sx) var(--sy), rgba(80,200,120,0.07) 0%, transparent 70%)",
          "--sx": pctX,
          "--sy": pctY,
        } as React.CSSProperties}
      />

      {/* Grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Ambient orbs */}
      <motion.div
        aria-hidden
        className="absolute rounded-full blur-[120px] pointer-events-none"
        style={{ top: "18%", left: "10%", width: 520, height: 520, background: "hsl(var(--accent)/0.07)" }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute rounded-full blur-[100px] pointer-events-none"
        style={{ bottom: "18%", right: "15%", width: 440, height: 440, background: "hsl(var(--accent)/0.05)" }}
        animate={{ x: [0, -50, 0], y: [0, -55, 0], opacity: [0.28, 0.5, 0.28] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">

        {/* Header */}
        <motion.div
          variants={softFadeUp}
          initial="hidden"
          whileInView="show"
          custom={0}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-3xl mb-14 lg:mb-16"
        >
          <Eyebrow variant="pill" tone="white" className="mb-6">
            Why Choose Olive Foods
          </Eyebrow>

          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-5 leading-tight tracking-tight">
            <SplitText text="Your Complete FMCG" by="word" stagger={0.05} as="span" className="block" />
            <span className="block">
              <SplitText text="Distribution Partner" by="word" stagger={0.05} delay={0.2} as="span" className="text-gradient-gold" />
            </span>
          </h2>

          <motion.p
            variants={softFadeUp}
            initial="hidden"
            whileInView="show"
            custom={0.35}
            viewport={{ once: true }}
            className="font-body text-lg leading-relaxed max-w-2xl"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Three decades of experience in import, warehousing, and distribution — built on strong global supplier relationships and an unwavering commitment to excellence.
          </motion.p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Row 1 */}
          <RouteMapPanel />
          <WarehousePanel />
          {/* Row 2 */}
          <ColdChainPanel />
          <SriLankaMapPanel />
        </div>

        {/* Bottom CTA */}
        <motion.div
          variants={softFadeUp}
          initial="hidden"
          whileInView="show"
          custom={0.2}
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12 lg:mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-white text-xl font-bold font-display mb-1">Ready to partner with Olive?</h3>
            <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.42)" }}>
              Discover how we can streamline your FMCG distribution.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm shadow-lg whitespace-nowrap transition-shadow duration-300"
            style={{ background: "hsl(var(--accent))", color: "hsl(var(--foreground))" }}
          >
            Get in Touch
            <motion.span
              className="inline-block"
              animate={{ x: [0, 2, 0], y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
