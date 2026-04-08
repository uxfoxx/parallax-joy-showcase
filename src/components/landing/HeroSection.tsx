import { useMouseGradient } from "@/hooks/useMouseGradient";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const words = ["Sri Lanka's", "Premier", "Food Import", "&", "Distribution", "Partner"];
const accentWords = new Set(["Premier"]);

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=760&fit=crop",
    label: "Premium Grocery",
  },
  {
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=500&h=760&fit=crop",
    label: "Bonded Warehousing",
  },
  {
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&h=760&fit=crop",
    label: "HoReCa Supply",
  },
  {
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&h=760&fit=crop",
    label: "Island Distribution",
  },
  {
    image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d6?w=500&h=760&fit=crop",
    label: "Quality Imports",
  },
];

type CardPos = {
  x: number; y: number; rotateZ: number; rotateY: number;
  scale: number; opacity: number; zIndex: number;
};

const POSITIONS: Record<string, CardPos> = {
  center:      { x: 0,    y: 0,  rotateZ: 0,   rotateY: 0,   scale: 1,    opacity: 1,    zIndex: 10 },
  right:       { x: 188,  y: 24, rotateZ: 10,  rotateY: 14,  scale: 0.8,  opacity: 0.78, zIndex: 5  },
  left:        { x: -188, y: 24, rotateZ: -10, rotateY: -14, scale: 0.8,  opacity: 0.78, zIndex: 5  },
  hiddenRight: { x: 520,  y: 60, rotateZ: 26,  rotateY: 52,  scale: 0.45, opacity: 0,    zIndex: 0  },
  hiddenLeft:  { x: -520, y: 60, rotateZ: -26, rotateY: -52, scale: 0.45, opacity: 0,    zIndex: 0  },
};

function getCardPos(idx: number, active: number, total: number): CardPos {
  const diff = ((idx - active) % total + total) % total;
  if (diff === 0) return POSITIONS.center;
  if (diff === 1) return POSITIONS.right;
  if (diff === total - 1) return POSITIONS.left;
  return diff <= Math.floor(total / 2) ? POSITIONS.hiddenRight : POSITIONS.hiddenLeft;
}

const HeroSection = () => {
  const { ref, gradientStyle } = useMouseGradient();
  const { scrollYProgress } = useScroll();
  const contentY = useTransform(scrollYProgress, [0, 0.15], ["0px", "60px"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const [activeIndex, setActiveIndex] = useState(0);
  const total = heroSlides.length;

  useEffect(() => {
    const t = setInterval(() => setActiveIndex(i => (i + 1) % total), 3500);
    return () => clearInterval(t);
  }, [total]);

  return (
    <section
      ref={(el) => { (ref as React.MutableRefObject<HTMLElement | null>).current = el; }}
      className="relative min-h-screen overflow-hidden flex flex-col"
    >
      {/* Animated gradient background — same as About hero */}
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background: `linear-gradient(135deg, hsl(150 40% 4%), hsl(140 50% 16%), hsl(80 45% 18%), hsl(75 38% 13%), hsl(140 55% 21%), hsl(150 40% 5%), hsl(140 50% 16%))`,
          backgroundSize: "400% 400%",
        }}
      />

      {/* Grid overlay — from About page hero */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-[1]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseHero">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseHero)" />
        </svg>
      </div>

      {/* Soft orbs */}
      <motion.div
        className="absolute rounded-full z-0 pointer-events-none"
        style={{ width: 600, height: 600, top: "-15%", left: "-10%", background: "hsl(140 55% 20%)", filter: "blur(130px)", opacity: 0.45 }}
        animate={{ x: [0, 70, -35, 0], y: [0, 45, -22, 0], scale: [1, 1.1, 0.96, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full z-0 pointer-events-none"
        style={{ width: 400, height: 400, bottom: "15%", right: "-8%", background: "hsl(80 55% 22%)", filter: "blur(110px)", opacity: 0.25 }}
        animate={{ x: [0, -50, 25, 0], y: [0, -30, 15, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      {/* Mouse-following gradient */}
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{ ...gradientStyle, opacity: 0.15 }} />

      {/* ── Text content — centered ──────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-4 flex-1"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/15 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-body text-xs font-medium text-primary-foreground/80 tracking-widest uppercase">
            Est. 1994 · Sri Lanka
          </span>
        </motion.div>

        {/* Headline — word by word */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-bold leading-[1.08] tracking-tight mb-5 max-w-3xl">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className={`inline-block mr-[0.2em] ${accentWords.has(word) ? "text-gradient-gold" : "text-primary-foreground"}`}
              initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.55, delay: 0.35 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="font-body text-base md:text-lg text-primary-foreground/60 leading-relaxed mb-8 max-w-lg"
        >
          Connecting global producers with Sri Lankan businesses across 8+ countries — bonded warehousing, cold-chain logistics, and island-wide distribution.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.05 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <Link to="/products">
            <Button className="bg-accent text-white hover:bg-accent/90 font-body font-semibold rounded-full h-12 px-7 text-sm md:text-base transition-all duration-300 shadow-xl shadow-accent/25 group border border-white/10 shine-sweep">
              Explore Products
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/about">
            <Button
              variant="outline"
              className="border-primary-foreground/35 bg-primary-foreground/8 text-primary-foreground hover:bg-primary-foreground/15 font-body font-semibold rounded-full h-12 px-7 text-sm md:text-base transition-all duration-300 backdrop-blur-sm"
            >
              Our Story
            </Button>
          </Link>
        </motion.div>

        {/* Mini stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex flex-wrap justify-center items-center gap-5"
        >
          {[
            { value: "500+", label: "Products" },
            { value: "1000+", label: "Retail Partners" },
            { value: "30+", label: "Years Experience" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              {i > 0 && <span className="w-px h-7 bg-primary-foreground/15" />}
              <div>
                <div className="font-display text-lg font-bold text-primary-foreground leading-none">{stat.value}</div>
                <div className="font-body text-xs text-primary-foreground/45 mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Sliding card deck ────────────────────────────────── */}
      <motion.div
        className="relative z-10 flex justify-center items-end flex-shrink-0"
        style={{ height: 300 }}
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Perspective parent — gives 3D depth to rotateY */}
        <div
          className="relative w-full"
          style={{
            maxWidth: 580,
            height: 300,
            perspective: "1400px",
            perspectiveOrigin: "50% 100%",
          }}
        >
          {heroSlides.map((slide, idx) => {
            const pos = getCardPos(idx, activeIndex, total);
            return (
              <motion.div
                key={idx}
                className="absolute overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
                style={{
                  width: 176,
                  height: 270,
                  left: "calc(50% - 88px)",
                  bottom: 0,
                  zIndex: pos.zIndex,
                  transformStyle: "preserve-3d",
                }}
                initial={false}
                animate={{
                  x: pos.x,
                  y: pos.y,
                  rotateZ: pos.rotateZ,
                  rotateY: pos.rotateY,
                  scale: pos.scale,
                  opacity: pos.opacity,
                }}
                transition={{ type: "spring", stiffness: 80, damping: 22, mass: 1.2 }}
                onClick={() => setActiveIndex(idx)}
              >
                <img
                  src={slide.image}
                  alt={slide.label}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 to-transparent" />
                {/* Label */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="font-body text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70">
                    {slide.label}
                  </span>
                </div>
                {/* Active ring */}
                {idx === activeIndex && (
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-accent/60 ring-inset" />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

    </section>
  );
};

export default HeroSection;
