import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero3DScene = lazy(() => import("./Hero3DScene"));

const HeroSection = () => {
  return (
    <section className="snap-section relative flex items-center justify-center overflow-hidden bg-background">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-20 w-full flex items-center min-h-[100vh]">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full rounded-3xl overflow-hidden"
        >
          {/* Animated gradient bg */}
          <div
            className="absolute inset-0 animate-gradient"
            style={{
              background: `
                radial-gradient(ellipse at 20% 20%, hsl(140 40% 25% / 0.9) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, hsl(42 80% 55% / 0.1) 0%, transparent 40%),
                radial-gradient(ellipse at 60% 30%, hsl(160 35% 18% / 0.6) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, hsl(140 45% 12%) 0%, hsl(140 50% 8%) 100%)
              `,
            }}
          />

          {/* Grain */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Two-column layout */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            {/* Left: text content */}
            <div className="flex-1 p-10 lg:p-20 space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/15"
              >
                <span className="text-primary-foreground font-body text-sm font-medium tracking-widest uppercase">
                  Premium Food Imports
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-[1.05] tracking-tight"
              >
                BRINGING THE WORLD'S
                <br />
                FINEST FOODS TO YOUR TABLE
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-primary-foreground/55 font-body text-lg max-w-xl leading-relaxed"
              >
                We source and import high-quality food products from trusted global suppliers—ensuring
                freshness, safety, and consistency for businesses across Sri Lanka.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.75 }}
                className="flex flex-wrap items-center gap-5 pt-2"
              >
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-full px-8 py-6 text-base transition-all duration-300 hover:shadow-xl hover:shadow-accent/25">
                    Contact US
                  </Button>
                </motion.div>
                <Button
                  variant="ghost"
                  className="text-primary-foreground hover:text-primary-foreground/80 font-body text-base group transition-all duration-300 hover:bg-transparent px-0"
                >
                  <span className="underline underline-offset-4 decoration-primary-foreground/30">Take The Quiz</span>
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                </Button>
              </motion.div>
            </div>

            {/* Right: 3D scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 w-full h-[400px] lg:h-[550px] hidden md:block"
            >
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-2 border-primary-foreground/20 border-t-accent animate-spin" />
                  </div>
                }
              >
                <Hero3DScene />
              </Suspense>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
