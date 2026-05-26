import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
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
 * Smooth, seamless, constant-velocity marquee.
 *
 * The outer flex has `gap: 0` and each track carries its own
 * trailing `paddingRight: 2rem` instead — that way the total content
 * width is exactly `repeat × trackStride`, so a `-100/repeat %`
 * translate shifts by exactly one stride and the wrap is invisible.
 *
 * Scroll-velocity reactivity was removed because the spring it relied
 * on caused visible speed flicker and short direction-flip glitches
 * while the page was being scrolled. Pure constant velocity reads as
 * "smooth seamless" the way the design calls for.
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
  const directionRef = useRef(direction);
  directionRef.current = direction;

  // Wrap interval equals one copy's stride (1/repeat of total width).
  const x = useTransform(baseX, (v) => `${wrap(-100 / repeat, 0, v)}%`);

  useAnimationFrame((_t, delta) => {
    if (reduced) return;
    const moveBy = directionRef.current * baseVelocity * (delta / 1000);
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
        style={{
          x,
          display: "flex",
          // Must size to content (not to its 100%-width parent) so that
          // translateX(<percentage>) resolves against total content width.
          // Without this, the wrap interval is a fraction of the *viewport*
          // and never lines up with a copy stride → visible snap.
          width: "max-content",
          willChange: "transform",
          whiteSpace: "nowrap",
        }}
      >
        {tracks.map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexShrink: 0,
              gap: "2rem",
              paddingRight: "2rem",
            }}
            aria-hidden={i > 0}
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeRow;
