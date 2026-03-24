import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { useMouseGradient } from "@/hooks/useMouseGradient";
import { motion } from "framer-motion";

const bannerStats = [
  { value: 120, suffix: "K+", label: "Products Delivered" },
  { value: 150, suffix: "+", label: "Active Partnerships" },
  { value: 32, suffix: "K+", label: "Orders Fulfilled" },
];

const DarkStatsBanner = () => {
  const { ref: inViewRef, isInView } = useInView();
  const { ref: mouseRef, gradientStyle } = useMouseGradient();

  return (
    <section
      ref={(el) => {
        (inViewRef as React.MutableRefObject<HTMLElement | null>).current = el;
        (mouseRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className="snap-section-auto relative overflow-hidden py-24"
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, hsl(140 35% 16% / 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, hsl(140 30% 14% / 0.4) 0%, transparent 50%),
            linear-gradient(90deg, hsl(140 45% 10%), hsl(140 40% 12%), hsl(140 45% 10%))
          `,
        }}
      />

      {/* Mouse-follow gradient */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={gradientStyle} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid sm:grid-cols-3 divide-x divide-primary-foreground/10">
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="px-10"
    >
      <p className="text-forest-light font-body text-sm mb-3 tracking-widest uppercase">{stat.label}</p>
      <div className="font-display text-5xl lg:text-6xl font-bold text-primary-foreground">
        {count}{stat.suffix}
      </div>
    </motion.div>
  );
};

export default DarkStatsBanner;
