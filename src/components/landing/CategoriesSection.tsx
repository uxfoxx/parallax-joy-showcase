import { motion, useScroll, useTransform } from "framer-motion";
import { Snowflake, Milk, Wheat, Droplets, Sparkles } from "lucide-react";

const categories = [
  {
    name: "Frozen",
    desc: "French fries, meats, seafood, fruits, and vegetables — stored and transported at -18°C for guaranteed freshness.",
    icon: Snowflake,
  },
  {
    name: "Dairy",
    desc: "Cheese, butter, cream, and specialty dairy products from leading international producers.",
    icon: Milk,
  },
  {
    name: "Grocery & Staples",
    desc: "Rice, pasta, canned goods, condiments, sauces, and everyday essentials from trusted global brands.",
    icon: Wheat,
  },
  {
    name: "Edible Oils",
    desc: "Premium vegetable oils, olive oils, and specialty cooking oils for commercial and retail use.",
    icon: Droplets,
  },
  {
    name: "Specialty Imports",
    desc: "Seasonal and premium international foods, gourmet ingredients, and exclusive brand offerings.",
    icon: Sparkles,
  },
];

const CategoriesSection = () => {
  const { scrollYProgress } = useScroll();

  // Fan-out effect: cards spread apart when element passes (~35-45%)
  const fanGap = useTransform(scrollYProgress, [0.32, 0.40, 0.48], [24, 48, 24]);

  return (
    <section id="brands" className="py-28 lg:py-36 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 tracking-tight">
            Product Categories
          </h2>
          <p className="text-muted-foreground font-body text-base leading-relaxed">
            We import and distribute across all major food categories, ensuring variety and quality for every business need.
          </p>
        </motion.div>

        {/* Grid — 5 cards: 3 top, 2 bottom centered */}
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: fanGap }}>
          {categories.slice(0, 3).map((cat, i) => (
            <CategoryCard key={cat.name} cat={cat} i={i} />
          ))}
        </motion.div>
        <motion.div
          className="grid sm:grid-cols-2 mt-6 max-w-2xl mx-auto lg:max-w-none lg:grid-cols-2 lg:px-[16.666%]"
          style={{ gap: fanGap }}
        >
          {categories.slice(3).map((cat, i) => (
            <CategoryCard key={cat.name} cat={cat} i={i + 3} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const CategoryCard = ({ cat, i }: { cat: typeof categories[0]; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: i * 0.1 }}
    whileHover={{ y: -6, transition: { duration: 0.3 } }}
    className="group p-8 rounded-2xl border border-border bg-card hover:border-forest-mid/30 hover:shadow-lg transition-all duration-500"
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="w-14 h-14 rounded-xl bg-forest-deep/10 flex items-center justify-center mb-6"
    >
      <cat.icon className="w-6 h-6 text-forest-mid" />
    </motion.div>

    <h3 className="font-display text-xl font-semibold text-foreground mb-3 tracking-tight">
      {cat.name}
    </h3>
    <p className="text-muted-foreground font-body text-sm leading-relaxed">
      {cat.desc}
    </p>
  </motion.div>
);

export default CategoriesSection;
