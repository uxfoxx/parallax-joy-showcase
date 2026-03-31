import { useState, useMemo } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { useProducts, useBrands, useCategories } from "@/lib/api";

const ProductsPage = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const { data: products = [], isLoading } = useProducts();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  const filtered = useMemo(() => {
    let results = products;
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
  }, [query, selectedCategory, selectedBrand, products]);

  const hasFilters = !!selectedCategory || !!selectedBrand;

  return (
    <PageLayout>
      {/* Header */}
      <section className="bg-background border-b border-border/40 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-tight uppercase">
            All Products
          </h1>
          <p className="font-body text-muted-foreground mt-3 max-w-lg">
            Browse our complete catalog of premium food imports from around the world.
          </p>
        </div>
      </section>

      {/* Filters bar */}
      <section className="bg-background border-b border-border/40 sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="pl-10 h-9 rounded-none border-border bg-background font-body text-sm"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="appearance-none bg-background border border-border px-4 pr-8 h-9 text-sm font-body text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Brand filter */}
          <div className="relative">
            <select
              value={selectedBrand || ""}
              onChange={(e) => setSelectedBrand(e.target.value || null)}
              className="appearance-none bg-background border border-border px-4 pr-8 h-9 text-sm font-body text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug}>{b.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {hasFilters && (
            <button
              onClick={() => { setSelectedCategory(null); setSelectedBrand(null); }}
              className="text-xs font-body text-muted-foreground hover:text-foreground underline"
            >
              Clear filters
            </button>
          )}

          <span className="text-xs font-body text-muted-foreground ml-auto">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-background py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {isLoading ? (
            <p className="text-center font-body text-muted-foreground py-20">Loading products...</p>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border/40">
              {filtered.map((product) => (
                <div key={product.id} className="bg-background">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-foreground mb-2">No products found</p>
              <p className="font-body text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default ProductsPage;
