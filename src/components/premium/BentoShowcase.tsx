import { motion } from "framer-motion";
import type { Product } from "@/lib/api";
import PremiumProductTile from "./PremiumProductTile";

interface Props {
  products: Product[];
}

/**
 * Asymmetric bento grid — 6 cells with varying spans.
 * Fills with first 6 premium products; empty cells render a subtle placeholder tile.
 */
const BENTO_LAYOUT = [
  "md:col-span-8 md:row-span-2",   // 0 — large hero
  "md:col-span-4 md:row-span-1",   // 1 — medium
  "md:col-span-4 md:row-span-1",   // 2 — medium
  "md:col-span-4 md:row-span-1",   // 3 — small
  "md:col-span-4 md:row-span-1",   // 4 — small
  "md:col-span-4 md:row-span-1",   // 5 — small
];

const BentoShowcase = ({ products }: Props) => {
  const cells = products.slice(0, 6);

  return (
    <section className="relative py-28 bg-gradient-to-b from-black via-[hsl(150_30%_6%)] to-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-xs font-medium border border-accent/20 mb-6 tracking-[0.3em] uppercase">
            The Selection
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white italic tracking-tight leading-tight max-w-3xl">
              A measured, deliberate curation.
            </h2>
            <p className="font-body text-white/50 text-base md:text-lg max-w-sm leading-relaxed">
              Each product here earns its place. We don't list — we recommend.
            </p>
          </div>
        </motion.div>

        {cells.length === 0 ? (
          <div className="py-20 text-center text-white/40 font-body">
            Premium selection coming soon — contact us to learn more.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[220px] gap-4 md:gap-5">
            {cells.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={BENTO_LAYOUT[i] ?? "md:col-span-4"}
              >
                <PremiumProductTile product={product} className="w-full h-full" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BentoShowcase;
