import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";

const bannerStats = [
  { value: 500, suffix: "+", label: "Products Distributed" },
  { value: 1000, suffix: "+", label: "Active Retail Partners" },
  { value: 24, suffix: "/7", label: "Cold-Chain Monitoring" },
  { value: 0, suffix: "", label: "Island-Wide Delivery", isText: true, displayText: "Island-Wide" },
];

const DarkStatsBanner = () => {
  const { ref: inViewRef, isInView } = useInView();

  return (
    <section
      ref={inViewRef as React.RefObject<HTMLElement>}
      className="relative bg-background py-24 border-y border-border overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 animate-gradient-shift opacity-[0.07]" style={{ background: "linear-gradient(135deg, hsl(150 40% 8%), hsl(140 55% 20%), hsl(80 50% 22%), hsl(75 42% 28%), hsl(80 50% 18%), hsl(140 50% 15%), hsl(150 40% 8%))", backgroundSize: "400% 400%" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-4">
          {bannerStats.map((stat, i) => (
            <BannerStat key={stat.label} stat={stat} isInView={isInView} index={i} isLast={i === bannerStats.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
};

type StatType = typeof bannerStats[0];

const BannerStat = ({ stat, isInView, index, isLast }: { stat: StatType; isInView: boolean; index: number; isLast: boolean }) => {
  const count = useCountUp(stat.value, isInView, 2500);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative px-6 sm:px-10 text-center sm:text-left"
    >
      {/* Animated separator on left (except first item) */}
      {index > 0 && (
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="hidden sm:block absolute left-0 top-2 bottom-2 w-px bg-border origin-top"
        />
      )}

      {/* Animated accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.12 + 0.2 }}
        className="w-8 h-[2px] bg-accent rounded-full mb-3 mx-auto sm:mx-0 origin-left"
      />
      <div className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-none">
        {stat.isText ? stat.displayText : <>{count}{stat.suffix}</>}
      </div>
      <p className="text-muted-foreground font-body text-xs mt-3 tracking-[0.15em] uppercase">{stat.label}</p>
    </motion.div>
  );
};

export default DarkStatsBanner;
