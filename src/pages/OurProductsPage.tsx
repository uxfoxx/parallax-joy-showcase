import { motion } from "framer-motion";
import { Star } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import { useFeaturedProducts } from "@/lib/api";

const OurProductsPage = () => {
  const { data: featured = [], isLoading } = useFeaturedProducts();

  return (
    <PageLayout>
      <section className="relative overflow-hidden py-28 lg:py-36">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseOP">
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseOP)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-8">
            <Star className="w-8 h-8 text-accent" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6">Our Products</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="font-body text-lg text-primary-foreground/70 max-w-2xl mx-auto">Our handpicked selection of standout products — chosen for exceptional quality, unique origin, and outstanding taste.</motion.p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          {isLoading ? (
            <p className="text-center font-body text-muted-foreground py-20">Loading products...</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {featured.map((product) => <ProductCard key={product.id} product={product} large />)}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default OurProductsPage;
