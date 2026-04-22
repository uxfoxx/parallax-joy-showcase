import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const PremiumTeaser = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-28 md:py-36"
      style={{
        background:
          "radial-gradient(ellipse at top right, hsl(150 40% 11%), hsl(150 40% 4%) 65%, #000)",
      }}
    >
      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="teaserGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#teaserGrain)" />
        </svg>
      </div>

      {/* Gold glow */}
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, hsl(42 80% 50%), transparent 65%)", filter: "blur(80px)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-[55%_45%] gap-10 md:gap-16 items-center">
        {/* Left — copy */}
        <motion.div style={{ y: textY }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm"
          >
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="font-body text-[11px] font-medium text-white/70 tracking-[0.2em] uppercase">
              New · Concierge Service
            </span>
          </motion.div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight text-white mb-6">
            <motion.span
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="block"
            >
              Something more
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="block text-gradient-gold italic"
            >
              exclusive.
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-body text-base md:text-lg text-white/55 leading-relaxed max-w-lg mb-8"
          >
            A curated segment for premium imports — Australian meat, artisan cheese, specialty pasta, and seasonal offerings — delivered through our dedicated concierge service.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Link
              to="/premium"
              className="group inline-flex items-center gap-3 h-12 px-7 rounded-full bg-accent text-white font-body font-semibold text-sm md:text-base shadow-xl shadow-accent/25 border border-white/10 hover:bg-accent/90 transition-all duration-300"
            >
              Discover the Premium Selection
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Right — stacked image collage */}
        <motion.div
          style={{ y: imageY }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[440px] md:h-[520px]"
        >
          <div className="absolute top-0 right-0 w-[62%] h-[68%] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=700&h=700&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
          <div className="absolute bottom-0 left-0 w-[58%] h-[55%] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&h=600&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>
          {/* Gold accent dot */}
          <div className="absolute top-[38%] left-[44%] w-20 h-20 rounded-full bg-accent/10 backdrop-blur-md border border-accent/40 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumTeaser;
