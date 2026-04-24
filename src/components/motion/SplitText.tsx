import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type CSSProperties, type ElementType } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion";

type SplitTextProps = {
  text: string;
  by?: "word" | "letter";
  stagger?: number;
  delay?: number;
  duration?: number;
  className?: string;
  tokenClassName?: string;
  style?: CSSProperties;
  /** Re-trigger on every scroll-back (motion.dev "Text Appear On Scroll"). */
  retrigger?: boolean;
  as?: ElementType;
};

const tokenVariants: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT_EXPO, delay: i },
  }),
};

/**
 * Word- or letter-level reveal driven by `whileInView`.
 * Content is `aria-label`ed so screen readers get the flat text.
 */
const SplitText = ({
  text,
  by = "word",
  stagger = 0.06,
  delay = 0,
  duration,
  className,
  tokenClassName,
  style,
  retrigger = false,
  as: Tag = "span",
}: SplitTextProps) => {
  const reduced = useReducedMotion();
  const Component = motion(Tag as "span");

  if (reduced) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  const tokens = by === "word" ? text.split(/(\s+)/) : Array.from(text);

  return (
    <Component
      className={className}
      style={style}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: !retrigger, margin: "-10% 0px -10% 0px" }}
    >
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) {
          return <span key={i} aria-hidden>{token}</span>;
        }
        return (
          <span
            key={i}
            aria-hidden
            style={{ display: "inline-block", overflow: "hidden" }}
          >
            <motion.span
              variants={tokenVariants}
              custom={delay + i * stagger}
              transition={duration ? { duration, ease: EASE_OUT_EXPO, delay: delay + i * stagger } : undefined}
              className={tokenClassName}
              style={{ display: "inline-block", willChange: "transform, opacity" }}
            >
              {token}
            </motion.span>
          </span>
        );
      })}
    </Component>
  );
};

export default SplitText;
