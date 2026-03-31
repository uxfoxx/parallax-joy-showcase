import { useMouseGradient } from "@/hooks/useMouseGradient";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRef } from "react";
import heroLogo from "@/assets/olive-foods-hero-logo.svg";

const HeroSection = () => {
  const { ref, gradientStyle } = useMouseGradient();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();

  const contentY = useTransform(scrollYProgress, [0, 0.15], ["0px", "60px"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <section
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLElement | null>).current = el;
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Subtle extra glow for hero only */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 25% 35%, hsl(150 40% 10% / 0.6) 0%, transparent 65%),
            radial-gradient(ellipse 50% 60% at 75% 25%, hsl(75 38% 45% / 0.1) 0%, transparent 55%),
            radial-gradient(ellipse 80% 55% at 50% 85%, hsl(140 50% 19% / 0.4) 0%, transparent 60%)
          `,
        }}
      />

      {/* Mouse-following radial glow */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-700"
        style={{ ...gradientStyle, opacity: 0.25 }}
      />

      {/* Full-height marquee text overlay */}
      <div className="absolute inset-0 flex items-center pointer-events-none select-none z-[5]">
        <div className="w-full h-full overflow-hidden flex flex-col justify-center">
          <div className="animate-marquee flex whitespace-nowrap items-center h-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="text-[100vh] leading-[100vh] font-black uppercase tracking-tighter text-primary-foreground/[0.03] mx-8 font-display"
              >
                OLIVE FOODS
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero content overlay */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto space-y-2"
        >
          <img
            src={heroLogo}
            alt="Olive Foods"
            className="max-w-sm sm:max-w-md lg:max-w-2xl w-full h-auto mx-auto"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/products">
              <Button className="bg-accent text-white hover:bg-accent/90 font-body font-semibold rounded-xl h-12 px-8 text-base transition-all duration-300 shadow-lg shadow-accent/20 group">
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
