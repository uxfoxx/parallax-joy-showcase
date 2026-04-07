import { useState, useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts, useBrands, useCategories } from "@/lib/api";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const showOurProducts = searchParams.get("our") === "true";
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: products = [], isLoading } = useProducts();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  const filtered = useMemo(() => {
    let results = showOurProducts ? products.filter((p) => (p as any).our_product) : products;
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brands?.name ?? "").toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags ?? []).some((t) => t.includes(q))
      );
    }
    if (selectedCategory) results = results.filter((p) => p.category === selectedCategory);
    if (selectedBrand) results = results.filter((p) => p.brands?.slug === selectedBrand);
    return results;
  }, [query, selectedCategory, selectedBrand, products, showOurProducts]);

  const hasFilters = !!selectedCategory || !!selectedBrand;

  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: contentRef, offset: ["start end", "end start"] });
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["-60px", "60px"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);

  return (
    <PageLayout>
      {/* Hero */}
      <div data-navbar-theme="dark">
        <section className="relative overflow-hidden py-10 lg:py-14">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <filter id="noiseP"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
              <rect width="100%" height="100%" filter="url(#noiseP)" />
            </svg>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              {showOurProducts ? "Our Products" : "All Products"}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="font-body text-sm text-primary-foreground/70 max-w-xl mx-auto">
              {showOurProducts
                ? "Our curated selection of premium food products for the Sri Lankan market."
                : "Browse our complete catalog of premium food imports from around the world."}
            </motion.p>
          </div>
        </section>
      </div>

      {/* Content */}
      <div data-navbar-theme="light">
        <section ref={contentRef} className="relative py-20 lg:py-28 bg-background/90 backdrop-blur-sm overflow-hidden">
          {/* Parallax orbs */}
          <motion.div
            className="absolute w-[600px] h-[600px] -top-60 -right-40 rounded-full pointer-events-none"
            style={{ y: orb1Y, background: "radial-gradient(circle, hsl(var(--accent) / 0.05), transparent 70%)" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] bottom-10 -left-32 rounded-full pointer-events-none"
            style={{ y: orb2Y, background: "radial-gradient(circle, hsl(var(--forest-mid) / 0.05), transparent 70%)" }}
          />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, brands, categories..." className="pl-12 h-12 rounded-lg font-body text-base border-border bg-card/90" />
                {query && <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>}
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className={`h-12 rounded-lg font-body gap-2 border-border ${showFilters ? "bg-forest-deep text-primary-foreground hover:bg-forest-mid" : ""}`}>
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </Button>
            </motion.div>

            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-8 space-y-4">
                <div>
                  <h4 className="font-body text-sm font-medium text-foreground mb-3">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button key={cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)} className={`px-4 py-2 rounded-xl text-sm font-body transition-all duration-200 border ${selectedCategory === cat.name ? "bg-forest-deep text-primary-foreground border-forest-deep" : "bg-card/90 text-foreground border-border hover:border-forest-mid/30"}`}>{cat.name}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-body text-sm font-medium text-foreground mb-3">Brand</h4>
                  <div className="flex flex-wrap gap-2">
                    {brands.map((b) => (
                      <button key={b.slug} onClick={() => setSelectedBrand(selectedBrand === b.slug ? null : b.slug)} className={`px-4 py-2 rounded-xl text-sm font-body transition-all duration-200 border ${selectedBrand === b.slug ? "bg-forest-deep text-primary-foreground border-forest-deep" : "bg-card/90 text-foreground border-border hover:border-forest-mid/30"}`}>{b.name}</button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {hasFilters && (
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm font-body text-muted-foreground">Active:</span>
                {selectedCategory && <Badge variant="secondary" className="gap-1 font-body cursor-pointer hover:bg-destructive/10" onClick={() => setSelectedCategory(null)}>{selectedCategory} <X className="w-3 h-3" /></Badge>}
                {selectedBrand && <Badge variant="secondary" className="gap-1 font-body cursor-pointer hover:bg-destructive/10" onClick={() => setSelectedBrand(null)}>{brands.find((b) => b.slug === selectedBrand)?.name} <X className="w-3 h-3" /></Badge>}
                <button onClick={() => { setSelectedCategory(null); setSelectedBrand(null); }} className="text-xs font-body text-forest-mid hover:underline ml-2">Clear all</button>
              </div>
            )}

            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-body text-muted-foreground">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>
            </div>

            {isLoading ? (
              <p className="text-center font-body text-muted-foreground py-20">Loading products...</p>
            ) : filtered.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-5">
                {filtered.map((product) => <ProductCard key={product.id} product={product} large />)}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-foreground mb-2">No products found</p>
                <p className="font-body text-muted-foreground">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default ProductsPage;
