import type { Variants, Transition } from "framer-motion";

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
