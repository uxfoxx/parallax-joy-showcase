import { cn } from "@/lib/utils";
import logo from "@/assets/olive-foods-hero-logo.svg";
import mark from "@/assets/olive-mark.svg";

/**
 * The Olive Foods logo as the brand guidelines want it in the admin
 * (public/olive-foods-brand-guidelines.pdf §02): the primary logo, or the
 * compact olive mark where the wordmark won't fit — never recoloured or given
 * effects, and on forest grounds always on a cream chip.
 * (olive-foods-hero-logo.svg is the primary logo's artwork, tightly cropped.)
 */
export function BrandLogo({ variant = "full", chip = false, className, imgClassName }: { variant?: "full" | "mark"; chip?: boolean; className?: string; imgClassName?: string }) {
  const img = (
    <img
      src={variant === "full" ? logo : mark}
      alt="Olive Foods"
      className={cn(variant === "full" ? "h-16 w-auto" : "h-7 w-7", imgClassName)}
      draggable={false}
    />
  );
  if (!chip) return <span className={cn("inline-flex", className)}>{img}</span>;
  return <span className={cn("inline-flex items-center justify-center rounded-lg bg-cream", variant === "full" ? "p-2.5" : "p-1.5", className)}>{img}</span>;
}

export const BRAND_TAGLINE = "Quality You Can Trust. Excellence You Can Taste.";
