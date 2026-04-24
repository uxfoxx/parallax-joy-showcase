import { Badge } from "@/components/ui/badge";
import MediaCard from "@/components/MediaCard";

interface Brand {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  description?: string | null;
  origin?: string | null;
}

interface BrandCardProps {
  brand: Brand;
  prodCount: number;
  variant?: "dark" | "light";
  index?: number;
  columns?: number;
}

/**
 * Brand card — adapter over `MediaCard`, visually identical to `ProductCard`.
 * Shows the brand image, origin, and a product-count pill in the top-right.
 */
const BrandCard = ({ brand, prodCount, variant = "light", index = 0, columns = 3 }: BrandCardProps) => {
  const meta = brand.description
    ? brand.description.length > 60
      ? `${brand.description.slice(0, 60).trim()}…`
      : brand.description
    : undefined;

  return (
    <MediaCard
      to={`/brands/${brand.slug}`}
      image={brand.image_url ?? null}
      title={brand.name}
      meta={meta}
      origin={brand.origin ?? null}
      variant={variant}
      index={index}
      columns={columns}
      badge={
        <Badge
          variant="outline"
          className="bg-background/80 backdrop-blur-sm font-body text-[10px] tracking-wider uppercase text-foreground border-border shadow-sm"
        >
          {prodCount} product{prodCount !== 1 ? "s" : ""}
        </Badge>
      }
      fallback={
        <span className="font-display text-6xl font-bold text-forest-mid/25">
          {brand.name.charAt(0)}
        </span>
      }
    />
  );
};

export default BrandCard;
