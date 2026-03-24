import { motion } from "framer-motion";
import { FileText, Rocket, TrendingUp } from "lucide-react";
import { useMouseGradient } from "@/hooks/useMouseGradient";

const features = [
  {
    icon: FileText,
    title: "Quality Assurance",
    desc: "No in-app analytics. No middle servers. Your prompts are sent directly to budget.",
  },
  {
    icon: Rocket,
    title: "Global Sourcing",
    desc: "Bank-level security ensures your and data are safe. We use authentication for your peace.",
  },
  {
    icon: TrendingUp,
    title: "Efficient Distribution",
    desc: "Track all your expenses in one place. Easily track transactions and monitor your spending habits.",
  },
];

const WhyChooseUs = () => {
  const { ref, gradientStyle } = useMouseGradient();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} id="about" className="snap-section flex items-center relative overflow-hidden">
      {/* Animated dark gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, #5C7928 0%, #194B22 24%, #08120A 100%)`,
        }}
      />

      {/* Mouse-follow gradient */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={gradientStyle} />

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-accent/10 blur-[80px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-28 w-full">
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
            Reliable Food Import Solutions
            <br />
            for Your Business
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
              className="group relative p-10 rounded-2xl border border-primary-foreground/10 hover:border-primary-foreground/20 transition-all duration-500 hover:shadow-xl hover:shadow-forest-mid/20 shine-sweep"
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
