import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";

type ScrollProgressRingProps = {
  /** px diameter */
  size?: number;
  strokeWidth?: number;
  className?: string;
};

/**
 * Circular companion to <ScrollProgressBar />.
 * Binds circle `strokeDashoffset` to global `scrollYProgress`.
 */
const ScrollProgressRing = ({
  size = 52,
  strokeWidth = 3,
  className,
}: ScrollProgressRingProps) => {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = useTransform(smooth, [0, 1], [circumference, 0]);

  if (reduced) return null;

  return (
    <div
      className={className}
      aria-hidden
      style={{
        width: size,
        height: size,
        pointerEvents: "none",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(0 0% 100% / 0.14)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(75 40% 60%)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset: dashOffset,
            rotate: -90,
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
    </div>
  );
};

export default ScrollProgressRing;
