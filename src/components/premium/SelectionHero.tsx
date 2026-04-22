import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { waLink, ENQUIRE_MSG } from "./premiumConstants";

const SelectionHero = () => {
  return (
    <section
      className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28"
      style={{
        background:
          "radial-gradient(ellipse at top left, hsl(150 40% 12%), hsl(150 40% 4%) 60%, #000)",
      }}
    >
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="selectionGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#selectionGrain)" />
        </svg>
      </div>

      {/* Gold radial glow */}
      <div
        className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none opacity-25"
        style={{ background: "radial-gradient(circle, hsl(42 80% 50%), transparent 65%)", filter: "blur(100px)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        {/* Breadcrumb back-link */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link
            to="/premium"
            className="group inline-flex items-center gap-2 text-white/55 hover:text-white font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Premium
          </Link>
        </motion.div>

        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-7 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-body text-[11px] font-medium text-white/70 tracking-[0.2em] uppercase">
              The Selection
            </span>
          </motion.div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.04] tracking-tight text-white mb-6">
            <motion.span
              initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              Our
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ duration: 0.7, delay: 0.37, ease: [0.22, 1, 0.36, 1] }}
              className="block text-gradient-gold italic"
            >
              Curation.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="font-body text-base md:text-lg text-white/55 leading-relaxed max-w-xl mb-9"
          >
            A living catalogue of everything our concierge sources — browse by category,
            origin, or season. Every piece is available on request.
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            href={waLink(ENQUIRE_MSG)}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 h-12 px-7 rounded-full bg-accent text-white font-body font-semibold text-sm md:text-base shadow-xl shadow-accent/30 border border-white/10 hover:bg-accent/90 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            Enquire on WhatsApp
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default SelectionHero;
