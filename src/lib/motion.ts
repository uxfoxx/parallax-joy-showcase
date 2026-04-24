import { useScroll, useTransform, type Variants, type Transition, type MotionValue } from "framer-motion";
import { type RefObject } from "react";

export const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Line-mask reveal (motion.dev "Scroll Text Lines"):
 * wrap a span.block around each line and animate clipPath + y.
 */
export const lineRevealVariants: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)", y: "0.4em" },
  show: (i: number = 0) => ({
    clipPath: "inset(0% 0 0 0)",
    y: "0em",
    transition: { duration: 0.85, ease: EASE_OUT_EXPO, delay: i * 0.06 },
  }),
};

/** Blur-up fade used for paragraphs and buttons entering alongside line-reveals. */
export const softFadeUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay },
  }),
};

/**
 * Positional stagger (motion.dev "Physical stagger") — diagonal cascade across a grid.
 * Returns the delay (seconds) for card at `index` in a grid with `columns` columns.
 */
export const staggerGrid = (index: number, columns = 3) => {
  const row = Math.floor(index / columns);
  const col = index % columns;
  return row * 0.08 + col * 0.04;
};

/** Shared transition preset for SVG pathLength draw-in animations. */
export const pathDrawTransition: Transition = {
  duration: 1.2,
  ease: EASE_OUT_EXPO,
};

/**
 * Curtain reveal (motion.dev "Image Reveal"): clip-path opens top → bottom.
 * Pair with `whileInView="show"` + `viewport={{ once: true }}`.
 */
export const curtainRevealVariants: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", scale: 1.08 },
  show: {
    clipPath: "inset(0 0 0% 0)",
    scale: 1,
    transition: { duration: 1.1, ease: EASE_OUT_EXPO },
  },
};

/** Cursor-spotlight radial overlay — fades/scales in on mount. */
export const cursorSpotlightVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: EASE_OUT_EXPO },
  },
};

/** Double-chevron scroll cue morph loop. */
export const chevronLoop: Transition = {
  duration: 1.8,
  repeat: Infinity,
  ease: "easeInOut",
};

/**
 * useParallaxRange — wraps `useScroll` + `useTransform` so sections don't
 * respell the pattern. Returns a `MotionValue<number>` in px.
 *
 * offset defaults to ["start end", "end start"] (enter → leave viewport).
 */
export function useParallaxRange(
  ref: RefObject<HTMLElement>,
  range: [number, number] = [-80, 80],
  offset: ["start end" | "start start", "end start" | "end end"] = ["start end", "end start"]
): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return useTransform(scrollYProgress, [0, 1], range);
}
