import { useRef } from "react";
import { motion } from "framer-motion";
import SplitText from "@/components/motion/SplitText";
import CountUp from "@/components/motion/CountUp";
import Eyebrow from "@/components/ui/eyebrow";
import GlobalOrigins from "@/components/landing/GlobalOrigins";

/**
 * Global Origins — headline stats over the trade-routes explorer
 * (GlobalOrigins.tsx: dot-matrix world map, country card, country rail).
 *
 * File name kept as StatsSection.tsx so Index.tsx imports don't churn.
 */

type HeadlineStat = {
  value: number;
  suffix: string;
  label: string;
  isText?: boolean;
  displayText?: string;
};

const HEADLINE_STATS: HeadlineStat[] = [
  { value: 30, suffix: "+", label: "Source countries" },
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

const StatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

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
                <SplitText text="it grows best" by="word" stagger={0.05} delay={0.2} as="span" tokenClassName="text-gradient-gold" />
              </span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-body text-[17px] leading-relaxed text-muted-foreground max-w-xl mt-7"
            >
              Every origin is a relationship, built over thirty-plus
              years between our team and the producers we source from.
              Select a country to see the brands we bring in from it.
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

        {/* ── Zone 2: the trade-routes explorer (map, country card, rail) ── */}
        <GlobalOrigins />
      </div>
    </section>
  );
};

export default StatsSection;
