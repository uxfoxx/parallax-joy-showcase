import { useState, useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, X, SlidersHorizontal, Star } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useProducts, useBrands, useCategories } from "@/lib/api";
import type { Product, Brand, Category } from "@/lib/api";

type SortBy = "featured" | "name-asc" | "name-desc";

/* ────────────────────────────────────────────────────────────
   FilterPanel — rendered ONLY inside the Sheet so IDs are
   always unique. Never duplicated in the DOM.
──────────────────────────────────────────────────────────── */
interface FilterPanelProps {
  categories: Category[];
  brands: Brand[];
  allProducts: Product[];
  selectedCategories: string[];
  selectedBrands: string[];
  featuredOnly: boolean;
  onToggleCategory: (name: string) => void;
  onToggleBrand: (slug: string) => void;
  onToggleFeatured: () => void;
  onClearAll: () => void;
  hasFilters: boolean;
  resultCount: number;
  onClose: () => void;
}

const FilterPanel = ({
  categories,
  brands,
  allProducts,
  selectedCategories,
  selectedBrands,
  featuredOnly,
  onToggleCategory,
  onToggleBrand,
  onToggleFeatured,
  onClearAll,
  hasFilters,
  resultCount,
  onClose,
}: FilterPanelProps) => {
  // Product counts based on the FULL unfiltered dataset
  const catCounts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((c) => [c.name, allProducts.filter((p) => p.category === c.name).length])
      ),
    [categories, allProducts]
  );

  const brandCounts = useMemo(
    () =>
      Object.fromEntries(
        brands.map((b) => [b.slug, allProducts.filter((p) => p.brands?.slug === b.slug).length])
      ),
    [brands, allProducts]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <h2 className="font-display text-base font-semibold text-foreground">Filters</h2>
        {hasFilters && (
          <button
            onClick={onClearAll}
            className="font-body text-xs text-accent hover:text-accent/80 transition-colors font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Scrollable filter content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <Accordion type="multiple" defaultValue={["categories", "brands"]} className="space-y-3">
          {/* ── Categories ── */}
          <AccordionItem
            value="categories"
            className="border border-border rounded-xl overflow-hidden bg-card/60"
          >
            <AccordionTrigger className="px-4 py-3 font-body text-sm font-medium text-foreground hover:no-underline hover:bg-muted/40 transition-colors data-[state=open]:border-b data-[state=open]:border-border">
              <span className="flex items-center gap-2">
                Categories
                {selectedCategories.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-semibold flex items-center justify-center">
                    {selectedCategories.length}
                  </span>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-3 pb-4">
              <div className="space-y-3">
                {categories.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.name);
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between cursor-pointer group"
                      onClick={() => onToggleCategory(cat.name)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => onToggleCategory(cat.name)}
                          className="data-[state=checked]:bg-accent data-[state=checked]:border-accent pointer-events-none"
                        />
                        <span
                          className={`font-body text-sm transition-colors ${
                            isChecked ? "text-accent font-medium" : "text-foreground group-hover:text-accent"
                          }`}
                        >
                          {cat.name}
                        </span>
                      </div>
                      <span className="font-body text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                        {catCounts[cat.name] ?? 0}
                      </span>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ── Brands ── */}
          <AccordionItem
            value="brands"
            className="border border-border rounded-xl overflow-hidden bg-card/60"
          >
            <AccordionTrigger className="px-4 py-3 font-body text-sm font-medium text-foreground hover:no-underline hover:bg-muted/40 transition-colors data-[state=open]:border-b data-[state=open]:border-border">
              <span className="flex items-center gap-2">
                Brands
                {selectedBrands.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-semibold flex items-center justify-center">
                    {selectedBrands.length}
                  </span>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-3 pb-4">
              <div className="space-y-3">
                {brands.map((brand) => {
                  const isChecked = selectedBrands.includes(brand.slug);
                  return (
                    <div
                      key={brand.slug}
                      className="flex items-center justify-between cursor-pointer group"
                      onClick={() => onToggleBrand(brand.slug)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => onToggleBrand(brand.slug)}
                          className="data-[state=checked]:bg-accent data-[state=checked]:border-accent pointer-events-none"
                        />
                        <span
                          className={`font-body text-sm transition-colors ${
                            isChecked ? "text-accent font-medium" : "text-foreground group-hover:text-accent"
                          }`}
                        >
                          {brand.name}
                        </span>
                      </div>
                      <span className="font-body text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                        {brandCounts[brand.slug] ?? 0}
                      </span>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* ── Featured Only ── */}
        <div
          className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/60 cursor-pointer group"
          onClick={onToggleFeatured}
        >
          <Label className="flex items-center gap-2.5 font-body text-sm text-foreground cursor-pointer group-hover:text-accent transition-colors pointer-events-none">
            <Star className={`w-4 h-4 ${featuredOnly ? "text-accent fill-accent" : "text-muted-foreground"}`} />
            Featured only
          </Label>
          <Checkbox
            checked={featuredOnly}
            onCheckedChange={onToggleFeatured}
            className="data-[state=checked]:bg-accent data-[state=checked]:border-accent pointer-events-none"
          />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="shrink-0 px-6 py-4 border-t border-border bg-background">
        <Button
          onClick={onClose}
          className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-body font-semibold rounded-xl text-sm transition-all duration-200"
        >
          Show {resultCount} result{resultCount !== 1 ? "s" : ""}
        </Button>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Main Page
──────────────────────────────────────────────────────────── */
const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const showOurProducts = searchParams.get("our") === "true";

  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("featured");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: allProducts = [], isLoading } = useProducts();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  /* ── Toggle helpers ── */
  const toggleCategory = (name: string) =>
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );

  const toggleBrand = (slug: string) =>
    setSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((b) => b !== slug) : [...prev, slug]
    );

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setFeaturedOnly(false);
  };

  const hasFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || featuredOnly;
  const activeFilterCount =
    selectedCategories.length + selectedBrands.length + (featuredOnly ? 1 : 0);

  /* ── Filtering + sorting ── */
  const filtered = useMemo(() => {
    // Start with all products or "our products" subset
    let results: Product[] = showOurProducts
      ? allProducts.filter((p) => (p as any).our_product === true)
      : [...allProducts];

    // Category multi-select
    if (selectedCategories.length > 0)
      results = results.filter((p) => selectedCategories.includes(p.category));

    // Brand multi-select (compare by slug via joined brands object)
    if (selectedBrands.length > 0)
      results = results.filter((p) =>
        p.brands ? selectedBrands.includes(p.brands.slug) : false
      );

    // Featured only
    if (featuredOnly) results = results.filter((p) => p.featured === true);

    // Text search
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brands?.name ?? "").toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    const sorted = [...results];
    if (sortBy === "name-asc") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "name-desc") sorted.sort((a, b) => b.name.localeCompare(a.name));
    else sorted.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));

    return sorted;
  }, [query, selectedCategories, selectedBrands, featuredOnly, sortBy, allProducts, showOurProducts]);

  /* ── Parallax orbs ── */
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: contentRef, offset: ["start end", "end start"] });
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["-60px", "60px"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <div data-navbar-theme="dark">
        <section className="relative overflow-hidden py-10 lg:py-14">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <filter id="noiseP">
                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#noiseP)" />
            </svg>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2"
            >
              {showOurProducts ? "Our Products" : "All Products"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="font-body text-sm text-primary-foreground/70 max-w-xl mx-auto"
            >
              {showOurProducts
                ? "Our curated selection of premium food products for the Sri Lankan market."
                : "Browse our complete catalog of premium food imports from around the world."}
            </motion.p>
          </div>
        </section>
      </div>

      {/* ── Content ── */}
      <div data-navbar-theme="light">
        <section
          ref={contentRef}
          className="relative py-16 lg:py-24 bg-background/90 backdrop-blur-sm overflow-hidden"
        >
          {/* Parallax orbs */}
          <motion.div
            className="absolute w-[600px] h-[600px] -top-60 -right-40 rounded-full pointer-events-none"
            style={{ y: orb1Y, background: "radial-gradient(circle, hsl(var(--accent) / 0.05), transparent 70%)" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] bottom-10 -left-32 rounded-full pointer-events-none"
            style={{ y: orb2Y, background: "radial-gradient(circle, hsl(var(--forest-mid) / 0.05), transparent 70%)" }}
          />

          <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">

            {/* ── Toolbar: Search + Sort + Filters button ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-4"
            >
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, brands, categories…"
                  className="pl-11 h-11 rounded-xl font-body text-sm border-border bg-card/90 focus-visible:ring-accent/30"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                <SelectTrigger className="h-11 w-[150px] rounded-xl font-body text-sm border-border bg-card/90 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured" className="font-body text-sm">Featured</SelectItem>
                  <SelectItem value="name-asc" className="font-body text-sm">Name A → Z</SelectItem>
                  <SelectItem value="name-desc" className="font-body text-sm">Name Z → A</SelectItem>
                </SelectContent>
              </Select>

              {/* Filters button — always visible, opens right Sheet */}
              <Button
                variant="outline"
                onClick={() => setFilterOpen(true)}
                className={`h-11 rounded-xl font-body gap-2 border-border shrink-0 transition-all duration-200 ${
                  hasFilters
                    ? "bg-accent/10 border-accent/40 text-accent hover:bg-accent/15"
                    : "bg-card/90 hover:border-accent/30"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </motion.div>

            {/* ── Active filter chips ── */}
            {hasFilters && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2 mb-5"
              >
                <span className="font-body text-xs text-muted-foreground">Active:</span>
                {selectedCategories.map((c) => (
                  <Badge
                    key={c}
                    variant="secondary"
                    className="gap-1.5 font-body text-xs cursor-pointer bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
                    onClick={() => toggleCategory(c)}
                  >
                    {c}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
                {selectedBrands.map((slug) => {
                  const brand = brands.find((b) => b.slug === slug);
                  return (
                    <Badge
                      key={slug}
                      variant="secondary"
                      className="gap-1.5 font-body text-xs cursor-pointer bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
                      onClick={() => toggleBrand(slug)}
                    >
                      {brand?.name ?? slug}
                      <X className="w-3 h-3" />
                    </Badge>
                  );
                })}
                {featuredOnly && (
                  <Badge
                    variant="secondary"
                    className="gap-1.5 font-body text-xs cursor-pointer bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
                    onClick={() => setFeaturedOnly(false)}
                  >
                    <Star className="w-3 h-3 fill-accent" />
                    Featured
                    <X className="w-3 h-3" />
                  </Badge>
                )}
                <button
                  onClick={clearAll}
                  className="font-body text-xs text-muted-foreground hover:text-accent transition-colors underline-offset-2 hover:underline ml-1"
                >
                  Clear all
                </button>
              </motion.div>
            )}

            {/* ── Result count ── */}
            <div className="flex items-center gap-3 mb-7">
              <p className="font-body text-sm text-muted-foreground shrink-0">
                <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                product{filtered.length !== 1 ? "s" : ""} found
              </p>
              <Separator className="flex-1" />
            </div>

            {/* ── Product Grid ── */}
            {isLoading ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[4/5]" />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <motion.div
                key={`${selectedCategories.sort().join()}-${selectedBrands.sort().join()}-${featuredOnly}-${sortBy}-${query}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="grid sm:grid-cols-2 md:grid-cols-3 gap-5"
              >
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} large />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-24">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="font-display text-xl font-semibold text-foreground mb-2">No products found</p>
                <p className="font-body text-sm text-muted-foreground mb-6">
                  Try adjusting your search or removing some filters.
                </p>
                {hasFilters && (
                  <Button
                    variant="outline"
                    onClick={clearAll}
                    className="font-body text-sm rounded-xl border-border hover:border-accent/40"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── Filter Side Modal ── */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent
          side="right"
          className="w-[320px] sm:w-[380px] p-0 flex flex-col"
        >
          <FilterPanel
            categories={categories}
            brands={brands}
            allProducts={allProducts}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            featuredOnly={featuredOnly}
            onToggleCategory={toggleCategory}
            onToggleBrand={toggleBrand}
            onToggleFeatured={() => setFeaturedOnly((v) => !v)}
            onClearAll={clearAll}
            hasFilters={hasFilters}
            resultCount={filtered.length}
            onClose={() => setFilterOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
};

export default ProductsPage;
