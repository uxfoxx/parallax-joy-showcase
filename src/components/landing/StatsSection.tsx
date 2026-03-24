import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
              Numbers That Speak for{" "}
              <span className="text-gradient-gold">Themselves</span>
            </h2>
            <p className="text-muted-foreground font-body text-lg leading-relaxed max-w-lg">
              Over a decade of importing excellence, connecting global suppliers with local businesses. Our track record speaks volumes about our commitment to quality.
            </p>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link to="/products">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-full px-8 py-6 text-base transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 group">
                  Browse Catalog
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — Staggered Stats grid */}
          <div className="grid grid-cols-2 gap-7">
            {stats.map((stat, i) => (
              <div key={stat.label} className={i % 2 === 1 ? "mt-10" : ""}>
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="p-7 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all duration-500 hover:shadow-lg group glow-border"
    >
      <div className="font-display text-4xl lg:text-5xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
        {count}{stat.suffix}
      </div>
      <p className="text-muted-foreground font-body text-sm mt-3 tracking-wide">{stat.label}</p>
    </motion.div>
  );
};

export default StatsSection;
