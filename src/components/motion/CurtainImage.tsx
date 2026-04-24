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
  ...imgProps
}: CurtainImageProps) => {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={wrapperClassName} style={wrapperStyle}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img className={className} {...imgProps} />
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
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img className={className} {...imgProps} />
    </motion.div>
  );
};

export default CurtainImage;
