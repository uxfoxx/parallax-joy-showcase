import { useEffect, useRef } from "react";
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
 * Shared primitive used by HeroSection, StatsSection, DarkStatsBanner.
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

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced) {
      node.textContent = prefix + format(to, decimals) + suffix;
      return;
    }
    if (!inView) return;
    const controls = animate(from, to, {
      duration,
      ease: EASE_OUT_EXPO,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = prefix + format(v, decimals) + suffix;
      },
      onComplete: () => {
        if (ref.current) ref.current.textContent = prefix + format(to, decimals) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, from, suffix, prefix, duration, decimals, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(from, decimals)}
      {suffix}
    </span>
  );
};

export default CountUp;
