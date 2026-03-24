import { lazy, Suspense } from "react";

const Hero3DScene = lazy(() => import("./Hero3DScene"));

const HeroSection = () => {
  return (
    <section className="snap-section relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0">
        <Suspense fallback={<div className="w-full h-full bg-background" />}>
          <Hero3DScene />
        </Suspense>
      </div>

      {/* Full-height marquee text overlay */}
      <div className="absolute inset-0 flex items-center pointer-events-none select-none z-10">
        <div className="w-full h-full overflow-hidden flex flex-col justify-center">
          <div className="animate-marquee flex whitespace-nowrap items-center h-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="text-[40vh] leading-none font-black uppercase tracking-tighter text-foreground/[0.06] mx-8"
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
