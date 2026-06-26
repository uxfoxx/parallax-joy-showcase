import { useState, useMemo, useRef, useEffect } from "react";
import Seo from "@/components/Seo";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, X, SlidersHorizontal, Star } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import PageHero from "@/components/PageHero";
import PaginationControls from "@/components/PaginationControls";
import { usePagination } from "@/hooks/usePagination";
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
import ProductQuickView from "@/components/ProductQuickView";
import FilterBar, { type FilterDef } from "@/components/products/FilterBar";
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
      <Seo
        title="Products: Premium Imported Food for Sri Lanka's Trade"
        description="Browse Olive Foods' range of globally sourced food products: frozen foods, dairy, grocery staples, edible oils and specialty imports, supplied to hotels, restaurants and supermarkets across Sri Lanka."
        path="/products"
      />
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
          className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-body font-semibold rounded-lg text-sm transition-all duration-200"
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
  const categoryParam = searchParams.get("category");
  const brandParam = searchParams.get("brand");
  const featuredParam = searchParams.get("featured") === "true";
  const ourParam = searchParams.get("our") === "true";

  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    brandParam ? [brandParam] : []
  );
  const [featuredOnly, setFeaturedOnly] = useState(featuredParam);
  const [ourOnly, setOurOnly] = useState(ourParam);
  const [sortBy, setSortBy] = useState<SortBy>("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // The URL is the source of truth for filters — re-sync when the query string
  // changes (deep-links + navbar mega-menu activate filters without remounting).
  // Scoped per-param so manual chip changes (which don't touch the URL) survive.
  useEffect(() => {
    setSelectedCategories(categoryParam ? [categoryParam] : []);
  }, [categoryParam]);
  useEffect(() => {
    setSelectedBrands(brandParam ? [brandParam] : []);
  }, [brandParam]);
  useEffect(() => {
    setFeaturedOnly(featuredParam);
  }, [featuredParam]);
  useEffect(() => {
    setOurOnly(ourParam);
  }, [ourParam]);

  const { data: allProducts = [], isLoading } = useProducts();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setFeaturedOnly(false);
    setOurOnly(false);
  };

  const hasFilters =
    selectedCategories.length > 0 || selectedBrands.length > 0 || featuredOnly || ourOnly;
  const activeFilterCount =
    selectedCategories.length + selectedBrands.length + (featuredOnly ? 1 : 0) + (ourOnly ? 1 : 0);

  /* ── Filter chip definitions for the FilterBar ── */
  const filterDefs: FilterDef[] = [
    {
      id: "category",
      label: "Category",
      searchable: true,
      options: categories.map((c) => ({ value: c.name, label: c.name })),
      selected: selectedCategories,
      onApply: setSelectedCategories,
    },
    {
      id: "brand",
      label: "Brand",
      searchable: true,
      options: brands.map((b) => ({ value: b.slug, label: b.name })),
      selected: selectedBrands,
      onApply: setSelectedBrands,
    },
    {
      id: "type",
      label: "Type",
      options: [
        { value: "featured", label: "Featured" },
        { value: "our", label: "Our products" },
      ],
      selected: [...(featuredOnly ? ["featured"] : []), ...(ourOnly ? ["our"] : [])],
      onApply: (vals) => {
        setFeaturedOnly(vals.includes("featured"));
        setOurOnly(vals.includes("our"));
      },
    },
  ];

  /* ── Filtering + sorting ── */
  const filtered = useMemo(() => {
    // Start with all products or "our products" subset
    let results: Product[] = ourOnly
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
  }, [query, selectedCategories, selectedBrands, featuredOnly, ourOnly, sortBy, allProducts]);

  /* ── Pagination ── */
  const { currentPage, setCurrentPage, totalPages, paginatedItems, startIndex, endIndex, totalItems } =
    usePagination(filtered, 12);
  const gridRef = useRef<HTMLDivElement>(null);

  /* ── Parallax orbs ── */
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: contentRef, offset: ["start end", "end start"] });
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["-60px", "60px"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);

  return (
    <PageLayout>
      <PageHero
        eyebrow={`Olive Foods / ${ourParam ? "Our Products" : "All Products"}`}
        title={
          ourParam
            ? (<>Our <span className="text-gradient-gold italic">curated</span> selection.</>)
            : (<>Every <span className="text-gradient-gold italic">import</span>, one catalogue.</>)
        }
        subtitle={
          ourParam
            ? "The range we source and distribute ourselves, quality lines built for the Sri Lankan market."
            : "Browse the complete catalogue of premium food imports from our supplier network across the world."
        }
        subheading
      />

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

            </motion.div>

            {/* ── Filter chip bar (Stripe-style) ── */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5"
            >
              <FilterBar filters={filterDefs} onClearAll={clearAll} />
            </motion.div>

            {/* ── Result count ── */}
            <div ref={gridRef} className="flex items-center gap-3 mb-7">
              <p className="font-body text-sm text-muted-foreground shrink-0">
                {totalItems > 0 ? (
                  <>Showing <span className="font-semibold text-foreground">{startIndex + 1}–{endIndex}</span> of <span className="font-semibold text-foreground">{totalItems}</span> products</>
                ) : (
                  <span className="font-semibold text-foreground">0</span>
                )}{" "}
                {totalItems === 0 ? "products found" : ""}
              </p>
              <Separator className="flex-1" />
            </div>

            {/* ── Product Grid ── */}
            {isLoading ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[4/5]" />
                ))}
              </div>
            ) : paginatedItems.length > 0 ? (
              <>
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3"
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

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => { if (!open) setQuickViewProduct(null); }}
      />
    </PageLayout>
  );
};

export default ProductsPage;
