import { motion, useReducedMotion } from "framer-motion";
import { type CSSProperties, type ImgHTMLAttributes } from "react";
import { curtainRevealVariants } from "@/lib/motion";

type CurtainImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  /** Re-trigger reveal on every scroll-back. */
  retrigger?: boolean;
};

/**
 * motion.dev "Image Reveal" — image in a clip-path curtain that opens
 * top → bottom when the element enters the viewport.
 */
const CurtainImage = ({
  wrapperClassName,
  wrapperStyle,
  retrigger = false,
  className,
  alt,
  ...imgProps
}: CurtainImageProps) => {
  const reduced = useReducedMotion();
  // Default to an empty string so the image is treated as decorative
  // when the caller forgets to set one — keeps the markup a11y-clean.
  const a11yAlt = alt ?? "";
  // Defer offscreen decode/fetch unless the caller opts out.
  const { loading = "lazy", decoding = "async", ...rest } = imgProps;
  const imgAttrs = { loading, decoding, ...rest };

  if (reduced) {
    return (
      <div className={wrapperClassName} style={wrapperStyle}>
        <img className={className} alt={a11yAlt} {...imgAttrs} />
      </div>
    );
  }

  return (
    <motion.div
      className={wrapperClassName}
      style={{ ...wrapperStyle, overflow: "hidden" }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: !retrigger, margin: "-10%" }}
      variants={curtainRevealVariants}
    >
      <img className={className} alt={a11yAlt} {...imgAttrs} />
    </motion.div>
  );
};

export default CurtainImage;
