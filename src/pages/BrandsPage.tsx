import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import PaginationControls from "@/components/PaginationControls";
import BrandCard from "@/components/BrandCard";
import { usePagination } from "@/hooks/usePagination";
import { useBrands, useProducts } from "@/lib/api";

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
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-[4/5]" />
                ))}
              </div>
            ) : (
              <>
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
                >
                  {paginatedItems.map((brand, i) => {
                    const prodCount = products.filter((p) => p.brand_id === brand.id).length;
                    return (
                      <BrandCard
                        key={brand.id}
                        brand={brand}
                        prodCount={prodCount}
                        index={i}
                        columns={3}
                      />
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
