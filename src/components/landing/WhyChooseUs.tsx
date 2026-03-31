import { motion } from "framer-motion";
import { ShieldCheck, Globe, Truck } from "lucide-react";
import { useMouseGradient } from "@/hooks/useMouseGradient";

const features = [
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    desc: "Every product undergoes rigorous laboratory testing, certification verification, and compliance checks with international food safety standards before reaching you.",
  },
  {
    icon: Globe,
    title: "Global Sourcing",
    desc: "Our network spans 25+ countries with long-term partnerships with certified producers, farmers, and artisans — ensuring consistent quality and supply.",
  },
  {
    icon: Truck,
    title: "Efficient Distribution",
    desc: "Temperature-controlled logistics and optimized cold-chain infrastructure ensure your products arrive fresh, on time, and in perfect condition.",
  },
];

const WhyChooseUs = () => {
  const { ref, gradientStyle } = useMouseGradient();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} id="about" className="relative overflow-hidden py-28 lg:py-36">
      {/* Standardized dark gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, hsl(140 35% 18% / 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, hsl(140 30% 14% / 0.4) 0%, transparent 50%),
            linear-gradient(180deg, hsl(140 45% 8%), hsl(140 40% 12%), hsl(140 45% 8%))
          `,
        }}
      />

      {/* Mouse-follow gradient */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-30" style={gradientStyle} />

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
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
            Reliable Food Import
            <br />
            Solutions for Your Business
          </h2>
          <p className="text-primary-foreground/45 font-body text-lg leading-relaxed">
            We simplify sourcing with a strong global network, strict quality control, and efficient logistics
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative p-10 rounded-2xl border border-primary-foreground/10 hover:border-primary-foreground/20 transition-all duration-500 hover:shadow-xl hover:shadow-forest-mid/20"
              style={{
                background: `
                  radial-gradient(ellipse at 30% 20%, hsl(140 30% 16% / 0.4) 0%, transparent 60%),
                  linear-gradient(180deg, hsl(140 40% 12%), hsl(140 45% 10%))
                `,
              }}
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 rounded-xl bg-primary-foreground flex items-center justify-center mb-7 shadow-lg shadow-primary-foreground/10"
              >
                <f.icon className="w-6 h-6 text-forest-deep" />
              </motion.div>
              <h3 className="font-display text-xl font-semibold text-primary-foreground mb-4 tracking-tight">
                {f.title}
              </h3>
              <p className="text-primary-foreground/45 font-body leading-relaxed text-sm">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
