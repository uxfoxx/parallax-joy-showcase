import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import { useBrand, useProducts } from "@/lib/api";

const BrandDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: brand, isLoading } = useBrand(slug || "");
  const { data: allProducts = [] } = useProducts();
  const brandProducts = brand ? allProducts.filter((p) => p.brand_id === brand.id) : [];

  if (isLoading) return <PageLayout><div className="py-40 text-center font-body text-muted-foreground">Loading...</div></PageLayout>;

  if (!brand) {
    return (
      <PageLayout>
        <div className="py-40 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Brand Not Found</h1>
          <Link to="/brands" className="font-body text-muted-foreground hover:text-foreground underline">← Back to Brands</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <section className="bg-background border-b border-border/40 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase font-body text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/brands" className="hover:text-foreground transition-colors">Brands</Link>
            <span>/</span>
            <span className="text-foreground">{brand.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Brand image */}
            {brand.image_url && (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-[hsl(35,25%,93%)] flex items-center justify-center shrink-0">
                <img src={brand.image_url} alt={brand.name} className="w-full h-full object-contain p-3" />
              </div>
            )}
            <div>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-tight uppercase">
                {brand.name}
              </h1>
              <p className="font-body text-muted-foreground mt-3 max-w-2xl">{brand.description}</p>
              <div className="flex items-center gap-6 mt-4 text-[11px] tracking-[0.1em] uppercase font-body text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {brand.origin}</span>
                {brand.established && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Est. {brand.established}</span>}
                <span>{brandProducts.length} product{brandProducts.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="bg-background py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground">
              Products by {brand.name}
            </h2>
            <Link to="/brands" className="flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> All Brands
            </Link>
          </div>

          {brandProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border/40">
              {brandProducts.map((product) => (
                <div key={product.id} className="bg-background">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-muted-foreground text-center py-16">No products available for this brand yet.</p>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default BrandDetailPage;
