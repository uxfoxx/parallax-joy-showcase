import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "dark" | "light";

type SectionHeadingProps = Omit<HTMLAttributes<HTMLHeadingElement>, "children"> & {
  children: ReactNode;
  /** "dark" = white on dark bg. "light" = forest on light bg. */
  tone?: Tone;
  /** Render as h1 (rare; hero only) or h2 (default). */
  as?: "h1" | "h2";
};

/**
 * Single source of truth for editorial section headings.
 *
 * Locks the H2 type system: font-display, bold, tracking-tight, with the
 * established mobile→lg ramp (text-4xl → sm:text-5xl → md:text-5xl →
 * lg:text-6xl). Pass children — this lets sections use mixed-tone words
 * (e.g. plain + text-gradient-gold spans) inside the same heading.
 */
const SectionHeading = forwardRef<HTMLHeadingElement, SectionHeadingProps>(
  ({ tone = "dark", as = "h2", className, children, ...rest }, ref) => {
    const Tag = as as "h2";
    return (
      <Tag
        ref={ref}
        className={cn(
          "font-display font-bold leading-[1.04] tracking-tight",
          "text-4xl sm:text-5xl md:text-5xl lg:text-6xl",
          tone === "dark" ? "text-primary-foreground" : "text-foreground",
          className,
        )}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);
SectionHeading.displayName = "SectionHeading";

export default SectionHeading;
