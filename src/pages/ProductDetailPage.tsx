import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Package, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProduct, useProducts, useProductImages } from "@/lib/api";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");
  const { data: allProducts = [] } = useProducts();
  const { data: extraImages = [] } = useProductImages(product?.id || "");
  const [activeImage, setActiveImage] = useState(0);

  const relatedProducts = product
    ? allProducts.filter((p) => p.brand_id === product.brand_id && p.id !== product.id).slice(0, 3)
    : [];

  // Combine main image + extra images
  const allImages = product
    ? [
        ...(product.image_url ? [product.image_url] : []),
        ...extraImages.map((img) => img.image_url),
      ]
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

  const details = [
    { label: "Category", value: product.category },
    { label: "Origin", value: product.origin },
    { label: "SKU", value: product.sku },
    { label: "Brand", value: brandName, link: `/brands/${brandSlug}` },
  ];

  return (
    <PageLayout>
      <section className="bg-background/90 backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] min-h-[calc(100vh-80px)]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative bg-muted/50 flex flex-col items-center justify-center min-h-[400px] lg:min-h-full">
            {allImages.length > 0 ? (
              <>
                <img src={allImages[activeImage]} alt={product.name} className="w-full h-full object-cover absolute inset-0" />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImage((prev) => (prev + 1) % allImages.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeImage ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <Package className="w-24 h-24 text-muted-foreground/20" />
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-20">
            <nav className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
              <span>/</span>
              <span className="text-foreground">{product.category}</span>
            </nav>

            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">{product.name}</h1>
            <Link to={`/brands/${brandSlug}`} className="font-body text-sm text-muted-foreground hover:text-forest-mid transition-colors mb-8">by {brandName}</Link>
            <p className="font-body text-muted-foreground leading-relaxed text-base mb-10">{product.description}</p>

            <div className="space-y-0 mb-10">
              {details.map((d, i) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between py-3">
                    <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">{d.label}</span>
                    {d.link ? (
                      <Link to={d.link} className="font-body text-sm text-foreground hover:text-forest-mid transition-colors">{d.value}</Link>
                    ) : (
                      <span className="font-body text-sm text-foreground">{d.value}</span>
                    )}
                  </div>
                  {i < details.length - 1 && <Separator />}
                </div>
              ))}
            </div>

            {(product.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {(product.tags ?? []).map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-body text-xs">{tag}</Badge>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={`/contact?subject=Product+Inquiry&product=${encodeURIComponent(product.name)}`}
                className="inline-flex items-center gap-2 rounded-lg bg-forest-deep text-primary-foreground px-6 h-11 text-sm font-body font-semibold hover:bg-forest-mid transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Inquire About This Product
              </Link>
              <Link to="/products" className="inline-flex items-center gap-2 text-sm font-body text-forest-mid hover:underline">
                <ArrowLeft className="w-4 h-4" /> Back to all products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-20 bg-background/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-display text-2xl font-bold text-foreground mb-10">More from {brandName}</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} large />)}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default ProductDetailPage;
