import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type { Product } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  large?: boolean;
}

const ProductCard = ({ product, large = false }: ProductCardProps) => {
  const brandName = product.brands?.name ?? "";
  const brandSlug = product.brands?.slug ?? "";

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
          className={`relative rounded-lg overflow-hidden ${large ? "aspect-[3/4]" : "aspect-[4/5]"} shadow-md hover:shadow-xl transition-shadow duration-500 border border-border/30`}
        >
          {/* Full image background */}
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-forest-deep/20 via-forest-mid/10 to-accent/10 flex items-center justify-center">
              <Package className="w-12 h-12 text-forest-mid/25" />
            </div>
          )}

          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]" style={{ transition: "opacity 0.7s, transform 0.9s" }} />

          {/* Top badges — always visible */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
            {product.featured ? (
              <Badge className="bg-accent text-accent-foreground font-body text-xs shadow-md">
                Featured
              </Badge>
            ) : <span />}
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm font-body text-xs text-foreground border-border shadow-sm">
              {product.category}
            </Badge>
          </div>

          {/* Three-stop gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Bottom details — name always visible, rest on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
            <h3 className="font-display text-lg font-semibold text-white drop-shadow-md leading-tight">
              {product.name}
            </h3>
            <div className="max-h-0 group-hover:max-h-24 overflow-hidden transition-all duration-500 ease-out">
              <p className="text-white/75 text-sm font-body line-clamp-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                {product.description}
              </p>
              <div className="flex items-center justify-between mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                <Link
                  to={`/brands/${brandSlug}`}
                  className="text-xs font-body font-medium text-white/90 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {brandName}
                </Link>
                <span className="text-xs font-body text-white/60">
                  {product.origin}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
