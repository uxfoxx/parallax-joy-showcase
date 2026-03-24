import { useInView } from "@/hooks/useInView";
import { MapPin } from "lucide-react";

const locations = [
  { region: "Middle East", countries: "UAE, Saudi Arabia, Qatar, Oman, Bahrain, Kuwait" },
  { region: "Southeast Asia", countries: "Thailand, Vietnam, Indonesia, Malaysia, Philippines" },
  { region: "East Africa", countries: "Kenya, Tanzania, Ethiopia, Uganda, Rwanda" },
  { region: "South Asia", countries: "India, Sri Lanka, Pakistan, Bangladesh, Nepal" },
  { region: "Mediterranean", countries: "Turkey, Greece, Egypt, Morocco, Tunisia" },
  { region: "Latin America", countries: "Brazil, Colombia, Peru, Chile, Argentina" },
];

const LocationsSection = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="snap-section flex items-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, #5C7928 0%, #194B22 24%, #08120A 100%)`,
        }}
      />

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-accent/10 blur-[80px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 mb-6">
            Our Reach
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-5 leading-tight">
            Locations We Cover
          </h2>
          <p className="text-primary-foreground/50 font-body text-lg">
            Our global sourcing network spans six continents, connecting you with the finest food products worldwide
          </p>
        </div>

        {/* Location cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc, i) => (
            <div
              key={loc.region}
              className={`group relative p-8 rounded-2xl border border-primary-foreground/10 hover:border-primary-foreground/20 transition-all duration-500 hover:shadow-xl hover:shadow-forest-mid/20 hover:-translate-y-1 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{
                transitionDelay: isInView ? `${i * 100}ms` : "0ms",
                background: `
                  radial-gradient(ellipse at 30% 20%, hsl(140 30% 16% / 0.4) 0%, transparent 60%),
                  linear-gradient(180deg, hsl(140 40% 12%), hsl(140 45% 10%))
                `,
              }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary-foreground flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6 text-forest-deep" />
              </div>
              <h3 className="font-display text-xl font-semibold text-primary-foreground mb-3">
                {loc.region}
              </h3>
              <p className="text-primary-foreground/50 font-body leading-relaxed text-sm">
                {loc.countries}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
