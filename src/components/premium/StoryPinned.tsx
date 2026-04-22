import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const beats = [
  { num: "01", title: "We source.", body: "Direct relationships with producers across Europe, Oceania, and beyond — every supplier personally vetted for quality and craft." },
  { num: "02", title: "We curate.", body: "Only the exceptional makes our list. A concise, seasonal selection rather than a sprawling catalogue." },
  { num: "03", title: "We deliver.", body: "Temperature-controlled, end-to-end logistics across the island. Your order arrives exactly as intended." },
];

const StoryPinned = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Background word slides across as you scroll
  const bgX = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section
      ref={ref}
      className="relative bg-gradient-to-b from-black via-[hsl(150_40%_4%)] to-black"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Background mega-word */}
        <motion.div
          style={{ x: bgX }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span
            className="font-display font-black whitespace-nowrap italic"
            style={{
              fontSize: "clamp(8rem, 22vw, 20rem)",
              color: "transparent",
              WebkitTextStroke: "1.5px hsl(42 80% 55% / 0.08)",
              letterSpacing: "-0.02em",
            }}
          >
            SOURCED WITH CARE
          </span>
        </motion.div>

        {/* Foreground beats — fade through based on scroll progress */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
          {beats.map((beat, i) => {
            const start = i / beats.length;
            const peak = start + 1 / beats.length / 2;
            const end = start + 1 / beats.length;
            const opacity = useTransform(scrollYProgress, [start, peak, end], [0, 1, 0]);
            const y = useTransform(scrollYProgress, [start, peak, end], [30, 0, -30]);
            return (
              <motion.div
                key={beat.num}
                style={{ opacity, y }}
                className="absolute inset-x-0 text-center"
              >
                <div className="font-body text-xs uppercase tracking-[0.35em] text-accent/80 mb-6">
                  Chapter {beat.num}
                </div>
                <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white italic tracking-tight mb-8">
                  {beat.title}
                </h2>
                <p className="font-body text-base md:text-lg text-white/55 max-w-xl mx-auto leading-relaxed">
                  {beat.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StoryPinned;
