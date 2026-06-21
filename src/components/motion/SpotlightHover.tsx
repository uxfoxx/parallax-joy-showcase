import {
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";

type SpotlightHoverProps = {
  children: ReactNode;
  className?: string;
  /** Element to render as the wrapper. Defaults to a div. */
  as?: ElementType;
  /** Spotlight tint. Defaults to the gold accent at low alpha. */
  color?: string;
  /** Radius of the soft falloff. Defaults to 45%. */
  radius?: string;
  style?: CSSProperties;
};

/**
 * Wraps any panel/card with a soft cursor-following radial glow that fades in
 * on hover — the "spotlight on cards" effect for the flatter surfaces that
 * don't get the MediaCard tilt/shine treatment. Tracks the pointer via
 * `--mx`/`--my` CSS vars (cheap; no React re-render per move) and paints an
 * overlay layer. No-ops under reduced-motion. The wrapper is `relative` and
 * the overlay is `pointer-events-none`, so children stay fully interactive.
 */
const SpotlightHover = ({
  children,
  className = "",
  as,
  color = "hsl(var(--accent) / 0.10)",
  radius = "45%",
  style,
}: SpotlightHoverProps) => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const Tag = (as ?? "div") as ElementType;

  if (reduced) {
    // Keep `relative` so consumers whose children are absolutely positioned
    // (e.g. LocationsSection rows) lay out identically without the spotlight.
    return (
      <Tag className={`relative ${className}`} style={style}>
        {children}
      </Tag>
    );
  }

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative ${className}`}
      style={style}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent ${radius})`,
        }}
      />
      {children}
    </Tag>
  );
};

export default SpotlightHover;
