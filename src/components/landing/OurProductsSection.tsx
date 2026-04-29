import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MarqueeRow from "@/components/motion/MarqueeRow";
import MagneticButton from "@/components/motion/MagneticButton";
import Eyebrow from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useOurProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ProductQuickView from "@/components/ProductQuickView";
import type { Product } from "@/lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { UseEmblaCarouselType } from "embla-carousel-react";

type CarouselApi = UseEmblaCarouselType[1];

const MARQUEE_ITEMS = [
  "Frozen Foods", "Premium Dairy", "Grocery & Staples",
  "Edible Oils", "Specialty Imports", "Cold-Chain Certified",
  "International Brands", "B2B Distribution", "Quality Assured",
];

const OurProductsSection = () => {
  const { data: products = [] } = useOurProducts();
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

  if (products.length === 0) return null;

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

        {/* Scroll-velocity marquee — motion.dev pattern, speeds up with scroll */}
        <div className="relative mb-10 bg-accent/5 border-y border-accent/10">
          <MarqueeRow baseVelocity={60} direction={-1} className="py-2.5">
            {MARQUEE_ITEMS.map((item, i) => (
              <span
                key={`r1-${i}`}
                className="font-body text-xs font-semibold tracking-[0.18em] uppercase text-accent/80 whitespace-nowrap flex items-center gap-3 mx-4"
              >
                {item}
                <span className="w-1 h-1 rounded-full bg-accent/30 inline-block" />
              </span>
            ))}
          </MarqueeRow>
          <div className="h-px bg-accent/10" />
          <MarqueeRow baseVelocity={40} direction={1} className="py-2.5">
            {MARQUEE_ITEMS.map((item, i) => (
              <span
                key={`r2-${i}`}
                className="font-body text-[11px] font-medium tracking-[0.22em] uppercase text-forest-mid/70 whitespace-nowrap flex items-center gap-3 mx-4"
              >
                <span className="w-1 h-1 rounded-full bg-forest-mid/30 inline-block" />
                {item}
              </span>
            ))}
          </MarqueeRow>
        </div>

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
              <span className="mx-2 text-muted-foreground/40">/</span>
              <span className="text-muted-foreground">
                {String(count).padStart(2, "0")}
              </span>
            </div>
          )}

          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full cursor-grab active:cursor-grabbing"
          >
            <CarouselContent className="-ml-5">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-5 basis-full md:basis-1/2 lg:basis-1/3">
                  <ProductCard product={product} large onQuickView={() => setQuickViewProduct(product)} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>

        {/* Progress strip — per-slide track, active fills 0→100% over autoplay. */}
        {count > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
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
                  className={`relative h-[3px] rounded-full overflow-hidden transition-all duration-300 ${
                    isActive
                      ? "w-12 bg-border"
                      : "w-6 bg-border/70 hover:bg-foreground/30"
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
            <Link to="/products?our=true">
              <Button variant="brand" size="pill" className="font-body group">
                View Our Products
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
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
