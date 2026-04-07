import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Package, Eye, MapPin } from "lucide-react";
import type { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  large?: boolean;
  variant?: "dark" | "light";
  onQuickView?: () => void;
}

const ProductCard = ({ product, large = false, onQuickView }: ProductCardProps) => {
  const brandName = product.brands?.name ?? "";
  const brandSlug = product.brands?.slug ?? "";
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/products/${product.slug}`} className="block group">
        <div
          className={`relative overflow-hidden rounded-2xl ${large ? "aspect-[4/3]" : "aspect-square"} cursor-pointer shadow-md group-hover:shadow-2xl group-hover:shadow-black/20 transition-shadow duration-500`}
        >
          {/* Loading skeleton */}
          {product.image_url && !imgLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}

          {/* Image */}
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08] ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-forest-deep/30 via-forest-mid/20 to-accent/15 flex items-center justify-center">
              <Package className="w-12 h-12 text-forest-mid/40" />
            </div>
          )}

          {/* Shine sweep on hover */}
          <div
            className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]"
            style={{ transition: "opacity 0.5s, transform 0.9s" }}
          />

          {/* Featured badge — always top-right */}
          {product.featured && (
            <div className="absolute top-3 right-3 z-30">
              <Badge className="bg-accent text-white font-body text-xs shadow-md border-0">Featured</Badge>
            </div>
          )}

          {/* Category badge — slides down from top on hover */}
          <div className="absolute top-3 left-3 z-30 -translate-y-10 opacity-0 group-hover:-translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
            <Badge
              variant="outline"
              className="bg-black/55 backdrop-blur-sm font-body text-xs text-white border-white/20 shadow-sm"
            >
              {product.category}
            </Badge>
          </div>

          {/* Always-visible: bottom gradient + title only */}
          <div
            className="absolute inset-x-0 bottom-0 z-20 pt-14 pb-4 px-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent group-hover:opacity-0 transition-opacity duration-300 pointer-events-none"
          >
            <h3 className="font-display text-sm font-semibold text-white leading-snug line-clamp-2 drop-shadow">
              {product.name}
            </h3>
          </div>

          {/* Hover panel — slides up from bottom */}
          <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
            {/* Accent top edge */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
            {/* Panel body */}
            <div className="bg-black/80 backdrop-blur-md px-4 pt-3 pb-4 space-y-2.5">
              {/* Product name */}
              <h3 className="font-display text-sm font-semibold text-white leading-snug line-clamp-2">
                {product.name}
              </h3>

              {/* Brand + origin */}
              <div className="flex items-center justify-between">
                {brandName ? (
                  <span
                    role="link"
                    className="text-xs font-body font-medium text-white/65 hover:text-accent cursor-pointer transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/brands/${brandSlug}`);
                    }}
                  >
                    {brandName}
                  </span>
                ) : (
                  <span />
                )}

                {product.origin && (
                  <div className="flex items-center gap-1 text-[11px] font-body text-white/50">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate max-w-[90px]">{product.origin}</span>
                  </div>
                )}
              </div>

              {/* Quick view button */}
              {onQuickView && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onQuickView();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 border border-white/15 text-white font-body text-xs font-medium hover:bg-white/20 transition-colors duration-200"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Quick View
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
