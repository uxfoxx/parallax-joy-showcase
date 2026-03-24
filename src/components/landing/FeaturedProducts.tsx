import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const products = [
  { name: "Daily Multivitamin", sku: "DM-02™", tag: "New" },
  { name: "Daily Multivitamin", sku: "DM-02™", tag: "New" },
  { name: "Daily Multivitamin", sku: "DM-02™", tag: "New" },
];

const FeaturedProducts = () => {
  return (
    <section id="products" className="snap-section flex items-center overflow-hidden relative">
      {/* Full animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: `linear-gradient(135deg, #08120A 38%, #194B22 74%, #08120A 85%)`,
        }}
      />

      {/* Decorative animated arc line */}
      <div className="absolute bottom-0 left-0 right-0 h-40 opacity-20">
        <svg viewBox="0 0 1200 160" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M-100,160 Q300,-40 600,80 T1300,40"
            fill="none"
            stroke="hsl(180, 60%, 50%)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-28 w-full">
        {/* Header */}
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

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl overflow-hidden border border-primary-foreground/10 hover:border-primary-foreground/20 hover:shadow-2xl hover:shadow-forest-mid/40 transition-all duration-500 shine-sweep"
            >
              {/* Card inner */}
              <div
                style={{
                  background: `
                    radial-gradient(ellipse at 50% 0%, hsl(140 30% 22% / 0.6) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 100%, hsl(140 35% 18% / 0.4) 0%, transparent 50%),
                    linear-gradient(180deg, hsl(140 40% 14%), hsl(140 45% 11%), hsl(140 40% 13%))
                  `,
                }}
              >
                {/* Top area */}
                <div className="p-6 pb-0">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="px-3 py-1 rounded-full bg-forest-mid/80 text-primary-foreground text-xs font-body font-medium border border-primary-foreground/10">
                      {product.tag}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-forest-mid/50 text-primary-foreground/70 text-xs font-body border border-primary-foreground/10">
                      {product.sku}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-primary-foreground mb-6">
                    {product.name}
                  </h3>
                </div>

                {/* Product image placeholder */}
                <div className="relative h-56 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-2xl bg-forest-mid/40 blur-[50px] group-hover:bg-forest-light/30 transition-all duration-700" />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.08, rotateY: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative z-10 w-36 h-44 rounded-xl bg-gradient-to-b from-forest-mid/60 to-forest-deep/80 border border-primary-foreground/10 flex flex-col items-center justify-center shadow-xl"
                  >
                    <div className="w-28 h-6 rounded-t-lg bg-forest-deep/90 -mt-3 border border-primary-foreground/10" />
                    <div className="mt-3 text-primary-foreground/40 font-body text-[10px] font-medium tracking-wider uppercase">
                      Seed®
                    </div>
                    <div className="w-3 h-3 rounded-full bg-primary-foreground/20 mt-4" />
                    <div className="mt-auto mb-3 px-3 py-1 bg-forest-deep/60 rounded text-[8px] text-primary-foreground/50 font-body text-center leading-tight">
                      DM-02™ DAILY MULTIVITAMIN
                      <br />
                      DIETARY SUPPLEMENT
                    </div>
                  </motion.div>
                </div>

                {/* Shop Now button */}
                <div className="p-6 pt-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground font-body rounded-full py-5 transition-all duration-300 border border-primary-foreground/10 hover:border-primary-foreground/20 group-hover:shadow-lg group-hover:shadow-forest-mid/30">
                      Shop Now
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
