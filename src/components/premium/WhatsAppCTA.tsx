import { motion } from "framer-motion";
import { MessageCircle, FileText } from "lucide-react";
import { waLink, CATALOGUE_MSG, ENQUIRE_MSG } from "./premiumConstants";

const WhatsAppCTA = () => {
  return (
    <section className="relative overflow-hidden bg-[hsl(150_40%_5%)]">
      <div className="grid md:grid-cols-2">
        {/* Left — solid forest with big headline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-[hsl(150_40%_10%)] via-[hsl(140_50%_14%)] to-[hsl(150_40%_5%)] p-10 md:p-16 lg:p-24 flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-body text-[11px] uppercase tracking-[0.3em] text-accent">
              Concierge desk · Open 7 days
            </span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white italic leading-tight tracking-tight mb-6"
          >
            Ready to
            <br />
            <span className="text-gradient-gold">indulge?</span>
          </motion.h2>
          <p className="font-body text-white/55 text-base md:text-lg leading-relaxed max-w-md mb-8">
            Our concierge team responds within the hour. Share what you're looking for — pricing, availability, and delivery are handled directly.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={waLink(ENQUIRE_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 h-12 px-7 rounded-full bg-accent text-white font-body font-semibold text-sm md:text-base shadow-xl shadow-accent/25 border border-white/10 hover:bg-accent/90 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
              Enquire on WhatsApp
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a
              href={waLink(CATALOGUE_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 h-12 px-7 rounded-full border border-white/25 bg-white/5 text-white font-body font-semibold text-sm md:text-base hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <FileText className="w-4 h-4" />
              Request Catalogue
            </a>
          </div>
        </motion.div>

        {/* Right — photograph */}
        <div className="relative min-h-[400px] md:min-h-[600px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&h=1200&fit=crop"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[hsl(150_40%_5%)]/40" />
        </div>
      </div>
    </section>
  );
};

export default WhatsAppCTA;
