import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  /** Max translation radius in px. */
  radius?: number;
  /** Multiplier applied to pointer delta (0–1). */
  strength?: number;
  className?: string;
};

/**
 * motion.dev "Magnetic" — child follows the cursor within `radius` px
 * using spring physics; snaps back on leave.
 *
 * Acts as a plain wrapper (doesn't inject a <button>) so it composes with
 * <Link> + <Button> without introducing nested interactives.
 */
const MagneticButton = ({
  children,
  radius = 16,
  strength = 0.35,
  className,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const x = useSpring(mvX, { stiffness: 220, damping: 18, mass: 0.6 });
  const y = useSpring(mvY, { stiffness: 220, damping: 18, mass: 0.6 });

  if (reduced) return <div className={className}>{children}</div>;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const clamp = (v: number) => Math.max(-radius, Math.min(radius, v * strength));
    mvX.set(clamp(relX));
    mvY.set(clamp(relY));
  };

  const onLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-block", willChange: "transform" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
