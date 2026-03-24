import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { brands, getProductsByBrand } from "@/data/products";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

const BrandsPage = () => {
  return (
    <PageLayout>
      {/* Header */}
      <section className="relative overflow-hidden bg-forest-deep py-28 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-deep via-forest-mid/20 to-forest-deep" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6"
          >
            Our Brands
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg text-primary-foreground/70 max-w-2xl mx-auto"
          >
            We partner with world-class producers to bring you the finest food products from around the globe.
          </motion.p>
        </div>
      </section>

      {/* Brand Grid */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {brands.map((brand) => {
              const prodCount = getProductsByBrand(brand.slug).length;
              return (
                <motion.div key={brand.id} variants={item}>
                  <Link to={`/brands/${brand.slug}`} className="block group">
                    <div className="rounded-2xl border border-border bg-card p-8 space-y-5 transition-all duration-300 hover:shadow-xl hover:border-forest-mid/30 h-full">
                      {/* Logo placeholder */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forest-deep/10 to-accent/10 flex items-center justify-center">
                        <span className="font-display text-2xl font-bold text-forest-mid">
                          {brand.name.charAt(0)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-forest-mid transition-colors">
                          {brand.name}
                        </h3>
                        <p className="font-body text-sm text-muted-foreground line-clamp-2">
                          {brand.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {brand.origin}
                        </div>
                        <span className="text-xs font-body text-muted-foreground">
                          {prodCount} product{prodCount !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-body font-medium text-forest-mid group-hover:gap-3 transition-all">
                        View Brand <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default BrandsPage;
