import { motion, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode, type CSSProperties } from "react";
import { useParallaxRange } from "@/lib/motion";

type ParallaxProps = {
  children: ReactNode;
  strength?: number;
  /** "y" default, or "x" for horizontal. */
  axis?: "x" | "y";
  /** Invert direction (move counter to scroll). */
  reverse?: boolean;
  offset?: ["start end" | "start start", "end start" | "end end"];
  className?: string;
  style?: CSSProperties;
  as?: "div" | "span" | "section";
};

/**
 * Generic scroll-linked parallax wrapper (motion.dev "Parallax Scroll").
 * Bails out to static render when `prefers-reduced-motion` is set.
 */
const Parallax = ({
  children,
  strength = 60,
  axis = "y",
  reverse = false,
  offset = ["start end", "end start"],
  className,
  style,
  as = "div",
}: ParallaxProps) => {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const from = reverse ? strength : -strength;
  const to = reverse ? -strength : strength;
  const value = useParallaxRange(ref, [from, to], offset);

  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) {
    const StaticTag = as;
    return (
      <StaticTag className={className} style={style}>
        {children}
      </StaticTag>
    );
  }

  return (
    <MotionTag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{ ...style, [axis]: value, willChange: "transform" }}
    >
      {children}
    </MotionTag>
  );
};

export default Parallax;
