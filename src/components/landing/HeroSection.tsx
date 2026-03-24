import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero3DScene = lazy(() => import("./Hero3DScene"));

const HeroSection = () => {
  return (
    <section className="snap-section relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Dark gradient base */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, hsl(var(--primary) / 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, hsl(var(--accent) / 0.08) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, hsl(140 45% 8%) 0%, hsl(140 50% 4%) 100%)
          `,
        }}
      />

      {/* 3D Background */}
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-primary-foreground/20 border-t-accent animate-spin" />
          </div>
        }
      >
        <Hero3DScene />
      </Suspense>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-background/60" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/15 backdrop-blur-sm"
        >
          <span className="text-primary-foreground font-body text-sm font-medium tracking-widest uppercase">
            Global Food Import Solutions
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-primary-foreground leading-[1.05] tracking-tight"
        >
          FROM FARM TO FORK,
          <br />
          <span className="text-accent">EXCELLENCE</span> IN EVERY
          <br />
          SHIPMENT
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-primary-foreground/50 font-body text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Curating premium food products from 30+ countries — delivering quality,
          compliance, and reliability to businesses across Sri Lanka and beyond.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex flex-wrap items-center justify-center gap-5 pt-4"
        >
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-full px-10 py-6 text-base transition-all duration-300 hover:shadow-xl hover:shadow-accent/25">
              Explore Our Products
            </Button>
          </motion.div>
          <Button
            variant="ghost"
            className="text-primary-foreground hover:text-primary-foreground/80 font-body text-base group transition-all duration-300 hover:bg-transparent px-0"
          >
            <span className="underline underline-offset-4 decoration-primary-foreground/30">
              Get a Quote
            </span>
            <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
