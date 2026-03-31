import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import type { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  large?: boolean;
}

const ProductCard = ({ product, large = false }: ProductCardProps) => {
  const brandName = product.brands?.name ?? "";

  return (
    <Link to={`/products/${product.slug}`} className="block group">
      <div className="border border-border/40 hover:border-border transition-colors duration-300">
        {/* Image area */}
        <div
          className={`relative overflow-hidden bg-[hsl(35,25%,93%)] ${large ? "aspect-[3/4]" : "aspect-square"}`}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-12 h-12 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Text area */}
        <div className="px-4 py-4 bg-background">
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-body mb-1">
            {product.category}
          </p>
          <h3 className="font-body text-sm tracking-wide uppercase text-foreground leading-snug">
            {product.name}
          </h3>
          {brandName && (
            <p className="text-[11px] text-muted-foreground font-body mt-1.5">
              {brandName}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
