import Marquee from "react-fast-marquee";
import { PROVENANCE_COUNTRIES } from "./premiumConstants";

const ProvenanceTicker = () => {
  return (
    <section className="relative bg-black border-y border-white/10 py-4 overflow-hidden">
      <Marquee gradient={false} speed={30} pauseOnHover>
        {PROVENANCE_COUNTRIES.concat(PROVENANCE_COUNTRIES).map((country, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 mx-8 font-display text-lg md:text-xl font-medium text-white/40"
          >
            <span className="text-gradient-gold italic">{country}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
          </span>
        ))}
      </Marquee>
    </section>
  );
};

export default ProvenanceTicker;
