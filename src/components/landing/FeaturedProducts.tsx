import { useInView } from "@/hooks/useInView";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const products = [
  { name: "Organic Olive Oil", origin: "Mediterranean Region", tag: "Best Seller" },
  { name: "Premium Basmati Rice", origin: "South Asia", tag: "New Arrival" },
  { name: "Artisan Dark Chocolate", origin: "West Africa & Europe", tag: "Popular" },
];

const FeaturedProducts = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} id="products" className="snap-section flex items-center bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent-foreground font-body text-xs font-semibold uppercase tracking-[0.15em] border border-accent/20 mb-4">
            Our Collection
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground font-body text-lg">
            Hand-picked selections from around the world, delivering unmatched quality and taste.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <div
              key={product.name}
              className={`group relative rounded-2xl overflow-hidden bg-gradient-to-br from-forest-deep to-forest-mid border border-primary-foreground/5 transition-all duration-700 hover:shadow-2xl hover:shadow-forest-deep/30 hover:-translate-y-2 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: isInView ? `${i * 150}ms` : "0ms" }}
            >
              {/* Image area */}
              <div className="relative h-64 bg-gradient-to-br from-forest-mid to-forest-light/30 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 to-transparent z-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-accent/10 blur-[40px] group-hover:bg-accent/20 transition-all duration-700" />
                </div>
                <span className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-accent/90 text-accent-foreground text-xs font-body font-semibold">
                  {product.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <h3 className="font-display text-xl font-semibold text-primary-foreground group-hover:text-accent transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-primary-foreground/50 font-body text-sm">{product.origin}</p>
                <Button className="w-full bg-primary-foreground/10 hover:bg-accent text-primary-foreground hover:text-accent-foreground font-body rounded-full mt-4 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent/20">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Shop Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
