import { motion, useScroll, useTransform, useInView, useMotionValue, animate } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { lineRevealVariants, softFadeUp, EASE_OUT_EXPO } from "@/lib/motion";

const headlineLines: { text: string; gold?: boolean }[] = [
  { text: "Sri Lanka's" },
  { text: "Premier Food Import &", gold: true },
  { text: "Distribution Partner" },
];

// Editorial background photograph — single cinematic shot, not a carousel.
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop&q=75";

/** Counter-roll — motion.dev "Number trend" pattern. */
const CountUp = ({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const value = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, {
      duration,
      ease: EASE_OUT_EXPO,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, duration, value]);

  return <span ref={ref}>0{suffix}</span>;
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-zoom: image scales up slowly as user scrolls past the hero.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.22]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.55]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      data-navbar-theme="dark"
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "hsl(150 40% 6%)" }}
    >
      {/* ── Cinematic background image (scroll-zoom) ─────────── */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: imageScale, opacity: imageOpacity }}
      >
        <img
          src={HERO_IMAGE}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Editorial dark gradient — keeps text legible over any photograph */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(150 40% 4% / 0.45) 0%, hsl(150 40% 4% / 0.70) 55%, hsl(150 40% 4% / 0.92) 100%)",
        }}
      />

      {/* Film grain — single subtle layer */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="heroGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#heroGrain)" />
        </svg>
      </div>

      {/* Gold radial glow — corner flourish for continuity with /premium surfaces */}
      <div
        className="absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(75 40% 60%), transparent 65%)",
          filter: "blur(110px)",
        }}
      />

      {/* ── Content layer ─────────────────────────────────────── */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col justify-center items-start max-w-6xl mx-auto px-6 lg:px-10 pt-28 pb-24"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 backdrop-blur-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-body text-[11px] font-semibold text-white/75 tracking-[0.28em] uppercase">
            30+ Years · Sri Lanka
          </span>
        </motion.div>

        {/* Headline — line-by-line clip-path mask reveal */}
        <motion.h1
          initial="hidden"
          animate="show"
          className="font-display text-5xl sm:text-6xl lg:text-[78px] xl:text-[92px] font-bold leading-[1.02] tracking-tight mb-8 max-w-[18ch]"
        >
          {headlineLines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                variants={lineRevealVariants}
                custom={i}
                className={`block ${line.gold ? "text-gradient-gold italic" : "text-white"}`}
              >
                {line.text}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Sub-copy */}
        <motion.p
          initial="hidden"
          animate="show"
          custom={0.55}
          variants={softFadeUp}
          className="font-body text-base md:text-lg text-white/65 leading-relaxed mb-10 max-w-xl"
        >
          Connecting global producers with Sri Lankan businesses across 8+ countries — bonded warehousing, cold-chain logistics, and island-wide distribution.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={0.7}
          variants={softFadeUp}
          className="flex flex-wrap gap-3 mb-14"
        >
          <Link to="/products">
            <Button className="bg-accent text-white hover:bg-accent/90 font-body font-semibold rounded-full h-12 px-7 text-sm md:text-base transition-all duration-300 shadow-xl shadow-accent/25 group border border-white/10">
              Explore Products
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/about">
            <Button
              variant="outline"
              className="border-white/25 bg-white/5 text-white hover:bg-white/15 font-body font-semibold rounded-full h-12 px-7 text-sm md:text-base transition-all duration-300 backdrop-blur-sm"
            >
              Our Story
            </Button>
          </Link>
        </motion.div>

        {/* Stats — counter-roll (motion.dev "Number trend") */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={0.85}
          variants={softFadeUp}
          className="flex flex-wrap items-end gap-x-10 gap-y-5"
        >
          {[
            { value: 500, suffix: "+", label: "Products" },
            { value: 1000, suffix: "+", label: "Retail Partners" },
            { value: 30, suffix: "+", label: "Years Experience" },
          ].map((stat, i) => (
            <div key={i} className="flex items-end gap-4">
              {i > 0 && <span className="w-px h-10 bg-white/15 mb-2" />}
              <div>
                <div className="font-display text-3xl md:text-4xl font-bold text-white leading-none tracking-tight">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </div>
                <div className="font-body text-[11px] text-white/50 tracking-[0.2em] uppercase mt-2">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="font-body text-[10px] text-white/45 tracking-[0.3em] uppercase">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/45 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
