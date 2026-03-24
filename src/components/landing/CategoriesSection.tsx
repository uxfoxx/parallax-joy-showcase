import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

const categories = [
  {
    name: "Processed Foods",
    desc: "Effortlessly configure your preferred keyboard shortcuts, enabling seamless integration.",
  },
  {
    name: "Grains & Staples",
    desc: "Effortlessly configure your preferred keyboard shortcuts, enabling seamless integration.",
  },
  {
    name: "Beverages",
    desc: "Effortlessly configure your preferred keyboard shortcuts, enabling seamless integration.",
  },
  {
    name: "Dairy & Frozen",
    desc: "Effortlessly configure your preferred keyboard shortcuts, enabling seamless integration.",
  },
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
        {/* Header — centered */}
        <div
          className={`text-center max-w-2xl mx-auto mb-14 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Categories
          </h2>
          <p className="text-muted-foreground font-body text-base">
            This customization increases Claypro's flexibility and usefulness, making it a powerful
            tool for a wide range of professionals.
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
                className={`flex-shrink-0 w-[calc(50%-12px)] rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: isInView ? `${i * 100}ms` : "0ms" }}
              >
                <div
                  className="h-full"
                  style={{
                    background: `
                      radial-gradient(ellipse at 50% 0%, hsl(140 35% 22% / 0.6) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 100%, hsl(140 30% 16% / 0.4) 0%, transparent 50%),
                      linear-gradient(180deg, hsl(140 40% 14%), hsl(140 45% 11%), hsl(140 40% 13%))
                    `,
                  }}
                >
                  {/* Icon placeholder */}
                  <div className="p-8 pb-6">
                    <div className="w-20 h-20 rounded-xl bg-primary-foreground flex items-center justify-center mb-8 shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <svg viewBox="0 0 60 60" className="w-12 h-12">
                        <polygon
                          points="30,8 42,18 42,32 30,42 18,32 18,18"
                          fill="none"
                          stroke="hsl(200, 70%, 55%)"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points="30,14 38,21 38,29 30,36 22,29 22,21"
                          fill="hsl(200, 70%, 55%)"
                          fillOpacity="0.3"
                        />
                        <circle cx="36" cy="16" r="1.5" fill="hsl(200, 70%, 55%)" />
                        <circle cx="36" cy="20" r="1.5" fill="hsl(200, 70%, 55%)" />
                        <circle cx="36" cy="24" r="1.5" fill="hsl(200, 70%, 55%)" />
                      </svg>
                    </div>

                    <h3 className="font-display text-2xl font-semibold text-primary-foreground mb-3">
                      {cat.name}
                    </h3>
                    <p className="text-primary-foreground/50 font-body text-sm leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8">
          {/* Dots */}
          <div className="flex gap-2 items-center">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "bg-foreground w-6 h-3"
                    : "bg-muted-foreground/30 w-3 h-3 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="flex gap-3">
            <button
              onClick={next}
              disabled={currentIndex === maxIndex}
              className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="w-12 h-12 rounded-full bg-muted border border-border text-foreground flex items-center justify-center hover:bg-muted-foreground/10 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowDownLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
