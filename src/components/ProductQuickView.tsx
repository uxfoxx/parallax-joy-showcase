import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Package, ArrowRight, MessageCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/api";

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductQuickView = ({ product, open, onOpenChange }: ProductQuickViewProps) => {
  if (!product) return null;

  const brandName = product.brands?.name ?? "";
  const brandSlug = product.brands?.slug ?? "";
  const plainDesc = product.description.includes("<")
    ? new DOMParser().parseFromString(product.description, "text/html").body.textContent || ""
    : product.description;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border-border bg-background gap-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Image */}
          <div className="relative aspect-[16/9] bg-muted overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-forest-deep/20 via-forest-mid/10 to-accent/10 flex items-center justify-center">
                <Package className="w-16 h-16 text-forest-mid/30" />
              </div>
            )}
            {/* Top badges */}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
              {product.featured && (
                <Badge className="bg-accent text-white font-body text-xs shadow-md">Featured</Badge>
              )}
              <Badge variant="outline" className="bg-background/90 backdrop-blur-sm font-body text-xs text-foreground border-border shadow-sm ml-auto">
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-1">{product.name}</h2>
              <div className="flex items-center gap-3 text-sm font-body text-muted-foreground">
                {brandName && (
                  <Link
                    to={`/brands/${brandSlug}`}
                    className="text-accent hover:underline font-medium"
                    onClick={() => onOpenChange(false)}
                  >
                    {brandName}
                  </Link>
                )}
                {product.origin && (
                  <span className="text-muted-foreground/60">·&nbsp;{product.origin}</span>
                )}
              </div>
            </div>

            <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {plainDesc}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                to={`/products/${product.slug}`}
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                <Button className="w-full bg-accent hover:bg-accent/90 text-white font-body font-semibold rounded-lg h-11 text-sm gap-2 shine-sweep">
                  View Full Details
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link
                to={`/contact?subject=Product+Inquiry&product=${encodeURIComponent(product.name)}`}
                onClick={() => onOpenChange(false)}
              >
                <Button variant="outline" className="rounded-lg h-11 font-body text-sm border-border hover:border-accent/40 gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Inquire
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
