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

type SortBy = "featured" | "name-asc" | "name-desc";

/* ─── Filter Panel (shared between sidebar + mobile Sheet) ─── */
interface FilterPanelProps {
  categories: { id: string; name: string }[];
  brands: { slug: string; name: string }[];
  products: { category: string; brands?: { slug?: string } | null; featured?: boolean }[];
  selectedCategories: string[];
  selectedBrands: string[];
  featuredOnly: boolean;
  onToggleCategory: (name: string) => void;
  onToggleBrand: (slug: string) => void;
  onToggleFeatured: () => void;
  onClearAll: () => void;
  hasFilters: boolean;
}

const FilterPanel = ({
  categories,
  brands,
  products,
  selectedCategories,
  selectedBrands,
  featuredOnly,
  onToggleCategory,
  onToggleBrand,
  onToggleFeatured,
  onClearAll,
  hasFilters,
}: FilterPanelProps) => {
  // Counts from full unfiltered dataset
  const catCounts = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.name, products.filter((p) => p.category === c.name).length])),
    [categories, products]
  );
  const brandCounts = useMemo(
    () => Object.fromEntries(brands.map((b) => [b.slug, products.filter((p) => p.brands?.slug === b.slug).length])),
    [brands, products]
  );

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pb-3">
        <span className="font-display text-sm font-semibold text-foreground tracking-wide">Filters</span>
        {hasFilters && (
          <button
            onClick={onClearAll}
            className="text-xs font-body text-accent hover:text-accent/80 transition-colors font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["categories", "brands"]} className="w-full space-y-1">
        {/* Categories */}
        <AccordionItem value="categories" className="border border-border rounded-lg overflow-hidden bg-card">
          <AccordionTrigger className="px-4 py-3 font-body text-sm font-medium text-foreground hover:no-underline hover:bg-muted/40 transition-colors [&[data-state=open]]:border-b [&[data-state=open]]:border-border">
            Categories
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-3 pb-4">
            <div className="space-y-2.5">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id={`cat-${cat.id}`}
                      checked={selectedCategories.includes(cat.name)}
                      onCheckedChange={() => onToggleCategory(cat.name)}
                      className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <Label
                      htmlFor={`cat-${cat.id}`}
                      className="font-body text-sm text-foreground cursor-pointer group-hover:text-accent transition-colors"
                    >
                      {cat.name}
                    </Label>
                  </div>
                  <span className="font-body text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-full">
                    {catCounts[cat.name] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brands" className="border border-border rounded-lg overflow-hidden bg-card">
          <AccordionTrigger className="px-4 py-3 font-body text-sm font-medium text-foreground hover:no-underline hover:bg-muted/40 transition-colors [&[data-state=open]]:border-b [&[data-state=open]]:border-border">
            Brands
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-3 pb-4">
            <div className="space-y-2.5">
              {brands.map((brand) => (
                <div key={brand.slug} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id={`brand-${brand.slug}`}
                      checked={selectedBrands.includes(brand.slug)}
                      onCheckedChange={() => onToggleBrand(brand.slug)}
                      className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <Label
                      htmlFor={`brand-${brand.slug}`}
                      className="font-body text-sm text-foreground cursor-pointer group-hover:text-accent transition-colors"
                    >
                      {brand.name}
                    </Label>
                  </div>
                  <span className="font-body text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-full">
                    {brandCounts[brand.slug] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Featured only */}
      <div className="flex items-center gap-2.5 px-1 pt-3 pb-1">
        <Checkbox
          id="featured-only"
          checked={featuredOnly}
          onCheckedChange={onToggleFeatured}
          className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
        />
        <Label htmlFor="featured-only" className="flex items-center gap-1.5 font-body text-sm text-foreground cursor-pointer">
          <Star className="w-3.5 h-3.5 text-accent" />
          Featured only
        </Label>
      </div>
    </div>
  );
};

/* ─── Main Page ─── */
const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const showOurProducts = searchParams.get("our") === "true";

  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("featured");
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  const { data: products = [], isLoading } = useProducts();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  // Toggle helpers
  const toggleCategory = (name: string) =>
    setSelectedCategories((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]));

  const toggleBrand = (slug: string) =>
    setSelectedBrands((prev) => (prev.includes(slug) ? prev.filter((b) => b !== slug) : [...prev, slug]));

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setFeaturedOnly(false);
  };

  const hasFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || featuredOnly;
  const activeFilterCount = selectedCategories.length + selectedBrands.length + (featuredOnly ? 1 : 0);

  const filtered = useMemo(() => {
    let results = showOurProducts ? products.filter((p) => (p as any).our_product) : [...products];

    if (selectedCategories.length > 0)
      results = results.filter((p) => selectedCategories.includes(p.category));

    if (selectedBrands.length > 0)
      results = results.filter((p) => selectedBrands.includes(p.brands?.slug ?? ""));

    if (featuredOnly)
      results = results.filter((p) => p.featured);

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

    if (sortBy === "name-asc") results = [...results].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "name-desc") results = [...results].sort((a, b) => b.name.localeCompare(a.name));
    else results = [...results].sort((a, b) => Number(b.featured) - Number(a.featured));

    return results;
  }, [query, selectedCategories, selectedBrands, featuredOnly, sortBy, products, showOurProducts]);

  // Parallax orbs
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: contentRef, offset: ["start end", "end start"] });
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["-60px", "60px"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);

  const filterPanelProps = {
    categories,
    brands,
    products,
    selectedCategories,
    selectedBrands,
    featuredOnly,
    onToggleCategory: toggleCategory,
    onToggleBrand: toggleBrand,
    onToggleFeatured: () => setFeaturedOnly((v) => !v),
    onClearAll: clearAll,
    hasFilters,
  };

  return (
    <PageLayout>
      {/* Hero */}
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

      {/* Content */}
      <div data-navbar-theme="light">
        <section ref={contentRef} className="relative py-16 lg:py-24 bg-background/90 backdrop-blur-sm overflow-hidden">
          {/* Parallax orbs */}
          <motion.div
            className="absolute w-[600px] h-[600px] -top-60 -right-40 rounded-full pointer-events-none"
            style={{ y: orb1Y, background: "radial-gradient(circle, hsl(var(--accent) / 0.05), transparent 70%)" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] bottom-10 -left-32 rounded-full pointer-events-none"
            style={{ y: orb2Y, background: "radial-gradient(circle, hsl(var(--forest-mid) / 0.05), transparent 70%)" }}
          />

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">

              {/* ── Desktop Sidebar ── */}
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <FilterPanel {...filterPanelProps} />
                </div>
              </aside>

              {/* ── Main Content ── */}
              <div className="min-w-0">
                {/* Search + Sort row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-4"
                >
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search products, brands, categories..."
                      className="pl-11 h-11 rounded-lg font-body text-sm border-border bg-card/90 focus-visible:ring-accent/30"
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
                    <SelectTrigger className="h-11 w-[160px] rounded-lg font-body text-sm border-border bg-card/90 shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured" className="font-body text-sm">Featured</SelectItem>
                      <SelectItem value="name-asc" className="font-body text-sm">Name A → Z</SelectItem>
                      <SelectItem value="name-desc" className="font-body text-sm">Name Z → A</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Mobile filters button */}
                  <Button
                    variant="outline"
                    onClick={() => setShowFilterSheet(true)}
                    className="lg:hidden h-11 rounded-lg font-body gap-2 border-border shrink-0"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-semibold">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </motion.div>

                {/* Active filter chips */}
                {hasFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap items-center gap-2 mb-5"
                  >
                    <span className="font-body text-xs text-muted-foreground">Active:</span>
                    {selectedCategories.map((c) => (
                      <Badge
                        key={c}
                        variant="secondary"
                        className="gap-1 font-body text-xs cursor-pointer hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-colors border border-transparent"
                        onClick={() => toggleCategory(c)}
                      >
                        {c} <X className="w-3 h-3" />
                      </Badge>
                    ))}
                    {selectedBrands.map((slug) => {
                      const brand = brands.find((b) => b.slug === slug);
                      return (
                        <Badge
                          key={slug}
                          variant="secondary"
                          className="gap-1 font-body text-xs cursor-pointer hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-colors border border-transparent"
                          onClick={() => toggleBrand(slug)}
                        >
                          {brand?.name ?? slug} <X className="w-3 h-3" />
                        </Badge>
                      );
                    })}
                    {featuredOnly && (
                      <Badge
                        variant="secondary"
                        className="gap-1 font-body text-xs cursor-pointer hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-colors border border-transparent"
                        onClick={() => setFeaturedOnly(false)}
                      >
                        <Star className="w-3 h-3" /> Featured <X className="w-3 h-3" />
                      </Badge>
                    )}
                    <button onClick={clearAll} className="text-xs font-body text-muted-foreground hover:text-accent transition-colors ml-1">
                      Clear all
                    </button>
                  </motion.div>
                )}

                {/* Result count + divider */}
                <div className="flex items-center gap-3 mb-7">
                  <p className="font-body text-sm text-muted-foreground shrink-0">
                    <span className="font-semibold text-foreground">{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""} found
                  </p>
                  <Separator className="flex-1" />
                </div>

                {/* Product grid */}
                {isLoading ? (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="rounded-lg bg-muted animate-pulse aspect-[4/5]" />
                    ))}
                  </div>
                ) : filtered.length > 0 ? (
                  <motion.div
                    key={`${selectedCategories.join()}-${selectedBrands.join()}-${featuredOnly}-${sortBy}-${query}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="grid md:grid-cols-2 xl:grid-cols-3 gap-5"
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
                    <p className="font-display text-xl text-foreground mb-2">No products found</p>
                    <p className="font-body text-sm text-muted-foreground mb-6">Try adjusting your search or filters.</p>
                    {hasFilters && (
                      <Button variant="outline" onClick={clearAll} className="font-body text-sm rounded-lg border-border">
                        Clear filters
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Mobile Filter Sheet ── */}
      <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl flex flex-col overflow-hidden">
          <SheetHeader className="shrink-0 pb-4 border-b border-border">
            <SheetTitle className="font-display text-base font-semibold text-foreground">Filters</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4">
            <FilterPanel {...filterPanelProps} />
          </div>

          {/* Footer CTA */}
          <div className="shrink-0 pt-4 border-t border-border">
            <Button
              onClick={() => setShowFilterSheet(false)}
              className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-body font-semibold rounded-lg text-sm"
            >
              Show {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
};

export default ProductsPage;
