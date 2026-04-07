import { useMouseGradient } from "@/hooks/useMouseGradient";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Globe, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRef } from "react";
import heroLogo from "@/assets/olive-foods-hero-logo.svg";

const words = ["Sri Lanka's", "Premier", "Food Import", "&", "Distribution", "Partner"];
const accentWords = new Set(["Premier"]);

const floatingBadges = [
  { icon: Globe, label: "8+ Countries Sourced", delay: 0.9, x: "8%", y: "22%", rotate: -4 },
  { icon: ShieldCheck, label: "Quality Certified", delay: 1.1, x: "72%", y: "15%", rotate: 3 },
  { icon: Truck, label: "Island-Wide Delivery", delay: 1.3, x: "60%", y: "75%", rotate: -2 },
];

const HeroSection = () => {
  const { ref, gradientStyle } = useMouseGradient();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();

  const contentY = useTransform(scrollYProgress, [0, 0.15], ["0px", "60px"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const logoY = useTransform(scrollYProgress, [0, 0.2], ["0px", "-30px"]);

  return (
    <section
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLElement | null>).current = el;
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 15% 40%, hsl(140 50% 14% / 0.8) 0%, transparent 60%),
            radial-gradient(ellipse 60% 70% at 85% 20%, hsl(75 38% 45% / 0.08) 0%, transparent 55%),
            radial-gradient(ellipse 70% 55% at 50% 90%, hsl(150 40% 10% / 0.5) 0%, transparent 60%)
          `,
        }}
      />

      {/* Mouse-following glow */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{ ...gradientStyle, opacity: 0.2 }} />

      {/* Faint marquee watermark */}
      <div className="absolute inset-0 flex items-center pointer-events-none select-none z-[2] overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap items-center h-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="text-[90vh] leading-[90vh] font-black uppercase tracking-tighter text-primary-foreground/[0.025] mx-8 font-display">
              OLIVE FOODS
            </span>
          ))}
        </div>
      </div>

      {/* Hero content */}
      <motion.div
        className="relative z-10 min-h-screen flex items-center px-6 lg:px-12"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1fr_auto] gap-16 items-center pt-20 pb-16">

          {/* Left: Text Content */}
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/15 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="font-body text-xs font-medium text-primary-foreground/80 tracking-widest uppercase">Est. 1994 · Sri Lanka</span>
            </motion.div>

            {/* Headline — word by word */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
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
              className="font-body text-lg text-primary-foreground/65 leading-relaxed mb-10 max-w-xl"
            >
              Connecting global producers with Sri Lankan businesses across 8+ countries — bonded warehousing, cold-chain logistics, and island-wide distribution.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.05 }}
              className="flex flex-wrap gap-4 mb-14"
            >
              <Link to="/products">
                <Button className="bg-accent text-white hover:bg-accent/90 font-body font-semibold rounded-lg h-13 px-8 text-base transition-all duration-300 shadow-xl shadow-accent/25 group border border-white/10 shine-sweep">
                  Explore Products
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="border-primary-foreground/40 bg-primary-foreground/8 text-primary-foreground hover:bg-primary-foreground/15 font-body font-semibold rounded-lg h-13 px-8 text-base transition-all duration-300 backdrop-blur-sm">
                  Our Story
                </Button>
              </Link>
            </motion.div>

            {/* Mini stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex flex-wrap items-center gap-6"
            >
              {[
                { value: "500+", label: "Products" },
                { value: "1000+", label: "Retail Partners" },
                { value: "30+", label: "Years Experience" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  {i > 0 && <span className="w-px h-8 bg-primary-foreground/15" />}
                  <div>
                    <div className="font-display text-xl font-bold text-primary-foreground leading-none">{stat.value}</div>
                    <div className="font-body text-xs text-primary-foreground/50 mt-0.5">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Logo + floating badges */}
          <motion.div
            className="relative hidden lg:flex items-center justify-center w-[400px] h-[400px] shrink-0"
            style={{ y: logoY }}
          >
            {/* Animated glow behind logo */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.08, 1],
              }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: "radial-gradient(ellipse, hsl(100 40% 25% / 0.5) 0%, transparent 70%)" }}
            />
            {/* Logo */}
            <motion.img
              src={heroLogo}
              alt="Olive Foods"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 70, damping: 18 }}
              className="relative w-80 h-auto animate-float"
              style={{ filter: "drop-shadow(0 0 40px hsl(100 40% 30% / 0.4))" }}
            />
            {/* Floating badges */}
            {floatingBadges.map((badge, i) => (
              <motion.div
                key={i}
                className="absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-background/90 backdrop-blur-md border border-border/60 shadow-lg shadow-black/20"
                style={{ left: badge.x, top: badge.y }}
                initial={{ opacity: 0, scale: 0.7, rotate: badge.rotate - 6 }}
                animate={{ opacity: 1, scale: 1, rotate: badge.rotate }}
                transition={{ duration: 0.7, delay: badge.delay, type: "spring", stiffness: 100 }}
              >
                <badge.icon className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="font-body text-xs font-medium text-foreground whitespace-nowrap">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <span className="font-body text-xs text-primary-foreground/40 tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-primary-foreground/30" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
