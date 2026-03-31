import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Handshake, Globe, GitBranch } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCallback, useRef, useState } from "react";

const stats = [
  { value: 30, suffix: "+", label: "Years of Experience", icon: Calendar, featured: true },
  { value: 8, suffix: "+", label: "Brand Partners", icon: Handshake, featured: false },
  { value: 8, suffix: "+", label: "Countries Sourced", icon: Globe, featured: false },
  { value: 3, suffix: "", label: "Distribution Channels", icon: GitBranch, featured: false },
];

const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    setTilt({ x, y });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setIsHovered(false); }}
      className={`relative group ${className}`}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isHovered
            ? "conic-gradient(from 180deg, hsl(75 38% 45% / 0.4), hsl(140 50% 19% / 0.4), hsl(75 40% 60% / 0.4), hsl(75 38% 45% / 0.4))"
            : "transparent",
          filter: "blur(1px)",
        }}
      />
      <div className="relative rounded-2xl glass p-7 h-full transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-accent/10">
        {children}
      </div>
    </div>
  );
};

const StatsSection = () => {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className="relative py-28 lg:py-36 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight tracking-tight">
              Three Decades of{" "}
              <span className="text-gradient-gold">Excellence</span>
            </h2>
            <p className="text-primary-foreground/40 font-body text-lg leading-relaxed max-w-lg">
              Over 30 years of importing excellence, connecting global suppliers with Sri Lankan businesses. Sourcing from Australia, Italy, Netherlands, Thailand, Singapore, UAE, India, and China.
            </p>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link to="/products">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-xl px-8 h-12 text-base transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 group">
                  View Products
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — Bento Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-2"
            >
              <TiltCard>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-primary-foreground/50 font-body text-sm tracking-wide">{stats[0].label}</p>
                </div>
                <div className="font-display text-5xl lg:text-6xl font-bold text-primary-foreground group-hover:text-accent transition-colors duration-300 mb-5">
                  <CountValue target={stats[0].value} isInView={isInView} />{stats[0].suffix}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {[1994, 2004, 2014, 2024].map((year, i) => (
                    <div key={year} className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-accent/50 group-hover:bg-accent transition-colors duration-300" />
                        <span className="text-[10px] text-primary-foreground/40 font-body mt-1.5">{year}</span>
                      </div>
                      {i < 3 && <div className="flex-1 h-[1px] bg-primary-foreground/10 group-hover:bg-accent/30 transition-colors duration-500" />}
                    </div>
                  ))}
                </div>
              </TiltCard>
            </motion.div>

            {stats.slice(1).map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard>
                  <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center mb-4">
                    <stat.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div className="font-display text-4xl lg:text-5xl font-bold text-primary-foreground group-hover:text-accent transition-colors duration-300">
                    <CountValue target={stat.value} isInView={isInView} />{stat.suffix}
                  </div>
                  <p className="text-primary-foreground/40 font-body text-sm mt-3 tracking-wide">{stat.label}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CountValue = ({ target, isInView }: { target: number; isInView: boolean }) => {
  const count = useCountUp(target, isInView, 2000);
  return <>{count}</>;
};

export default StatsSection;
