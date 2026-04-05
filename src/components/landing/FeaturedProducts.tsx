import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFeaturedProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

const FeaturedProducts = () => {
  const { data: products = [] } = useFeaturedProducts();
  const displayProducts = products.slice(0, 3);

  return (
    <section id="products" className="relative overflow-hidden py-28 lg:py-36 bg-background">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6"
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            Our Products
          </h2>
          <p className="text-muted-foreground font-body text-base max-w-sm leading-relaxed">
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
              <ProductCard product={product} large />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link to="/our-products">
            <Button className="bg-forest-deep text-white hover:bg-forest-deep/90 font-body rounded-lg px-8 py-5 transition-all duration-300 border border-forest-deep/20 hover:shadow-lg">
              View Our Products →
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
