import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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
    <section className="relative overflow-hidden py-28 lg:py-36">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6"
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            {"Our Products".split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.25em]"
                initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <p className="text-muted-foreground font-body text-base max-w-sm leading-relaxed">
            Our curated selection of premium food products, carefully chosen for the Sri Lankan market.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
            <CarouselPrevious className="hidden md:flex -left-4 w-10 h-10 rounded-full border-border bg-background/90 backdrop-blur-sm shadow-lg hover:bg-accent hover:text-white hover:border-accent transition-all" />
            <CarouselNext className="hidden md:flex -right-4 w-10 h-10 rounded-full border-border bg-background/90 backdrop-blur-sm shadow-lg hover:bg-accent hover:text-white hover:border-accent transition-all" />
          </Carousel>

          {count > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8">
              <span className="text-muted-foreground font-body text-sm tabular-nums">
                {current + 1} / {count}
              </span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link to="/products?our=true">
            <Button className="bg-forest-deep text-white hover:bg-forest-deep/90 font-body rounded-lg px-8 py-5 transition-all duration-300 border border-forest-deep/20 hover:shadow-lg shine-sweep">
              View Our Products →
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
