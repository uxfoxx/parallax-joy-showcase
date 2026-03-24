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
    </section>
  );
};

export default HeroSection;
