import { useScroll, useTransform, MotionValue } from "framer-motion";

interface ScrollReaction {
  shiftX: MotionValue<number>;
  shiftXReverse: MotionValue<number>;
  gap: MotionValue<number>;
  fadeNear: MotionValue<number>;
  fadeFar: MotionValue<number>;
  scaleNear: MotionValue<number>;
}

export function useScrollSectionReaction(
  scrollRange: [number, number],
  peakShift = 40
): ScrollReaction {
  const { scrollYProgress } = useScroll();
  const mid = (scrollRange[0] + scrollRange[1]) / 2;

  const shiftX = useTransform(
    scrollYProgress,
    [scrollRange[0], mid, scrollRange[1]],
    [0, peakShift, 0]
  );

  const shiftXReverse = useTransform(
    scrollYProgress,
    [scrollRange[0], mid, scrollRange[1]],
    [0, -peakShift, 0]
  );

  const gap = useTransform(
    scrollYProgress,
    [scrollRange[0], mid, scrollRange[1]],
    [0, 60, 0]
  );

  const fadeNear = useTransform(
    scrollYProgress,
    [scrollRange[0], mid, scrollRange[1]],
    [1, 0.7, 1]
  );

  const fadeFar = useTransform(
    scrollYProgress,
    [scrollRange[0], mid, scrollRange[1]],
    [1, 1, 1]
  );

  const scaleNear = useTransform(
    scrollYProgress,
    [scrollRange[0], mid, scrollRange[1]],
    [1, 0.95, 1]
  );

  return { shiftX, shiftXReverse, gap, fadeNear, fadeFar, scaleNear };
}
