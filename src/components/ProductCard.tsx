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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/products/${product.slug}`} className="block group">
        <div className="rounded-lg border border-border bg-card overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-forest-mid/30">
          <div
            className={`relative overflow-hidden bg-gradient-to-br from-forest-deep/10 via-forest-mid/5 to-accent/10 flex items-center justify-center ${
              large ? "h-64" : "h-48"
            }`}
          >
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <Package className="w-10 h-10 text-forest-mid/25" />
            )}
            {product.featured && (
              <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground font-body text-xs">
                Featured
              </Badge>
            )}
            <div className="absolute top-3 right-3">
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm font-body text-xs text-foreground border-border">
                {product.category}
              </Badge>
            </div>
          </div>

          <div className="p-5 space-y-2">
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-forest-mid transition-colors">
              {product.name}
            </h3>
            <p className="text-sm font-body text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between pt-2">
              <Link
                to={`/brands/${brandSlug}`}
                className="text-xs font-body font-medium text-forest-mid hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {brandName}
              </Link>
              <span className="text-xs font-body text-muted-foreground">
                {product.origin}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
