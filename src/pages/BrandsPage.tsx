import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Package } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useBrands, useProducts } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const BrandsPage = () => {
  const { data: brands = [], isLoading } = useBrands();
  const { data: products = [] } = useProducts();

  return (
    <PageLayout>
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"><svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg"><filter id="noiseB"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#noiseB)" /></svg></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-3">Our Brands</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="font-body text-base text-primary-foreground/70 max-w-xl mx-auto">We partner with world-class producers to bring you the finest food products from around the globe.</motion.p>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          {isLoading ? (
            <p className="text-center font-body text-muted-foreground py-20">Loading brands...</p>
          ) : (
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-3 gap-5">
              {brands.map((brand) => {
                const prodCount = products.filter((p) => p.brand_id === brand.id).length;
                return (
                  <motion.div key={brand.id} variants={item}>
                    <Link to={`/brands/${brand.slug}`} className="block group">
                      <div className="relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg hover:shadow-2xl transition-shadow duration-500 border border-border">
                        {brand.image_url ? (
                          <img src={brand.image_url} alt={brand.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-forest-deep/30 via-forest-mid/20 to-accent/15 flex items-center justify-center">
                            <span className="font-display text-5xl font-bold text-forest-mid/25">{brand.name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]" style={{ transition: "opacity 0.7s, transform 0.9s" }} />
                        <div className="absolute top-3 right-3 z-10">
                          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm font-body text-xs text-foreground border-border shadow-sm">{prodCount} product{prodCount !== 1 ? "s" : ""}</Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
                          <h3 className="font-display text-lg font-semibold text-white drop-shadow-md leading-tight">{brand.name}</h3>
                          <div className="max-h-0 group-hover:max-h-24 overflow-hidden transition-all duration-500 ease-out">
                            <p className="text-white/75 text-sm font-body line-clamp-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{brand.description}</p>
                            <div className="flex items-center gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                              <MapPin className="w-3.5 h-3.5 text-white/60" />
                              <span className="text-xs font-body text-white/60">{brand.origin}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default BrandsPage;
