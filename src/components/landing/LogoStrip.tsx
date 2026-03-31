import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const logos = ["AZIZAA", "Hungritos", "Fletcher", "Granoro", "Daily Dairy", "Snorre Foods", "Wai Wai", "Royal Arm"];

const LogoStrip = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const splitGap = useTransform(scrollYProgress, [0.08, 0.17, 0.27], [0, 250, 0]);
  const leftShift = useTransform(scrollYProgress, [0.08, 0.17, 0.27], [0, -60, 0]);
  const rightShift = useTransform(scrollYProgress, [0.08, 0.17, 0.27], [0, 60, 0]);
  const verticalBounce = useTransform(scrollYProgress, [0.08, 0.14, 0.20, 0.27], [0, -8, 8, 0]);

  const allLogos = [...logos, ...logos, ...logos, ...logos];
  const half = Math.floor(allLogos.length / 2);
  const leftLogos = allLogos.slice(0, half);
  const rightLogos = allLogos.slice(half);

  return (
    <section ref={sectionRef} className="relative py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-primary-foreground/40 font-body text-sm uppercase tracking-[0.25em] mb-10"
        >
          Our Brand Partners
        </motion.p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-forest-deep/80 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-forest-deep/80 to-transparent z-10" />

        <motion.div className="flex items-center justify-center" style={{ y: verticalBounce }}>
          <motion.div className="flex animate-marquee" style={{ x: leftShift }}>
            {leftLogos.map((logo, i) => (
              <div key={`l-${i}`} className="flex-shrink-0 mx-10 flex items-center justify-center h-12 px-8">
                <span className="font-display text-xl font-bold text-primary-foreground/20 hover:text-primary-foreground/50 transition-colors duration-300 whitespace-nowrap">
                  {logo}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div className="hidden md:block flex-shrink-0" style={{ width: splitGap }} />

          <motion.div className="flex animate-marquee" style={{ x: rightShift }}>
            {rightLogos.map((logo, i) => (
              <div key={`r-${i}`} className="flex-shrink-0 mx-10 flex items-center justify-center h-12 px-8">
                <span className="font-display text-xl font-bold text-primary-foreground/20 hover:text-primary-foreground/50 transition-colors duration-300 whitespace-nowrap">
                  {logo}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LogoStrip;
