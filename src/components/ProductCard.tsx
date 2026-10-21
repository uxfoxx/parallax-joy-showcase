import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type { Product } from "@/lib/api";
import MediaCard from "@/components/MediaCard";
import { useProductModal } from "@/lib/productModal";
import { productCategories } from "@/hooks/useSuppliedCategories";

interface ProductCardProps {
  product: Product;
  large?: boolean;
  variant?: "dark" | "light";
  index?: number;
  columns?: number;
  onQuickView?: () => void;
  /** Hide the "Featured" badge where every card is featured anyway. */
  showBadge?: boolean;
}

const ProductCard = ({ product, variant = "light", index = 0, columns = 3, showBadge = true }: ProductCardProps) => {
  const { openProductModal } = useProductModal();
  const brandName = product.brands?.name ?? "";
  const category = productCategories(product)[0] ?? product.category;

  return (
    <MediaCard
      // A real link to the product page (crawlable, opens in a new tab on
      // ⌘/Ctrl-click); a plain click still opens the quick view.
      to={`/products/${product.slug}`}
      onClick={() => openProductModal(product.slug)}
      image={product.image_url ?? null}
      title={product.name}
      eyebrow={brandName || undefined}
      meta={category}
      /* origin deliberately not passed — product↔country associations are
       * admin-only and never shown to visitors (BrandCard still uses the
       * MediaCard origin slot; a brand's home country is fine to show). */
      variant={variant}
      index={index}
      columns={columns}
      badge={
        showBadge && product.featured ? (
          <Badge className="bg-accent text-accent-foreground font-body text-[11px] tracking-[0.14em] uppercase shadow-md border-0">
            Featured
          </Badge>
        ) : undefined
      }
      fallback={<Package className="w-12 h-12 text-forest-mid/40" />}
    />
  );
};

/** Placeholder card while products load (same footprint as ProductCard). */
export const ProductCardSkeleton = () => (
  <div aria-hidden>
    <div className="aspect-[4/5] rounded-2xl border border-border/60 skeleton-shimmer" />
    <div className="mt-3 h-2.5 w-16 rounded-full skeleton-shimmer" />
    <div className="mt-2 h-3.5 w-3/4 rounded-full skeleton-shimmer" />
    <div className="mt-2 h-3 w-1/3 rounded-full skeleton-shimmer" />
  </div>
);

export default ProductCard;
