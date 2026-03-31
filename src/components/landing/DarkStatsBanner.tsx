import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { useMouseGradient } from "@/hooks/useMouseGradient";
import { motion, useScroll, useTransform } from "framer-motion";
import { Package, Users, Thermometer, MapPin } from "lucide-react";
import { useRef } from "react";

const bannerStats = [
  { value: 500, suffix: "+", label: "Products Distributed", icon: Package },
  { value: 1000, suffix: "+", label: "Active Retail Partners", icon: Users },
  { value: 24, suffix: "/7", label: "Cold-Chain Monitoring", icon: Thermometer },
  { value: 0, suffix: "", label: "Island-Wide Delivery", icon: MapPin, isText: true, displayText: "Island-Wide" },
];

const DarkStatsBanner = () => {
  const { ref: inViewRef, isInView } = useInView();
  const { ref: mouseRef, gradientStyle } = useMouseGradient();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax on bg and SVG line
  const bgY = useTransform(scrollYProgress, [0, 1], ["-40px", "40px"]);
  const lineX = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={(el) => {
        (inViewRef as React.MutableRefObject<HTMLElement | null>).current = el;
        (mouseRef as React.MutableRefObject<HTMLElement | null>).current = el;
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className="relative overflow-hidden py-24"
    >
      {/* Dark gradient bg with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: bgY,
          background: `
            radial-gradient(ellipse at 20% 50%, hsl(140 35% 16% / 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, hsl(140 30% 14% / 0.4) 0%, transparent 50%),
            linear-gradient(90deg, hsl(140 45% 8%), hsl(140 40% 12%), hsl(140 45% 8%))
          `,
        }}
      />

      {/* Pulsing SVG line with parallax */}
      <motion.svg
        className="absolute inset-0 w-full h-full z-[1] opacity-20"
        preserveAspectRatio="none"
        style={{ x: lineX }}
      >
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="hsl(42 80% 55%)" strokeWidth="0.5">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />
        </line>
      </motion.svg>

      {/* Mouse-follow glow */}
      <div className="absolute inset-0 pointer-events-none z-[2] opacity-30" style={gradientStyle} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-4 sm:divide-x sm:divide-primary-foreground/10">
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
      <div className="w-10 h-10 rounded-xl bg-primary-foreground/5 flex items-center justify-center mb-3 mx-auto sm:mx-0">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <div className="font-display text-4xl lg:text-5xl font-bold text-primary-foreground">
        {stat.isText ? stat.displayText : <>{count}{stat.suffix}</>}
      </div>
      <p className="text-forest-light font-body text-sm mt-2 tracking-widest uppercase">{stat.label}</p>
    </motion.div>
  );
};

export default DarkStatsBanner;
