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

const ProductCard = ({ product, large = false, variant = "light", onQuickView }: ProductCardProps) => {
  const brandName = product.brands?.name ?? "";
  const brandSlug = product.brands?.slug ?? "";
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();

  const cardBg = variant === "dark" ? "bg-white/8 border-white/10" : "bg-card border-border";
  const nameColor = variant === "dark" ? "text-primary-foreground" : "text-foreground";
  const mutedColor = variant === "dark" ? "text-primary-foreground/60" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/products/${product.slug}`} className="block group">
        <div
          className={`relative rounded-xl overflow-hidden border transition-all duration-500 ${cardBg} shadow-sm hover:shadow-xl hover:shadow-black/10`}
          style={{ borderLeftWidth: "1px" }}
        >
          {/* Image container */}
          <div className={`relative overflow-hidden ${large ? "aspect-[4/3]" : "aspect-square"}`}>
            {/* Loading skeleton */}
            {product.image_url && !imgLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05] ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-forest-deep/30 via-forest-mid/20 to-accent/15 flex items-center justify-center">
                <Package className="w-12 h-12 text-forest-mid/40" />
              </div>
            )}

            {/* Shine sweep on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-tr from-transparent via-white/12 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]"
              style={{ transition: "opacity 0.6s, transform 1s" }}
            />

            {/* Category badge — top left of image */}
            <div className="absolute top-3 left-3 z-10">
              <Badge
                variant="outline"
                className="bg-background/85 backdrop-blur-sm font-body text-xs text-foreground border-border/60 shadow-sm"
              >
                {product.category}
              </Badge>
            </div>

            {/* Featured badge — top right of image */}
            {product.featured && (
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-accent text-white font-body text-xs shadow-md">Featured</Badge>
              </div>
            )}

            {/* Quick view — centre of image on hover */}
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView();
                }}
                className="absolute inset-0 z-20 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-forest-deep font-body text-xs font-semibold shadow-lg hover:bg-white transition-colors duration-200">
                  <Eye className="w-3.5 h-3.5" />
                  Quick View
                </span>
              </button>
            )}
          </div>

          {/* Card body — below image */}
          <div className="p-4 relative">
            {/* Accent left border on hover */}
            <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

            <div className="pl-1">
              <h3 className={`font-display text-sm font-semibold leading-snug line-clamp-2 mb-1.5 transition-colors duration-300 group-hover:text-accent ${nameColor}`}>
                {product.name}
              </h3>

              <div className="flex items-center justify-between mt-2">
                <span
                  role="link"
                  className={`text-xs font-body font-medium hover:text-accent cursor-pointer transition-colors duration-200 ${mutedColor}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/brands/${brandSlug}`);
                  }}
                >
                  {brandName}
                </span>

                {product.origin && (
                  <div className={`flex items-center gap-1 text-xs font-body ${mutedColor}`}>
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate max-w-[80px]">{product.origin}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
