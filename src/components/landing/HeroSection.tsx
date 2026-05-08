import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
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
import MarqueeRow from "@/components/motion/MarqueeRow";
import Eyebrow from "@/components/ui/eyebrow";

/**
 * Hero — full-bleed cinematic plate with scroll-orchestrated typography,
 * parallax depth layers, and editorial micro-details. Every motion below
 * is bound to a single `scrollYProgress` so the layers move in concert
 * (motion.dev "scroll-linked layered parallax").
 *
 * Layers, deepest → highest:
 *   1. Photo (scroll-zoom + dim)
 *   2. Animated mesh-gradient blobs (CSS `animate-orb`)
 *   3. Mega "OLIVE" watermark — slow vertical drift + subtle scale
 *   4. Editorial dark gradient + film grain
 *   5. Cursor spotlight (gold)
 *   6. Vertical edge rail "EST · 1994 · COLOMBO"
 *   7. Content column (eyebrow, headline, copy, CTAs)
 *   8. Country marquee band — speed reacts to scroll velocity
 *   9. Floating glass stat pills (lower right) — counter-scroll lift
 *  10. Scroll cue — drawing line + dot
 */

const HERO_IMAGE =
  "https://vqvspkuhqthvbtsgfgbo.supabase.co/storage/v1/object/sign/Backgrounds/ChatGPT%20Image%20May%208,%202026,%2011_22_03%20PM.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZWY2OGMyNy1mZDY2LTRkYWEtODA3OC1kZTQ1NjI3MmFmMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJCYWNrZ3JvdW5kcy9DaGF0R1BUIEltYWdlIE1heSA4LCAyMDI2LCAxMV8yMl8wMyBQTS5wbmciLCJpYXQiOjE3NzgyNjI4MDUsImV4cCI6MTgwOTc5ODgwNX0.PqIJ4F50wqHQneq2tHVyy-i9iT5h_Hb78Jso7vq3r0A";

const COUNTRIES = [
  "Italy",
  "Netherlands",
  "Australia",
  "Thailand",
  "Singapore",
  "UAE",
  "India",
  "China",
];

const STATS = [
  { value: 500, suffix: "+", label: "Products" },
  { value: 1000, suffix: "+", label: "Retail Partners" },
  { value: 10, suffix: "+", label: "Source Countries" },
];

/** Helper: spring-smoothed transform — gives parallax that feel like easing,
 *  not raw scroll. Apple/Linear-style. */
const useSmooth = (
  mv: MotionValue<number>,
  input: [number, number],
  output: [number | string, number | string],
) => {
  const t = useTransform(mv, input, output);
  return useSpring(t as MotionValue<number>, { stiffness: 110, damping: 24, mass: 0.4 });
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Photo — slow zoom + gentle dim as user scrolls past.
  const photoScale = useSmooth(scrollYProgress, [0, 1], [1.02, 1.18]);
  const photoOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.4]);

  // Watermark — drifts down slowly, reads as "deep" depth.
  const wmY = useSmooth(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const wmScale = useSmooth(scrollYProgress, [0, 1], [1, 1.08]);
  const wmOpacity = useTransform(scrollYProgress, [0, 0.85], [0.06, 0.02]);

  // Content — slight upward drift + fade-out as you leave the hero.
  const contentY = useSmooth(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Foreground floating stat-pill cluster — counter-scroll (motion.dev foreground parallax).
  const pillsY = useSmooth(scrollYProgress, [0, 1], ["0%", "-25%"]);

  // Country marquee track drift (in addition to its scroll-velocity reaction).
  const marqueeY = useSmooth(scrollYProgress, [0, 1], ["0%", "-50%"]);

  // Edge-rail vertical text — slow upward drift.
  const railY = useSmooth(scrollYProgress, [0, 1], ["0%", "-18%"]);

  // Headline lines — each line gets a slightly different parallax rate so
  // they "separate" as you scroll (motion.dev kinetic typography).
  const line1Y = useSmooth(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const line2Y = useSmooth(scrollYProgress, [0, 1], ["0%", "-44%"]);
  const line3Y = useSmooth(scrollYProgress, [0, 1], ["0%", "-58%"]);

  return (
    <section
      ref={sectionRef}
      data-navbar-theme="dark"
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "hsl(150 40% 5%)" }}
    >
      {/* 1 — Cinematic photograph (scroll-zoom) */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: reduced ? 1 : photoScale, opacity: photoOpacity }}
      >
        <img
          src={HERO_IMAGE}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>

      {/* 2 — Animated mesh-gradient blobs (breathing) */}
      <div
        aria-hidden
        className="absolute -top-40 -left-32 w-[640px] h-[640px] rounded-full opacity-[0.25] pointer-events-none animate-orb mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, hsl(140 55% 22%), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="absolute top-1/2 -right-40 w-[560px] h-[560px] rounded-full opacity-[0.22] pointer-events-none animate-orb mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, hsl(75 45% 38%), transparent 65%)",
          animationDelay: "6s",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-32 left-1/3 w-[420px] h-[420px] rounded-full opacity-[0.18] pointer-events-none animate-orb mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, hsl(45 60% 55%), transparent 65%)",
          animationDelay: "12s",
        }}
      />

      {/* 3 — Mega "OLIVE" watermark */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-[28%] -translate-y-1/2 pointer-events-none select-none flex justify-center"
        style={{
          y: reduced ? 0 : wmY,
          scale: reduced ? 1 : wmScale,
          opacity: wmOpacity,
        }}
      >
        <span className="font-display font-black text-[26vw] leading-none tracking-[-0.06em] text-white whitespace-nowrap">
          OLIVE
        </span>
      </motion.div>

      {/* 4 — Editorial dark gradient + film grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50 "
        style={{
          background:
            "linear-gradient(180deg, hsl(150 40% 4% / 0.40) 0%, hsl(150 40% 4% / 0.62) 50%, hsl(150 40% 4% / 0.95) 100%)",
        }}
      />
      <div className="absolute inset-0 opacity-[0.045] pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="heroGrain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#heroGrain)" />
        </svg>
      </div>

      {/* 5 — Gold cursor spotlight */}
      <CursorSpotlight color="hsl(75 40% 60% / 0.30)" size={620} blendMode="screen" />

      {/* 6 — Vertical edge rail (left) */}
      <motion.div
        aria-hidden
        className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center gap-3 pointer-events-none"
        style={{ y: reduced ? 0 : railY }}
      >
        <span className="block w-px h-24 bg-gradient-to-b from-transparent via-white/35 to-transparent" />
        <span
          className="font-body text-[11px] md:text-[10px] tracking-[0.5em] uppercase text-white/60 whitespace-nowrap"
          style={{ writingMode: "vertical-rl" }}
        >
          
        </span>
      </motion.div>

      {/* 7 — Content column */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col justify-center items-start max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-32"
        style={{ y: reduced ? 0 : contentY, opacity: contentOpacity }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT_EXPO }}
          className="mb-9"
        >
          <Eyebrow variant="pill" tone="white" withDot>
            Sri Lanka 
          </Eyebrow>
        </motion.div>

        {/* Headline — per-line mask + per-word reveal + per-line scroll parallax */}
        <h1 className="font-display text-[44px] sm:text-6xl lg:text-[88px] xl:text-[104px] font-bold leading-[0.96] tracking-[-0.025em] mb-9 max-w-[16ch]">
          <motion.span
            className="block overflow-hidden"
            style={{ y: reduced ? 0 : line1Y }}
          >
            <SplitText
              text="Sri Lanka's"
              by="word"
              stagger={0.06}
              delay={0.1}
              duration={0.85}
              className="block text-white"
              as="span"
            />
          </motion.span>

          <motion.span
            className="block overflow-hidden"
            style={{ y: reduced ? 0 : line2Y }}
          >
            <SplitText
              text="Premier Food"
              by="word"
              stagger={0.06}
              delay={0.1}
              duration={0.9}
              className="block text-gradient-gold italic"
              as="span"
            />
          </motion.span>

          <motion.span
            className="block overflow-hidden"
            style={{ y: reduced ? 0 : line3Y }}
          >
            <SplitText
              text="Import Partner."
              by="word"
              stagger={0.06}
              delay={0.42}
              duration={0.95}
              className="block text-white"
              as="span"
            />
          </motion.span>
        </h1>

        {/* Hairline + sub-copy */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.6, ease: EASE_OUT_EXPO }}
          style={{ transformOrigin: "left" }}
          className="h-px w-20 bg-accent mb-7"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE_OUT_EXPO }}
          className="font-body text-[15px] md:text-[17px] text-white/70 leading-relaxed mb-11 max-w-xl font-body "
        >
          Connecting global producers with Sri Lankan businesses across eight
          countries — bonded warehousing, cold-chain logistics, and island-wide
          distribution from a single, vertically integrated partner..
        </motion.p>

        {/* CTAs — magnetic with gold halo on primary */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: EASE_OUT_EXPO }}
          className="flex flex-wrap gap-3"
        >
          <MagneticButton>
            <Link to="/products" className="relative inline-block group">
              {/* Gold halo */}
              <span
                aria-hidden
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/40 via-primary/0 to-primary/40 opacity-60 blur-xl group-hover:opacity-100 transition-opacity duration-500"
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

        {/* Mobile-only stat strip — desktop has the floating glass pills on the right */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: EASE_OUT_EXPO }}
          className="md:hidden mt-10 flex gap-3 overflow-x-auto -mx-6 px-6 pb-2 scrollbar-thin"
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
      </motion.div>

      {/* 8 — Country marquee band (above bottom edge) */}
      

      {/* 9 — Floating glass stat-pill cluster (right) */}
      <motion.div
        className="absolute right-4 md:right-8 lg:right-12 top-[28%] z-10 hidden md:flex flex-col gap-3"
        style={{ y: reduced ? 0 : pillsY }}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 1.0, ease: EASE_OUT_EXPO }}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: 30, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.7,
              delay: 1.05 + i * 0.12,
              ease: EASE_OUT_EXPO,
            }}
            whileHover={{ x: -4 }}
            className="group relative pl-4 pr-5 py-3 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-xl shadow-xl shadow-black/30 min-w-[180px]"
          >
            {/* gold accent bar */}
            <span className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-accent group-hover:bg-accent transition-colors" />
            <div className="font-display text-2xl lg:text-3xl font-bold text-white leading-none tracking-tight">
              <CountUp to={s.value} suffix={s.suffix} />
            </div>
            <div className="font-body text-[11px] md:text-[10px] text-white/60 tracking-[0.22em] uppercase mt-1.5">
              {s.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 10 — Scroll cue — drawing line + pulsing dot */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.7 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none"
      >
        <span className="font-body text-[11px] md:text-[10px] text-white/55 tracking-[0.4em] uppercase">
          Scroll
        </span>
        <div className="relative h-12 w-px overflow-hidden">
          <span className="absolute inset-0 bg-white/15" />
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/70 to-transparent"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-white/70"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.95, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
