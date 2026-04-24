import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type { Product } from "@/lib/api";
import MediaCard from "@/components/MediaCard";

interface ProductCardProps {
  product: Product;
  /** Legacy prop — no longer used, kept for API compat. */
  large?: boolean;
  variant?: "dark" | "light";
  index?: number;
  columns?: number;
  /** Legacy prop — no longer used, kept for API compat. */
  onQuickView?: () => void;
}

/**
 * Product card — adapter over `MediaCard`. Shares the exact same visual
 * language as `BrandCard` so the two read as siblings.
 */
const ProductCard = ({ product, variant = "light", index = 0, columns = 3 }: ProductCardProps) => {
  const brandName = product.brands?.name ?? "";
  const meta = brandName || product.category;

  return (
    <MediaCard
      to={`/products/${product.slug}`}
      image={product.image_url ?? null}
      title={product.name}
      meta={meta}
      origin={product.origin ?? null}
      variant={variant}
      index={index}
      columns={columns}
      badge={
        product.featured ? (
          <Badge className="bg-accent text-white font-body text-[10px] tracking-[0.14em] uppercase shadow-md border-0">
            Featured
          </Badge>
        ) : undefined
      }
      fallback={<Package className="w-12 h-12 text-forest-mid/40" />}
    />
  );
};

export default ProductCard;
