import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";
import Eyebrow from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useOurProducts } from "@/lib/api";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import ProductQuickView from "@/components/ProductQuickView";
import type { Product } from "@/lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { UseEmblaCarouselType } from "embla-carousel-react";

type CarouselApi = UseEmblaCarouselType[1];

const OurProductsSection = () => {
  const { data: products = [], isLoading } = useOurProducts();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [hovered, setHovered] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api, onSelect]);

  // Autoplay — paused on hover or once the user manually interacts.
  useEffect(() => {
    if (!api || hovered || userInteracted) return;
    const id = window.setInterval(() => api.scrollNext(), 5000);
    return () => window.clearInterval(id);
  }, [api, hovered, userInteracted]);

  // Embla pointer-down event = user dragging — stop autoplay permanently.
  useEffect(() => {
    if (!api) return;
    const onPointerDown = () => setUserInteracted(true);
    api.on("pointerDown", onPointerDown);
    return () => { api.off("pointerDown", onPointerDown); };
  }, [api]);

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-section-base lg:py-section-base-lg bg-background">
      {/* Dot-grid background — fades in on section entry */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--forest-mid) / 0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          {/* Badge — primary/forest palette, distinct from FeaturedProducts' accent badge */}
          <Eyebrow variant="pill" tone="primary" className="mb-8 text-primary border-primary/20 bg-primary/10">
            Our Products
          </Eyebrow>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              {["Explore", "Our"].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block text-gradient-gold"
              >
                Range
              </motion.span>
            </h2>
            <p className="text-muted-foreground font-body text-base max-w-sm leading-relaxed">
              Our curated selection of premium food products, carefully chosen for the Sri Lankan market.
            </p>
          </div>
        </motion.div>

        {/* Carousel — px-10 md:px-14 wrapper provides clearance for absolute arrow buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Counter chip — top-right of carousel */}
          {count > 1 && (
            <div className="absolute -top-9 right-0 font-body text-[11px] tracking-[0.22em] uppercase tabular-nums z-10">
              <span className="text-foreground font-semibold">
                {String(current + 1).padStart(2, "0")}
              </span>
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="text-muted-foreground">
                {String(count).padStart(2, "0")}
              </span>
            </div>
          )}

          <Carousel
            aria-label="Our own range"
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full cursor-grab active:cursor-grabbing"
          >
            <CarouselContent className="-ml-5">
              {isLoading
                ? [0, 1, 2].map((i) => (
                    <CarouselItem key={`skeleton-${i}`} className="pl-5 basis-full md:basis-1/2 lg:basis-1/3">
                      <ProductCardSkeleton />
                    </CarouselItem>
                  ))
                : products.map((product) => (
                    <CarouselItem key={product.id} className="pl-5 basis-full md:basis-1/2 lg:basis-1/3">
                      <ProductCard product={product} large onQuickView={() => setQuickViewProduct(product)} />
                    </CarouselItem>
                  ))}
            </CarouselContent>
          </Carousel>
        </motion.div>

        {/* Progress strip — per-slide track, active fills 0→100% over autoplay. */}
        {count > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {Array.from({ length: count }).map((_, i) => {
              const isActive = i === current;
              const isAutoplaying = isActive && !hovered && !userInteracted;
              return (
                <button
                  key={i}
                  onClick={() => {
                    api?.scrollTo(i);
                    setUserInteracted(true);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  // 24px-tall hit area around the 3px bar (it was a 3px target).
                  className="group flex items-center h-6"
                >
                  <span
                    className={`relative block h-[3px] rounded-full overflow-hidden transition-all duration-300 ${
                      isActive ? "w-12 bg-border" : "w-6 bg-border group-hover:bg-foreground/30"
                    }`}
                  >
                    {isActive && (
                      <span
                        key={`fill-${current}-${userInteracted}`}
                        className={`absolute inset-0 bg-primary rounded-full ${
                          isAutoplaying ? "animate-progress-bar" : ""
                        }`}
                        style={{ transformOrigin: "left" }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <MagneticButton>
            <Button asChild variant="brand" size="pill" className="font-body group">
              <Link to="/products?our=true">
                View Our Products
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </MagneticButton>
        </motion.div>
      </div>

      <ProductQuickView
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(open) => !open && setQuickViewProduct(null)}
      />
    </section>
  );
};

export default OurProductsSection;
