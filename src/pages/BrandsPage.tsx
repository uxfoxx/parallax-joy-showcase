import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PaginationControls from "@/components/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { useBrands, useProducts } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface BrandCardProps {
  brand: { id: string; name: string; slug: string; image_url?: string | null; description?: string | null; origin?: string | null };
  prodCount: number;
}

const BrandCard = ({ brand, prodCount }: BrandCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link to={`/brands/${brand.slug}`} className="block group">
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-xl overflow-hidden aspect-video shadow-md hover:shadow-2xl transition-shadow duration-500 border border-border"
      >
        {brand.image_url && !imgLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        {brand.image_url ? (
          <img
            src={brand.image_url}
            alt={brand.name}
            onLoad={() => setImgLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06] ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-forest-deep/30 via-forest-mid/20 to-accent/15 flex items-center justify-center">
            <span className="font-display text-6xl font-bold text-forest-mid/25">{brand.name.charAt(0)}</span>
          </div>
        )}

        {/* Shine sweep on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%]"
          style={{ transition: "opacity 0.6s, transform 1s" }}
        />

        {/* Product count badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm font-body text-xs text-foreground border-border shadow-sm">
            {prodCount} product{prodCount !== 1 ? "s" : ""}
          </Badge>
        </div>

        {/* Bottom gradient overlay — always 40%, darkens on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-base font-semibold text-white drop-shadow-md leading-tight">{brand.name}</h3>
          <div className="flex items-center gap-1.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            <MapPin className="w-3 h-3 text-white/60" />
            <span className="text-xs font-body text-white/60">{brand.origin}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const BrandsPage = () => {
  const { data: brands = [], isLoading } = useBrands();
  const { data: products = [] } = useProducts();

  const { currentPage, setCurrentPage, totalPages, paginatedItems } = usePagination(brands, 9);
  const gridRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: contentRef, offset: ["start end", "end start"] });
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["-60px", "60px"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);

  return (
    <PageLayout>
      <div data-navbar-theme="dark">
        <section className="relative overflow-hidden min-h-[280px] flex items-center">
          {/* Animated gradient background */}
          <div
            className="absolute inset-0 animate-gradient-shift"
            style={{
              background: `linear-gradient(135deg, hsl(150 40% 6%), hsl(140 50% 16%), hsl(150 40% 9%), hsl(140 50% 13%))`,
              backgroundSize: "300% 300%",
            }}
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <filter id="noiseB"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
              <rect width="100%" height="100%" filter="url(#noiseB)" />
            </svg>
          </div>
          {/* Decorative orb */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20 lg:py-24">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-body text-xs text-primary-foreground/50 tracking-widest uppercase mb-4"
            >
              Olive Foods / Brands
            </motion.p>
            <div className="flex items-end gap-4 flex-wrap">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight tracking-tight"
              >
                Our Brands
              </motion.h1>
              {brands.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.4, type: "spring" }}
                  className="mb-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 font-body text-xs text-primary-foreground/80 font-medium"
                >
                  {brands.length} global brands
                </motion.span>
              )}
            </div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="font-body text-base text-primary-foreground/70 max-w-xl mt-4 leading-relaxed"
            >
              We partner with world-class producers to bring you the finest food products from around the globe.
            </motion.p>
          </div>
        </section>
      </div>

      <div data-navbar-theme="light">
        <section ref={contentRef} className="relative py-20 lg:py-28 bg-background/90 backdrop-blur-sm overflow-hidden">
          <motion.div
            className="absolute w-[500px] h-[500px] -top-40 -right-40 rounded-full pointer-events-none"
            style={{ y: orb1Y, background: "radial-gradient(circle, hsl(var(--accent) / 0.06), transparent 70%)" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] bottom-20 -left-32 rounded-full pointer-events-none"
            style={{ y: orb2Y, background: "radial-gradient(circle, hsl(var(--forest-mid) / 0.05), transparent 70%)" }}
          />

          <div ref={gridRef} className="max-w-6xl mx-auto px-6 relative z-10">
            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-lg bg-muted animate-pulse aspect-[4/5]" />
                ))}
              </div>
            ) : (
              <>
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="grid md:grid-cols-3 gap-5"
                >
                  {paginatedItems.map((brand) => {
                    const prodCount = products.filter((p) => p.brand_id === brand.id).length;
                    return (
                      <motion.div
                        key={brand.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <BrandCard brand={brand} prodCount={prodCount} />
                      </motion.div>
                    );
                  })}
                </motion.div>
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  scrollTargetRef={gridRef as React.RefObject<HTMLElement>}
                />
              </>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default BrandsPage;
