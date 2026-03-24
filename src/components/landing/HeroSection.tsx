const HeroSection = () => {
  return (
    <section className="snap-section relative min-h-screen overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 z-0 animate-gradient-shift"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 40%, hsl(var(--forest-deep) / 0.9) 0%, transparent 70%),
            radial-gradient(ellipse 60% 80% at 80% 30%, hsl(var(--gold) / 0.25) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 50% 80%, hsl(var(--forest-mid) / 0.7) 0%, transparent 65%),
            radial-gradient(ellipse 90% 70% at 70% 60%, hsl(var(--cream) / 0.15) 0%, transparent 50%),
            linear-gradient(135deg, hsl(var(--forest-deep)) 0%, hsl(var(--forest-mid)) 40%, hsl(var(--primary)) 100%)
          `,
          backgroundSize: '200% 200%',
        }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.12] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="heroNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
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
