import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFeaturedProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

const FeaturedProducts = () => {
  const { data: products = [] } = useFeaturedProducts();
  const displayProducts = products.slice(0, 3);

  return (
    <section id="products" className="relative overflow-hidden py-28 lg:py-36">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, hsl(140 50% 19% / 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, hsl(150 40% 14% / 0.4) 0%, transparent 50%),
            linear-gradient(180deg, hsl(150 40% 10%), hsl(140 50% 19%), hsl(150 40% 10%))
          `,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6"
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground tracking-tight">
            Featured Products
          </h2>
          <p className="text-primary-foreground/50 font-body text-base max-w-sm leading-relaxed">
            Carefully selected food products sourced from certified international suppliers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={product} large variant="dark" />
            </motion.div>
          ))}
        </div>

        {/* View All link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link to="/featured">
            <Button className="bg-white/10 hover:bg-white/20 text-primary-foreground font-body rounded-xl px-8 py-5 transition-all duration-300 border border-primary-foreground/10 hover:border-primary-foreground/20">
              View All Featured Products →
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
