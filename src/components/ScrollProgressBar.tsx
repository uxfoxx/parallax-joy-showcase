import { motion, useScroll } from "framer-motion";

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[200] origin-left pointer-events-none"
      style={{
        scaleX: scrollYProgress,
        background:
          "linear-gradient(90deg, hsl(140 50% 19%), hsl(75 38% 45%), hsl(80 50% 31%))",
      }}
    />
  );
};

export default ScrollProgressBar;
