import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/motion";

type CountUpProps = {
  to: number;
  from?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
};

const format = (v: number, decimals: number) =>
  decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString();

/**
 * motion.dev "Number Trend" — counts from `from` → `to` when in view (once).
 * Shared primitive used by HeroSection, StatsSection, Footer, DarkStatsBanner.
 *
 * The displayed value lives in React state (not written imperatively to
 * textContent) so it survives re-renders — an imperative write gets wiped back
 * to the JSX default on the next render (StrictMode/HMR in dev, background
 * refetches in prod), which stranded the number at its `from` value.
 */
const CountUp = ({
  to,
  from = 0,
  suffix = "",
  prefix = "",
  duration = 1.6,
  decimals = 0,
  className,
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    if (!inView) return;
    const controls = animate(from, to, {
      duration,
      ease: EASE_OUT_EXPO,
      onUpdate: setValue,
      onComplete: () => setValue(to),
    });
    return () => controls.stop();
  }, [inView, to, from, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(value, decimals)}
      {suffix}
    </span>
  );
};

export default CountUp;
