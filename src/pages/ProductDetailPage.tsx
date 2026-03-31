import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Tag, MapPin, Package } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { useProduct, useProducts } from "@/lib/api";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");
  const { data: allProducts = [] } = useProducts();
  const relatedProducts = product
    ? allProducts.filter((p) => p.brand_id === product.brand_id && p.id !== product.id).slice(0, 3)
    : [];

  if (isLoading) return <PageLayout><div className="py-40 text-center font-body text-muted-foreground">Loading...</div></PageLayout>;

  if (!product) {
    return (
      <PageLayout>
        <div className="py-40 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/products" className="font-body text-forest-mid hover:underline">← Back to Products</Link>
        </div>
      </PageLayout>
    );
  }

  const brandName = product.brands?.name ?? "";
  const brandSlug = product.brands?.slug ?? "";

  return (
    <PageLayout>
      <section className="py-12 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm font-body text-muted-foreground mb-10">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
            <Link to="/products" className="hover:text-foreground transition-colors">Products</Link><span>/</span>
            <span className="text-foreground">{product.name}</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl overflow-hidden aspect-square bg-gradient-to-br from-forest-deep/10 via-forest-mid/5 to-accent/10 flex items-center justify-center">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-20 h-20 text-forest-mid/20" />
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 flex flex-col justify-center">
              <div className="space-y-3">
                <Badge variant="outline" className="font-body text-xs border-border text-foreground">{product.category}</Badge>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{product.name}</h1>
                <Link to={`/brands/${brandSlug}`} className="inline-block font-body text-forest-mid font-medium hover:underline">by {brandName}</Link>
              </div>
              <p className="font-body text-muted-foreground leading-relaxed text-lg">{product.description}</p>
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-sm font-body"><MapPin className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Origin:</span><span className="text-foreground font-medium">{product.origin}</span></div>
                <div className="flex items-center gap-3 text-sm font-body"><Package className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">SKU:</span><span className="text-foreground font-medium">{product.sku}</span></div>
                <div className="flex items-center gap-3 text-sm font-body">
                  <Tag className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground">Tags:</span>
                  <div className="flex flex-wrap gap-1.5">{(product.tags ?? []).map((tag) => <Badge key={tag} variant="secondary" className="font-body text-xs">{tag}</Badge>)}</div>
                </div>
              </div>
              <div className="pt-4"><Link to="/products" className="inline-flex items-center gap-2 text-sm font-body text-forest-mid hover:underline"><ArrowLeft className="w-4 h-4" /> Back to all products</Link></div>
            </motion.div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-display text-2xl font-bold text-foreground mb-10">More from {brandName}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">{relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default ProductDetailPage;
