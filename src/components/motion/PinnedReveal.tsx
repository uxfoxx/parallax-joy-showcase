import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

type PinnedRevealProps = {
  children: ReactNode;
  /** Height of the outer scroll container, used to control reveal length. */
  heightVh?: number;
  className?: string;
  pinnedClassName?: string;
};

/**
 * motion.dev "Scroll-linked reveal / Sticky scene".
 *
 * The outer element is `heightVh * 1vh` tall. Inside it a sticky pane holds
 * the children; `scrollYProgress` goes 0 → 1 as the section scrolls past.
 * Children receive it via a CSS variable `--reveal` they can map with
 * `var()`/`calc()`, but most consumers can just render their own scroll-
 * linked motion inside.
 *
 * Exposed context: wrap children in an element that reads
 * `data-progress={scrollYProgress}` if you need programmatic access.
 */
const PinnedReveal = ({
  children,
  heightVh = 180,
  className,
  pinnedClassName,
}: PinnedRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Map to a CSS custom property so children can do `calc()` without JS.
  const revealPct = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ height: `${heightVh}vh`, position: "relative" }}
    >
      <motion.div
        className={pinnedClassName}
        style={
          {
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            "--reveal": revealPct,
          } as React.CSSProperties
        }
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PinnedReveal;
