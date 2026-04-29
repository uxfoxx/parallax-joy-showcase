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
      
    </motion.div>
  );
};

export default ScrollFloatingElement;
