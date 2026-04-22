import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { ArrowRight } from "lucide-react";
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
  CarouselPrevious,
  CarouselNext,
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

  if (products.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-28 lg:py-36 bg-background">
      {/* Dot-grid background — fades in on section entry */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
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
          <span className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary font-body text-sm font-medium border border-primary/15 mb-8 tracking-widest uppercase">
            Our Products
          </span>

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

        {/* Marquee strip — doubled rows, counter-directional for parallax-carousel feel */}
        <div className="relative mb-10 bg-accent/5 border-y border-accent/10">
          <Marquee speed={36} gradient gradientColor="hsl(var(--background))" gradientWidth={60} pauseOnHover className="py-2.5">
            {MARQUEE_ITEMS.map((item, i) => (
              <span
                key={`r1-${i}`}
                className="font-body text-xs font-semibold tracking-[0.18em] uppercase text-accent/80 whitespace-nowrap flex items-center gap-3 mx-4"
              >
                {item}
                <span className="w-1 h-1 rounded-full bg-accent/30 inline-block" />
              </span>
            ))}
          </Marquee>
          <div className="h-px bg-accent/10" />
          <Marquee speed={22} direction="right" gradient gradientColor="hsl(var(--background))" gradientWidth={60} pauseOnHover className="py-2.5">
            {MARQUEE_ITEMS.map((item, i) => (
              <span
                key={`r2-${i}`}
                className="font-body text-[11px] font-medium tracking-[0.22em] uppercase text-forest-mid/70 whitespace-nowrap flex items-center gap-3 mx-4"
              >
                <span className="w-1 h-1 rounded-full bg-forest-mid/30 inline-block" />
                {item}
              </span>
            ))}
          </Marquee>
        </div>

        {/* Carousel — px-10 md:px-14 wrapper provides clearance for absolute arrow buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative px-10 md:px-14"
        >
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-5">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-5 basis-full md:basis-1/2 lg:basis-1/3">
                  <ProductCard product={product} large onQuickView={() => setQuickViewProduct(product)} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-2 md:-left-6 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border border-border text-foreground hover:bg-primary hover:text-white hover:border-primary hover:scale-110 transition-all duration-200" />
            <CarouselNext className="-right-2 md:-right-6 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border border-border text-foreground hover:bg-primary hover:text-white hover:border-primary hover:scale-110 transition-all duration-200" />
          </Carousel>
        </motion.div>

        {/* Progress bar indicator — key={current} resets animation on each slide change */}
        <div className="mt-6 h-0.5 bg-border rounded-full overflow-hidden max-w-xs mx-auto">
          <div
            key={current}
            className="h-full bg-primary rounded-full animate-progress-bar"
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link to="/products?our=true">
            <Button className="bg-forest-deep text-white hover:bg-forest-deep/90 font-body rounded-lg px-8 h-12 text-base transition-all duration-300 border border-forest-deep/20 hover:shadow-lg group">
              View Our Products
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
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
