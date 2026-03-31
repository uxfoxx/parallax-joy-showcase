import { useMouseGradient } from "@/hooks/useMouseGradient";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRef } from "react";

const HeroSection = () => {
  const { ref, gradientStyle } = useMouseGradient();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: bg shifts up slower than scroll
  const bgY = useTransform(scrollYProgress, [0, 1], ["0px", "80px"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0px", "40px"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLElement | null>).current = el;
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* Animated gradient background with parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          y: bgY,
          background: `
            radial-gradient(ellipse 90% 70% at 25% 35%, hsl(140 50% 10% / 0.95) 0%, transparent 65%),
            radial-gradient(ellipse 50% 60% at 75% 25%, hsl(42 85% 52% / 0.18) 0%, transparent 55%),
            radial-gradient(ellipse 80% 55% at 50% 85%, hsl(140 40% 18% / 0.8) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 85% 65%, hsl(42 50% 92% / 0.1) 0%, transparent 45%),
            radial-gradient(ellipse 40% 40% at 10% 80%, hsl(45 90% 55% / 0.12) 0%, transparent 50%),
            linear-gradient(150deg, hsl(140 50% 8%) 0%, hsl(140 45% 14%) 35%, hsl(140 40% 10%) 70%, hsl(140 50% 8%) 100%)
          `,
          backgroundSize: '250% 250%',
          animation: 'gradient-shift 18s ease infinite',
        }}
      />

      {/* Mouse-following radial glow */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-700"
        style={{ ...gradientStyle, opacity: 0.25 }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 z-[2] opacity-[0.10] pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="heroNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#heroNoise)" />
        </svg>
      </div>

      {/* Full-height marquee text overlay */}
      <div className="absolute inset-0 flex items-center pointer-events-none select-none z-[5]">
        <div className="w-full h-full overflow-hidden flex flex-col justify-center">
          <div className="animate-marquee flex whitespace-nowrap items-center h-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="text-[100vh] leading-[100vh] font-black uppercase tracking-tighter text-primary-foreground/[0.04] mx-8"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                OLIVE FOODS
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero content overlay with parallax */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-bold text-primary-foreground leading-[0.95] tracking-tight">
            Premium Food
            <br />
            <span className="text-gradient-gold">Imports</span>
          </h1>
          <p className="font-body text-lg sm:text-xl text-primary-foreground/50 max-w-xl mx-auto leading-relaxed">
            Your trusted import, bonded warehousing & FMCG distribution partner serving Sri Lanka's HoReCa, Modern Trade and General Trade sectors.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center pt-4"
          >
            <Link to="/products">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-xl h-12 px-8 text-base transition-all duration-300 shadow-lg shadow-accent/20 group">
                Explore Products
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 font-body font-semibold rounded-xl h-12 px-8 text-base transition-all duration-300">
                Our Story
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
