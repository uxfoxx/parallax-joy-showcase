import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";
import { Package, Users, Thermometer, MapPin } from "lucide-react";

const bannerStats = [
  { value: 500, suffix: "+", label: "Products Distributed", icon: Package },
  { value: 1000, suffix: "+", label: "Active Retail Partners", icon: Users },
  { value: 24, suffix: "/7", label: "Cold-Chain Monitoring", icon: Thermometer },
  { value: 0, suffix: "", label: "Island-Wide Delivery", icon: MapPin, isText: true, displayText: "Island-Wide" },
];

const DarkStatsBanner = () => {
  const { ref: inViewRef, isInView } = useInView();

  return (
    <section
      ref={inViewRef as React.RefObject<HTMLElement>}
      className="relative bg-background py-24 border-y border-border overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 animate-gradient-shift opacity-[0.03]" style={{ background: "linear-gradient(135deg, hsl(140 50% 19%), hsl(75 38% 45%), hsl(80 50% 31%), hsl(140 50% 19%))", backgroundSize: "300% 300%" }} />

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
  const Icon = stat.icon;

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

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.12 + 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={`w-10 h-10 rounded-lg bg-forest-deep/10 flex items-center justify-center mb-3 mx-auto sm:mx-0 ${isInView ? "animate-pulse-glow" : ""}`}
        style={{ animationDelay: `${index * 0.3}s` }}
      >
        <Icon className="w-5 h-5 text-forest-mid" />
      </motion.div>
      <div className="font-display text-4xl lg:text-5xl font-bold text-foreground">
        {stat.isText ? stat.displayText : <>{count}{stat.suffix}</>}
      </div>
      <p className="text-muted-foreground font-body text-sm mt-2 tracking-widest uppercase">{stat.label}</p>
    </motion.div>
  );
};

export default DarkStatsBanner;
