import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ShoppingCart, Globe, Warehouse, Truck, Shield, Headphones } from "lucide-react";

const team = [
  { icon: ShoppingCart, name: "Sales & Marketing", role: "Commercial Team", bio: "Driving brand growth across HoReCa, Modern Trade, and General Trade channels island-wide.", color: "hsl(80 50% 31%)" },
  { icon: Globe, name: "Procurement", role: "Sourcing Team", bio: "Managing global supplier relationships across 8+ countries to secure the best products at competitive prices.", color: "hsl(140 50% 19%)" },
  { icon: Warehouse, name: "Warehousing", role: "Operations Team", bio: "Running customs-approved bonded warehouse facilities with cold-chain storage at -18°C.", color: "hsl(150 40% 10%)" },
  { icon: Truck, name: "Logistics", role: "Distribution Team", bio: "Ensuring reliable, on-time delivery through our island-wide distribution network.", color: "hsl(75 38% 45%)" },
  { icon: Shield, name: "Quality Control", role: "QA Team", bio: "Maintaining the highest food safety standards with rigorous quality checks at every stage.", color: "hsl(80 50% 31%)" },
  { icon: Headphones, name: "Customer Service", role: "Support Team", bio: "Providing responsive, dedicated support to our retail and wholesale partners.", color: "hsl(140 50% 19%)" },
];

const TeamSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => setActiveIndex((prev) => (prev + 1) % team.length), 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const getDistance = (index: number) => {
    const len = team.length;
    const diff = ((index - activeIndex + Math.floor(len / 2) + len) % len) - Math.floor(len / 2);
    return Math.abs(diff);
  };

  const getItemStyle = (index: number) => {
    const dist = getDistance(index);
    if (dist === 0) return { scale: 1.1, opacity: 1, y: -8 };
    if (dist === 1) return { scale: 0.9, opacity: 0.7, y: 0 };
    if (dist === 2) return { scale: 0.8, opacity: 0.45, y: 0 };
    return { scale: 0.75, opacity: 0.3, y: 0 };
  };

  const activeMember = team[activeIndex];
  const ActiveIcon = activeMember.icon;

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium border border-accent/20 mb-8 tracking-widest uppercase">
            Our Team
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
            Three Decades of
            <br />
            <span className="text-gradient-gold">Industry Experience</span>
          </h2>
          <p className="text-primary-foreground/40 font-body text-lg leading-relaxed">
            Dedicated departments working together to deliver seamless import-to-distribution solutions
          </p>
        </motion.div>

        {/* Blurred backdrop icon */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.06, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <ActiveIcon className="w-64 h-64 text-accent" />
            </motion.div>
          </AnimatePresence>

          {/* Horizontal Carousel */}
          <div
            className="flex items-center justify-center gap-3 md:gap-5 overflow-hidden py-8 relative z-10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {team.map((member, index) => {
              const Icon = member.icon;
              const style = getItemStyle(index);
              const isActive = index === activeIndex;

              return (
                <motion.div
                  key={member.name}
                  onClick={() => setActiveIndex(index)}
                  className="cursor-pointer flex-shrink-0"
                  animate={{ scale: style.scale, opacity: style.opacity, y: style.y }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className={`relative w-28 h-36 sm:w-36 sm:h-44 md:w-44 md:h-56 lg:w-52 lg:h-64 rounded-2xl overflow-hidden transition-shadow duration-500 ${
                      isActive ? "shadow-[0_0_40px_hsl(75_38%_45%_/_0.3)] ring-2 ring-accent/40" : "shadow-lg"
                    }`}
                    style={{ background: `linear-gradient(160deg, ${member.color}, hsl(150 40% 10%))` }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className={`transition-all duration-500 ${isActive ? "w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 text-primary-foreground/90" : "w-10 h-10 md:w-12 md:h-12 text-primary-foreground/40"}`} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-primary-foreground font-display text-xs sm:text-sm md:text-base font-bold leading-tight">{member.name}</p>
                    </div>
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-accent/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Active member info */}
        <div className="mt-16 text-center max-w-2xl mx-auto min-h-[140px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2 tracking-tight">{activeMember.name}</h3>
              <p className="text-accent font-body text-base font-medium mb-4">{activeMember.role}</p>
              <p className="text-primary-foreground/40 font-body text-base md:text-lg leading-relaxed">{activeMember.bio}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-3 mt-10">
          {team.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
              style={{ width: activeIndex === i ? 32 : 8 }}
            >
              <div className="absolute inset-0 bg-primary-foreground/15 rounded-full" />
              {activeIndex === i && (
                <motion.div
                  className="absolute inset-0 bg-accent rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 4, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
