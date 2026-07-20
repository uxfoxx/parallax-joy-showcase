import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type { Product } from "@/lib/api";
import MediaCard from "@/components/MediaCard";
import { useProductModal } from "@/lib/productModal";

interface ProductCardProps {
  product: Product;
  large?: boolean;
  variant?: "dark" | "light";
  index?: number;
  columns?: number;
  onQuickView?: () => void;
}

const ProductCard = ({ product, variant = "light", index = 0, columns = 3 }: ProductCardProps) => {
  const { openProductModal } = useProductModal();
  const brandName = product.brands?.name ?? "";
  const meta = brandName || product.category;

  return (
    <MediaCard
      onClick={() => openProductModal(product.slug)}
      image={product.image_url ?? null}
      title={product.name}
      meta={meta}
      /* origin deliberately not passed — product↔country associations are
       * admin-only and never shown to visitors (BrandCard still uses the
       * MediaCard origin slot; a brand's home country is fine to show). */
      variant={variant}
      index={index}
      columns={columns}
      // TEMPORARY: featured products currently host oversized source
      // images; rendering them inside an inset keeps their visual weight
      // matched to standard cards until images are re-uploaded.
      imageInset={!!product.featured}
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
