import SplitText from "@/components/motion/SplitText";
import MarqueeRow from "@/components/motion/MarqueeRow";
import { usePartnerLogos } from "@/lib/api";

/**
 * "Our Brand Partners" — velocity-reactive marquee of real brand logos.
 * Logos are unified with `brightness-0 invert opacity-70` so disparate
 * colored marks read as a coherent set against the dark forest background.
 */
const LogoStrip = () => {
  const { data: logos = [] } = usePartnerLogos({ onlyActive: true });

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

        {logos.length > 0 && (
          <MarqueeRow baseVelocity={30} direction={-1} repeat={3}>
            {logos.map((logo) => {
              const tileClass =
                "group flex-shrink-0 flex items-center justify-center h-16 md:h-20 px-8 md:px-10";
              const inner = (
                <img
                  src={logo.image_url}
                  alt={`${logo.name} logo`}
                  loading="lazy"
                  className="h-full w-auto max-w-[180px] object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[1.04]"
                />
              );
              return logo.link_url ? (
                <a
                  key={logo.id}
                  href={logo.link_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={logo.name}
                  className={tileClass}
                >
                  {inner}
                </a>
              ) : (
                <span key={logo.id} aria-label={logo.name} className={tileClass}>
                  {inner}
                </span>
              );
            })}
          </MarqueeRow>
        )}
      </div>
    </section>
  );
};

export default LogoStrip;
