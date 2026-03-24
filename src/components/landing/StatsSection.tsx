import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: 10, suffix: "+", label: "Years of Experience" },
  { value: 200, suffix: "+", label: "Happy Clients" },
  { value: 500, suffix: "+", label: "Products Available" },
  { value: 25, suffix: "+", label: "Countries Sourced" },
];

const StatsSection = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="snap-section flex items-center bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className={`space-y-6 transition-all duration-700 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Numbers That Speak for{" "}
              <span className="text-gradient-gold">Themselves</span>
            </h2>
            <p className="text-muted-foreground font-body text-lg leading-relaxed max-w-lg">
              Over a decade of importing excellence, connecting global suppliers with local businesses. Our track record speaks volumes about our commitment to quality.
            </p>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-full px-8 py-6 text-base transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-1 group">
              Get Started
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Right — Staggered Stats grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <div key={stat.label} className={i % 2 === 1 ? "mt-8" : ""}>
                <StatCard stat={stat} isInView={isInView} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ stat, isInView, index }: { stat: typeof stats[0]; isInView: boolean; index: number }) => {
  const count = useCountUp(stat.value, isInView, 2000);

  return (
    <div
      className={`p-6 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 group ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: isInView ? `${index * 100}ms` : "0ms" }}
    >
      <div className="font-display text-4xl lg:text-5xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
        {count}{stat.suffix}
      </div>
      <p className="text-muted-foreground font-body text-sm mt-2">{stat.label}</p>
      <div className="flex -space-x-2 mt-4">
        {[0, 1, 2].map((j) => (
          <div
            key={j}
            className="w-7 h-7 rounded-full border-2 border-card"
            style={{ background: `hsl(${140 + j * 30} 30% ${40 + j * 10}%)` }}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
