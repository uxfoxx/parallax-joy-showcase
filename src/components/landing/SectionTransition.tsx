import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface SectionTransitionProps {
  colorFrom?: string;
  colorTo?: string;
  flip?: boolean;
}

const SectionTransition = ({ 
  colorFrom = "hsl(150 40% 8% / 0.3)", 
  colorTo = "hsl(140 50% 12% / 0.2)", 
  flip = false 
}: SectionTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const morphY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.8, 0.3]);

  return (
    <motion.div
      ref={ref}
      className="relative w-full h-32 md:h-48 -my-16 md:-my-24 z-[2] pointer-events-none"
      style={{ opacity }}
    >
      <motion.svg
        viewBox="0 0 1440 200"
        className={`absolute inset-0 w-full h-full ${flip ? "rotate-180" : ""}`}
        preserveAspectRatio="none"
        style={{ y: morphY }}
      >
        <path
          d="M0,80 C240,140 480,20 720,100 C960,180 1200,40 1440,120 L1440,200 L0,200 Z"
          fill={colorFrom}
        />
        <path
          d="M0,120 C360,60 720,160 1080,80 C1260,40 1380,100 1440,90 L1440,200 L0,200 Z"
          fill={colorTo}
        />
      </motion.svg>
    </motion.div>
  );
};

export default SectionTransition;
