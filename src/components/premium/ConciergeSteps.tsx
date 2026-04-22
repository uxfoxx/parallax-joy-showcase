import { motion } from "framer-motion";
import { MessageCircle, ClipboardList, Package, Truck } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: MessageCircle,
    title: "You enquire",
    body: "Send us a message on WhatsApp. Tell us what you're looking for — a specific cut, a cheese board for an occasion, or simply a recommendation.",
  },
  {
    num: "02",
    icon: ClipboardList,
    title: "We respond",
    body: "Our concierge team shares the current catalogue, pricing, and availability — tailored to your needs. No browsing a static list.",
  },
  {
    num: "03",
    icon: Package,
    title: "We prepare",
    body: "Your order is hand-picked from our bonded warehouse, packed with temperature-control materials, and dispatched.",
  },
  {
    num: "04",
    icon: Truck,
    title: "We deliver",
    body: "Island-wide delivery through our own logistics fleet — cold-chain preserved from our warehouse to your door.",
  },
];

const ConciergeSteps = () => {
  return (
    <section className="relative py-28 bg-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary font-body text-xs font-medium border border-primary/15 mb-6 tracking-[0.3em] uppercase">
            How it works
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground italic tracking-tight max-w-3xl mx-auto leading-tight">
            A service, not a checkout.
          </h2>
        </motion.div>

        {/* Zig-zag numbered layout */}
        <div className="relative">
          {/* Connecting dashed vertical line behind steps */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <svg className="w-full h-full" viewBox="0 0 2 800" preserveAspectRatio="none">
              <motion.line
                x1="1"
                y1="0"
                x2="1"
                y2="800"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="4 6"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
          </div>

          <div className="space-y-16 md:space-y-28">
            {steps.map((step, i) => {
              const isRight = i % 2 === 0;
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
                    isRight ? "" : "md:[&>*:first-child]:order-2"
                  }`}
                >
                  {/* Content */}
                  <div className={`${isRight ? "md:text-right" : "md:text-left"}`}>
                    <div className="font-display text-7xl md:text-8xl font-black text-foreground/[0.08] leading-none mb-3 tabular-nums">
                      {step.num}
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground italic mb-4 leading-tight">
                      {step.title}
                    </h3>
                    <p className="font-body text-muted-foreground leading-relaxed max-w-md md:inline-block">
                      {step.body}
                    </p>
                  </div>
                  {/* Icon */}
                  <div className={`flex ${isRight ? "md:justify-start" : "md:justify-end"}`}>
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-accent/20 to-primary/10 border border-accent/30 flex items-center justify-center shadow-lg shadow-accent/5">
                      <Icon className="w-10 h-10 md:w-12 md:h-12 text-accent" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConciergeSteps;
