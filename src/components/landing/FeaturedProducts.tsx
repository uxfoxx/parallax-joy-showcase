import { useInView } from "@/hooks/useInView";
import { Button } from "@/components/ui/button";

const products = [
  { name: "Daily Multivitamin", sku: "DM-02™", tag: "New" },
  { name: "Daily Multivitamin", sku: "DM-02™", tag: "New" },
  { name: "Daily Multivitamin", sku: "DM-02™", tag: "New" },
];

const FeaturedProducts = () => {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      id="products"
      className="snap-section flex items-center overflow-hidden relative"
    >
      {/* Full animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: `linear-gradient(135deg, #08120A 38%, #194B22 74%, #08120A 85%)`,
        }}
      />

      {/* Decorative animated arc line */}
      <div className="absolute bottom-0 left-0 right-0 h-40 opacity-20">
        <svg viewBox="0 0 1200 160" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M-100,160 Q300,-40 600,80 T1300,40"
            fill="none"
            stroke="hsl(180, 60%, 50%)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
        {/* Header — left-aligned with description on right */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground">
            Featured Products
          </h2>
          <p className="text-primary-foreground/60 font-body text-base max-w-sm leading-relaxed">
            Carefully selected food products sourced from certified international suppliers.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl overflow-hidden border border-primary-foreground/10 transition-all duration-700 hover:shadow-2xl hover:shadow-forest-mid/40 hover:-translate-y-2 hover:border-primary-foreground/20 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: isInView ? `${i * 150}ms` : "0ms" }}
            >
              {/* Card inner with animated gradient */}
              <div
                className="animate-gradient-slow"
                style={{
                  background: `
                    radial-gradient(ellipse at 50% 0%, hsl(140 30% 22% / 0.6) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 100%, hsl(140 35% 18% / 0.4) 0%, transparent 50%),
                    linear-gradient(180deg, hsl(140 40% 14%), hsl(140 45% 11%), hsl(140 40% 13%))
                  `,
                }}
              >
                {/* Top area with tags + title */}
                <div className="p-5 pb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-forest-mid/80 text-primary-foreground text-xs font-body font-medium border border-primary-foreground/10">
                      {product.tag}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-forest-mid/50 text-primary-foreground/70 text-xs font-body border border-primary-foreground/10">
                      {product.sku}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-primary-foreground mb-6">
                    {product.name}
                  </h3>
                </div>

                {/* Product image placeholder — gradient jar shape */}
                <div className="relative h-52 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-2xl bg-forest-mid/40 blur-[50px] group-hover:bg-forest-light/30 transition-all duration-700" />
                  </div>
                  {/* Jar silhouette */}
                  <div className="relative z-10 w-36 h-44 rounded-xl bg-gradient-to-b from-forest-mid/60 to-forest-deep/80 border border-primary-foreground/10 flex flex-col items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-500">
                    <div className="w-28 h-6 rounded-t-lg bg-forest-deep/90 -mt-3 border border-primary-foreground/10" />
                    <div className="mt-3 text-primary-foreground/40 font-body text-[10px] font-medium tracking-wider uppercase">
                      Seed®
                    </div>
                    <div className="w-3 h-3 rounded-full bg-primary-foreground/20 mt-4" />
                    <div className="mt-auto mb-3 px-3 py-1 bg-forest-deep/60 rounded text-[8px] text-primary-foreground/50 font-body text-center leading-tight">
                      DM-02™ DAILY MULTIVITAMIN
                      <br />
                      DIETARY SUPPLEMENT
                    </div>
                  </div>
                </div>

                {/* Shop Now button */}
                <div className="p-5 pt-4">
                  <Button className="w-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground font-body rounded-full py-5 transition-all duration-300 border border-primary-foreground/10 hover:border-primary-foreground/20 group-hover:shadow-lg group-hover:shadow-forest-mid/30">
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
