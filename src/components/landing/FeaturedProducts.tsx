import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFeaturedProducts } from "@/lib/api";
import { useRef } from "react";

const FeaturedProducts = () => {
  const { data: products = [] } = useFeaturedProducts();
  const displayProducts = products.slice(0, 3);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();

  const gridShift = useTransform(scrollYProgress, [0.22, 0.37, 0.52], [0, 100, 0]);
  const gridRotate = useTransform(scrollYProgress, [0.22, 0.37, 0.52], [0, 2, 0]);
  const firstCardScale = useTransform(scrollYProgress, [0.22, 0.37, 0.52], [1, 0.82, 1]);
  const firstCardOpacity = useTransform(scrollYProgress, [0.22, 0.37, 0.52], [1, 0.35, 1]);

  return (
    <section ref={sectionRef} id="products" className="relative overflow-hidden py-28 lg:py-36">
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
          <p className="text-primary-foreground/40 font-body text-base max-w-sm leading-relaxed">
            Carefully selected food products sourced from certified international suppliers.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          style={{ x: gridShift, rotate: gridRotate }}
        >
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 60, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl overflow-hidden glass hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500"
              style={i === 0 ? { scale: firstCardScale, opacity: firstCardOpacity } : undefined}
            >
              <div className="relative">
                <div className="p-6 pb-0">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-primary-foreground text-xs font-body font-medium border border-accent/20">
                      {product.featured ? "Featured" : "New"}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary-foreground/5 text-primary-foreground/60 text-xs font-body border border-primary-foreground/10">
                      {product.sku}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-primary-foreground mb-6">{product.name}</h3>
                </div>
                <div className="relative h-56 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-2xl bg-accent/10 blur-[50px] group-hover:bg-accent/20 transition-all duration-700" />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.08, rotateY: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative z-10 w-36 h-44 rounded-xl glass flex flex-col items-center justify-center shadow-xl"
                  >
                    <div className="w-28 h-6 rounded-t-lg bg-forest-deep/60 -mt-3 border border-primary-foreground/10" />
                    <div className="mt-3 text-primary-foreground/40 font-body text-[10px] font-medium tracking-wider uppercase">
                      {product.brands?.name ?? ""}
                    </div>
                    <div className="w-3 h-3 rounded-full bg-accent/30 mt-4" />
                    <div className="mt-auto mb-3 px-3 py-1 bg-forest-deep/40 rounded text-[8px] text-primary-foreground/50 font-body text-center leading-tight">
                      {product.sku}<br />{product.category}
                    </div>
                  </motion.div>
                </div>
                <div className="p-6 pt-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to={`/products/${product.slug}`}>
                      <Button className="w-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground font-body rounded-xl py-5 transition-all duration-300 border border-primary-foreground/10 hover:border-accent/30">
                        View Product
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
