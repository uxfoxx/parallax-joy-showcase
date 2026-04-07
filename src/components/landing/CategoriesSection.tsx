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

const darkColorMap: Record<string, { glow: string; iconClass: string }> = {
  frozen:   { glow: "hsl(200 65% 40%)", iconClass: "text-sky-400" },
  dairy:    { glow: "hsl(45 65% 45%)",  iconClass: "text-amber-400" },
  cheese:   { glow: "hsl(30 65% 45%)",  iconClass: "text-orange-400" },
  butter:   { glow: "hsl(45 60% 45%)",  iconClass: "text-amber-300" },
  oil:      { glow: "hsl(80 55% 35%)",  iconClass: "text-lime-400" },
  flour:    { glow: "hsl(30 60% 45%)",  iconClass: "text-orange-300" },
  grain:    { glow: "hsl(40 60% 40%)",  iconClass: "text-amber-300" },
  rice:     { glow: "hsl(40 50% 40%)",  iconClass: "text-amber-200" },
  pasta:    { glow: "hsl(35 65% 40%)",  iconClass: "text-amber-400" },
  grocery:  { glow: "hsl(140 50% 30%)", iconClass: "text-emerald-400" },
  beverage: { glow: "hsl(25 60% 40%)",  iconClass: "text-amber-500" },
  seafood:  { glow: "hsl(200 60% 40%)", iconClass: "text-sky-400" },
  meat:     { glow: "hsl(0 55% 40%)",   iconClass: "text-red-400" },
  fruit:    { glow: "hsl(100 50% 35%)", iconClass: "text-green-400" },
};

const getIcon = (name: string): LucideIcon => {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lower.includes(key)) return icon;
  }
  return Sparkles;
};

const getDarkColors = (name: string) => {
  const lower = name.toLowerCase();
  for (const [key, colors] of Object.entries(darkColorMap)) {
    if (lower.includes(key)) return colors;
  }
  return { glow: "hsl(75 45% 35%)", iconClass: "text-accent" };
};

const CategoryCard = ({
  name,
  desc,
  icon: Icon,
  index,
}: {
  name: string;
  desc: string;
  icon: LucideIcon;
  index: number;
}) => {
  const { glow, iconClass } = getDarkColors(name);

  return (
    <Link to={`/products?category=${encodeURIComponent(name)}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 60, filter: "blur(8px)", scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6 }}
        className="group relative p-6 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:border-white/[0.15] hover:bg-white/[0.07] transition-all duration-300 overflow-hidden cursor-pointer h-full"
      >
        {/* Per-category top glow */}
        <div
          className="absolute top-0 left-0 right-0 h-36 rounded-t-xl pointer-events-none opacity-[0.15]"
          style={{ background: `radial-gradient(ellipse at top, ${glow}, transparent 70%)` }}
        />

        {/* Watermark number */}
        <span className="absolute top-2 right-4 font-display text-8xl font-black text-white/[0.05] select-none leading-none pointer-events-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center relative z-10 group-hover:bg-white/15 transition-colors duration-300">
          <Icon className={`w-5 h-5 ${iconClass}`} />
        </div>

        {/* Name */}
        <h3 className="font-display text-xl font-semibold text-primary-foreground mt-4 mb-2 relative z-10 leading-snug tracking-tight">
          {name}
        </h3>

        {/* Description */}
        <p className="text-primary-foreground/55 font-body text-sm leading-relaxed relative z-10">
          {desc}
        </p>

        {/* Explore link */}
        <div className="mt-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-1 group-hover:translate-y-0 transition-transform">
          <span className="text-accent text-sm font-medium font-body">Explore →</span>
        </div>
      </motion.div>
    </Link>
  );
};

const CategoriesSection = () => {
  const { data: allCategories = [] } = useCategories();
  const categories = allCategories.slice(0, 5);

  return (
    <section
      id="categories"
      className="relative overflow-hidden py-28 lg:py-36"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, hsl(140 50% 19% / 0.5) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, hsl(150 40% 14% / 0.4) 0%, transparent 50%),
          linear-gradient(180deg, hsl(150 40% 6%), hsl(140 50% 14%), hsl(150 40% 10%))
        `,
      }}
    >
      {/* Decorative orbs */}
      <div
        className="absolute w-[500px] h-[500px] -top-32 -left-32 rounded-full opacity-[0.08] pointer-events-none animate-orb"
        style={{ background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)" }}
      />
      <div
        className="absolute w-[350px] h-[350px] bottom-0 right-10 rounded-full opacity-[0.06] pointer-events-none animate-orb"
        style={{ background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)", animationDelay: "7s" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 mb-8 tracking-widest uppercase">
            Product Categories
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
            Everything Your
            <br />
            <span className="text-gradient-gold">Business Needs</span>
          </h2>
          <p className="text-primary-foreground/60 font-body text-lg leading-relaxed">
            We import and distribute across all major food categories — quality and variety for every business need.
          </p>
        </motion.div>

        {/* Top row — 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {categories.slice(0, 3).map((cat, i) => {
            const Icon = getIcon(cat.name);
            return (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                desc={cat.description || "Premium imported products from global suppliers."}
                icon={Icon}
                index={i}
              />
            );
          })}
        </div>

        {/* Bottom row — 2 cards centered */}
        {categories.length > 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 sm:max-w-2xl sm:mx-auto lg:max-w-none lg:grid-cols-2 lg:px-[16.666%]">
            {categories.slice(3, 5).map((cat, i) => {
              const Icon = getIcon(cat.name);
              return (
                <CategoryCard
                  key={cat.id}
                  name={cat.name}
                  desc={cat.description || "Premium imported products from global suppliers."}
                  icon={Icon}
                  index={i + 3}
                />
              );
            })}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-14"
        >
          <Link to="/products">
            <Button
              className="bg-white/10 backdrop-blur-sm text-primary-foreground hover:bg-white/20 font-body font-semibold rounded-lg px-8 h-12 text-base transition-all duration-300 border border-white/10 hover:border-white/20 group"
            >
              View All Products
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1 inline-block">→</span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
