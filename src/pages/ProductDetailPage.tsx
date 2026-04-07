import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Package, MessageCircle, Share2, MapPin, Tag, Building2, ChevronLeft, ChevronRight, Sparkles, Box, Globe, Hash } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useProduct, useProducts, useProductImages } from "@/lib/api";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");
  const { data: allProducts = [] } = useProducts();
  const { data: extraImages = [] } = useProductImages(product?.id || "");
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

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

  const specs = [
    { icon: Tag, label: "Category", value: product.category },
    { icon: Globe, label: "Origin", value: product.origin },
    { icon: Hash, label: "SKU", value: product.sku },
    { icon: Building2, label: "Brand", value: brandName, link: `/brands/${brandSlug}` },
  ];

  return (
    <PageLayout>
      {/* Category Hero Bar */}
      <motion.div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, hsl(140 50% 14%), hsl(150 40% 10%))`,
        }}
      >
        <motion.div className="absolute inset-0 opacity-[0.06]" style={{ y: parallaxY }}>
          <div className="absolute w-[500px] h-[500px] -top-60 -right-40 rounded-full" style={{ background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)" }} />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <motion.nav
            className="flex items-center gap-2 text-xs font-body text-primary-foreground/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
            <span className="text-primary-foreground/50">/</span>
            <Link to="/products" className="hover:text-primary-foreground transition-colors">Products</Link>
            <span className="text-primary-foreground/50">/</span>
            <span className="text-primary-foreground/80">{product.name}</span>
          </motion.nav>
        </div>
      </motion.div>

      <section className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6 lg:gap-14 items-start">
            {/* Left — Gallery (Sticky) */}
            <div className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)]">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-muted/50 group cursor-zoom-in border border-border/50"
                onClick={() => allImages.length > 0 && setLightboxOpen(true)}
              >
                <AnimatePresence mode="wait">
                  {allImages.length > 0 ? (
                    <motion.img
                      key={activeImage}
                      src={allImages[activeImage]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.08]"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  ) : (
                    <motion.div className="w-full h-full flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Package className="w-24 h-24 text-muted-foreground/20" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Zoom hint */}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-foreground/60 backdrop-blur-md text-background text-[10px] font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click to zoom
                </div>
              </motion.div>

              {/* Thumbnail Carousel */}
              {allImages.length > 1 && (
                <motion.div
                  className="px-6 sm:px-10"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                    <CarouselContent className="-ml-2">
                      {allImages.map((img, i) => (
                        <CarouselItem key={i} className="pl-2 basis-1/4 sm:basis-1/5">
                          <button
                            onClick={() => setActiveImage(i)}
                            className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${i === activeImage ? "border-accent ring-2 ring-accent/30 scale-105" : "border-border hover:border-accent/50 opacity-70 hover:opacity-100"}`}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-background/80 backdrop-blur-sm border-border" />
                    <CarouselNext className="bg-background/80 backdrop-blur-sm border-border" />
                  </Carousel>
                </motion.div>
              )}
            </div>

            {/* Right — Details */}
            <motion.div
              className="flex flex-col"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {/* Brand Badge */}
              <motion.div variants={fadeUp}>
                <Link to={`/brands/${brandSlug}`}>
                  <Badge variant="secondary" className="font-body text-xs px-3 py-1.5 mb-4 hover:bg-secondary/80 transition-colors inline-flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" />
                    {brandName}
                  </Badge>
                </Link>
              </motion.div>

              {/* Product Name */}
              <motion.h1
                className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-2"
                variants={fadeUp}
              >
                {product.name}
              </motion.h1>

              {/* Accent line */}
              <motion.div
                className="h-1 w-16 rounded-full bg-accent mb-6"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 64, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Category + Origin Pills */}
              <motion.div className="flex flex-wrap gap-2 mb-8" variants={fadeUp}>
                {product.category && (
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Badge variant="outline" className="font-body text-xs px-3 py-1.5">
                      <Tag className="w-3 h-3 mr-1.5" />
                      {product.category}
                    </Badge>
                  </motion.div>
                )}
                {product.origin && (
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Badge variant="outline" className="font-body text-xs px-3 py-1.5">
                      <MapPin className="w-3 h-3 mr-1.5" />
                      {product.origin}
                    </Badge>
                  </motion.div>
                )}
                {product.featured && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Badge className="font-body text-xs px-3 py-1.5 bg-accent/10 text-accent border-accent/20">
                      <Sparkles className="w-3 h-3 mr-1.5" />
                      Featured
                    </Badge>
                  </motion.div>
                )}
              </motion.div>

              {/* Description Section */}
              <motion.div className="mb-8" variants={fadeUp}>
                <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Box className="w-4 h-4 text-accent" />
                  About this product
                </h3>
                {isHtml ? (
                  <div
                    className="font-body text-muted-foreground leading-relaxed text-sm prose prose-sm max-w-none [&_a]:text-accent"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p className="font-body text-muted-foreground leading-relaxed text-sm">{product.description}</p>
                )}
              </motion.div>

              <motion.div variants={fadeUp}>
                <Separator className="mb-8" />
              </motion.div>

              {/* Specifications Section */}
              <motion.div className="mb-8" variants={fadeUp}>
                <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-accent" />
                  Specifications
                </h3>
                <div className="rounded-xl border border-border overflow-hidden">
                  {specs.map((d, i) => (
                    <motion.div
                      key={d.label}
                      className={`flex items-center justify-between px-5 py-4 ${i % 2 === 0 ? "bg-muted/30" : "bg-background"}`}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                    >
                      <span className="font-body text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <d.icon className="w-3.5 h-3.5" />
                        {d.label}
                      </span>
                      {d.link ? (
                        <Link to={d.link} className="font-body text-sm text-foreground hover:text-accent transition-colors font-medium">{d.value}</Link>
                      ) : (
                        <span className="font-body text-sm text-foreground font-medium">{d.value}</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Tags Section */}
              {(product.tags ?? []).length > 0 && (
                <motion.div className="mb-8" variants={fadeUp}>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    Product Highlights
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(product.tags ?? []).map((tag, i) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.05, type: "spring", stiffness: 300 }}
                      >
                        <Badge variant="secondary" className="font-body text-xs px-3 py-1.5 hover:bg-accent/10 hover:text-accent transition-colors cursor-default">
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div variants={fadeUp}>
                <Separator className="mb-8" />
              </motion.div>

              {/* Inquiry CTA Card */}
              <motion.div
                className="relative rounded-xl border border-accent/20 bg-accent/5 backdrop-blur-sm p-6 space-y-4 overflow-hidden"
                variants={fadeUp}
                whileHover={{ borderColor: "hsl(var(--accent) / 0.4)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Subtle glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
                <p className="font-body text-sm text-muted-foreground relative z-10">Interested in this product? Get in touch with our team for pricing and availability.</p>
                <div className="flex flex-wrap items-center gap-3 relative z-10">
                  <Link
                    to={`/contact?subject=Product+Inquiry&product=${encodeURIComponent(product.name)}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-5 h-11 text-sm font-body font-semibold hover:bg-accent/90 transition-all hover:shadow-lg hover:shadow-accent/20"
                  >
                    <MessageCircle className="w-4 h-4" /> Inquire Now
                  </Link>
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 backdrop-blur-sm px-4 h-11 text-sm font-body text-muted-foreground hover:text-foreground hover:border-accent/50 transition-all"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </motion.div>

              {/* Back link */}
              <motion.div className="mt-6" variants={fadeUp}>
                <Link to="/products" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors group">
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to all products
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gradient divider */}
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-border to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="flex items-center justify-between mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-4">
                <h2 className="font-display text-2xl font-bold text-foreground">More from {brandName}</h2>
                <motion.div
                  className="hidden sm:block h-px w-20 bg-border"
                  initial={{ width: 0 }}
                  whileInView={{ width: 80 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
              </div>
              <Link
                to={`/brands/${brandSlug}`}
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
              >
                View All →
              </Link>
            </motion.div>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {relatedProducts.map((p) => (
                <motion.div key={p.id} variants={fadeUp}>
                  <ProductCard product={p} large />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-[95vh] p-0 border-none bg-black/95 backdrop-blur-xl [&>button]:text-white [&>button]:hover:text-white/80">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
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
