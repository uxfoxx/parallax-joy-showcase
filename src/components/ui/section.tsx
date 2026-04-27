import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionSize = "tight" | "base" | "hero";
type SectionTheme = "dark" | "light";

type SectionProps = HTMLAttributes<HTMLElement> & {
  /**
   * Vertical rhythm preset. Pick "tight" for narrow bands (LogoStrip,
   * DarkStatsBanner), "base" for standard sections, "hero" for full-bleed
   * landing posters.
   */
  size?: SectionSize;
  /** Sets the data-navbar-theme attribute used by the navbar to pick text colour. */
  theme?: SectionTheme;
  /** Sets the inner container max-width. Defaults to 7xl. */
  inner?: "default" | "wide" | "none";
  /** When true, omits the inner container entirely (caller supplies layout). */
  bare?: boolean;
  children: ReactNode;
};

const sizeClasses: Record<SectionSize, string> = {
  // Section vertical rhythm — single source of truth.
  // Token defs live in tailwind.config.ts under spacing.section-*.
  tight: "py-section-tight lg:py-section-tight-lg",
  base: "py-section-base lg:py-section-base-lg",
  hero: "min-h-screen",
};

const innerClasses = {
  default: "relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full",
  wide: "relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 w-full",
  none: "relative z-10 w-full",
};

/**
 * Standard landing section wrapper.
 *
 * Provides one-source-of-truth vertical rhythm and the data-navbar-theme
 * hook. The inner container with max-width and gutters is included by
 * default; pass `bare` to skip it when the caller needs full-bleed layout.
 */
const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      size = "base",
      theme,
      inner = "default",
      bare = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        data-navbar-theme={theme}
        className={cn("relative overflow-hidden", sizeClasses[size], className)}
        {...rest}
      >
        {bare ? children : <div className={innerClasses[inner]}>{children}</div>}
      </section>
    );
  },
);
Section.displayName = "Section";

export default Section;
