import { motion } from "framer-motion";

const logos = ["ADIRA", "ADIRA INC", "Holcim", "MNC", "TELKOMSEL"];

const LogoStrip = () => {
  return (
    <section className="snap-section-auto bg-background py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-muted-foreground font-body text-sm uppercase tracking-[0.25em] mb-12"
        >
          Trusted by Leading Companies
        </motion.p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-marquee w-max">
          {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-12 flex items-center justify-center h-16 px-10 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/60 hover:border-accent/30 transition-all duration-300 group cursor-default"
            >
              <span className="font-display text-lg font-semibold text-muted-foreground/60 group-hover:text-foreground transition-colors duration-300 whitespace-nowrap">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoStrip;
