import { motion } from "framer-motion";
import { Star } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";

const FeaturedPage = () => {
  const featured = getFeaturedProducts();

  return (
    <PageLayout>
      {/* Header */}
      <section className="relative overflow-hidden bg-forest-deep py-28 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-deep via-forest-mid/20 to-forest-deep" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-8"
          >
            <Star className="w-8 h-8 text-accent" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6"
          >
            Featured Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg text-primary-foreground/70 max-w-2xl mx-auto"
          >
            Our handpicked selection of standout products — chosen for exceptional quality, unique origin, and outstanding taste.
          </motion.p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} large />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default FeaturedPage;
