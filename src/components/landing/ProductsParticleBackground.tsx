import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const DOTS = [
  { id: 0,  x: 8,  y: 8,  size: 8,  opacity: 0.35, dur: 18, delay: 0,   amp: 20 },
  { id: 1,  x: 22, y: 35, size: 5,  opacity: 0.28, dur: 22, delay: -3,  amp: 15 },
  { id: 2,  x: 55, y: 12, size: 10, opacity: 0.25, dur: 16, delay: -7,  amp: 25 },
  { id: 3,  x: 78, y: 25, size: 7,  opacity: 0.30, dur: 20, delay: -12, amp: 18 },
  { id: 4,  x: 93, y: 50, size: 5,  opacity: 0.26, dur: 24, delay: -5,  amp: 12 },
  { id: 5,  x: 35, y: 82, size: 8,  opacity: 0.32, dur: 19, delay: -9,  amp: 22 },
  { id: 6,  x: 65, y: 72, size: 6,  opacity: 0.28, dur: 21, delay: -2,  amp: 16 },
  { id: 7,  x: 12, y: 60, size: 9,  opacity: 0.24, dur: 17, delay: -14, amp: 20 },
  { id: 8,  x: 48, y: 47, size: 5,  opacity: 0.30, dur: 23, delay: -6,  amp: 14 },
  { id: 9,  x: 85, y: 87, size: 8,  opacity: 0.27, dur: 20, delay: -11, amp: 19 },
  { id: 10, x: 30, y: 18, size: 6,  opacity: 0.32, dur: 25, delay: -4,  amp: 17 },
  { id: 11, x: 70, y: 55, size: 5,  opacity: 0.26, dur: 18, delay: -8,  amp: 21 },
  { id: 12, x: 96, y: 10, size: 9,  opacity: 0.22, dur: 22, delay: -15, amp: 23 },
  { id: 13, x: 4,  y: 92, size: 7,  opacity: 0.28, dur: 19, delay: -1,  amp: 16 },
  { id: 14, x: 58, y: 94, size: 8,  opacity: 0.25, dur: 21, delay: -10, amp: 18 },
  { id: 15, x: 43, y: 28, size: 5,  opacity: 0.30, dur: 20, delay: -7,  amp: 13 },
  { id: 16, x: 18, y: 75, size: 8,  opacity: 0.27, dur: 23, delay: -3,  amp: 20 },
  { id: 17, x: 88, y: 38, size: 6,  opacity: 0.29, dur: 17, delay: -13, amp: 15 },
  { id: 18, x: 52, y: 62, size: 7,  opacity: 0.24, dur: 26, delay: -6,  amp: 17 },
  { id: 19, x: 25, y: 52, size: 9,  opacity: 0.22, dur: 19, delay: -11, amp: 22 },
];

const ProductsParticleBackground = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const y1 = useTransform(scrollYProgress, [0, 1], ["-40px", "40px"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-70px", "70px"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);
  const y4 = useTransform(scrollYProgress, [0, 1], ["80px", "-80px"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-background" />

      {/* Large parallax blur orbs */}
      <motion.div
        style={{ y: y1, background: "radial-gradient(circle, hsl(75 38% 45% / 0.22), transparent 65%)" }}
        className="absolute top-[0%] left-[0%] w-[600px] h-[600px] rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y2, background: "radial-gradient(circle, hsl(140 50% 35% / 0.18), transparent 65%)" }}
        className="absolute top-[5%] right-[0%] w-[520px] h-[520px] rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y3, background: "radial-gradient(circle, hsl(75 38% 50% / 0.20), transparent 65%)" }}
        className="absolute top-[38%] left-[25%] w-[560px] h-[560px] rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y4, background: "radial-gradient(circle, hsl(150 40% 40% / 0.16), transparent 65%)" }}
        className="absolute bottom-[5%] right-[10%] w-[480px] h-[480px] rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y2, background: "radial-gradient(circle, hsl(80 45% 45% / 0.18), transparent 65%)" }}
        className="absolute bottom-[10%] left-[5%] w-[440px] h-[440px] rounded-full blur-3xl"
      />

      {/* Floating dot particles */}
      {DOTS.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            background: `hsl(75 38% 40% / ${dot.opacity})`,
          }}
          animate={{
            y: [0, -dot.amp, 0],
            opacity: [dot.opacity, Math.min(dot.opacity * 1.5, 0.6), dot.opacity],
          }}
          transition={{
            duration: dot.dur,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default ProductsParticleBackground;
