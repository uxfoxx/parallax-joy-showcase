import { useMouseGradient } from "@/hooks/useMouseGradient";
import { useScrollSpeed } from "@/hooks/useScrollSpeed";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const { ref, gradientStyle } = useMouseGradient();
  useScrollSpeed();

  return (
    <section ref={ref} className="snap-section relative min-h-screen overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 25% 35%, hsl(140 50% 10% / 0.95) 0%, transparent 65%),
            radial-gradient(ellipse 50% 60% at 75% 25%, hsl(42 85% 52% / 0.18) 0%, transparent 55%),
            radial-gradient(ellipse 80% 55% at 50% 85%, hsl(140 40% 18% / 0.8) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 85% 65%, hsl(42 50% 92% / 0.1) 0%, transparent 45%),
            radial-gradient(ellipse 40% 40% at 10% 80%, hsl(45 90% 55% / 0.12) 0%, transparent 50%),
            linear-gradient(150deg, hsl(140 50% 8%) 0%, hsl(140 45% 14%) 35%, hsl(140 40% 10%) 70%, hsl(140 50% 8%) 100%)
          `,
          backgroundSize: '250% 250%',
          animation: `gradient-shift var(--gradient-duration, 18s) ease infinite`,
        }}
      />

      {/* Mouse-following radial glow */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-700"
        style={{
          ...gradientStyle,
          opacity: 0.25,
        }}
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
                className="text-[100vh] leading-[100vh] font-black uppercase tracking-tighter text-foreground/[0.04] mx-8"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                OLIVE FOODS
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Content — on top */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="text-center max-w-3xl mx-auto px-6 pointer-events-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground/80 font-body text-sm font-medium border border-primary-foreground/15 mb-8 tracking-widest uppercase"
          >
            Premium Food Imports
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-[1.1] tracking-tight"
          >
            Quality You Can
            <br />
            <span className="text-gradient-gold">Trust</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="font-body text-lg text-primary-foreground/50 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Sourcing the world's finest food products and delivering them to your doorstep with unmatched reliability.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/products">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-full px-8 py-6 text-base transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 group">
                Explore Products
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 font-body font-semibold rounded-full px-8 py-6 text-base">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
