import { useInView } from "@/hooks/useInView";
import { ArrowRight } from "lucide-react";

const categories = [
  { name: "Processed Foods", count: "120+ Products", color: "from-accent/20 to-gold-light/10" },
  { name: "Grains & Staples", count: "85+ Products", color: "from-forest-light/20 to-accent/10" },
  { name: "Beverages", count: "60+ Products", color: "from-gold/15 to-accent/5" },
  { name: "Dairy & Frozen", count: "45+ Products", color: "from-forest-mid/20 to-forest-light/10" },
];

const CategoriesSection = () => {
  const { ref, isInView } = useInView();

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: isInView ? `${i * 100}ms` : "0ms" }}
            >
              <div className={`h-64 bg-gradient-to-br ${cat.color} border border-border group-hover:border-accent/30 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300`}>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">{cat.name}</h3>
                  <p className="text-muted-foreground font-body text-sm">{cat.count}</p>
                </div>
                <div className="flex items-center text-accent font-body font-medium text-sm group-hover:gap-2 transition-all duration-300">
                  Browse
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
