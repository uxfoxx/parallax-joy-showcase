import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFeaturedProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ProductQuickView from "@/components/ProductQuickView";
import type { Product } from "@/lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import MagneticButton from "@/components/motion/MagneticButton";
import Eyebrow from "@/components/ui/eyebrow";

type CarouselApi = UseEmblaCarouselType[1];

const FeaturedProducts = () => {
  const { data: products = [] } = useFeaturedProducts();
  const sectionRef = useRef<HTMLElement>(null);
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

  // Autoplay — pauses on hover or once the user interacts.
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

  // Mouse parallax — same pattern as CategoriesSection
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, { damping: 28, stiffness: 90 });
  const mouseY = useSpring(rawMouseY, { damping: 28, stiffness: 90 });
  const wmarkMouseX = useTransform(mouseX, [-0.5, 0.5], [-24, 24]);
  const wmarkMouseY = useTransform(mouseY, [-0.5, 0.5], [-14, 14]);

  // Scroll parallax
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const wmarkScrollY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawMouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawMouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [rawMouseX, rawMouseY]);

  if (products.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative overflow-hidden py-section-base lg:py-section-base-lg bg-background"
      onMouseMove={handleMouseMove}
    >
      {/* Unified dot-grid backdrop — matches all white sections */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--forest-mid) / 0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Orbs — white-background compatible, 3-5% opacity */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="animate-orb absolute w-[600px] h-[500px] -top-24 -right-32 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, hsl(75 40% 60%), transparent 70%)" }}
        />
        <div
          className="animate-orb absolute w-[400px] h-[400px] bottom-16 -left-24 rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)", animationDelay: "7s" }}
        />
      </div>

      {/* Watermark — outer div carries scroll parallax, inner carries mouse parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden select-none"
        style={{ y: wmarkScrollY }}
      >
        <motion.div style={{ x: wmarkMouseX, y: wmarkMouseY }}>
          <span
            className="font-display font-black whitespace-nowrap"
            style={{
              fontSize: "clamp(5rem, 16vw, 14rem)",
              color: "transparent",
              WebkitTextStroke: "1px hsl(80 50% 31% / 0.055)",
              letterSpacing: "0.1em",
            }}
          >
            FEATURED
          </span>
        </motion.div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          {/* Badge */}
          <Eyebrow variant="pill" tone="accent" className="mb-8">
            Featured Products
          </Eyebrow>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              {["Handpicked", "for", "You"].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`inline-block mr-[0.25em] ${i === 0 ? "text-gradient-gold" : ""}`}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
            <p className="text-muted-foreground font-body text-base max-w-sm leading-relaxed">
              Carefully selected food products sourced from certified international suppliers.
            </p>
          </div>

          {/* Animated accent line — draws in from left on section entry */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="h-px bg-gradient-to-r from-accent via-accent/40 to-transparent origin-left"
          />
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
            <Link to="/products">
              <Button variant="brand" size="pill" className="font-body group">
                Browse Products
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

export default FeaturedProducts;
