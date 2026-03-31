import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";
import { useMouseGradient } from "@/hooks/useMouseGradient";
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
  const { ref, gradientStyle } = useMouseGradient();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax bg
  const bgY = useTransform(scrollYProgress, [0, 1], ["-60px", "60px"]);
  const accentX = useTransform(scrollYProgress, [0, 1], ["20px", "-20px"]);

  return (
    <section
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLElement | null>).current = el;
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className="relative overflow-hidden py-28 lg:py-36"
    >
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

      {/* Parallax floating accent */}
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ y: bgY }}>
        <motion.div
          className="absolute w-[400px] h-[400px] top-20 -right-20 rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, hsl(42 70% 55%), transparent 70%)",
            x: accentX,
          }}
        />
        <div
          className="absolute w-[350px] h-[350px] -bottom-20 left-10 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsl(140 50% 25%), transparent 70%)" }}
        />
      </motion.div>

      {/* Mouse-follow gradient */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-30" style={gradientStyle} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 mb-8 tracking-widest uppercase">
            Our Reach
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
            Locations We Cover
          </h2>
          <p className="text-primary-foreground/45 font-body text-lg leading-relaxed">
            Our global sourcing network spans six continents, connecting you with the finest food products worldwide
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.region}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative p-10 rounded-2xl border border-primary-foreground/10 hover:border-primary-foreground/20 transition-all duration-500 hover:shadow-xl hover:shadow-forest-mid/20"
              style={{
                background: `
                  radial-gradient(ellipse at 30% 20%, hsl(140 30% 16% / 0.4) 0%, transparent 60%),
                  linear-gradient(180deg, hsl(140 40% 12%), hsl(140 45% 10%))
                `,
              }}
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 rounded-xl bg-primary-foreground flex items-center justify-center mb-7 shadow-lg shadow-primary-foreground/10"
              >
                <MapPin className="w-6 h-6 text-forest-deep" />
              </motion.div>
              <h3 className="font-display text-xl font-semibold text-primary-foreground mb-4 tracking-tight">
                {loc.region}
              </h3>
              <p className="text-primary-foreground/45 font-body leading-relaxed text-sm">
                {loc.countries}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
