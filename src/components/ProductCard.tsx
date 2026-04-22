import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin } from "lucide-react";
import type { Product } from "@/lib/api";
import { staggerGrid, EASE_OUT_EXPO } from "@/lib/motion";

interface ProductCardProps {
  product: Product;
  large?: boolean;
  variant?: "dark" | "light";
  index?: number;
  columns?: number;
  /** Legacy prop — no longer renders a button, kept for API compat. */
  onQuickView?: () => void;
}

/**
 * Vertical portrait product card (motion.dev "Tilt card" + "Physical stagger").
 * Tall 3:4 image, text block sits below the image.
 */
const ProductCard = ({
  product,
  variant = "light",
  index = 0,
  columns = 3,
}: ProductCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const brandName = product.brands?.name ?? "";

  const isDark = variant === "dark";
  const titleColor = isDark ? "text-white" : "text-foreground";
  const metaColor = isDark ? "text-white/55" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.65,
        ease: EASE_OUT_EXPO,
        delay: staggerGrid(index, columns),
      }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/products/${product.slug}`} className="block group">
        <Tilt
          tiltMaxAngleX={3}
          tiltMaxAngleY={3}
          perspective={1400}
          glareEnable
          glareMaxOpacity={0.12}
          glareColor="#e6c96b"
          glareBorderRadius="14px"
          transitionSpeed={900}
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted shadow-sm group-hover:shadow-xl group-hover:shadow-black/15 transition-shadow duration-500">
            {product.image_url && !imgLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05] ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-forest-deep/30 via-forest-mid/20 to-accent/15 flex items-center justify-center">
                <Package className="w-12 h-12 text-forest-mid/40" />
              </div>
            )}

            {product.featured && (
              <div className="absolute top-3 right-3 z-20">
                <Badge className="bg-accent text-white font-body text-[10px] tracking-[0.14em] uppercase shadow-md border-0">
                  Featured
                </Badge>
              </div>
            )}

            {/* Accent hairline fade-in on hover — editorial flourish */}
            <div className="absolute inset-x-4 bottom-4 h-px bg-accent/0 group-hover:bg-accent/80 transition-colors duration-500" />
          </div>
        </Tilt>

        {/* Text block — below the image */}
        <div className="pt-4 px-1 space-y-1.5">
          <h3
            className={`font-display text-base md:text-[17px] font-semibold leading-snug line-clamp-2 ${titleColor} group-hover:text-accent transition-colors duration-300`}
          >
            {product.name}
          </h3>
          <div className={`flex items-center justify-between gap-3 font-body text-xs ${metaColor}`}>
            <span className="truncate">{brandName || product.category}</span>
            {product.origin && (
              <span className="flex items-center gap-1 shrink-0">
                <MapPin className="w-3 h-3" />
                <span className="truncate max-w-[90px]">{product.origin}</span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
