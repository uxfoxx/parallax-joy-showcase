import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { ArrowLeft, ArrowRight, Package, Wheat, Coffee, Snowflake } from "lucide-react";

const categories = [
  { name: "Processed Foods", desc: "Premium processed food items sourced from trusted global manufacturers with rigorous quality standards.", count: "120+ Products", icon: Package },
  { name: "Grains & Staples", desc: "Essential grains and staple products from the world's finest agricultural regions.", count: "85+ Products", icon: Wheat },
  { name: "Beverages", desc: "Curated selection of beverages ranging from artisanal coffees to specialty teas.", count: "60+ Products", icon: Coffee },
  { name: "Dairy & Frozen", desc: "Temperature-controlled dairy and frozen goods delivered with care and precision.", count: "45+ Products", icon: Snowflake },
];

const CategoriesSection = () => {
  const { ref, isInView } = useInView();
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = categories.length - 2;

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <section ref={ref} id="brands" className="snap-section flex items-center bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
        <div className={`max-w-2xl mb-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent-foreground font-body text-xs font-semibold uppercase tracking-[0.15em] border border-accent/20 mb-4">
            Categories
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Explore Our Range
          </h2>
          <p className="text-muted-foreground font-body text-lg">
            From everyday staples to gourmet specialities, discover our extensive product catalogue.
          </p>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * (50 + 1.5)}%)` }}
          >
            {categories.map((cat, i) => (
              <div
                key={cat.name}
                className={`flex-shrink-0 w-[calc(50%-12px)] rounded-2xl border border-border p-8 transition-all duration-500 hover:border-accent/30 hover:shadow-xl hover:-translate-y-1 group animate-gradient-slow ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{
                  transitionDelay: isInView ? `${i * 100}ms` : "0ms",
                  background: `linear-gradient(135deg, hsl(200 40% 94%), hsl(180 30% 96%), hsl(160 20% 95%), hsl(200 40% 94%))`,
                }}
              >
                <div className="w-14 h-14 rounded-xl bg-sky-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <cat.icon className="w-7 h-7 text-sky-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{cat.name}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">{cat.desc}</p>
                <span className="text-accent-foreground font-body text-xs font-semibold uppercase tracking-wider">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8">
          {/* Dots */}
          <div className="flex gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-accent w-8" : "bg-border hover:bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-3">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-accent/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={next}
              disabled={currentIndex === maxIndex}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-accent/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
