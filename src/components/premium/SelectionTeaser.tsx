import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const collageImages = [
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=800&fit=crop",
];

const SelectionTeaser = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const y1 = useTransform(scrollYProgress, [0, 1], ["10%", "-20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-5%", "-32%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 lg:py-32"
      style={{
        background:
          "linear-gradient(180deg, hsl(150 40% 4%) 0%, hsl(150 40% 7%) 50%, hsl(150 40% 4%) 100%)",
      }}
    >
      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="teaserGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#teaserGrain)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[1fr_1fr] gap-14 lg:gap-20 items-center">
        {/* Left — Stacked parallax collage */}
        <div className="relative grid grid-cols-2 gap-4 h-[440px] lg:h-[520px] order-2 lg:order-1">
          <motion.div
            style={{ y: y1 }}
            className="relative overflow-hidden rounded-2xl border border-white/10"
          >
            <img src={collageImages[0]} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-1">
                From Australia
              </div>
              <div className="font-display text-white text-sm">Prime Cuts</div>
            </div>
          </motion.div>
          <motion.div
            style={{ y: y2 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 mt-10"
          >
            <img src={collageImages[1]} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-1">
                From France
              </div>
              <div className="font-display text-white text-sm">Aged Cheese</div>
            </div>
          </motion.div>
        </div>

        {/* Right — Headline + CTA */}
        <div className="order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="inline-block font-body text-[11px] font-semibold tracking-[0.25em] uppercase text-accent/80 mb-5 border-b border-accent/30 pb-1"
          >
            The Selection
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-white mb-5"
          >
            Ready to see the{" "}
            <span className="text-gradient-gold italic">curation?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-body text-base md:text-lg text-white/55 leading-relaxed max-w-lg mb-9"
          >
            Browse the full catalogue — Australian meats, artisan cheeses, specialty pasta,
            and every seasonal arrival. Each piece is sourced to order through our concierge.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Link
              to="/premium/selection"
              className="group inline-flex items-center gap-2.5 h-12 px-7 rounded-full bg-accent text-white font-body font-semibold text-sm md:text-base shadow-xl shadow-accent/30 border border-white/10 hover:bg-accent/90 transition-all duration-300"
            >
              View the Selection
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SelectionTeaser;
