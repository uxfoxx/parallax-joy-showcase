import { motion, useScroll, useTransform } from "framer-motion";

const logos = ["AZIZAA", "Hungritos", "Fletcher", "Granoro", "Daily Dairy", "Snorre Foods", "Wai Wai", "Royal Arm"];

const LogoStrip = () => {
  const { scrollYProgress } = useScroll();

  // Split gap: logos separate in the middle when element passes (scroll 10-25%)
  const splitGap = useTransform(scrollYProgress, [0.08, 0.17, 0.27], [0, 120, 0]);
  const leftShift = useTransform(scrollYProgress, [0.08, 0.17, 0.27], [0, -30, 0]);
  const rightShift = useTransform(scrollYProgress, [0.08, 0.17, 0.27], [0, 30, 0]);

  const allLogos = [...logos, ...logos, ...logos, ...logos];
  const half = Math.floor(allLogos.length / 2);
  const leftLogos = allLogos.slice(0, half);
  const rightLogos = allLogos.slice(half);

  return (
    <section className="bg-background py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-muted-foreground font-body text-sm uppercase tracking-[0.25em] mb-10"
        >
          Our Brand Partners
        </motion.p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex items-center justify-center">
          {/* Left half */}
          <motion.div
            className="flex animate-marquee"
            style={{ x: leftShift }}
          >
            {leftLogos.map((logo, i) => (
              <div
                key={`l-${i}`}
                className="flex-shrink-0 mx-10 flex items-center justify-center h-12 px-8"
              >
                <span className="font-display text-xl font-bold text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors duration-300 whitespace-nowrap">
                  {logo}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Dynamic gap — only visible on md+ */}
          <motion.div className="hidden md:block flex-shrink-0" style={{ width: splitGap }} />

          {/* Right half */}
          <motion.div
            className="flex animate-marquee"
            style={{ x: rightShift }}
          >
            {rightLogos.map((logo, i) => (
              <div
                key={`r-${i}`}
                className="flex-shrink-0 mx-10 flex items-center justify-center h-12 px-8"
              >
                <span className="font-display text-xl font-bold text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors duration-300 whitespace-nowrap">
                  {logo}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LogoStrip;
