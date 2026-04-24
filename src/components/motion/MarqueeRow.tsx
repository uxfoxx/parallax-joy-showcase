import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
  wrap,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

type MarqueeRowProps = {
  children: ReactNode;
  /** Base speed in px/second. */
  baseVelocity?: number;
  /** Direction: 1 left→right, -1 right→left. */
  direction?: 1 | -1;
  className?: string;
  rowClassName?: string;
  /** How many duplicated tracks to render (must be >= 2 for seamless loop). */
  repeat?: number;
};

/**
 * motion.dev "Scroll Velocity Marquee".
 * Marquee whose speed bumps with scroll velocity; slows back to baseVelocity
 * on idle. Children are repeated `repeat` times for seamless wrap.
 */
const MarqueeRow = ({
  children,
  baseVelocity = 40,
  direction = -1,
  className,
  rowClassName,
  repeat = 4,
}: MarqueeRowProps) => {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  const directionFactor = useRef<number>(direction);
  useAnimationFrame((_t, delta) => {
    if (reduced) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    // Invert direction on fast opposite scroll for a pleasing rubber-band effect.
    const vf = velocityFactor.get();
    if (vf < 0) directionFactor.current = -1;
    else if (vf > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });

  if (reduced) {
    return (
      <div className={className} style={{ overflow: "hidden" }}>
        <div className={rowClassName} style={{ display: "flex", gap: "2rem" }}>
          {children}
        </div>
      </div>
    );
  }

  const tracks = Array.from({ length: repeat });

  return (
    <div className={className} style={{ overflow: "hidden", width: "100%" }}>
      <motion.div
        className={rowClassName}
        style={{ x, display: "flex", willChange: "transform", gap: "2rem", whiteSpace: "nowrap" }}
      >
        {tracks.map((_, i) => (
          <div key={i} style={{ display: "flex", flexShrink: 0, gap: "2rem" }} aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeRow;
