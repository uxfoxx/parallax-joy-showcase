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

  // Amplified split: logos separate in the middle when element passes (scroll 10-25%)
  const splitGap = useTransform(scrollYProgress, [0.08, 0.17, 0.27], [0, 250, 0]);
  const leftShift = useTransform(scrollYProgress, [0.08, 0.17, 0.27], [0, -60, 0]);
  const rightShift = useTransform(scrollYProgress, [0.08, 0.17, 0.27], [0, 60, 0]);
  const verticalBounce = useTransform(scrollYProgress, [0.08, 0.14, 0.20, 0.27], [0, -8, 8, 0]);

  // Parallax background
  const bgY = useTransform(sectionProgress, [0, 1], ["-40px", "40px"]);

  const allLogos = [...logos, ...logos, ...logos, ...logos];
  const half = Math.floor(allLogos.length / 2);
  const leftLogos = allLogos.slice(0, half);
  const rightLogos = allLogos.slice(half);

  return (
    <section ref={sectionRef} className="relative bg-background py-16 overflow-hidden">
      {/* Parallax decorative bg */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <div
          className="absolute w-[600px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(ellipse, hsl(140 40% 30%), transparent 70%)" }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
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

        <motion.div className="flex items-center justify-center" style={{ y: verticalBounce }}>
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
        </motion.div>
      </div>
    </section>
  );
};

export default LogoStrip;
