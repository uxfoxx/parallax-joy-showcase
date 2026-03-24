import { useInView } from "@/hooks/useInView";
import { FileText, Rocket, TrendingUp } from "lucide-react";

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
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} id="about" className="snap-section flex items-center relative overflow-hidden">
      {/* Animated dark gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, hsl(140 40% 18% / 0.7) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, hsl(140 35% 14% / 0.5) 0%, transparent 50%),
            linear-gradient(180deg, hsl(140 45% 8%), hsl(140 40% 10%), hsl(140 45% 8%))
          `,
        }}
      />

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-accent/10 blur-[80px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
        {/* Header — centered */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 mb-6">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-5 leading-tight">
            Reliable Food Import Solutions
            <br />
            for Your Business
          </h2>
          <p className="text-primary-foreground/50 font-body text-lg">
            We simplify sourcing with a strong global network, strict quality control, and efficient logistics
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group relative p-8 rounded-2xl border border-primary-foreground/10 hover:border-primary-foreground/20 transition-all duration-500 hover:shadow-xl hover:shadow-forest-mid/20 hover:-translate-y-1 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{
                transitionDelay: isInView ? `${i * 150}ms` : "0ms",
                background: `
                  radial-gradient(ellipse at 30% 20%, hsl(140 30% 16% / 0.4) 0%, transparent 60%),
                  linear-gradient(180deg, hsl(140 40% 12%), hsl(140 45% 10%))
                `,
              }}
            >
              {/* Icon — white rounded square with colored icon */}
              <div className="w-12 h-12 rounded-xl bg-primary-foreground flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="w-6 h-6 text-forest-deep" />
              </div>
              <h3 className="font-display text-xl font-semibold text-primary-foreground mb-3">
                {f.title}
              </h3>
              <p className="text-primary-foreground/50 font-body leading-relaxed text-sm">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
