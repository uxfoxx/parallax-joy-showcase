import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, MessageCircle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import ProductQuickView from "@/components/ProductQuickView";
import PaginationControls from "@/components/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
import { useBrand, useProducts } from "@/lib/api";
import type { Product } from "@/lib/api";

const BrandDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: brand, isLoading } = useBrand(slug || "");
  const { data: allProducts = [] } = useProducts();
  const brandProducts = brand ? allProducts.filter((p) => p.brand_id === brand.id) : [];

  const { currentPage, setCurrentPage, totalPages, paginatedItems } = usePagination(brandProducts, 12);
  const gridRef = useRef<HTMLDivElement>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (isLoading) return <PageLayout><div className="py-40 text-center font-body text-muted-foreground">Loading...</div></PageLayout>;

  if (!brand) {
    return (
      <PageLayout>
        <div className="py-40 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Brand Not Found</h1>
          <Link to="/brands" className="font-body text-forest-mid hover:underline">← Back to Brands</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHero
        eyebrow={`Brands / ${brand.name}`}
        title={<span className="text-gradient-gold italic">{brand.name}</span>}
        subtitle={brand.description ?? undefined}
      >
        <div className="flex flex-wrap items-center gap-4">
          {brand.origin && (
            <span className="inline-flex items-center gap-1.5 text-sm font-body text-white/65">
              <MapPin className="w-4 h-4" /> {brand.origin}
            </span>
          )}
          {brand.established && (
            <span className="inline-flex items-center gap-1.5 text-sm font-body text-white/65">
              <Calendar className="w-4 h-4" /> Est. {brand.established}
            </span>
          )}
          <Link
            to={`/contact?subject=Brand+Inquiry&brand=${encodeURIComponent(brand.name)}`}
            className="inline-flex items-center gap-2 rounded-full bg-accent text-white px-6 h-11 text-sm font-body font-semibold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/25"
          >
            <MessageCircle className="w-4 h-4" /> Inquire About This Brand
          </Link>
        </div>
      </PageHero>

      <section className="py-20 lg:py-28 bg-background/90 backdrop-blur-sm">
        <div ref={gridRef} className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Products by {brand.name}</h2>
            <Link to="/brands" className="flex items-center gap-2 text-sm font-body text-forest-mid hover:underline"><ArrowLeft className="w-4 h-4" /> All Brands</Link>
          </div>
          {paginatedItems.length > 0 ? (
            <>
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="grid md:grid-cols-3 gap-5"
              >
                {paginatedItems.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    columns={3}
                    onQuickView={() => setQuickViewProduct(product)}
                  />
                ))}
              </motion.div>
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                scrollTargetRef={gridRef as React.RefObject<HTMLElement>}
              />
            </>
          ) : (
            <p className="font-body text-muted-foreground text-center py-16">No products available for this brand yet.</p>
          )}
        </div>
      </section>

      <ProductQuickView
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => { if (!open) setQuickViewProduct(null); }}
      />
    </PageLayout>
  );
};

export default BrandDetailPage;
