import { useInView } from "@/hooks/useInView";
import { Shield, Globe, Truck } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Quality Assurance",
    desc: "Every product undergoes rigorous quality checks ensuring only the finest items reach your shelves.",
  },
  {
    icon: Globe,
    title: "Global Sourcing",
    desc: "We partner with trusted suppliers across 25+ countries, bringing diverse flavors from around the world.",
  },
  {
    icon: Truck,
    title: "Efficient Distribution",
    desc: "Our streamlined logistics ensure timely delivery with temperature-controlled supply chain management.",
  },
];

const WhyChooseUs = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} id="about" className="snap-section flex items-center bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent-foreground font-body text-xs font-semibold uppercase tracking-[0.15em] border border-accent/20 mb-4">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Built on Trust & Excellence
          </h2>
          <p className="text-muted-foreground font-body text-lg">
            Decades of experience in food imports, delivering quality you can taste in every bite.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group relative p-8 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all duration-500 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: isInView ? `${i * 150}ms` : "0ms" }}
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                <f.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{f.title}</h3>
              <p className="text-muted-foreground font-body leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
