import { useInView } from "@/hooks/useInView";

const logos = ["ADIRA", "ADIRA INC", "Holcim", "MNC", "TELKOMSEL"];

const LogoStrip = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="snap-section-auto bg-background py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className={`text-center text-muted-foreground font-body text-sm uppercase tracking-[0.2em] mb-10 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          Trusted by Leading Companies
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-marquee w-max">
          {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-12 flex items-center justify-center h-16 px-8 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/60 hover:border-accent/30 transition-all duration-300 group cursor-default"
            >
              <span className="font-display text-lg font-semibold text-muted-foreground/60 group-hover:text-foreground transition-colors duration-300 whitespace-nowrap">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoStrip;
