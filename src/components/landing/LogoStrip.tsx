import { Link } from "react-router-dom";
import SplitText from "@/components/motion/SplitText";
import MarqueeRow from "@/components/motion/MarqueeRow";
import { useBrands } from "@/lib/api";

/**
 * "Our Brand Partners" — velocity-reactive marquee of real brand logos.
 * Logos are unified with `brightness-0 invert opacity-70` so disparate
 * colored marks read as a coherent set against the dark forest background.
 */
const LogoStrip = () => {
  const { data: brands = [] } = useBrands();

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <SplitText
          text="Our Brand Partners"
          by="letter"
          stagger={0.025}
          as="p"
          className="text-center text-primary-foreground/40 font-body text-sm uppercase tracking-[0.25em] mb-10"
        />
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-forest-deep/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-forest-deep/80 to-transparent z-10 pointer-events-none" />

        {brands.length > 0 && (
          <MarqueeRow baseVelocity={30} direction={-1} repeat={3}>
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/brands/${brand.slug}`}
                aria-label={brand.name}
                className="group flex-shrink-0 flex items-center justify-center h-16 md:h-20 px-8 md:px-10"
              >
                {brand.image_url ? (
                  <img
                    src={brand.image_url}
                    alt={`${brand.name} logo`}
                    loading="lazy"
                    className="h-full w-auto max-w-[180px] object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <span className="font-display text-xl font-bold text-primary-foreground/30 group-hover:text-primary-foreground/80 transition-colors duration-300 whitespace-nowrap">
                    {brand.name}
                  </span>
                )}
              </Link>
            ))}
          </MarqueeRow>
        )}
      </div>
    </section>
  );
};

export default LogoStrip;
