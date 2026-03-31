import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface SectionTransitionProps {
  colorFrom?: string;
  colorTo?: string;
  flip?: boolean;
}

const SectionTransition = ({ 
  colorFrom = "hsl(140 50% 19% / 0.3)", 
  colorTo = "hsl(80 50% 31% / 0.15)",
  flip = false,
}: SectionTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const pathMorph = useTransform(scrollYProgress, [0, 0.5, 1], [
    "M0,80 C200,120 400,20 600,60 C800,100 1000,30 1200,70 L1200,200 L0,200 Z",
    "M0,40 C200,80 400,100 600,30 C800,60 1000,90 1200,50 L1200,200 L0,200 Z",
    "M0,60 C200,30 400,90 600,50 C800,20 1000,70 1200,40 L1200,200 L0,200 Z",
  ]);

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.8, 0.8, 0.3]);

  return (
    <div ref={ref} className={`relative h-32 md:h-48 pointer-events-none ${flip ? "rotate-180" : ""}`}>
      <motion.svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{ opacity }}
      >
        <defs>
          <linearGradient id={`wave-grad-${flip ? "flip" : "normal"}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={colorFrom} />
            <stop offset="50%" stopColor={colorTo} />
            <stop offset="100%" stopColor={colorFrom} />
          </linearGradient>
        </defs>
        <motion.path
          d={pathMorph}
          fill={`url(#wave-grad-${flip ? "flip" : "normal"})`}
        />
      </motion.svg>
    </div>
  );
};

export default SectionTransition;
