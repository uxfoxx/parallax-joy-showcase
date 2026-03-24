import { motion } from "framer-motion";
import { Wheat, Coffee, Milk, Snowflake } from "lucide-react";

const categories = [
  {
    name: "Grains & Staples",
    desc: "Premium rice, flour, pasta, and wholegrains sourced from the world's top agricultural regions.",
    icon: Wheat,
  },
  {
    name: "Beverages",
    desc: "Specialty coffees, teas, juices, and craft drinks curated from artisan producers worldwide.",
    icon: Coffee,
  },
  {
    name: "Dairy & Frozen",
    desc: "European cheeses, butter, yogurts, and frozen goods maintained with strict cold-chain logistics.",
    icon: Milk,
  },
  {
    name: "Processed Foods",
    desc: "Ready-to-eat meals, canned goods, sauces, and condiments from trusted international brands.",
    icon: Snowflake,
  },
];

const CategoriesSection = () => {
  return (
    <section id="brands" className="snap-section-auto bg-background py-28">
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
            Explore our diverse range of premium food categories, each sourced with care from the world's finest producers.
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
              className="group rounded-2xl border border-border bg-card p-8 hover:border-forest-mid/30 hover:shadow-xl transition-all duration-500"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 rounded-xl bg-forest-deep/10 flex items-center justify-center mb-6"
              >
                <cat.icon className="w-7 h-7 text-forest-mid" />
              </motion.div>

              <h3 className="font-display text-xl font-semibold text-foreground mb-3 tracking-tight group-hover:text-forest-mid transition-colors">
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
