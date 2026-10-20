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

const containerVariants: Variants = {
  hidden: {},
  show: {},
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

/** Each token's reveal mask. It clips vertically only (the words slide up into
 *  view), so italic overhangs aren't cut off — they lost their last letter
 *  ("partne|") — and word spacing is untouched. The padding/negative-margin
 *  pair gives descenders room without moving the baseline. Browsers without
 *  `overflow: clip` simply show the slide unmasked. */
const MASK: CSSProperties = {
  display: "inline-block",
  overflowX: "visible",
  overflowY: "clip",
  paddingBottom: "0.12em",
  marginBottom: "-0.12em",
};

/**
 * Word- or letter-level reveal driven by `whileInView`.
 * Screen readers get the flat text from a visually hidden copy; the animated
 * tokens are aria-hidden. (aria-label isn't allowed on a plain span.)
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
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: !retrigger, margin: "0px" }}
    >
      <span className="sr-only">{text}</span>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) {
          return <span key={i} aria-hidden>{token}</span>;
        }
        return (
          <span key={i} aria-hidden style={MASK}>
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
