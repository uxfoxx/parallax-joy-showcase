import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ShoppingCart, Globe, Warehouse, Truck, Shield, Headphones } from "lucide-react";

const team = [
  { icon: ShoppingCart, name: "Sales & Marketing", color: "hsl(80 50% 31%)" },
  { icon: Globe, name: "Procurement", color: "hsl(140 50% 19%)" },
  { icon: Warehouse, name: "Warehousing", color: "hsl(150 40% 10%)" },
  { icon: Truck, name: "Logistics", color: "hsl(75 38% 45%)" },
  { icon: Shield, name: "Quality Control", color: "hsl(80 50% 31%)" },
  { icon: Headphones, name: "Customer Service", color: "hsl(140 50% 19%)" },
];

const duplicatedTeam = [...team, ...team];

const TeamSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={sectionRef} className="relative min-h-[80vh] overflow-hidden flex items-center bg-background">
      {/* Subtle animated orbs on white */}
      <div className="absolute inset-0">
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <div
            className="absolute w-[800px] h-[800px] -top-40 -left-40 rounded-full animate-orb opacity-[0.07]"
            style={{ background: "radial-gradient(circle, hsl(140 50% 19% / 0.5), transparent 70%)" }}
          />
          <div
            className="absolute w-[600px] h-[600px] top-1/2 right-0 rounded-full animate-orb opacity-[0.05]"
            style={{ background: "radial-gradient(circle, hsl(80 50% 31% / 0.4), transparent 70%)", animationDelay: "-7s", animationDuration: "25s" }}
          />
          <div
            className="absolute w-[500px] h-[500px] -bottom-20 left-1/3 rounded-full animate-orb opacity-[0.06]"
            style={{ background: "radial-gradient(circle, hsl(75 38% 45% / 0.4), transparent 70%)", animationDelay: "-14s", animationDuration: "30s" }}
          />
        </motion.div>
      </div>

      <div className="relative z-10 w-full py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-0 items-center max-w-[1600px] mx-auto px-6 lg:px-12">
          {/* Left — heading */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pr-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-body text-xs font-medium border border-accent/20 mb-6 tracking-[0.2em] uppercase">
              Our Team
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
              Three Decades
              <br />
              of <span className="text-gradient-gold">Excellence</span>
            </h2>
            <p className="text-muted-foreground font-body text-base lg:text-lg leading-relaxed max-w-md">
              Dedicated departments working together to deliver seamless solutions.
            </p>
          </motion.div>

          {/* Right — sliding cards */}
          <div className="overflow-hidden">
            <div className="flex gap-5 animate-marquee hover:[animation-play-state:paused] w-max">
              {duplicatedTeam.map((member, index) => {
                const Icon = member.icon;
                return (
                  <div
                    key={`${member.name}-${index}`}
                    className="flex-shrink-0 w-40 h-56 sm:w-48 sm:h-64 md:w-56 md:h-72 rounded-2xl overflow-hidden backdrop-blur-md bg-white/80 border border-border shadow-lg transition-all duration-500 hover:bg-white hover:shadow-xl hover:scale-105 hover:-translate-y-2 group cursor-pointer"
                  >
                    <div className="flex flex-col items-center justify-center h-full p-6 relative">
                      {/* Gradient accent top */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                        style={{ background: `linear-gradient(90deg, transparent, ${member.color}, transparent)` }}
                      />
                      <div
                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${member.color}22, ${member.color}0D)` }}
                      >
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-forest-mid group-hover:text-forest-deep transition-colors duration-300" />
                      </div>
                      <p className="text-foreground font-display text-sm md:text-base font-semibold text-center leading-tight">
                        {member.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
