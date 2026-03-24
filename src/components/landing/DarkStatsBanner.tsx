import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";

const bannerStats = [
  { value: 120, suffix: "K+", label: "Products Delivered" },
  { value: 150, suffix: "+", label: "Active Partnerships" },
  { value: 32, suffix: "K+", label: "Orders Fulfilled" },
];

const DarkStatsBanner = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="snap-section-auto bg-forest-deep py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        background: "radial-gradient(circle at 20% 50%, hsl(42 80% 55% / 0.15), transparent 50%), radial-gradient(circle at 80% 50%, hsl(140 35% 22% / 0.3), transparent 50%)",
      }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid sm:grid-cols-3 gap-12 text-center">
          {bannerStats.map((stat, i) => (
            <BannerStat key={stat.label} stat={stat} isInView={isInView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const BannerStat = ({ stat, isInView, index }: { stat: typeof bannerStats[0]; isInView: boolean; index: number }) => {
  const count = useCountUp(stat.value, isInView, 2500);

  return (
    <div
      className={`transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ transitionDelay: isInView ? `${index * 150}ms` : "0ms" }}
    >
      <div className="font-display text-5xl lg:text-6xl font-bold text-primary-foreground mb-2">
        {count}{stat.suffix}
      </div>
      <p className="text-primary-foreground/50 font-body text-sm uppercase tracking-[0.15em]">{stat.label}</p>
    </div>
  );
};

export default DarkStatsBanner;
