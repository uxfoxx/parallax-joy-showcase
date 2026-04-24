import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type CSSProperties } from "react";
import { cursorSpotlightVariants } from "@/lib/motion";

type CursorSpotlightProps = {
  /** Radial gradient color (HSL string, alpha included). */
  color?: string;
  /** Spotlight radius in px. */
  size?: number;
  /** Mix blend mode for the overlay. */
  blendMode?: CSSProperties["mixBlendMode"];
  className?: string;
  style?: CSSProperties;
};

/**
 * motion.dev "Cursor Highlight" — radial gradient that springs toward the
 * pointer. Falls back to a static center-glow when reduced motion is set.
 */
const CursorSpotlight = ({
  color = "hsl(75 40% 60% / 0.22)",
  size = 520,
  blendMode = "screen",
  className,
  style,
}: CursorSpotlightProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const x = useSpring(mvX, { stiffness: 120, damping: 20, mass: 0.5 });
  const y = useSpring(mvY, { stiffness: 120, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mvX.set(e.clientX - rect.left);
      mvY.set(e.clientY - rect.top);
    };
    parent.addEventListener("mousemove", onMove);
    return () => parent.removeEventListener("mousemove", onMove);
  }, [mvX, mvY, reduced]);

  if (reduced) {
    return (
      <div
        aria-hidden
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(circle ${size}px at 50% 30%, ${color}, transparent 70%)`,
          mixBlendMode: blendMode,
          ...style,
        }}
      />
    );
  }

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={className}
      initial="hidden"
      animate="show"
      variants={cursorSpotlightVariants}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        mixBlendMode: blendMode,
        ...style,
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
          translateX: "-50%",
          translateY: "-50%",
          x,
          y,
          background: `radial-gradient(circle, ${color}, transparent 70%)`,
          willChange: "transform",
        }}
      />
    </motion.div>
  );
};

export default CursorSpotlight;
