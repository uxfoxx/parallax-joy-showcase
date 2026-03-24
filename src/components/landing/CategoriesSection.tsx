import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

const categories = [
  {
    name: "Processed Foods",
    desc: "Effortlessly configure your preferred keyboard shortcuts, enabling seamless integration.",
  },
  {
    name: "Grains & Staples",
    desc: "Effortlessly configure your preferred keyboard shortcuts, enabling seamless integration.",
  },
  {
    name: "Beverages",
    desc: "Effortlessly configure your preferred keyboard shortcuts, enabling seamless integration.",
  },
  {
    name: "Dairy & Frozen",
    desc: "Effortlessly configure your preferred keyboard shortcuts, enabling seamless integration.",
  },
];

const CategoriesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = categories.length - 2;

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <section id="brands" className="snap-section flex items-center bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28 w-full">
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
            This customization increases Claypro's flexibility and usefulness, making it a powerful
            tool for a wide range of professionals.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="overflow-hidden">
          <div
            className="flex gap-8 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * (50 + 2)}%)` }}
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="flex-shrink-0 w-[calc(50%-16px)] rounded-2xl overflow-hidden group shine-sweep border border-primary-foreground/5 hover:shadow-xl transition-shadow duration-500"
              >
                <div
                  className="h-full"
                  style={{
                    background: `
                      radial-gradient(ellipse at 50% 0%, hsl(140 35% 22% / 0.6) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 100%, hsl(140 30% 16% / 0.4) 0%, transparent 50%),
                      linear-gradient(180deg, hsl(140 40% 14%), hsl(140 45% 11%), hsl(140 40% 13%))
                    `,
                  }}
                >
                  {/* Icon placeholder */}
                  <div className="p-10 pb-8">
                    <motion.div
                      whileHover={{ scale: 1.08, rotate: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-20 h-20 rounded-xl bg-primary-foreground flex items-center justify-center mb-10 shadow-lg shadow-primary-foreground/10"
                    >
                      <svg viewBox="0 0 60 60" className="w-12 h-12">
                        <polygon
                          points="30,8 42,18 42,32 30,42 18,32 18,18"
                          fill="none"
                          stroke="hsl(200, 70%, 55%)"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points="30,14 38,21 38,29 30,36 22,29 22,21"
                          fill="hsl(200, 70%, 55%)"
                          fillOpacity="0.3"
                        />
                        <circle cx="36" cy="16" r="1.5" fill="hsl(200, 70%, 55%)" />
                        <circle cx="36" cy="20" r="1.5" fill="hsl(200, 70%, 55%)" />
                        <circle cx="36" cy="24" r="1.5" fill="hsl(200, 70%, 55%)" />
                      </svg>
                    </motion.div>

                    <h3 className="font-display text-2xl font-semibold text-primary-foreground mb-4 tracking-tight">
                      {cat.name}
                    </h3>
                    <p className="text-primary-foreground/45 font-body text-sm leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-10">
          {/* Dots */}
          <div className="flex gap-2.5 items-center">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`rounded-full transition-all duration-400 ${
                  i === currentIndex
                    ? "bg-foreground w-7 h-3"
                    : "bg-muted-foreground/30 w-3 h-3 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              disabled={currentIndex === maxIndex}
              className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowUpRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              disabled={currentIndex === 0}
              className="w-12 h-12 rounded-full bg-muted border border-border text-foreground flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowDownLeft className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
