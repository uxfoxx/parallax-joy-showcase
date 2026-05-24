import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EASE_OUT_EXPO } from "@/lib/motion";
import MagneticButton from "@/components/motion/MagneticButton";
import SplitText from "@/components/motion/SplitText";
import Eyebrow from "@/components/ui/eyebrow";

/**
 * Hero — editorial food-spread composition.
 *
 * A flat-lay photograph of dishes wreathed around a cream negative-space
 * oval. The composition is the hero — typography lives in the centre,
 * decorative sprigs of garnish drift with the cursor in the margins,
 * and a soft vignette keeps text legible regardless of the photo crop
 * at any breakpoint.
 *
 * To swap the photo: upload the new file to the Supabase Backgrounds
 * bucket, get a signed URL, and replace both `HERO_SPREAD_IMAGE` here
 * AND the matching `<link rel="preload" as="image">` href in
 * `index.html` so the browser preloads the actual LCP image.
 */

const HERO_SPREAD_IMAGE =
  "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=2400&q=85&auto=format&fit=crop";

/** Tiny olive-sprig SVG — sits in the photo's negative-space margins. */
const Sprig = ({ rotate = 0, scale = 1 }: { rotate?: number; scale?: number }) => (
  <svg
    viewBox="0 0 60 60"
    className="w-full h-full"
    aria-hidden
    style={{ transform: `rotate(${rotate}deg) scale(${scale})` }}
  >
    <g fill="hsl(140 50% 19% / 0.65)">
      <ellipse cx="30" cy="14" rx="3.5" ry="7" />
      <ellipse
        cx="20" cy="22" rx="3" ry="6"
        transform="rotate(-25 20 22)"
      />
      <ellipse
        cx="40" cy="22" rx="3" ry="6"
        transform="rotate(25 40 22)"
      />
      <ellipse
        cx="16" cy="34" rx="2.5" ry="5"
        transform="rotate(-40 16 34)"
      />
      <ellipse
        cx="44" cy="34" rx="2.5" ry="5"
        transform="rotate(40 44 34)"
      />
    </g>
    <line
      x1="30" y1="12" x2="30" y2="56"
      stroke="hsl(140 50% 19% / 0.55)"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

/** Spring-smoothed scroll transform — buttery scrub, not raw scroll. */
const useSmooth = (
  mv: MotionValue<number>,
  input: number[],
  output: (number | string)[],
) => {
  const t = useTransform(
    mv,
    input as [number, number, ...number[]],
    output as [number | string, number | string, ...(number | string)[]],
  );
  return useSpring(t, { stiffness: 110, damping: 24, mass: 0.4 });
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // ── Scroll parallax ───────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const photoScale = useSmooth(scrollYProgress, [0, 1], [1, 1.06]);
  const photoOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.5]);
  const contentY = useSmooth(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // ── Mouse parallax for garnish sprigs ─────────────────────────
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, { damping: 28, stiffness: 90 });
  const mouseY = useSpring(rawMouseY, { damping: 28, stiffness: 90 });
  const sprig1X = useTransform(mouseX, [-0.5, 0.5], [-14, 14]);
  const sprig1Y = useTransform(mouseY, [-0.5, 0.5], [-10, 10]);
  const sprig2X = useTransform(mouseX, [-0.5, 0.5], [10, -10]);
  const sprig2Y = useTransform(mouseY, [-0.5, 0.5], [12, -12]);
  const sprig3X = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const sprig3Y = useTransform(mouseY, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawMouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawMouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [rawMouseX, rawMouseY],
  );

  return (
    <section
      ref={sectionRef}
      data-navbar-theme="light"
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: "hsl(36 18% 94%)" }}
      onMouseMove={handleMouseMove}
    >
      {/* 1 — Food-spread photo (full-bleed, scroll-zoom) */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: reduced ? 1 : photoScale, opacity: photoOpacity }}
      >
        <img
          src={HERO_SPREAD_IMAGE}
          alt=""
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchpriority="high"
        />
      </motion.div>

      {/* 2 — Centre vignette so type contrast stays consistent across crops */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, hsl(36 18% 94% / 0.82), hsl(36 18% 94% / 0.45) 55%, transparent 80%)",
        }}
      />
      {/* Top + bottom edge fades for nav + scroll-cue legibility */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(36 18% 94% / 0.75), transparent)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, hsl(36 18% 94% / 0.75), transparent)",
        }}
      />

      {/* 3 — Mouse-parallax garnish sprigs in the photo's negative-space margins */}
      <motion.div
        className="absolute top-[16%] left-[7%] w-12 h-12 md:w-16 md:h-16 pointer-events-none opacity-60 hidden md:block"
        style={reduced ? undefined : { x: sprig1X, y: sprig1Y }}
      >
        <Sprig rotate={-22} scale={0.9} />
      </motion.div>
      <motion.div
        className="absolute bottom-[20%] right-[10%] w-10 h-10 md:w-14 md:h-14 pointer-events-none opacity-55 hidden md:block"
        style={reduced ? undefined : { x: sprig2X, y: sprig2Y }}
      >
        <Sprig rotate={42} scale={0.85} />
      </motion.div>
      <motion.div
        className="absolute top-[24%] right-[15%] w-8 h-8 md:w-12 md:h-12 pointer-events-none opacity-50 hidden md:block"
        style={reduced ? undefined : { x: sprig3X, y: sprig3Y }}
      >
        <Sprig rotate={15} scale={0.7} />
      </motion.div>

      {/* 4 — Centred type column */}
      <motion.div
        className="relative z-10 w-full max-w-3xl mx-auto px-6 lg:px-10 text-center pt-24 pb-32"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT_EXPO }}
          className="mb-7 flex justify-center"
        >
          <Eyebrow variant="pill" tone="primary" withDot>
            Premium Imports · Since 1994
          </Eyebrow>
        </motion.div>

        <h1 className="font-display text-[34px] sm:text-5xl lg:text-6xl xl:text-[68px] font-bold leading-[1.05] tracking-[-0.025em] text-foreground mb-8">
          <span className="block overflow-hidden">
            <SplitText
              text="Every great meal"
              by="word"
              stagger={0.06}
              delay={0.18}
              duration={0.85}
              className="block"
              as="span"
            />
          </span>
          <span className="block overflow-hidden">
            <SplitText
              text="starts with the right"
              by="word"
              stagger={0.05}
              delay={0.32}
              duration={0.85}
              className="block"
              as="span"
            />
          </span>
          <span className="block overflow-hidden">
            <SplitText
              text="ingredients."
              by="word"
              stagger={0.05}
              delay={0.5}
              duration={0.9}
              className="block text-gradient-gold italic"
              as="span"
            />
          </span>
        </h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.75, ease: EASE_OUT_EXPO }}
          style={{ transformOrigin: "center" }}
          className="mx-auto h-px w-20 bg-primary/40 mb-7"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE_OUT_EXPO }}
          className="font-body text-[15px] md:text-[17px] text-foreground/75 leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          Three decades sourcing premium FMCG for Sri Lanka — bonded
          warehousing, cold-chain logistics, and island-wide distribution
          from one vertically integrated partner.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease: EASE_OUT_EXPO }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton>
            <Link to="/products" className="inline-block group">
              <Button variant="brand" size="pill" className="font-body">
                Explore Products
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link to="/about">
              <Button variant="brandOutline" size="pill" className="font-body">
                Our Story
              </Button>
            </Link>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* 5 — Bottom-centre scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: reduced ? 0 : 1 }}
        transition={{ duration: 0.7, delay: 1.5 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none"
      >
        <span className="font-body text-[11px] md:text-[10px] text-foreground/55 tracking-[0.4em] uppercase">
          Scroll
        </span>
        <div className="relative h-12 w-px overflow-hidden">
          <span className="absolute inset-0 bg-foreground/15" />
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-foreground/70 to-transparent"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-foreground/70"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.95, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
