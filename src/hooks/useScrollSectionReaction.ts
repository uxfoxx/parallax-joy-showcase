import { useScroll, useTransform, MotionValue } from "framer-motion";

interface ScrollReaction {
  shiftX: MotionValue<number>;
  shiftXReverse: MotionValue<number>;
  gap: MotionValue<number>;
  fadeNear: MotionValue<number>;
  fadeFar: MotionValue<number>;
  scaleNear: MotionValue<number>;
  scaleUp: MotionValue<number>;
}

export function useScrollSectionReaction(
  scrollRange: [number, number],
  peakShift = 80
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
    [0, 140, 0]
  );

  const fadeNear = useTransform(
    scrollYProgress,
    [scrollRange[0], mid, scrollRange[1]],
    [1, 0.4, 1]
  );

  const fadeFar = useTransform(
    scrollYProgress,
    [scrollRange[0], mid, scrollRange[1]],
    [1, 0.85, 1]
  );

  const scaleNear = useTransform(
    scrollYProgress,
    [scrollRange[0], mid, scrollRange[1]],
    [1, 0.88, 1]
  );

  const scaleUp = useTransform(
    scrollYProgress,
    [scrollRange[0], mid, scrollRange[1]],
    [1, 1.08, 1]
  );

  return { shiftX, shiftXReverse, gap, fadeNear, fadeFar, scaleNear, scaleUp };
}
