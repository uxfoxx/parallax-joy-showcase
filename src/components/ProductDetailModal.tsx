import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Building2, ChevronLeft, ChevronRight, X, ArrowUpRight,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProduct, useProducts, useProductImages } from "@/lib/api";
import { useProductModal } from "@/lib/productModal";
import { originToFlag } from "@/lib/flags";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: EASE } },
};

/* Inner content — rendered only when slug is known so hooks are stable */
const ModalInner = ({ slug, onClose }: { slug: string; onClose: () => void }) => {
  const { data: product, isLoading } = useProduct(slug);
  const { data: allProducts = [] } = useProducts();
  const { data: extraImages = [] } = useProductImages(product?.id || "");
  const { openProductModal } = useProductModal();

  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => { setActiveImage(0); }, [slug]);

  const allImages = product
    ? [
        ...(product.image_url ? [product.image_url] : []),
        ...extraImages.map((img) => img.image_url),
      ]
    : [];

  const navigateLightbox = useCallback(
    (dir: 1 | -1) =>
      setActiveImage((prev) => (prev + dir + allImages.length) % allImages.length),
    [allImages.length]
  );

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
      <div className="flex items-center justify-center h-full min-h-[420px]">
        <div className="w-8 h-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[420px] gap-4">
        <Package className="w-12 h-12 text-muted-foreground/30" />
        <p className="font-body text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const brandName = product.brands?.name ?? "";
  const brandSlug = product.brands?.slug ?? "";
  const brandLogo = product.brands?.image_url ?? null;
  const established = product.brands?.established ?? null;
  const initials = (brandName || product.name)
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const isHtml = product.description?.includes("<") ?? false;
  const plainDesc = isHtml
    ? new DOMParser().parseFromString(product.description, "text/html").body.textContent || ""
    : product.description;

  return (
    <>
      {/* ── True two-column layout, both sides fill modal height ── */}
      <div className="flex flex-col sm:flex-row h-full">

        {/* ── LEFT: image panel ── */}
        <div className="sm:w-[46%] flex-shrink-0 bg-muted/20 flex flex-col border-b sm:border-b-0 sm:border-r border-border">
          {/* Main image */}
          <motion.div
            className="relative flex-1 min-h-[260px] sm:min-h-0 cursor-zoom-in group overflow-hidden"
            onClick={() => allImages.length > 0 && setLightboxOpen(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {allImages.length > 0 ? (
                <motion.img
                  key={activeImage}
                  src={allImages[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-contain p-6 group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-20 h-20 text-muted-foreground/20" />
                </div>
              )}
            </AnimatePresence>

            {allImages.length > 0 && (
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-foreground/50 backdrop-blur-md text-background text-[10px] font-body opacity-0 group-hover:opacity-100 transition-opacity">
                Zoom
              </div>
            )}
          </motion.div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 px-4 py-3 border-t border-border overflow-x-auto scrollbar-none">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                    i === activeImage
                      ? "border-accent ring-2 ring-accent/25 scale-105"
                      : "border-border hover:border-accent/50 opacity-55 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: details panel (scrolls independently) ── */}
        <div className="flex-1 overflow-y-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="p-6 flex flex-col gap-5"
          >
            {/* Provenance — brand crest + where it's from */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-4 rounded-2xl border border-border bg-gradient-to-br from-forest-deep/[0.05] to-accent/[0.06] p-4"
            >
              {/* Brand-logo medallion */}
              <Link
                to={brandSlug ? `/brands/${brandSlug}` : "#"}
                onClick={onClose}
                className="shrink-0"
                aria-label={brandName || "Brand"}
              >
                <div className="w-16 h-16 rounded-full border border-border bg-background shadow-sm flex items-center justify-center overflow-hidden">
                  {brandLogo ? (
                    <img src={brandLogo} alt={brandName} className="w-12 h-12 object-contain" />
                  ) : (
                    <span className="font-display text-lg font-bold text-forest-mid">{initials}</span>
                  )}
                </div>
              </Link>

              <div className="min-w-0">
                {brandName ? (
                  <Link
                    to={`/brands/${brandSlug}`}
                    onClick={onClose}
                    className="font-display text-base font-bold text-foreground hover:text-accent transition-colors inline-flex items-center gap-1"
                  >
                    {brandName}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="font-display text-base font-bold text-foreground inline-flex items-center gap-1">
                    <Building2 className="w-4 h-4" /> Olive Foods
                  </span>
                )}
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  {product.origin && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-accent/40 bg-accent/[0.06] px-2.5 py-0.5 font-body text-[11px] font-medium text-foreground">
                      <span aria-hidden className="text-sm leading-none">{originToFlag(product.origin)}</span>
                      {product.origin}
                    </span>
                  )}
                  {established && (
                    <span className="font-body text-[11px] text-muted-foreground">Est. {established}</span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Category + tags */}
            {(product.category || (product.tags?.length ?? 0) > 0) && (
              <motion.div variants={fadeUp} className="flex flex-wrap gap-1.5">
                {product.category && (
                  <Badge variant="secondary" className="font-body text-[11px]">
                    {product.category}
                  </Badge>
                )}
                {(product.tags ?? []).slice(0, 6).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2 py-0.5 font-body text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Name */}
            <motion.div variants={fadeUp}>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                {product.name}
              </h2>
              <motion.div
                className="mt-3 h-[3px] w-12 rounded-full bg-accent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                style={{ transformOrigin: "left" }}
                transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
              />
            </motion.div>

            {/* Description */}
            {plainDesc && (
              <motion.div variants={fadeUp}>
                <p className="font-body text-[10px] font-semibold tracking-[0.22em] uppercase text-accent/70 mb-2">
                  About this product
                </p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {plainDesc}
                </p>
              </motion.div>
            )}

            {/* More from brand */}
            {relatedProducts.length > 0 && (
              <motion.div variants={fadeUp}>
                <Separator className="mb-4" />
                <div className="flex items-center justify-between mb-3">
                  <p className="font-display text-sm font-bold text-foreground">More from {brandName}</p>
                  <Link
                    to={`/brands/${brandSlug}`}
                    onClick={onClose}
                    className="text-xs font-body text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    View All <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
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
        </div>
      </div>

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
    <Dialog
      open={!!activeSlug}
      onOpenChange={(open) => { if (!open) closeProductModal(); }}
    >
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden rounded-2xl border-border bg-background gap-0 h-[88vh] max-h-[88vh] flex flex-col [&>button]:hidden">
        {/* Close button — wrapped in a div so DialogContent's
            [&>button]:hidden (which hides Radix's default close) doesn't also
            hide ours. Without the wrapper this button renders 0×0. */}
        <div className="absolute top-3.5 right-3.5 z-50">
          <button
            onClick={closeProductModal}
            className="w-9 h-9 rounded-full border border-border bg-background/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-muted hover:border-accent/40 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          {activeSlug && (
            <ModalInner slug={activeSlug} onClose={closeProductModal} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
