import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Tag, MapPin, Package } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import { useProduct, useProducts } from "@/lib/api";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");
  const { data: allProducts = [] } = useProducts();
  const relatedProducts = product
    ? allProducts.filter((p) => p.brand_id === product.brand_id && p.id !== product.id).slice(0, 4)
    : [];

  if (isLoading) return <PageLayout><div className="py-40 text-center font-body text-muted-foreground">Loading...</div></PageLayout>;

  if (!product) {
    return (
      <PageLayout>
        <div className="py-40 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/products" className="font-body text-muted-foreground hover:text-foreground underline">← Back to Products</Link>
        </div>
      </PageLayout>
    );
  }

  const brandName = product.brands?.name ?? "";
  const brandSlug = product.brands?.slug ?? "";

  return (
    <PageLayout>
      <section className="bg-background py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase font-body text-muted-foreground mb-10">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image */}
            <div className="aspect-square bg-[hsl(35,25%,93%)] flex items-center justify-center">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-10" />
              ) : (
                <Package className="w-20 h-20 text-muted-foreground/15" />
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-body mb-3">
                  {product.category}
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">
                  {product.name}
                </h1>
                <Link
                  to={`/brands/${brandSlug}`}
                  className="inline-block font-body text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
                >
                  by {brandName}
                </Link>
              </div>

              <p className="font-body text-muted-foreground leading-relaxed">{product.description}</p>

              <div className="space-y-3 pt-4 border-t border-border/40">
                <div className="flex items-center gap-3 text-sm font-body">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Origin</span>
                  <span className="text-foreground ml-auto">{product.origin}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-body border-t border-border/20 pt-3">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">SKU</span>
                  <span className="text-foreground ml-auto font-mono text-xs">{product.sku}</span>
                </div>
                {(product.tags ?? []).length > 0 && (
                  <div className="flex items-start gap-3 text-sm font-body border-t border-border/20 pt-3">
                    <Tag className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">Tags</span>
                    <div className="flex flex-wrap gap-2 ml-auto">
                      {(product.tags ?? []).map((tag) => (
                        <span key={tag} className="text-[11px] tracking-wide uppercase text-muted-foreground border border-border/40 px-2 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Link to="/products" className="inline-flex items-center gap-2 text-xs tracking-[0.1em] uppercase font-body text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> All products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="bg-background border-t border-border/40 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-8">
              More from {brandName}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border/40">
              {relatedProducts.map((p) => (
                <div key={p.id} className="bg-background">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default ProductDetailPage;
