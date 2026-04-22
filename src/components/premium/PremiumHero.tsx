import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import { waLink, ENQUIRE_MSG } from "./premiumConstants";

const stackImages = [
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=700&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=700&fit=crop",
  "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&h=700&fit=crop",
];

const PremiumHero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-42%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden min-h-[95vh] flex items-center"
      style={{
        background:
          "radial-gradient(ellipse at top left, hsl(150 40% 12%), hsl(150 40% 4%) 60%, #000)",
      }}
    >
      {/* Marble / grain overlay */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="premiumGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#premiumGrain)" />
        </svg>
      </div>

      {/* Gold radial glow */}
      <div
        className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, hsl(42 80% 50%), transparent 65%)", filter: "blur(100px)" }}
      />

      {/* 40px grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[55%_45%] gap-16 items-center py-24">
        {/* Left — Headline */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-body text-[11px] font-medium text-white/70 tracking-[0.2em] uppercase">
              Concierge Service · Sri Lanka
            </span>
          </motion.div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] font-bold leading-[1.02] tracking-tight text-white mb-6">
            {["Premium.", "Imported.", "Delivered."].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 48, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`block ${i === 1 ? "text-gradient-gold italic" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="font-body text-base md:text-lg text-white/55 leading-relaxed max-w-xl mb-10"
          >
            A curated selection of the world's finest gourmet imports — Australian meat, artisanal cheeses, specialty pasta — delivered across Sri Lanka through our dedicated concierge service.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="flex flex-wrap gap-3"
          >
            <a
              href={waLink(ENQUIRE_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 h-13 px-7 py-4 rounded-full bg-accent text-white font-body font-semibold text-sm md:text-base shadow-xl shadow-accent/30 border border-white/10 hover:bg-accent/90 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              Enquire on WhatsApp
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <Link
              to="/premium/selection"
              className="group inline-flex items-center gap-2.5 h-13 px-7 py-4 rounded-full border border-white/25 bg-white/5 text-white font-body font-semibold text-sm md:text-base hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              View the Selection
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Right — Stacked parallax image column */}
        <div className="hidden lg:grid grid-cols-3 gap-4 h-[600px]">
          <motion.div style={{ y: y1 }} className="relative overflow-hidden rounded-2xl border border-white/10">
            <img src={stackImages[0]} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-1">From Australia</div>
              <div className="font-display text-white text-sm">Wagyu & Prime Cuts</div>
            </div>
          </motion.div>
          <motion.div style={{ y: y2 }} className="relative overflow-hidden rounded-2xl border border-white/10 mt-12">
            <img src={stackImages[1]} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-1">From France</div>
              <div className="font-display text-white text-sm">Aged Cheese</div>
            </div>
          </motion.div>
          <motion.div style={{ y: y3 }} className="relative overflow-hidden rounded-2xl border border-white/10 mt-6">
            <img src={stackImages[2]} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-1">From Italy</div>
              <div className="font-display text-white text-sm">Artisan Pasta</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHero;
