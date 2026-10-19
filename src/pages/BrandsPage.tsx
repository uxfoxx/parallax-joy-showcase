import { useMemo, useRef } from "react";
import Seo from "@/components/Seo";
import { motion, useScroll, useTransform } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import BrandCard from "@/components/BrandCard";
import { useBrands, useProducts } from "@/lib/api";
import { brandProfile } from "@/lib/brands";

const BrandsPage = () => {
  const { data: allBrands = [], isLoading: brandsLoading } = useBrands();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const isLoading = brandsLoading || productsLoading;

  const prodCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of products) if (p.brand_id) m[p.brand_id] = (m[p.brand_id] ?? 0) + 1;
    return m;
  }, [products]);
  // Every brand on one page, so each brand page has a crawlable link from the
  // hub. A brand with no products and no profile is left out: its page is
  // thin and noindex until it has something to show.
  const brands = allBrands.filter((b) => prodCounts[b.id] > 0 || !!brandProfile(b.slug).about?.trim());

  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: contentRef, offset: ["start end", "end start"] });
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["-60px", "60px"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);

  return (
    <PageLayout>
      <Seo
        title="Our Brands: World-Class Food Producers | Olive Foods"
        description="The international food brands Olive Foods imports and represents in Sri Lanka, sourced from world-class growers and producers across Europe, Asia and the Middle East."
        path="/brands"
      />
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

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-[4/5]" />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                {brands.map((brand, i) => (
                  <BrandCard
                    key={brand.id}
                    brand={brand}
                    prodCount={prodCounts[brand.id] ?? 0}
                    index={i}
                    columns={3}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default BrandsPage;
