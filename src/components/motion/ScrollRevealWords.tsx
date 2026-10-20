import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A headline that lights up word by word as it scrolls into the reading zone
 * (scroll-linked, not time-based, so it moves with the reader). The full text
 * is always in the DOM — search engines and screen readers get it unchanged —
 * and prefers-reduced-motion shows it fully lit.
 *
 * `lines` are rendered on their own lines; `highlight` words (matched without
 * punctuation) get `highlightClassName`, e.g. the brand gradient.
 */
function Word({ progress, range, children, className }: { progress: MotionValue<number>; range: [number, number]; children: string; className?: string }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className={cn("inline-block will-change-transform", className)}>
      {children}
    </motion.span>
  );
}

/** Keeps each word's trailing space inside its own inline-block. */
const NBSP = String.fromCharCode(160);

export default function ScrollRevealWords({
  lines,
  highlight = [],
  highlightClassName,
  className,
  id,
  as: Tag = "h2",
}: {
  id?: string;
  lines: string[];
  highlight?: string[];
  highlightClassName?: string;
  className?: string;
  as?: "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = lines.map((l) => l.split(" "));
  const total = words.flat().length;
  const strip = (w: string) => w.replace(/[^\p{L}\p{N}-]/gu, "").toLowerCase();
  const marks = new Set(highlight.map(strip));
  let i = 0;

  return (
    <Tag ref={ref} id={id} className={className}>
      {words.map((line, li) => (
        <span key={li} className="block">
          {line.map((w, wi) => {
            const idx = i++;
            const hl = marks.has(strip(w)) ? highlightClassName : undefined;
            const text = wi < line.length - 1 ? `${w}${NBSP}` : w;
            if (reduced) {
              return (
                <span key={wi} className={cn("inline-block", hl)}>
                  {text}
                </span>
              );
            }
            const start = (idx / total) * 0.8;
            return (
              <Word key={wi} progress={scrollYProgress} range={[start, start + 0.2]} className={hl}>
                {text}
              </Word>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
