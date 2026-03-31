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
  const { scrollYProgress: sectionProgress } = useScroll();

  // Amplified: Element is at left side during scroll 25-50%, so grid shifts right
  const gridShift = useTransform(scrollYProgress, [0.22, 0.37, 0.52], [0, 100, 0]);
  const gridRotate = useTransform(scrollYProgress, [0.22, 0.37, 0.52], [0, 2, 0]);
  const firstCardScale = useTransform(scrollYProgress, [0.22, 0.37, 0.52], [1, 0.82, 1]);
  const firstCardOpacity = useTransform(scrollYProgress, [0.22, 0.37, 0.52], [1, 0.35, 1]);

  // Parallax background
  const bgY = useTransform(sectionProgress, [0, 1], ["-60px", "60px"]);
  const orbX = useTransform(sectionProgress, [0, 1], ["-30px", "30px"]);

  return (
    <section ref={sectionRef} id="products" className="relative overflow-hidden py-28 lg:py-36">
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

      {/* Parallax decorative elements */}
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ y: bgY }}>
        <motion.div
          className="absolute w-[400px] h-[400px] -top-20 -right-20 rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)",
            x: orbX,
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] -bottom-40 -left-40 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)" }}
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground tracking-tight">Featured Products</h2>
          <p className="text-primary-foreground/50 font-body text-base max-w-sm leading-relaxed">Carefully selected food products sourced from certified international suppliers.</p>
        </motion.div>

         <motion.div
          className="grid md:grid-cols-3 gap-5"
          style={{ x: gridShift, rotate: gridRotate }}
        >
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative rounded-lg overflow-hidden border border-primary-foreground/10 hover:border-primary-foreground/20 hover:shadow-2xl hover:shadow-forest-mid/40 transition-all duration-500"
              style={i === 0 ? { scale: firstCardScale, opacity: firstCardOpacity } : undefined}
            >
              <div style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(140 50% 19% / 0.6) 0%, transparent 60%), linear-gradient(180deg, hsl(140 50% 19%), hsl(150 40% 10%))` }}>
                <div className="p-6 pb-0">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="px-3 py-1 rounded-full bg-forest-mid/80 text-primary-foreground text-xs font-body font-medium border border-primary-foreground/10">{product.featured ? "Featured" : "New"}</span>
                    <span className="px-3 py-1 rounded-full bg-forest-mid/50 text-primary-foreground/70 text-xs font-body border border-primary-foreground/10">{product.sku}</span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-primary-foreground mb-6">{product.name}</h3>
                </div>
                <div className="relative h-56 flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <motion.img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center"><div className="w-40 h-40 rounded-2xl bg-forest-mid/40 blur-[50px] group-hover:bg-forest-light/30 transition-all duration-700" /></div>
                      <div className="relative z-10 w-36 h-44 rounded-xl bg-gradient-to-b from-forest-mid/60 to-forest-deep/80 border border-primary-foreground/10 flex flex-col items-center justify-center shadow-xl">
                        <div className="mt-3 text-primary-foreground/40 font-body text-[10px] font-medium tracking-wider uppercase">{product.brands?.name ?? ""}</div>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6 pt-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to={`/products/${product.slug}`}>
                      <Button className="w-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground font-body rounded-xl py-5 transition-all duration-300 border border-primary-foreground/10 hover:border-primary-foreground/20">View Product</Button>
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
