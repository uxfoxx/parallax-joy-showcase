import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import SplitText from "@/components/motion/SplitText";
import Eyebrow from "@/components/ui/eyebrow";

/* ─── Timeline data ──────────────────────────────────────────────────── */

type Milestone = {
  year: string;
  index: string;
  chapter: string;
  heading: string;
  body: string;
  art: React.ReactNode;
};

const ImportShipArt = () => (
  <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden>
    <path d="M 10 55 Q 60 30 110 55" fill="none" stroke="hsl(var(--accent)/0.2)" strokeWidth="1" />
    <path d="M 30 52 L 90 52 L 85 65 L 35 65 Z" fill="hsl(var(--accent)/0.15)" stroke="hsl(var(--accent)/0.5)" strokeWidth="1" />
    <rect x="50" y="40" width="20" height="13" rx="2" fill="hsl(var(--accent)/0.25)" stroke="hsl(var(--accent)/0.5)" strokeWidth="1" />
    <line x1="60" y1="20" x2="60" y2="40" stroke="hsl(var(--accent)/0.55)" strokeWidth="1.5" />
    <path d="M 60 20 L 74 27 L 60 34 Z" fill="hsl(var(--accent)/0.7)" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M ${15 + i * 25} 70 Q ${27 + i * 25} 65 ${39 + i * 25} 70`}
        fill="none" stroke="hsl(var(--accent)/0.25)" strokeWidth="1" />
    ))}
    {[[18, 54], [72, 52], [100, 54]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="hsl(var(--accent)/0.6)" />
    ))}
  </svg>
);

const WarehouseArt = () => (
  <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden>
    <path d="M 20 60 L 20 30 L 60 18 L 100 30 L 100 60 Z" fill="hsl(var(--accent)/0.1)" stroke="hsl(var(--accent)/0.45)" strokeWidth="1" />
    <line x1="20" y1="30" x2="100" y2="30" stroke="hsl(var(--accent)/0.35)" strokeWidth="0.75" strokeDasharray="3 2" />
    <rect x="48" y="42" width="24" height="18" rx="1" fill="hsl(var(--accent)/0.18)" stroke="hsl(var(--accent)/0.5)" strokeWidth="1" />
    <line x1="60" y1="42" x2="60" y2="60" stroke="hsl(var(--accent)/0.4)" strokeWidth="0.75" />
    {[[28, 36], [82, 36]].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="12" height="9" rx="1" fill="hsl(var(--accent)/0.2)" stroke="hsl(var(--accent)/0.45)" strokeWidth="0.75" />
    ))}
    <line x1="10" y1="60" x2="110" y2="60" stroke="hsl(var(--accent)/0.2)" strokeWidth="1" />
    {[44, 50].map((y) => (
      <line key={y} x1="49" y1={y} x2="71" y2={y} stroke="hsl(var(--accent)/0.3)" strokeWidth="0.75" />
    ))}
  </svg>
);

const ColdChainArt = () => (
  <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden>
    <rect x="35" y="30" width="68" height="32" rx="2" fill="hsl(var(--accent)/0.12)" stroke="hsl(var(--accent)/0.5)" strokeWidth="1" />
    <path d="M 12 45 L 12 58 L 35 58 L 35 30 L 22 30 Z" fill="hsl(var(--accent)/0.18)" stroke="hsl(var(--accent)/0.5)" strokeWidth="1" />
    <path d="M 15 34 L 15 47 L 33 47 L 33 34 Z" fill="hsl(var(--accent)/0.25)" />
    {[[22, 62], [52, 62], [82, 62]].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="7" fill="hsl(150 30% 10%)" stroke="hsl(var(--accent)/0.4)" strokeWidth="1" />
        <circle cx={x} cy={y} r="3" fill="hsl(var(--accent)/0.3)" />
      </g>
    ))}
    {[0, 60, 120, 180, 240, 300].map((a, i) => {
      const rad = (a * Math.PI) / 180;
      return <line key={i} x1="80" y1="43" x2={80 + Math.cos(rad) * 9} y2={43 + Math.sin(rad) * 9} stroke="hsl(var(--accent)/0.55)" strokeWidth="1.5" />;
    })}
    <circle cx="80" cy="43" r="2.5" fill="hsl(var(--accent)/0.7)" />
    <text x="55" y="50" fontSize="9" fontFamily="Sora, sans-serif" fill="hsl(var(--accent)/0.6)" fontWeight="700">-18°C</text>
  </svg>
);

const NetworkArt = () => (
  <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden>
    <circle cx="60" cy="40" r="8" fill="hsl(var(--accent)/0.2)" stroke="hsl(var(--accent)/0.65)" strokeWidth="1.5" />
    <circle cx="60" cy="40" r="3" fill="hsl(var(--accent))" />
    {[[18, 22], [102, 22], [18, 58], [102, 58], [60, 12], [60, 68]].map(([nx, ny], i) => (
      <g key={i}>
        <line x1="60" y1="40" x2={nx} y2={ny} stroke="hsl(var(--accent)/0.3)" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx={nx} cy={ny} r="4" fill="hsl(var(--accent)/0.15)" stroke="hsl(var(--accent)/0.5)" strokeWidth="1" />
        <circle cx={nx} cy={ny} r="1.5" fill="hsl(var(--accent)/0.75)" />
      </g>
    ))}
    <circle cx="60" cy="40" r="14" fill="none" stroke="hsl(var(--accent)/0.18)" strokeWidth="1" />
    <circle cx="60" cy="40" r="20" fill="none" stroke="hsl(var(--accent)/0.1)" strokeWidth="1" />
  </svg>
);

const TodayArt = () => (
  <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden>
    {[[20, 55, 16], [38, 42, 16], [56, 30, 16], [74, 20, 16], [92, 12, 16]].map(([x, y, w], i) => (
      <rect key={i} x={x} y={y} width={w} height={60 - y} rx="2"
        fill={`hsl(var(--accent)/${0.15 + i * 0.1})`} stroke="hsl(var(--accent)/0.45)" strokeWidth="1" />
    ))}
    <path d="M 28 55 L 46 43 L 64 30 L 82 21 L 100 13"
      fill="none" stroke="hsl(var(--accent)/0.8)" strokeWidth="1.5" strokeLinecap="round" />
    {[[28, 55], [46, 43], [64, 30], [82, 21], [100, 13]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="hsl(var(--accent))" />
    ))}
    <line x1="12" y1="62" x2="108" y2="62" stroke="hsl(var(--accent)/0.25)" strokeWidth="1" />
  </svg>
);

const MILESTONES: Milestone[] = [
  {
    year: "1993",
    index: "01",
    chapter: "The Origin",
    heading: "Founded on a Vision",
    body: "Olive Foods was established with a simple conviction — Sri Lanka deserved access to the world's finest food brands. A single warehouse, a single promise.",
    art: <ImportShipArt />,
  },
  {
    year: "2001",
    index: "02",
    chapter: "First Milestone",
    heading: "Bonded Warehouse Secured",
    body: "Customs-approved bonded storage gave us the infrastructure to import at scale — unlocking duty optimisation and secure handling for our growing brand portfolio.",
    art: <WarehouseArt />,
  },
  {
    year: "2010",
    index: "03",
    chapter: "Cold Chain Era",
    heading: "Temperature Control, End-to-End",
    body: "We invested in a full cold-chain network — from port to shelf at -18°C. Frozen and chilled categories became a cornerstone of our distribution capability.",
    art: <ColdChainArt />,
  },
  {
    year: "2018",
    index: "04",
    chapter: "Island-Wide Reach",
    heading: "All 25 Districts Covered",
    body: "HoReCa, Modern Trade, General Trade — our network expanded to serve every channel across every district, making Olive Foods the most connected FMCG distributor in Sri Lanka.",
    art: <NetworkArt />,
  },
  {
    year: "Today",
    index: "05",
    chapter: "30 Years Strong",
    heading: "500+ Products, 1000+ Partners",
    body: "Three decades of trust, ten source countries, and a bonded warehouse that never sleeps. The vision that started in 1993 is now Sri Lanka's fastest-growing food distribution network.",
    art: <TodayArt />,
  },
];

/* ─── Desktop milestone card ─────────────────────────────────────────── */

type CardProps = { m: Milestone; isActive: boolean; onClick: () => void };

const MilestoneCard = ({ m, isActive, onClick }: CardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      animate={{
        opacity: isActive ? 1 : 0.45,
        scale: isActive ? 1 : 0.94,
        y: isActive ? 0 : 10,
      }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      className="relative flex-shrink-0 w-[310px] md:w-[340px] flex flex-col cursor-pointer select-none"
      style={{
        background: isActive ? "hsl(150 38% 8%)" : "hsl(150 38% 6%)",
        border: `1px solid ${isActive ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)"}`,
        borderRadius: "1.25rem",
        boxShadow: isActive
          ? "0 24px 56px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset"
          : "none",
        transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s",
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between px-7 pt-7 pb-4">
        <span className="font-body text-[10px] tracking-[0.32em] uppercase"
          style={{ color: isActive ? "hsl(var(--accent)/0.75)" : "rgba(255,255,255,0.22)" }}>
          {m.chapter}
        </span>
        <span className="font-display text-[11px] font-semibold tracking-[0.18em] tabular-nums"
          style={{ color: "rgba(255,255,255,0.18)" }}>
          {m.index} / {String(MILESTONES.length).padStart(2, "0")}
        </span>
      </div>

      {/* Art zone */}
      <div className="mx-7 mb-5 rounded-xl overflow-hidden flex items-center justify-center"
        style={{
          height: 120,
          background: "hsl(150 40% 5%)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
        <div className="w-full h-full p-5">{m.art}</div>
      </div>

      {/* Year */}
      <motion.div
        className="px-7 mb-1"
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}
      >
        <span
          className="font-display text-[3rem] font-black leading-none tabular-nums"
          style={{ color: isActive ? "hsl(var(--accent))" : "rgba(255,255,255,0.18)" }}
        >
          {m.year}
        </span>
      </motion.div>

      {/* Accent rule */}
      <motion.div
        className="mx-7 mb-4 h-[2px] rounded-full"
        style={{ background: "hsl(var(--accent))", transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: isActive ? 1 : 0.3 } : {}}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.2 }}
      />

      {/* Text */}
      <div className="px-7 pb-7 flex-1 flex flex-col justify-end">
        <h3 className="font-display text-lg font-bold text-white leading-snug mb-2">
          {m.heading}
        </h3>
        <p className="font-body text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.42)" }}>
          {m.body}
        </p>
      </div>
    </motion.div>
  );
};

/* ─── Mobile vertical timeline ───────────────────────────────────────── */

const MobileTimeline = () => (
  <div className="relative pl-10 py-6">
    <div
      className="absolute left-3 top-4 bottom-4 w-[2px] rounded-full"
      style={{
        background:
          "linear-gradient(180deg, transparent, hsl(var(--accent)/0.4) 12%, hsl(var(--accent)/0.4) 88%, transparent)",
      }}
    />
    <div className="flex flex-col gap-8">
      {MILESTONES.map((m, i) => (
        <motion.div
          key={m.year}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO, delay: i * 0.04 }}
          className="relative"
        >
          {/* Node */}
          <div
            className="absolute -left-[30px] top-2 w-4 h-4 rounded-full flex items-center justify-center"
            style={{ background: "hsl(150 40% 5%)", border: "2px solid hsl(var(--accent)/0.55)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--accent))" }} />
          </div>

          <div
            className="rounded-xl p-5"
            style={{ background: "hsl(150 38% 8%)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="font-display text-3xl font-black leading-none tabular-nums"
                style={{ color: "hsl(var(--accent))" }}
              >
                {m.year}
              </span>
              <div>
                <p className="font-body text-[10px] tracking-[0.28em] uppercase mb-0.5"
                  style={{ color: "hsl(var(--accent)/0.6)" }}>
                  {m.chapter}
                </p>
                <h3 className="font-display text-base font-bold text-white leading-snug">
                  {m.heading}
                </h3>
              </div>
            </div>
            <div
              className="mb-4 rounded-lg overflow-hidden"
              style={{
                height: 72,
                background: "hsl(150 40% 5%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="w-full h-full p-3">{m.art}</div>
            </div>
            <p className="font-body text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.42)" }}>
              {m.body}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

/* ─── Main section ───────────────────────────────────────────────────── */

const TeamSection = () => {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  const [active, setActive] = useState(0);
  const [userPicked, setUserPicked] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const CARD_W = 356; // card width + gap
  const totalShift = -(MILESTONES.length - 1) * CARD_W;

  const rawX = useTransform(scrollYProgress, [0.05, 0.9], [0, totalShift]);
  const x = useSpring(rawX, { stiffness: 55, damping: 18, mass: 0.9 });

  // Sync active dot with scroll
  useEffect(() => {
    if (userPicked) return;
    const unsub = scrollYProgress.on("change", (v) => {
      const pct = (v - 0.05) / 0.85;
      const idx = Math.round(pct * (MILESTONES.length - 1));
      setActive(Math.max(0, Math.min(MILESTONES.length - 1, idx)));
    });
    return unsub;
  }, [scrollYProgress, userPicked]);

  const pick = (i: number) => {
    setActive(i);
    setUserPicked(true);
    setTimeout(() => setUserPicked(false), 1400);
  };

  const progressWidth = useTransform(scrollYProgress, [0.05, 0.9], ["0%", "100%"]);
  const springPW = useSpring(
    useTransform(scrollYProgress, [0.05, 0.9], [0, 100]),
    { stiffness: 55, damping: 18 }
  );
  const progressWidthSpring = useTransform(springPW, (v) => `${v}%`);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "hsl(150 40% 5%)",
        height: reduced ? "auto" : `${MILESTONES.length * 85}vh`,
      }}
    >
      {/* ── Background ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
      <div aria-hidden className="absolute rounded-full blur-[140px] pointer-events-none animate-orb"
        style={{
          top: "-8%", left: "-8%", width: 580, height: 580,
          background: "radial-gradient(circle, hsl(140 55% 20%) 0%, transparent 70%)",
          opacity: 0.18,
        }} />
      <div aria-hidden className="absolute rounded-full blur-[110px] pointer-events-none animate-orb"
        style={{
          bottom: "0%", right: "-6%", width: 460, height: 460,
          background: "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)",
          opacity: 0.07,
          animationDelay: "9s",
        }} />
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }} />

      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">

        {/* Header */}
        <div
          ref={headerRef}
          className="relative z-20 max-w-7xl mx-auto w-full px-6 lg:px-8 pt-14 pb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="mb-5"
            >
              <Eyebrow variant="pill" tone="white">Our Heritage</Eyebrow>
            </motion.div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              <SplitText text="Three Decades" by="word" stagger={0.05} as="span" className="block" />
              <span className="block">
                <SplitText
                  text="of Trust"
                  by="word"
                  stagger={0.05}
                  delay={0.15}
                  as="span"
                  className="text-gradient-gold"
                />
              </span>
            </h2>
          </div>

          {/* Active chapter callout — desktop only */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
              className="hidden lg:block text-right shrink-0"
            >
              <p className="font-body text-[10px] tracking-[0.32em] uppercase mb-1"
                style={{ color: "hsl(var(--accent)/0.6)" }}>
                {MILESTONES[active].chapter}
              </p>
              <p className="font-display text-xl font-bold text-white leading-snug">
                {MILESTONES[active].heading}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hairline separator */}
        <motion.div
          className="mx-6 lg:mx-8 h-px mb-6"
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--accent)/0.4), hsl(var(--accent)/0.12) 60%, transparent)",
            scaleX: useTransform(scrollYProgress, [0, 0.12], [0, 1]),
            transformOrigin: "left",
          }}
        />

        {/* ── Desktop: scrolling card track ── */}
        <div className="hidden lg:flex flex-1 items-center overflow-hidden relative">
          {/* Giant watermark year */}
          <AnimatePresence mode="wait">
            <motion.span
              key={`wm-${active}`}
              className="absolute inset-0 flex items-center justify-center font-display font-black pointer-events-none select-none"
              style={{ fontSize: "28vw", color: "rgba(255,255,255,0.016)", lineHeight: 1 }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            >
              {MILESTONES[active].year}
            </motion.span>
          </AnimatePresence>

          <motion.div
            className="flex gap-4 px-8 lg:px-20 items-center"
            style={{ x: reduced ? 0 : x }}
          >
            {MILESTONES.map((m, i) => (
              <MilestoneCard
                key={m.year}
                m={m}
                isActive={i === active}
                onClick={() => pick(i)}
              />
            ))}
          </motion.div>
        </div>

        {/* ── Mobile: vertical stacked timeline ── */}
        <div className="lg:hidden flex-1 overflow-y-auto px-6 pb-6">
          <MobileTimeline />
        </div>

        {/* ── Bottom nav strip ── */}
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 lg:px-8 pb-8 pt-4">
          {/* Progress bar — desktop */}
          <div className="relative h-[2px] rounded-full mb-5 hidden lg:block"
            style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                width: progressWidthSpring,
                background: "linear-gradient(90deg, hsl(var(--accent)/0.5), hsl(var(--accent)))",
              }}
            />
          </div>

          {/* Dot navigation */}
          <div className="flex flex-wrap gap-x-1 gap-y-2">
            {MILESTONES.map((m, i) => {
              const isActive = i === active;
              return (
                <button
                  key={m.year}
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={isActive}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-300"
                  style={{
                    background: isActive ? "hsl(var(--accent)/0.1)" : "transparent",
                    color: isActive ? "hsl(var(--accent))" : "rgba(255,255,255,0.32)",
                  }}
                >
                  <span className="font-display text-[11px] font-semibold tracking-[0.18em] tabular-nums">
                    {m.index}
                  </span>
                  <span className="font-body text-[12.5px] font-medium tracking-wide hidden sm:block">
                    {m.year}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="heritage-active-bar"
                      className="absolute left-2 right-2 -bottom-0.5 h-[2px] rounded-full"
                      style={{ background: "hsl(var(--accent))" }}
                      transition={{ type: "spring", stiffness: 500, damping: 36 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
