import { useMouseGradient } from "@/hooks/useMouseGradient";
import { useScrollSpeed } from "@/hooks/useScrollSpeed";

const HeroSection = () => {
  const { ref, gradientStyle } = useMouseGradient();
  useScrollSpeed();

  return (
    <section ref={ref} className="snap-section relative min-h-screen overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 25% 35%, hsl(140 50% 10% / 0.95) 0%, transparent 65%),
            radial-gradient(ellipse 50% 60% at 75% 25%, hsl(42 85% 52% / 0.18) 0%, transparent 55%),
            radial-gradient(ellipse 80% 55% at 50% 85%, hsl(140 40% 18% / 0.8) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 85% 65%, hsl(42 50% 92% / 0.1) 0%, transparent 45%),
            radial-gradient(ellipse 40% 40% at 10% 80%, hsl(45 90% 55% / 0.12) 0%, transparent 50%),
            linear-gradient(150deg, hsl(140 50% 8%) 0%, hsl(140 45% 14%) 35%, hsl(140 40% 10%) 70%, hsl(140 50% 8%) 100%)
          `,
          backgroundSize: '250% 250%',
          animation: `gradient-shift var(--gradient-duration, 18s) ease infinite`,
        }}
      />

      {/* Mouse-following radial glow */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-700"
        style={{
          ...gradientStyle,
          opacity: 0.25,
        }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 z-[2] opacity-[0.10] pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="heroNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#heroNoise)" />
        </svg>
      </div>

      {/* Full-height marquee text overlay — on top */}
      <div className="absolute inset-0 flex items-center pointer-events-none select-none z-10">
        <div className="w-full h-full overflow-hidden flex flex-col justify-center">
          <div className="animate-marquee flex whitespace-nowrap items-center h-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="text-[100vh] leading-[100vh] font-black uppercase tracking-tighter text-foreground/[0.06] mx-8"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                OLIVE FOODS
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
