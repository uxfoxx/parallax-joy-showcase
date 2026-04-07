import { motion } from "framer-motion";
import { Snowflake, Milk, Wheat, Droplets, Sparkles, Coffee, Cookie, Fish, Beef, Apple, ShoppingBasket } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  frozen: Snowflake,
  dairy: Milk,
  cheese: Milk,
  butter: Milk,
  oil: Droplets,
  flour: Wheat,
  grain: Wheat,
  rice: Wheat,
  pasta: Wheat,
  grocery: ShoppingBasket,
  beverage: Coffee,
  chocolate: Cookie,
  pastry: Cookie,
  seafood: Fish,
  meat: Beef,
  fruit: Apple,
};

// Per-category color themes: [gradientFrom, gradientTo, iconColor, borderHover]
const colorMap: Record<string, [string, string, string, string]> = {
  frozen:    ["from-blue-50",   "to-cyan-50",    "text-blue-500",    "hover:border-blue-200"],
  dairy:     ["from-yellow-50", "to-amber-50",   "text-amber-500",   "hover:border-amber-200"],
  cheese:    ["from-yellow-50", "to-orange-50",  "text-amber-600",   "hover:border-amber-200"],
  butter:    ["from-amber-50",  "to-yellow-50",  "text-amber-500",   "hover:border-amber-200"],
  oil:       ["from-lime-50",   "to-green-50",   "text-lime-600",    "hover:border-lime-200"],
  flour:     ["from-orange-50", "to-yellow-50",  "text-orange-400",  "hover:border-orange-200"],
  grain:     ["from-orange-50", "to-amber-50",   "text-orange-400",  "hover:border-orange-200"],
  rice:      ["from-stone-50",  "to-amber-50",   "text-stone-500",   "hover:border-stone-200"],
  pasta:     ["from-amber-50",  "to-orange-50",  "text-amber-600",   "hover:border-amber-200"],
  grocery:   ["from-green-50",  "to-emerald-50", "text-emerald-500", "hover:border-emerald-200"],
  beverage:  ["from-brown-50",  "to-amber-50",   "text-amber-700",   "hover:border-amber-200"],
  chocolate: ["from-amber-50",  "to-orange-50",  "text-amber-700",   "hover:border-amber-200"],
  pastry:    ["from-pink-50",   "to-rose-50",    "text-rose-400",    "hover:border-rose-200"],
  seafood:   ["from-sky-50",    "to-blue-50",    "text-sky-500",     "hover:border-sky-200"],
  meat:      ["from-red-50",    "to-rose-50",    "text-red-500",     "hover:border-red-200"],
  fruit:     ["from-green-50",  "to-lime-50",    "text-green-500",   "hover:border-green-200"],
};

const getIcon = (name: string): LucideIcon => {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lower.includes(key)) return icon;
  }
  return Sparkles;
};

const getColors = (name: string): [string, string, string, string] => {
  const lower = name.toLowerCase();
  for (const [key, colors] of Object.entries(colorMap)) {
    if (lower.includes(key)) return colors;
  }
  return ["from-accent/5", "to-forest-mid/5", "text-accent", "hover:border-accent/30"];
};

const CategoryCard = ({ name, desc, icon: Icon, index }: { name: string; desc: string; icon: LucideIcon; index: number }) => {
  const [gradFrom, gradTo, iconColor, borderHover] = getColors(name);

  return (
    <Link to={`/products?category=${encodeURIComponent(name)}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        whileHover={{ y: -8 }}
        className={`group p-6 rounded-xl border border-border bg-gradient-to-br ${gradFrom} ${gradTo} ${borderHover} hover:shadow-xl transition-all duration-500 cursor-pointer relative overflow-hidden`}
      >
        {/* Left accent border on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl bg-current opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className={`w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center mb-5 shadow-sm`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </motion.div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 tracking-tight group-hover:text-forest-deep transition-colors duration-300">{name}</h3>
        <p className="text-muted-foreground font-body text-sm leading-relaxed">{desc}</p>
      </motion.div>
    </Link>
  );
};

const CategoriesSection = () => {
  const { data: allCategories = [] } = useCategories();
  const categories = allCategories.slice(0, 5);

  return (
    <section id="brands" className="relative py-28 lg:py-36 bg-background overflow-hidden">
      <div className="absolute w-[700px] h-[500px] top-1/4 left-1/2 -translate-x-1/2 rounded-full opacity-[0.05] pointer-events-none" style={{ background: "radial-gradient(ellipse, hsl(75 38% 45%), transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 tracking-tight">Product Categories</h2>
          <p className="text-muted-foreground font-body text-base leading-relaxed">We import and distribute across all major food categories, ensuring variety and quality for every business need.</p>
        </motion.div>

        {/* Mobile: horizontal scroll / Desktop: grid */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {categories.slice(0, 3).map((cat, i) => {
            const Icon = getIcon(cat.name);
            return (
              <div key={cat.id} className="min-w-[260px] sm:min-w-0 snap-start shrink-0 sm:shrink sm:snap-none">
                <CategoryCard name={cat.name} desc={cat.description || ""} icon={Icon} index={i} />
              </div>
            );
          })}
        </div>

        {categories.length > 3 && (
          <div className="hidden sm:grid sm:grid-cols-2 mt-5 max-w-2xl mx-auto lg:max-w-none lg:grid-cols-2 lg:px-[16.666%] gap-5">
            {categories.slice(3, 5).map((cat, i) => {
              const Icon = getIcon(cat.name);
              return (
                <CategoryCard key={cat.id} name={cat.name} desc={cat.description || ""} icon={Icon} index={i + 3} />
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link to="/products">
            <Button className="bg-forest-deep text-white hover:bg-forest-deep/90 font-body rounded-lg px-8 py-5 transition-all duration-300 border border-forest-deep/20 hover:shadow-lg">
              View All Categories →
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
