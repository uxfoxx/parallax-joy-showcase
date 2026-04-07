import { motion, useMotionValue, useTransform, useSpring, useScroll } from "framer-motion";
import { Snowflake, Milk, Wheat, Droplets, Sparkles, Coffee, Cookie, Fish, Beef, Apple, ShoppingBasket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  frozen:    Snowflake,
  dairy:     Milk,
  cheese:    Milk,
  butter:    Milk,
  oil:       Droplets,
  flour:     Wheat,
  grain:     Wheat,
  rice:      Wheat,
  pasta:     Wheat,
  grocery:   ShoppingBasket,
  beverage:  Coffee,
  chocolate: Cookie,
  pastry:    Cookie,
  seafood:   Fish,
  meat:      Beef,
  fruit:     Apple,
};

const colorMap: Record<string, { iconClass: string; iconBg: string }> = {
  frozen:    { iconClass: "text-sky-500",     iconBg: "bg-sky-50" },
  dairy:     { iconClass: "text-amber-500",   iconBg: "bg-amber-50" },
  cheese:    { iconClass: "text-orange-500",  iconBg: "bg-orange-50" },
  butter:    { iconClass: "text-amber-500",   iconBg: "bg-amber-50" },
  oil:       { iconClass: "text-lime-600",    iconBg: "bg-lime-50" },
  flour:     { iconClass: "text-orange-400",  iconBg: "bg-orange-50" },
  grain:     { iconClass: "text-amber-600",   iconBg: "bg-amber-50" },
  rice:      { iconClass: "text-stone-500",   iconBg: "bg-stone-50" },
  pasta:     { iconClass: "text-amber-600",   iconBg: "bg-amber-50" },
  grocery:   { iconClass: "text-emerald-600", iconBg: "bg-emerald-50" },
  beverage:  { iconClass: "text-amber-700",   iconBg: "bg-amber-50" },
  seafood:   { iconClass: "text-sky-500",     iconBg: "bg-sky-50" },
  meat:      { iconClass: "text-red-500",     iconBg: "bg-red-50" },
  fruit:     { iconClass: "text-green-600",   iconBg: "bg-green-50" },
};

const getIcon = (name: string): LucideIcon => {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lower.includes(key)) return icon;
  }
  return Sparkles;
};

const getColors = (name: string) => {
  const lower = name.toLowerCase();
  for (const [key, colors] of Object.entries(colorMap)) {
    if (lower.includes(key)) return colors;
  }
  return { iconClass: "text-accent", iconBg: "bg-accent/10" };
};

const CategoryRow = ({
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
  const [hovered, setHovered] = useState(false);
  const { iconClass, iconBg } = getColors(name);

  return (
    <motion.div
      initial={{ opacity: 0, x: -48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
    >
      <Link to={`/products?category=${encodeURIComponent(name)}`}>
        {/* Hover background */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.22 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/[0.06] via-accent/[0.02] to-transparent pointer-events-none"
        />

        {/* Left accent bar */}
        <motion.div
          animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-3 bottom-3 w-[3px] bg-accent rounded-r-full origin-top"
        />

        <div className="relative flex items-center gap-5 md:gap-8 px-5 md:px-8 py-5 md:py-7">
          {/* Number */}
          <motion.span
            animate={{ color: hovered ? "hsl(var(--foreground) / 0.14)" : "hsl(var(--foreground) / 0.07)" }}
            transition={{ duration: 0.25 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-black select-none leading-none w-16 md:w-20 shrink-0 tabular-nums"
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <motion.h3
              animate={{ color: hovered ? "hsl(var(--forest-deep))" : "hsl(var(--foreground))" }}
              transition={{ duration: 0.25 }}
              className="font-display text-xl md:text-2xl lg:text-3xl font-bold leading-snug tracking-tight"
            >
              {name}
            </motion.h3>
            <motion.p
              animate={{ opacity: hovered ? 1 : 0.55, y: hovered ? 0 : 3 }}
              transition={{ duration: 0.3 }}
              className="font-body text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-lg"
            >
              {desc}
            </motion.p>
          </div>

          {/* Icon + arrow */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <motion.div
              animate={{
                scale: hovered ? 1.12 : 1,
                rotate: hovered ? 8 : 0,
              }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}
            >
              <Icon className={`w-5 h-5 ${iconClass}`} />
            </motion.div>
            <motion.div
              animate={{ x: hovered ? 6 : 0, opacity: hovered ? 1 : 0.3 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-5 h-5 text-accent" />
            </motion.div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mx-5 md:mx-8" />
      </Link>
    </motion.div>
  );
};

const CategoriesSection = () => {
  const { data: allCategories = [] } = useCategories();
  const categories = allCategories.slice(0, 5);

  const sectionRef = useRef<HTMLElement>(null);

  // Mouse parallax for watermark
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 90 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 90 });
  const wmarkX = useTransform(smoothX, [-0.5, 0.5], [-24, 24]);
  const wmarkY = useTransform(smoothY, [-0.5, 0.5], [-14, 14]);

  // Scroll parallax for watermark
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const wmarkScrollY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="relative overflow-hidden py-28 lg:py-36 bg-background"
      onMouseMove={handleMouseMove}
    >
      {/* Mouse + scroll parallax watermark */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
        style={{ x: wmarkX, y: wmarkScrollY }}
      >
        <span className="font-display font-black text-[15vw] text-foreground/[0.025] leading-none whitespace-nowrap tracking-tight">
          CATEGORIES
        </span>
      </motion.div>

      {/* Subtle accent orb */}
      <div
        className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-[280px] h-[280px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(140 50% 19%), transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mb-16"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium border border-accent/20 mb-8 tracking-widest uppercase">
            Product Categories
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight tracking-tight">
            Everything Your
            <br />
            <span className="text-gradient-gold">Business Needs</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            We import and distribute across all major food categories — quality and variety for every business need.
          </p>
        </motion.div>

        {/* Category rows */}
        <div className="border-t border-border">
          {categories.map((cat, i) => {
            const Icon = getIcon(cat.name);
            return (
              <CategoryRow
                key={cat.id}
                name={cat.name}
                desc={cat.description || "Premium imported products from global suppliers."}
                icon={Icon}
                index={i}
              />
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <Link to="/products">
            <Button className="bg-forest-deep text-white hover:bg-forest-deep/90 font-body font-semibold rounded-lg px-8 h-12 text-base transition-all duration-300 group">
              View All Products
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
