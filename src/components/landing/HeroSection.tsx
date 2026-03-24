import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        bgRef.current.style.transform = `translateY(${scrollY * 0.4}px) scale(1.1)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="snap-section relative flex items-center justify-center overflow-hidden bg-background">
      {/* Subtle parallax layer */}
      <div ref={bgRef} className="absolute inset-0 scale-110" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-20 w-full flex items-center min-h-[100vh]">
        {/* Dark green rounded card */}
        <div className="relative max-w-4xl w-full rounded-3xl overflow-hidden">
          {/* Animated gradient bg inside card */}
          <div
            className="absolute inset-0 animate-gradient"
            style={{
              background: `
                radial-gradient(ellipse at 20% 20%, hsl(140 40% 25% / 0.9) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, hsl(42 80% 55% / 0.1) 0%, transparent 40%),
                radial-gradient(ellipse at 60% 30%, hsl(160 35% 18% / 0.6) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, hsl(140 45% 12%) 0%, hsl(140 50% 8%) 100%)
              `,
            }}
          />

          {/* Grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Inner content */}
          <div className="relative z-10 p-10 lg:p-16 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/15 animate-slide-up-reveal">
              <span className="text-primary-foreground font-body text-sm font-medium tracking-wide">
                Premium Food Imports
              </span>
            </div>

            <h1
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-[1.1] tracking-tight animate-slide-up-reveal"
              style={{ animationDelay: "0.15s" }}
            >
              BRINGING THE WORLD'S
              <br />
              FINEST FOODS TO YOUR TABLE
            </h1>

            <p
              className="text-primary-foreground/60 font-body text-base max-w-xl leading-relaxed animate-slide-up-reveal"
              style={{ animationDelay: "0.3s" }}
            >
              We source and import high-quality food products from trusted global suppliers—ensuring
              freshness, safety, and consistency for businesses across Sri Lanka.
            </p>

            <div
              className="flex flex-wrap items-center gap-4 animate-slide-up-reveal"
              style={{ animationDelay: "0.45s" }}
            >
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-full px-7 py-5 text-sm transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-1">
                Contact US
              </Button>
              <Button
                variant="ghost"
                className="text-primary-foreground hover:text-primary-foreground/80 font-body text-sm group transition-all duration-300 hover:bg-transparent px-0"
              >
                <span className="underline underline-offset-4">Take The Quiz</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
