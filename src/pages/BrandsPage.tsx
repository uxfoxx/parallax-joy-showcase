import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
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
      <PageHero
        eyebrow="Olive Foods / Brands"
        title={<>The <span className="text-gradient-gold italic">makers</span> behind our shelves.</>}
        subtitle="We partner with world-class producers to bring the finest food products from around the globe."
      >
        {brands.length > 0 && (
          <span className="inline-block px-3 py-1.5 rounded-full bg-white/5 border border-white/15 font-body text-xs text-white/75 font-medium">
            {brands.length} global brands
          </span>
        )}
      </PageHero>

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
