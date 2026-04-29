import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import CountUp from "@/components/motion/CountUp";
import MagneticButton from "@/components/motion/MagneticButton";
import CursorSpotlight from "@/components/motion/CursorSpotlight";
import SplitText from "@/components/motion/SplitText";
import Eyebrow from "@/components/ui/eyebrow";
import logoSvg from "@/assets/olive-foods-hero-logo.svg";

/**
 * Hero — two-stage, scroll-locked.
 *
 * The outer wrapper is ~160–200vh tall. A `sticky top-0 h-screen`
 * inner container pins the visual to the viewport while the user
 * scrolls. A single `useScroll` reads progress 0 → 1 against the outer
 * wrapper and drives a vertical curtain wipe between two stages:
 *
 *   Stage 1 (progress 0   → 0.5)  — Animated logo intro + scroll cue.
 *   Stage 2 (progress 0.5 → 1.0)  — Headline, copy, CTAs, stat pills.
 *
 * Once `progress >= 1` the sticky pin releases and the next section
 * (`LogoStrip`) flows in naturally. With `prefers-reduced-motion` the
 * scroll-pin is dropped — Stage 2 renders directly with the logo
 * shrunk above the headline.
 */

const STATS = [
  { value: 500, suffix: "+", label: "Products" },
  { value: 1000, suffix: "+", label: "Retail Partners" },
  { value: 8, suffix: "+", label: "Source Countries" },
];

/** Spring-smoothed scroll transform — buttery scrub, not raw scroll. */
const useSmooth = (
  mv: MotionValue<number>,
  input: number[],
  output: (number | string)[],
) => {
  // useTransform's typing wants a tuple, but it accepts arbitrary-length
  // arrays of matching size; cast to satisfy the overload.
  const t = useTransform(
    mv,
    input as [number, number, ...number[]],
    output as [number | string, number | string, ...(number | string)[]],
  );
  return useSpring(t, { stiffness: 120, damping: 28, mass: 0.4 });
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // ── Stage 1 (logo intro) — lifts up + fades out across the wipe.
  const stage1Y = useSmooth(scrollYProgress, [0, 0.4, 0.6], ["0%", "0%", "-100%"]);
  const stage1Opacity = useSmooth(scrollYProgress, [0.35, 0.55], [1, 0]);
  const stage1Scale = useSmooth(scrollYProgress, [0, 0.55], [1, 0.92]);

  // ── Stage 2 (hero details) — rises from below + fades in.
  const stage2Y = useSmooth(scrollYProgress, [0.4, 0.6, 1], ["100%", "0%", "0%"]);
  const stage2Opacity = useSmooth(scrollYProgress, [0.45, 0.65], [0, 1]);

  // ── Scroll cue fades out as the user starts moving.
  const cueOpacity = useSmooth(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={sectionRef}
      data-navbar-theme="dark"
      className="relative h-[160vh] md:h-[200vh]"
    >
      {/* Sticky viewport — pinned for the duration of the section. */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Shared backdrop — single forest gradient + orbs for both stages. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, hsl(140 50% 19% / 0.55) 0%, transparent 50%)," +
              "radial-gradient(ellipse at 70% 80%, hsl(150 40% 14% / 0.45) 0%, transparent 50%)," +
              "linear-gradient(180deg, hsl(150 40% 6%), hsl(140 50% 14%), hsl(150 40% 8%))",
          }}
        />
        <div
          aria-hidden
          className="absolute w-[640px] h-[640px] -top-32 -right-32 rounded-full opacity-[0.08] pointer-events-none animate-orb"
          style={{ background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="absolute w-[480px] h-[480px] -bottom-24 -left-24 rounded-full opacity-[0.06] pointer-events-none animate-orb"
          style={{
            background: "radial-gradient(circle, hsl(140 55% 22%), transparent 70%)",
            animationDelay: "8s",
          }}
        />

        {/* Subtle dot grid for editorial texture — under both stages. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(0 0% 100% / 0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <CursorSpotlight color="hsl(75 38% 55%)" radius={520} />

        {/* ──────────────────────────  STAGE 1  ────────────────────────── */}
        <motion.div
          aria-hidden={false}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
          style={
            reduced
              ? undefined
              : { y: stage1Y, opacity: stage1Opacity, scale: stage1Scale }
          }
        >
          {/* Logo + shimmer */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
            className="relative"
          >
            {/* Soft gold halo */}
            <span
              aria-hidden
              className="absolute -inset-12 rounded-full blur-3xl opacity-40 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, hsl(75 38% 45% / 0.45), transparent 65%)",
              }}
            />

            <motion.img
              src={logoSvg}
              alt="Olive Foods"
              draggable={false}
              className="relative w-[180px] sm:w-[220px] md:w-[260px] h-auto select-none"
              style={{ filter: "brightness(0) invert(1)" }}
              animate={
                reduced
                  ? undefined
                  : { scale: [1, 1.025, 1] }
              }
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Shimmer sweep — translucent gold band that crosses the mark. */}
            {!reduced && (
              <motion.span
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 35%, hsl(75 60% 70% / 0.45) 50%, transparent 65%)",
                  mixBlendMode: "overlay",
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  repeatDelay: 1.4,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE_OUT_EXPO }}
            className="mt-9 flex flex-col items-center gap-3 text-center"
          >
            <span className="font-display text-3xl md:text-5xl font-bold tracking-[-0.02em] text-white">
              Olive Foods
            </span>
            <span className="font-body text-[11px] md:text-[10px] tracking-[0.5em] uppercase text-white/55">
              Sri Lanka · Since 1994
            </span>
          </motion.div>
        </motion.div>

        {/* ──────────────────────────  STAGE 2  ────────────────────────── */}
        <motion.div
          className="absolute inset-0 z-30 flex flex-col justify-center"
          style={reduced ? undefined : { y: stage2Y, opacity: stage2Opacity }}
        >
          <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-32">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.05, ease: EASE_OUT_EXPO }}
              className="mb-8"
            >
              <Eyebrow variant="pill" tone="white" withDot>
                Sri Lanka · Since 1994
              </Eyebrow>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-[44px] sm:text-6xl lg:text-[88px] xl:text-[104px] font-bold leading-[0.96] tracking-[-0.025em] mb-8 max-w-[16ch]">
              <span className="block overflow-hidden">
                <SplitText
                  text="Sri Lanka's"
                  by="word"
                  stagger={0.06}
                  delay={0.1}
                  duration={0.85}
                  className="block text-white"
                  as="span"
                />
              </span>
              <span className="block overflow-hidden">
                <SplitText
                  text="Premier Food"
                  by="word"
                  stagger={0.06}
                  delay={0.25}
                  duration={0.9}
                  className="block text-gradient-gold italic"
                  as="span"
                />
              </span>
              <span className="block overflow-hidden">
                <SplitText
                  text="Distribution Partner."
                  by="word"
                  stagger={0.06}
                  delay={0.42}
                  duration={0.95}
                  className="block text-white"
                  as="span"
                />
              </span>
            </h1>

            {/* Hairline */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.6, ease: EASE_OUT_EXPO }}
              style={{ transformOrigin: "left" }}
              className="h-px w-20 bg-accent mb-7"
            />

            {/* Sub-copy */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE_OUT_EXPO }}
              className="font-body text-[15px] md:text-[17px] text-white/70 leading-relaxed mb-10 max-w-xl"
            >
              Connecting global producers with Sri Lankan businesses across eight
              countries — bonded warehousing, cold-chain logistics, and
              island-wide distribution from a single, vertically integrated
              partner.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.85, ease: EASE_OUT_EXPO }}
              className="flex flex-wrap gap-3"
            >
              <MagneticButton>
                <Link to="/products" className="relative inline-block group">
                  <span
                    aria-hidden
                    className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent/40 via-accent/0 to-accent/40 opacity-60 blur-xl group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <Button variant="hero" size="pill" className="relative font-body">
                    Explore Products
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link to="/about">
                  <Button variant="heroOutline" size="pill" className="font-body">
                    Our Story
                  </Button>
                </Link>
              </MagneticButton>
            </motion.div>

            {/* Floating glass stat-pills (desktop) */}
            <motion.div
              className="absolute right-4 md:right-8 lg:right-12 top-[18%] hidden md:flex flex-col gap-3"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 1.0, ease: EASE_OUT_EXPO }}
            >
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: 30, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: 1.05 + i * 0.12,
                    ease: EASE_OUT_EXPO,
                  }}
                  whileHover={{ x: -4 }}
                  className="group relative pl-4 pr-5 py-3 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-xl shadow-xl shadow-black/30 min-w-[180px]"
                >
                  <span className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-accent" />
                  <div className="font-display text-2xl lg:text-3xl font-bold text-white leading-none tracking-tight">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="font-body text-[11px] md:text-[10px] text-white/60 tracking-[0.22em] uppercase mt-1.5">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile stat strip */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.0, ease: EASE_OUT_EXPO }}
              className="md:hidden mt-10 flex gap-3 overflow-x-auto -mx-6 px-6 pb-2"
            >
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="shrink-0 pl-3 pr-4 py-2.5 rounded-2xl bg-white/[0.06] border border-white/15 backdrop-blur-md min-w-[148px] relative"
                >
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-[2px] rounded-full bg-accent" />
                  <div className="font-display text-xl font-bold text-white leading-none tracking-tight">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="font-body text-[11px] text-white/65 tracking-[0.2em] uppercase mt-1.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll cue — bottom-center, fades out once user starts scrolling. */}
        <motion.div
          aria-hidden
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none"
          style={reduced ? undefined : { opacity: cueOpacity }}
        >
          <span className="font-body text-[11px] md:text-[10px] text-white/55 tracking-[0.4em] uppercase">
            Scroll
          </span>
          <div className="relative h-12 w-px overflow-hidden">
            <span className="absolute inset-0 bg-white/15" />
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent"
              animate={{ y: ["-100%", "200%"] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-white/70"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.95, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
