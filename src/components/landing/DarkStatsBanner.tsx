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
      className="relative bg-background py-24 border-y border-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-4 sm:divide-x sm:divide-border">
          {bannerStats.map((stat, i) => (
            <BannerStat key={stat.label} stat={stat} isInView={isInView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

type StatType = typeof bannerStats[0];

const BannerStat = ({ stat, isInView, index }: { stat: StatType; isInView: boolean; index: number }) => {
  const count = useCountUp(stat.value, isInView, 2500);
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="px-6 sm:px-10 text-center sm:text-left"
    >
      <div className="w-10 h-10 rounded-lg bg-forest-deep/10 flex items-center justify-center mb-3 mx-auto sm:mx-0">
        <Icon className="w-5 h-5 text-forest-mid" />
      </div>
      <div className="font-display text-4xl lg:text-5xl font-bold text-foreground">
        {stat.isText ? stat.displayText : <>{count}{stat.suffix}</>}
      </div>
      <p className="text-muted-foreground font-body text-sm mt-2 tracking-widest uppercase">{stat.label}</p>
    </motion.div>
  );
};

export default DarkStatsBanner;
