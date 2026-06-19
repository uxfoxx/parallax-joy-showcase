import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type MarqueeRowProps = {
  children: ReactNode;
  /** Base speed in px/second. */
  baseVelocity?: number;
  /** Direction: 1 left→right, -1 right→left. */
  direction?: 1 | -1;
  className?: string;
  rowClassName?: string;
  /** Total duplicated copies of children to render (split across two groups). */
  repeat?: number;
};

/**
 * Seamless, GPU-composited marquee.
 *
 * Renders the children as TWO identical groups inside a max-content track and
 * animates `translateX(0 → -50%)` via a pure CSS keyframe — so the motion runs
 * on the compositor and stays buttery even when the main thread is busy with
 * parallax/springs elsewhere on the page (the old useAnimationFrame approach
 * stuttered under that contention).
 *
 * Each group repeats the children enough times to overflow the viewport, so
 * there's never a gap at the wrap point. `animationDuration` is set inline from
 * the measured group width to keep a constant px/second speed regardless of how
 * much content a row holds.
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
  const groupRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(20);

  // Copies inside ONE group (two groups total ≈ `repeat`).
  const perGroup = Math.max(2, Math.ceil(repeat / 2));

  // Measure one group's width → duration = width / speed (constant px/sec).
  useEffect(() => {
    if (reduced) return;
    const el = groupRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.scrollWidth;
      if (w > 0) setDuration(Math.max(4, w / Math.max(1, baseVelocity)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseVelocity, reduced, perGroup]);

  if (reduced) {
    return (
      <div className={className} style={{ overflow: "hidden" }}>
        <div className={rowClassName} style={{ display: "flex", gap: "2rem" }}>
          {children}
        </div>
      </div>
    );
  }

  const group = (refIt: boolean) => (
    <div
      ref={refIt ? groupRef : undefined}
      aria-hidden={!refIt}
      style={{ display: "flex", flexShrink: 0, gap: "2rem", paddingRight: "2rem" }}
    >
      {Array.from({ length: perGroup }).map((_, i) => (
        <div key={i} style={{ display: "flex", flexShrink: 0, gap: "2rem", paddingRight: "2rem" }}>
          {children}
        </div>
      ))}
    </div>
  );

  return (
    <div className={className} style={{ overflow: "hidden", width: "100%" }}>
      <div
        className={`animate-marquee-scroll ${rowClassName ?? ""}`}
        style={{
          display: "flex",
          width: "max-content",
          whiteSpace: "nowrap",
          willChange: "transform",
          animationDuration: `${duration}s`,
          // direction 1 = left→right: play the same keyframes in reverse.
          animationDirection: direction === 1 ? "reverse" : "normal",
        }}
      >
        {group(true)}
        {group(false)}
      </div>
    </div>
  );
};

export default MarqueeRow;
