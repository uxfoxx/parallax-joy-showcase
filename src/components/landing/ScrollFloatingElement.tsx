import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ScrollFloatingElement = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const x = useTransform(
    scrollYProgress,
    [0, 0.1, 0.25, 0.5, 0.75, 1],
    ["0vw", "0vw", "30vw", "-25vw", "20vw", "0vw"]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.1, 0.25, 0.5, 0.75, 1],
    ["0vh", "10vh", "20vh", "15vh", "10vh", "5vh"]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.25, 0.5, 0.75, 1],
    [1, 0.8, 0.6, 0.8, 1.2, 0.3]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.1, 0.25, 0.5, 0.75, 1],
    [0, 8, 15, -10, 20, 45]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.1, 0.25, 0.5, 0.75, 0.85, 1],
    [0, 0.15, 0.25, 0.2, 0.2, 0.15, 0.08, 0]
  );

  return (
    <motion.div
      ref={containerRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[5] hidden md:block"
      style={{ x, y, scale, rotate, opacity }}
    >
      <div className="relative w-64 h-64">
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.3), transparent 70%)" }}
        />
        {/* Olive branch SVG */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main stem */}
          <path
             d="M40 160 C60 140, 80 100, 120 60 C140 40, 160 30, 170 25"
             stroke="hsl(140 50% 19%)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Branch */}
          <path
            d="M90 110 C100 95, 115 85, 130 80"
            stroke="hsl(140 50% 19%)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Leaf 1 - top right */}
          <ellipse
            cx="155" cy="35"
            rx="18" ry="10"
            transform="rotate(-35 155 35)"
            fill="hsl(140 50% 19% / 0.7)"
          />
          {/* Leaf 2 - mid right */}
          <ellipse
            cx="130" cy="65"
            rx="15" ry="8"
            transform="rotate(-25 130 65)"
            fill="hsl(140 25% 32% / 0.6)"
          />
          {/* Leaf 3 - mid left */}
          <ellipse
            cx="95" cy="85"
            rx="14" ry="8"
            transform="rotate(20 95 85)"
            fill="hsl(140 35% 22% / 0.65)"
          />
          {/* Leaf 4 - lower */}
          <ellipse
            cx="70" cy="120"
            rx="13" ry="7"
            transform="rotate(30 70 120)"
            fill="hsl(140 25% 32% / 0.5)"
          />
          {/* Leaf 5 - small branch */}
          <ellipse
            cx="125" cy="82"
            rx="12" ry="6"
            transform="rotate(-15 125 82)"
            fill="hsl(140 35% 22% / 0.55)"
          />
          {/* Olive 1 */}
          <ellipse
            cx="110" cy="72"
            rx="7" ry="9"
            fill="hsl(42 80% 55% / 0.8)"
          />
          <ellipse
            cx="108" cy="70"
            rx="3" ry="4"
            fill="hsl(42 70% 75% / 0.5)"
          />
          {/* Olive 2 */}
          <ellipse
            cx="78" cy="108"
            rx="6" ry="8"
            fill="hsl(42 80% 55% / 0.7)"
          />
          <ellipse
            cx="76" cy="106"
            rx="2.5" ry="3.5"
            fill="hsl(42 70% 75% / 0.4)"
          />
          {/* Leaf veins */}
          <line x1="145" y1="35" x2="165" y2="33" stroke="hsl(140 25% 32% / 0.3)" strokeWidth="0.5" />
          <line x1="120" y1="67" x2="140" y2="62" stroke="hsl(140 25% 32% / 0.3)" strokeWidth="0.5" />
          <line x1="85" y1="87" x2="105" y2="82" stroke="hsl(140 25% 32% / 0.3)" strokeWidth="0.5" />
        </svg>
      </div>
    </motion.div>
  );
};

export default ScrollFloatingElement;
