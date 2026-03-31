import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ScrollFloatingElement = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const x = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ["0vw", "25vw", "-20vw", "0vw"]);
  const y = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], ["5vh", "20vh", "12vh", "5vh"]);
  const scale = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0.9, 0.7, 1, 0.4]);
  const rotate = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 12, -8, 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.85, 1], [0, 0.2, 0.18, 0.1, 0]);

  return (
    <motion.div
      ref={containerRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[5] hidden md:block"
      style={{ x, y, scale, rotate, opacity, willChange: "transform, opacity" }}
    >
      <div className="relative w-64 h-64">
        <div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.3), transparent 70%)" }}
        />
        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 160 C60 140, 80 100, 120 60 C140 40, 160 30, 170 25" stroke="hsl(140 50% 19%)" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M90 110 C100 95, 115 85, 130 80" stroke="hsl(140 50% 19%)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="155" cy="35" rx="18" ry="10" transform="rotate(-35 155 35)" fill="hsl(140 50% 19% / 0.7)" />
          <ellipse cx="130" cy="65" rx="15" ry="8" transform="rotate(-25 130 65)" fill="hsl(80 50% 31% / 0.6)" />
          <ellipse cx="95" cy="85" rx="14" ry="8" transform="rotate(20 95 85)" fill="hsl(140 50% 19% / 0.65)" />
          <ellipse cx="70" cy="120" rx="13" ry="7" transform="rotate(30 70 120)" fill="hsl(80 50% 31% / 0.5)" />
          <ellipse cx="125" cy="82" rx="12" ry="6" transform="rotate(-15 125 82)" fill="hsl(140 50% 19% / 0.55)" />
          <ellipse cx="110" cy="72" rx="7" ry="9" fill="hsl(75 38% 45% / 0.8)" />
          <ellipse cx="108" cy="70" rx="3" ry="4" fill="hsl(75 40% 60% / 0.5)" />
          <ellipse cx="78" cy="108" rx="6" ry="8" fill="hsl(75 38% 45% / 0.7)" />
          <ellipse cx="76" cy="106" rx="2.5" ry="3.5" fill="hsl(75 40% 60% / 0.4)" />
        </svg>
      </div>
    </motion.div>
  );
};

export default ScrollFloatingElement;
