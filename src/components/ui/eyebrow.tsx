import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type EyebrowVariant = "pill" | "plain";
type EyebrowTone = "accent" | "primary" | "muted" | "white";

type EyebrowProps = HTMLAttributes<HTMLSpanElement> & {
  /** "pill" = section labels (above H2). "plain" = micro-labels above values. */
  variant?: EyebrowVariant;
  tone?: EyebrowTone;
  /** Shows a small pulsing dot to the left (good for "live" indicators). */
  withDot?: boolean;
};

/**
 * Single source of truth for uppercase tracking-heavy labels.
 *
 * Two variants:
 * - `pill`  — wraps in rounded-full bg+border. Use above section headings.
 * - `plain` — text-only. Use above values, in info panels, on stat pills.
 *
 * Floor of 11px on mobile, 10px on md+ (decided by the variant).
 */
const Eyebrow = forwardRef<HTMLSpanElement, EyebrowProps>(
  ({ variant = "pill", tone = "accent", withDot, className, children, ...rest }, ref) => {
    const isPill = variant === "pill";

    const toneText: Record<EyebrowTone, string> = {
      accent: "text-accent",
      primary: "text-primary-foreground",
      muted: "text-primary-foreground/55",
      white: "text-white/80",
    };
    const toneBg: Record<EyebrowTone, string> = {
      accent: "bg-accent/10 border-accent/25",
      primary: "bg-primary-foreground/10 border-primary-foreground/15",
      muted: "bg-white/[0.06] border-white/15",
      white: "bg-white/[0.06] border-white/15",
    };
    const toneDot: Record<EyebrowTone, string> = {
      accent: "bg-accent",
      primary: "bg-primary-foreground",
      muted: "bg-primary-foreground/70",
      white: "bg-accent",
    };

    if (isPill) {
      return (
        <span
          ref={ref}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full",
            "border backdrop-blur-sm",
            "font-body text-[11px] md:text-[11px] font-semibold tracking-[0.3em] uppercase",
            toneText[tone],
            toneBg[tone],
            className,
          )}
          {...rest}
        >
          {withDot && (
            <span className="relative w-1.5 h-1.5 rounded-full">
              <span className={cn("absolute inset-0 rounded-full", toneDot[tone])} />
              <span
                className={cn(
                  "absolute inset-0 rounded-full opacity-60 animate-ping",
                  toneDot[tone],
                )}
              />
            </span>
          )}
          {children}
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(
          "font-body text-[11px] md:text-[10px] font-semibold tracking-[0.3em] uppercase",
          toneText[tone],
          className,
        )}
        {...rest}
      >
        {children}
      </span>
    );
  },
);
Eyebrow.displayName = "Eyebrow";

export default Eyebrow;
