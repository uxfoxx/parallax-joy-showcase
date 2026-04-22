import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import type { Product } from "@/lib/api";
import {
  SEASONAL_HEADLINE,
  SEASONAL_SUBTITLE,
  waLink,
  productMsg,
  originToFlag,
} from "./premiumConstants";

interface Props {
  products: Product[];
}

const SeasonalRail = ({ products }: Props) => {
  const seasonal = products.filter((p) => p.tags?.some((t) => t.toLowerCase() === "seasonal"));
  if (seasonal.length === 0) return null;

  return (
    <section className="relative py-24 bg-[hsl(150_40%_5%)] overflow-hidden">
      {/* Gold horizontal accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="font-body text-[11px] uppercase tracking-[0.3em] text-accent">
                Limited availability
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white italic tracking-tight">
              {SEASONAL_HEADLINE}
            </h2>
            <p className="font-body text-white/50 mt-3 max-w-xl">{SEASONAL_SUBTITLE}</p>
          </div>
        </motion.div>
      </div>

      <div className="overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth">
        <div className="flex gap-5 px-6 lg:px-10 w-max">
          {seasonal.map((product, i) => {
            const flag = originToFlag(product.origin);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="snap-start flex-shrink-0 w-[82vw] md:w-[520px] h-[420px] relative overflow-hidden rounded-2xl border border-white/10"
              >
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                {flag && (
                  <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15">
                    <span className="text-[10px] font-mono font-bold text-accent tracking-wider">{flag}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-accent/80 mb-2 font-body">
                    Seasonal · {product.category}
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-white italic leading-tight mb-4">
                    {product.name}
                  </h3>
                  <a
                    href={waLink(productMsg(product.name))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-accent text-white font-body text-sm font-semibold hover:bg-accent/90 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enquire on WhatsApp
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SeasonalRail;
