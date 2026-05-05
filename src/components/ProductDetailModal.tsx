import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, MessageCircle, Share2, MapPin, Tag, Building2,
  ChevronLeft, ChevronRight, Sparkles, Box, Globe, Hash, X, ArrowUpRight,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useProduct, useProducts, useProductImages } from "@/lib/api";
import { useProductModal } from "@/lib/productModal";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE } },
};

const EyebrowLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block font-body text-[10px] font-semibold tracking-[0.25em] uppercase text-accent/80 mb-3 border-b border-accent/30 pb-1">
    {children}
  </span>
);

/* Inner content — rendered only when slug is known so hooks are stable */
const ModalInner = ({ slug, onClose }: { slug: string; onClose: () => void }) => {
  const { data: product, isLoading } = useProduct(slug);
  const { data: allProducts = [] } = useProducts();
  const { data: extraImages = [] } = useProductImages(product?.id || "");
  const { openProductModal } = useProductModal();

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Reset image index when product changes
  useEffect(() => { setActiveImage(0); }, [slug]);

  const allImages = product
    ? [
        ...(product.image_url ? [product.image_url] : []),
        ...extraImages.map((img) => img.image_url),
      ]
    : [];

  const navigateLightbox = useCallback((dir: 1 | -1) => {
    setActiveImage((prev) => (prev + dir + allImages.length) % allImages.length);
  }, [allImages.length]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Package className="w-12 h-12 text-muted-foreground/30" />
        <p className="font-body text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const brandName = product.brands?.name ?? "";
  const brandSlug = product.brands?.slug ?? "";
  const isHtml = product.description.includes("<");
  const plainDesc = isHtml
    ? new DOMParser().parseFromString(product.description, "text/html").body.textContent || ""
    : product.description;

  const specs = [
    { icon: Tag, label: "Category", value: product.category },
    { icon: Globe, label: "Origin", value: product.origin },
    { icon: Hash, label: "SKU", value: product.sku },
    { icon: Building2, label: "Brand", value: brandName, link: `/brands/${brandSlug}` },
  ].filter((s) => s.value);

  return (
    <>
      <motion.div variants={stagger} initial="hidden" animate="show">
        <div className="grid grid-cols-1 lg:grid-cols-[48%_52%] gap-0">
          {/* ── Left: gallery ── */}
          <div className="p-5 lg:p-6 space-y-3 lg:border-r border-border">
            {/* Main image */}
            <motion.div
              variants={fadeUp}
              className="relative aspect-square rounded-xl overflow-hidden bg-muted/50 group cursor-zoom-in border border-border/50"
              onClick={() => allImages.length > 0 && setLightboxOpen(true)}
            >
              <AnimatePresence mode="wait">
                {allImages.length > 0 ? (
                  <motion.img
                    key={activeImage}
                    src={allImages[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.06]"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  />
                ) : (
                  <motion.div
                    className="w-full h-full flex items-center justify-center bg-gradient-to-br from-forest-deep/20 via-forest-mid/10 to-accent/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Package className="w-20 h-20 text-muted-foreground/20" />
                  </motion.div>
                )}
              </AnimatePresence>
              {allImages.length > 0 && (
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-foreground/60 backdrop-blur-md text-background text-[10px] font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click to zoom
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                {product.featured && (
                  <Badge className="bg-accent text-white font-body text-xs shadow-md border-0">Featured</Badge>
                )}
                {product.category && (
                  <Badge variant="outline" className="bg-background/90 backdrop-blur-sm font-body text-xs text-foreground border-border shadow-sm ml-auto">
                    {product.category}
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <motion.div variants={fadeUp} className="px-4 sm:px-6">
                <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                  <CarouselContent className="-ml-2">
                    {allImages.map((img, i) => (
                      <CarouselItem key={i} className="pl-2 basis-1/4 sm:basis-1/5">
                        <button
                          onClick={() => setActiveImage(i)}
                          className={`w-full aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                            i === activeImage
                              ? "border-accent ring-2 ring-accent/30 scale-105"
                              : "border-border hover:border-accent/50 opacity-60 hover:opacity-100"
                          }`}
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

          {/* ── Right: details ── */}
          <div className="p-5 lg:p-6 overflow-y-auto max-h-[75vh] lg:max-h-none flex flex-col gap-5">
            {/* Brand badge */}
            {brandName && (
              <motion.div variants={fadeUp}>
                <Link to={`/brands/${brandSlug}`} onClick={onClose}>
                  <Badge variant="secondary" className="font-body text-xs px-3 py-1.5 hover:bg-secondary/80 transition-colors inline-flex items-center gap-1.5">
                    <Building2 className="w-3 h-3" />
                    {brandName}
                  </Badge>
                </Link>
              </motion.div>
            )}

            {/* Name */}
            <motion.div variants={fadeUp}>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                {product.name}
              </h2>
              <motion.div
                className="mt-3 h-1 w-14 rounded-full bg-accent"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 56, opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.25, ease: EASE }}
              />
            </motion.div>

            {/* Pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {product.category && (
                <Badge variant="outline" className="font-body text-xs px-3 py-1.5">
                  <Tag className="w-3 h-3 mr-1.5" />{product.category}
                </Badge>
              )}
              {product.origin && (
                <Badge variant="outline" className="font-body text-xs px-3 py-1.5">
                  <MapPin className="w-3 h-3 mr-1.5" />{product.origin}
                </Badge>
              )}
              {product.featured && (
                <Badge className="font-body text-xs px-3 py-1.5 bg-accent/10 text-accent border-accent/20">
                  <Sparkles className="w-3 h-3 mr-1.5" />Featured
                </Badge>
              )}
            </motion.div>

            {/* Description */}
            <motion.div variants={fadeUp}>
              <EyebrowLabel>Description</EyebrowLabel>
              <h3 className="font-display text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                <Box className="w-4 h-4 text-accent" />
                About this product
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {plainDesc}
              </p>
            </motion.div>

            {/* Specs */}
            {specs.length > 0 && (
              <motion.div variants={fadeUp}>
                <Separator className="mb-4" />
                <EyebrowLabel>Specifications</EyebrowLabel>
                <div className="rounded-xl border border-border overflow-hidden">
                  {specs.map((d, i) => (
                    <div
                      key={d.label}
                      className={`flex items-center justify-between px-4 py-3 ${i % 2 === 0 ? "bg-muted/30" : "bg-background"}`}
                    >
                      <span className="font-body text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <d.icon className="w-3.5 h-3.5" />{d.label}
                      </span>
                      {d.link ? (
                        <Link to={d.link} onClick={onClose} className="font-body text-sm text-foreground hover:text-accent transition-colors font-medium">
                          {d.value}
                        </Link>
                      ) : (
                        <span className="font-body text-sm text-foreground font-medium">{d.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tags */}
            {(product.tags ?? []).length > 0 && (
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
                {(product.tags ?? []).map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-body text-xs px-3 py-1.5">
                    {tag}
                  </Badge>
                ))}
              </motion.div>
            )}

            {/* CTA */}
            <motion.div variants={fadeUp}>
              <Separator className="mb-4" />
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 space-y-3 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-accent/10 blur-2xl pointer-events-none" />
                <p className="font-body text-sm text-muted-foreground relative z-10">
                  Interested in this product? Get in touch with our team for pricing and availability.
                </p>
                <div className="flex flex-wrap gap-3 relative z-10">
                  <Link
                    to={`/contact?subject=Product+Inquiry&product=${encodeURIComponent(product.name)}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-5 h-10 text-sm font-body font-semibold hover:bg-accent/90 transition-all hover:shadow-lg hover:shadow-accent/20"
                  >
                    <MessageCircle className="w-4 h-4" /> Inquire Now
                  </Link>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/products/${product.slug}`)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 px-4 h-10 text-sm font-body text-muted-foreground hover:text-foreground hover:border-accent/50 transition-all"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Related products ── */}
        {relatedProducts.length > 0 && (
          <motion.div
            variants={fadeUp}
            className="border-t border-border px-5 lg:px-6 py-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-foreground">
                More from {brandName}
              </h3>
              <Link
                to={`/brands/${brandSlug}`}
                onClick={onClose}
                className="text-xs font-body text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                View All <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => openProductModal(p.slug)}
                  className="group text-left rounded-xl overflow-hidden border border-border hover:border-accent/40 transition-all duration-300 hover:shadow-md"
                >
                  <div className="aspect-square bg-muted/50 overflow-hidden">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-forest-deep/10 to-accent/5">
                        <Package className="w-8 h-8 text-muted-foreground/25" />
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="font-body text-xs font-semibold text-foreground line-clamp-2 leading-snug">
                      {p.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ── Lightbox ── */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-[90vh] p-0 border-none bg-black/96 backdrop-blur-xl [&>button]:text-white [&>button]:hover:text-white/80">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox(-1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigateLightbox(1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
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
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      i === activeImage
                        ? "border-white ring-2 ring-white/30"
                        : "border-white/20 hover:border-white/50 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="absolute top-4 left-4 text-white/50 text-xs font-body">
              {activeImage + 1} / {allImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

/* Root modal — reads slug from context */
const ProductDetailModal = () => {
  const { activeSlug, closeProductModal } = useProductModal();

  return (
    <Dialog open={!!activeSlug} onOpenChange={(open) => { if (!open) closeProductModal(); }}>
      <DialogContent className="max-w-5xl w-full p-0 overflow-hidden rounded-2xl border-border bg-background gap-0 max-h-[92vh] overflow-y-auto">
        {/* Custom close button */}
        <button
          onClick={closeProductModal}
          className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {activeSlug && (
          <ModalInner slug={activeSlug} onClose={closeProductModal} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
