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

const getIcon = (name: string): LucideIcon => {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lower.includes(key)) return icon;
  }
  return Sparkles;
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.slice(0, 3).map((cat, i) => {
            const Icon = getIcon(cat.name);
            return (
              <motion.div
                key={cat.id}
                custom={i}
                initial={flyInPositions[i]}
                whileInView={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", damping: 20, stiffness: 80, delay: i * 0.1 }}
                style={{ opacity: 0 }}
              >
                <CategoryCard name={cat.name} desc={cat.description || ""} icon={Icon} />
              </motion.div>
            );
          })}
        </div>
        {categories.length > 3 && (
          <div className="grid sm:grid-cols-2 mt-5 max-w-2xl mx-auto lg:max-w-none lg:grid-cols-2 lg:px-[16.666%] gap-5">
            {categories.slice(3, 5).map((cat, i) => {
              const Icon = getIcon(cat.name);
              return (
                <motion.div
                  key={cat.id}
                  custom={i + 3}
                  initial={flyInPositions[i + 3]}
                  whileInView={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ type: "spring", damping: 20, stiffness: 80, delay: (i + 3) * 0.1 }}
                  style={{ opacity: 0 }}
                >
                  <CategoryCard name={cat.name} desc={cat.description || ""} icon={Icon} />
                </motion.div>
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

const CategoryCard = ({ name, desc, icon: Icon }: { name: string; desc: string; icon: LucideIcon }) => (
  <Link to={`/products?category=${encodeURIComponent(name)}`}>
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group p-6 rounded-lg border border-border bg-card hover:border-forest-mid/30 hover:shadow-lg transition-all duration-500 cursor-pointer"
    >
      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }} className="w-14 h-14 rounded-xl bg-forest-deep/10 flex items-center justify-center mb-6">
        <Icon className="w-6 h-6 text-forest-mid" />
      </motion.div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-3 tracking-tight">{name}</h3>
      <p className="text-muted-foreground font-body text-sm leading-relaxed">{desc}</p>
    </motion.div>
  </Link>
);

export default CategoriesSection;
