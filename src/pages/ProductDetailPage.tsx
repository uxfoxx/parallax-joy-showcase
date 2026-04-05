import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Package, MessageCircle, Share2, MapPin, Tag, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useProduct, useProducts, useProductImages } from "@/lib/api";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");
  const { data: allProducts = [] } = useProducts();
  const { data: extraImages = [] } = useProductImages(product?.id || "");
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const navigateLightbox = useCallback((dir: 1 | -1) => {
    if (!product) return;
    const imgs = [
      ...(product.image_url ? [product.image_url] : []),
      ...extraImages.map((img) => img.image_url),
    ];
    setActiveImage((prev) => (prev + dir + imgs.length) % imgs.length);
  }, [product, extraImages]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "ArrowRight") navigateLightbox(1);
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, navigateLightbox]);

  const relatedProducts = product
    ? allProducts.filter((p) => p.brand_id === product.brand_id && p.id !== product.id).slice(0, 4)
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
          <Link to="/products" className="font-body text-accent hover:underline">← Back to Products</Link>
        </div>
      </PageLayout>
    );
  }

  const brandName = product.brands?.name ?? "";
  const brandSlug = product.brands?.slug ?? "";
  const isHtml = product.description.includes("<");

  return (
    <PageLayout>
      <section className="bg-background">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-body text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6 lg:gap-12 items-start">
            {/* Left — Gallery (Sticky) */}
            <div className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)]">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-muted/50 group cursor-zoom-in"
                onClick={() => allImages.length > 0 && setLightboxOpen(true)}
              >
                <AnimatePresence mode="wait">
                  {allImages.length > 0 ? (
                    <motion.img
                      key={activeImage}
                      src={allImages[activeImage]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <motion.div className="w-full h-full flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Package className="w-24 h-24 text-muted-foreground/20" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Thumbnail Carousel */}
              {allImages.length > 1 && (
                <div className="px-6 sm:px-10">
                  <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                    <CarouselContent className="-ml-2">
                      {allImages.map((img, i) => (
                        <CarouselItem key={i} className="pl-2 basis-1/4 sm:basis-1/5">
                          <button
                            onClick={() => setActiveImage(i)}
                            className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? "border-accent ring-2 ring-accent/30" : "border-border hover:border-accent/50"}`}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-background/80 backdrop-blur-sm border-border" />
                    <CarouselNext className="bg-background/80 backdrop-blur-sm border-border" />
                  </Carousel>
                </div>
              )}
            </div>

            {/* Right — Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col"
            >
              {/* Brand Badge */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Link to={`/brands/${brandSlug}`}>
                  <Badge variant="secondary" className="font-body text-xs px-3 py-1 mb-3 hover:bg-secondary/80 transition-colors">
                    <Building2 className="w-3 h-3 mr-1.5" />
                    {brandName}
                  </Badge>
                </Link>
              </motion.div>

              {/* Product Name */}
              <motion.h1
                className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                {product.name}
              </motion.h1>

              {/* Category + Origin Pills */}
              <motion.div
                className="flex flex-wrap gap-2 mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {product.category && (
                  <Badge variant="outline" className="font-body text-xs">
                    <Tag className="w-3 h-3 mr-1.5" />
                    {product.category}
                  </Badge>
                )}
                {product.origin && (
                  <Badge variant="outline" className="font-body text-xs">
                    <MapPin className="w-3 h-3 mr-1.5" />
                    {product.origin}
                  </Badge>
                )}
              </motion.div>

              {/* Description Section */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">About this product</h3>
                {isHtml ? (
                  <div
                    className="font-body text-muted-foreground leading-relaxed text-sm prose prose-sm max-w-none [&_a]:text-accent"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p className="font-body text-muted-foreground leading-relaxed text-sm">{product.description}</p>
                )}
              </motion.div>

              <Separator className="mb-8" />

              {/* Specifications Section */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">Specifications</h3>
                <div className="space-y-0">
                  {[
                    { label: "Category", value: product.category },
                    { label: "Origin", value: product.origin },
                    { label: "SKU", value: product.sku },
                    { label: "Brand", value: brandName, link: `/brands/${brandSlug}` },
                  ].map((d, i, arr) => (
                    <div key={d.label}>
                      <div className="flex items-center justify-between py-3">
                        <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">{d.label}</span>
                        {d.link ? (
                          <Link to={d.link} className="font-body text-sm text-foreground hover:text-accent transition-colors">{d.value}</Link>
                        ) : (
                          <span className="font-body text-sm text-foreground">{d.value}</span>
                        )}
                      </div>
                      {i < arr.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tags Section */}
              {(product.tags ?? []).length > 0 && (
                <>
                  <Separator className="mb-8" />
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <h3 className="font-display text-lg font-semibold text-foreground mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {(product.tags ?? []).map((tag) => (
                        <Badge key={tag} variant="secondary" className="font-body text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}

              <Separator className="mb-8" />

              {/* Inquiry CTA Card */}
              <motion.div
                className="rounded-xl border border-border/50 bg-muted/30 backdrop-blur-sm p-6 space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="font-body text-sm text-muted-foreground">Interested in this product? Get in touch with our team.</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to={`/contact?subject=Product+Inquiry&product=${encodeURIComponent(product.name)}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-5 h-10 text-sm font-body font-semibold hover:bg-accent/90 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Inquire Now
                  </Link>
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 backdrop-blur-sm px-4 h-10 text-sm font-body text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </motion.div>

              {/* Back link */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
              >
                <Link to="/products" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to all products
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <h2 className="font-display text-2xl font-bold text-foreground">More from {brandName}</h2>
                <div className="hidden sm:block h-px w-20 bg-border" />
              </div>
              <Link
                to={`/brands/${brandSlug}`}
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} large />)}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-[95vh] p-0 border-none bg-black/95 backdrop-blur-xl [&>button]:text-white [&>button]:hover:text-white/80">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox(-1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateLightbox(1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center w-full px-16 py-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={allImages[activeImage]}
                  alt={product?.name}
                  className="max-w-full max-h-full object-contain"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 pb-4 px-4">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      i === activeImage ? "border-white ring-2 ring-white/30" : "border-white/20 hover:border-white/50 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Counter */}
            <div className="absolute top-4 left-4 text-white/60 text-sm font-body">
              {activeImage + 1} / {allImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ProductDetailPage;
