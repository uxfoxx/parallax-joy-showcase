import { motion } from "framer-motion";
import { Wheat, Coffee, Milk, Snowflake } from "lucide-react";

const categories = [
  {
    name: "Processed Foods",
    desc: "Premium canned goods, sauces, condiments, and ready-to-use ingredients from trusted international producers.",
    icon: Wheat,
  },
  {
    name: "Grains & Staples",
    desc: "High-quality rice, flour, pasta, pulses, and cereals sourced from the world's finest agricultural regions.",
    icon: Coffee,
  },
  {
    name: "Beverages",
    desc: "Specialty teas, coffees, juices, and drink concentrates — carefully curated for flavour and freshness.",
    icon: Coffee,
  },
  {
    name: "Dairy & Frozen",
    desc: "Temperature-controlled dairy products, frozen vegetables, seafood, and desserts delivered in perfect condition.",
    icon: Snowflake,
  },
];

const CategoriesSection = () => {
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
            Categories
          </h2>
          <p className="text-muted-foreground font-body text-base leading-relaxed">
            We source and distribute across all major food categories, ensuring variety and quality for every business need.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
