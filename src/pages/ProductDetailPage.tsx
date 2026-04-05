import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Package, MessageCircle } from "lucide-react";
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

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const isHtml = product.description.includes("<");

  return (
    <PageLayout>
      <section className="bg-background/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <nav className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12">
            {/* Left — Image + Thumbnails */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted/50">
                {allImages.length > 0 ? (
                  <img src={allImages[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-muted-foreground/20" />
                  </div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? "border-accent ring-2 ring-accent/30" : "border-border hover:border-accent/50"}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right — Details */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-col">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-3">{product.name}</h1>
              <Link to={`/brands/${brandSlug}`} className="font-body text-sm text-muted-foreground hover:text-forest-mid transition-colors mb-6">by {brandName}</Link>

              {isHtml ? (
                <div
                  className="font-body text-muted-foreground leading-relaxed text-base mb-10 prose prose-sm max-w-none [&_a]:text-forest-mid"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="font-body text-muted-foreground leading-relaxed text-base mb-10">{product.description}</p>
              )}

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

              <div className="flex flex-wrap items-center gap-4 mt-auto">
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
