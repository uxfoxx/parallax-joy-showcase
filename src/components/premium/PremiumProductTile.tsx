import Tilt from "react-parallax-tilt";
import { MessageCircle } from "lucide-react";
import type { Product } from "@/lib/api";
import { waLink, productMsg, originToFlag } from "./premiumConstants";

interface Props {
  product: Product;
  className?: string;
}

const PremiumProductTile = ({ product, className = "" }: Props) => {
  const flag = originToFlag(product.origin);

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      glareEnable
      glareMaxOpacity={0.15}
      glareColor="#e6c96b"
      glarePosition="all"
      scale={1.02}
      transitionSpeed={1500}
      className={`relative group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] ${className}`}
    >
      {/* Image */}
      <div className="absolute inset-0">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-forest-deep to-black" />
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />

      {/* Provenance chip */}
      {flag && (
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-accent tracking-wider">{flag}</span>
          <span className="text-[10px] font-body uppercase tracking-[0.15em] text-white/70">
            {product.origin}
          </span>
        </div>
      )}

      {/* Text content */}
      <div className="relative h-full flex flex-col justify-end p-6 min-h-[22rem]">
        {product.category && (
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 font-body">
            {product.category}
          </div>
        )}
        <h3 className="font-display text-2xl md:text-3xl font-bold text-white italic leading-tight mb-3">
          {product.name}
        </h3>
        {product.description && (
          <p className="font-body text-sm text-white/50 leading-relaxed mb-5 line-clamp-2">
            {typeof product.description === "string"
              ? product.description.replace(/<[^>]+>/g, "").slice(0, 120)
              : ""}
          </p>
        )}
        <a
          href={waLink(productMsg(product.name))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-accent font-body text-sm font-semibold group/cta"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Enquire
          <span className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
        </a>
      </div>

      {/* Gold hairline on hover */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-accent/0 group-hover:ring-accent/50 transition-all duration-500 pointer-events-none" />
    </Tilt>
  );
};

export default PremiumProductTile;
