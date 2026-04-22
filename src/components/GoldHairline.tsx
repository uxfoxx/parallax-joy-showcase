import { motion } from "framer-motion";
import { pathDrawTransition } from "@/lib/motion";

interface GoldHairlineProps {
  width?: number;
  delay?: number;
  className?: string;
  align?: "left" | "center";
  /** When true, hairline draws on viewport entry (once) instead of on mount. */
  inView?: boolean;
}

/**
 * Animated gold hairline that draws from left (or center-out).
 * Used as a low-key editorial flourish under eyebrows and FAQ items.
 */
const GoldHairline = ({
  width = 72,
  delay = 0,
  className = "",
  align = "left",
  inView = false,
}: GoldHairlineProps) => {
  const origin = align === "center" ? "center" : "left";
  const target = { pathLength: 1, opacity: 1 };
  const triggerProps = inView
    ? { whileInView: target, viewport: { once: true, margin: "-40px" } }
    : { animate: target };
  return (
    <svg
      width={width}
      height="2"
      viewBox={`0 0 ${width} 2`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: "visible" }}
    >
      <motion.line
        x1={0}
        y1={1}
        x2={width}
        y2={1}
        stroke="hsl(75 40% 60%)"
        strokeWidth={1}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        {...triggerProps}
        transition={{ ...pathDrawTransition, delay }}
        style={{ transformOrigin: origin }}
      />
    </svg>
  );
};

export default GoldHairline;
