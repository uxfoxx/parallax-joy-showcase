import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import MagneticButton from "@/components/motion/MagneticButton";
import SplitText from "@/components/motion/SplitText";
import Eyebrow from "@/components/ui/eyebrow";

/**
 * Hero — generic full-bleed video-background hero.
 *
 * Layers (deepest → highest):
 *   1. Brand gradient backdrop — always present, also serves as the
 *      video poster/fallback before video buffers (or if it 404s).
 *   2. Background video — autoplay/muted/loop. Drop a file at
 *      `public/videos/hero-bg.mp4` and it appears automatically.
 *      On `onError` (file missing, codec issue) the element hides
 *      itself and only the gradient remains.
 *   3. Legibility overlay — top + bottom dark gradient so text reads
 *      on any video frame.
 *   4. Content column — eyebrow, H1, sub-copy, two CTAs.
 *   5. Scroll cue — bottom-center.
 */

const HERO_VIDEO_SRC = "/videos/hero-bg.mp4";

const HeroSection = () => {
  const reduced = useReducedMotion();
  const [videoOk, setVideoOk] = useState(true);

  return (
    <section
      data-navbar-theme="dark"
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-28 pb-24 md:pt-32 md:pb-28"
    >
      {/* 1 — Brand gradient backdrop (always rendered) */}
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

      {/* 2 — Background video (hidden if missing/errors) */}
      {videoOk && (
        <video
          src={HERO_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoOk(false)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* 3 — Legibility overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(150 40% 6% / 0.55) 0%, hsl(150 40% 6% / 0.25) 30%, hsl(150 40% 6% / 0.35) 70%, hsl(150 40% 6% / 0.7) 100%)",
        }}
      />

      {/* Subtle dot grid for editorial texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(0 0% 100% / 0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* 4 — Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT_EXPO }}
          className="mb-8 flex justify-center"
        >
          <Eyebrow variant="pill" tone="white" withDot>
            Sri Lanka
          </Eyebrow>
        </motion.div>

        <h1 className="font-display text-[44px] sm:text-6xl lg:text-7xl xl:text-[88px] font-bold leading-[1.02] tracking-[-0.025em] text-white mb-7">
          <span className="block overflow-hidden">
            <SplitText
              text="Sri Lanka's Premium Food Exporters"
              by="word"
              stagger={0.06}
              delay={0.15}
              duration={0.85}
              className="block"
              as="span"
            />
          </span>
          <span className="block overflow-hidden">
            <SplitText
              text="Premier Food Distribution Partner."
              by="word"
              stagger={0.05}
              delay={0.32}
              duration={0.9}
              className="block text-gradient-gold italic"
              as="span"
            />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE_OUT_EXPO }}
          className="font-body text-[15px] md:text-[17px] text-white/75 leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Three decades connecting global producers with Sri Lankan businesses
          — bonded warehousing, cold-chain logistics, and island-wide
          distribution from one vertically integrated partner.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: EASE_OUT_EXPO }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton>
            <Link to="/products" className="inline-block group">
              <Button variant="hero" size="pill" className="font-body">
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
      </div>

      {/* 5 — Scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: reduced ? 0 : 1 }}
        transition={{ duration: 0.7, delay: 1.4 }}
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
