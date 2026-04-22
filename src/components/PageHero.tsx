import { motion } from "framer-motion";
import type { ReactNode } from "react";
import GoldHairline from "./GoldHairline";
import { lineRevealVariants, softFadeUp } from "@/lib/motion";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
}

/**
 * Editorial page hero used across About / Products / Brands / Contact / BrandDetail.
 * Replaces the copy-pasted mesh+noise+orbs pattern with: solid forest, film grain,
 * single gold radial glow top-right, and a drawn-in gold hairline under the eyebrow.
 */
const PageHero = ({ eyebrow, title, subtitle, children }: PageHeroProps) => {
  return (
    <section
      data-navbar-theme="dark"
      className="relative overflow-hidden min-h-[56vh] flex items-center pt-32 pb-20"
      style={{
        background:
          "radial-gradient(ellipse at top left, hsl(150 40% 12%), hsl(150 40% 7%) 60%, hsl(150 40% 5%))",
      }}
    >
      {/* Film grain — single subtle layer */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="pageHeroGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#pageHeroGrain)" />
        </svg>
      </div>

      {/* Single gold radial glow, top-right */}
      <div
        className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none opacity-[0.18]"
        style={{
          background: "radial-gradient(circle, hsl(75 40% 60%), transparent 65%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-body text-[11px] font-semibold text-white/70 tracking-[0.28em] uppercase">
            {eyebrow}
          </span>
        </motion.div>

        {/* Animated gold hairline */}
        <div className="mb-7">
          <GoldHairline width={72} delay={0.15} />
        </div>

        {/* Title — line-reveal mask */}
        <motion.h1
          initial="hidden"
          animate="show"
          className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-bold leading-[1.05] tracking-tight text-white max-w-4xl"
        >
          <motion.span variants={lineRevealVariants} custom={0} className="block">
            {title}
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial="hidden"
            animate="show"
            custom={0.55}
            variants={softFadeUp}
            className="font-body text-base md:text-lg text-white/60 leading-relaxed max-w-2xl mt-6"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Optional extras (e.g. filter pills, CTAs) */}
        {children && (
          <motion.div
            initial="hidden"
            animate="show"
            custom={0.75}
            variants={softFadeUp}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
