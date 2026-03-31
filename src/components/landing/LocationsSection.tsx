import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useRef } from "react";

const locations = [
  { region: "Middle East", countries: "UAE, Saudi Arabia, Qatar, Oman, Bahrain, Kuwait" },
  { region: "Southeast Asia", countries: "Thailand, Vietnam, Indonesia, Malaysia, Philippines" },
  { region: "East Africa", countries: "Kenya, Tanzania, Ethiopia, Uganda, Rwanda" },
  { region: "South Asia", countries: "India, Sri Lanka, Pakistan, Bangladesh, Nepal" },
  { region: "Mediterranean", countries: "Turkey, Greece, Egypt, Morocco, Tunisia" },
  { region: "Latin America", countries: "Brazil, Colombia, Peru, Chile, Argentina" },
];

const LocationsSection = () => {
  return (
    <section className="relative overflow-hidden py-28 lg:py-36">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium border border-accent/20 mb-8 tracking-widest uppercase">
            Our Reach
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
            Locations We Cover
          </h2>
          <p className="text-primary-foreground/40 font-body text-lg leading-relaxed">
            Our global sourcing network spans six continents, connecting you with the finest food products worldwide
          </p>
        </motion.div>

        {/* Connecting dotted line */}
        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 w-[80%] h-[1px] border-t border-dashed border-accent/15 z-0" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.region}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
                y: { type: "spring", stiffness: 200, damping: 15 },
              }}
              whileHover={{ y: -10, scale: 1.03, transition: { duration: 0.25 } }}
              className="group relative p-10 rounded-2xl glass hover:shadow-xl hover:shadow-accent/15 transition-all duration-500"
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 rounded-xl bg-accent/15 flex items-center justify-center mb-7 shadow-lg shadow-accent/10 group-hover:bg-accent/25 group-hover:shadow-[0_0_20px_hsl(75_38%_45%_/_0.2)] transition-all duration-500"
              >
                <MapPin className="w-6 h-6 text-accent" />
              </motion.div>
              <h3 className="font-display text-xl font-semibold text-primary-foreground mb-4 tracking-tight">{loc.region}</h3>
              <p className="text-primary-foreground/40 font-body leading-relaxed text-sm">{loc.countries}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
