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
    <section className="snap-section relative flex items-center justify-center overflow-hidden bg-forest-deep">
      {/* Animated Gradient BG with Parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 scale-110 animate-gradient"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, hsl(140 40% 25% / 0.9) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, hsl(42 80% 55% / 0.15) 0%, transparent 40%),
            radial-gradient(ellipse at 60% 30%, hsl(160 35% 18% / 0.6) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, hsl(140 45% 12%) 0%, hsl(140 50% 6%) 100%)
          `,
        }}
      />

      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full flex items-center min-h-[100vh]">
        {/* Bordered content card */}
        <div className="max-w-2xl rounded-2xl border border-primary-foreground/10 bg-forest-deep/40 backdrop-blur-sm p-10 lg:p-14 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 border border-accent/25 backdrop-blur-sm animate-slide-up-reveal">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent font-body text-sm font-medium tracking-wider uppercase">
              Premium Food Imports
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-[1.1] tracking-tight animate-slide-up-reveal" style={{ animationDelay: "0.15s" }}>
            BRINGING THE WORLD'S{" "}
            <span className="text-gradient-gold">FINEST FOODS</span>{" "}
            TO YOUR TABLE
          </h1>

          <p className="text-primary-foreground/65 font-body text-lg max-w-xl leading-relaxed animate-slide-up-reveal" style={{ animationDelay: "0.3s" }}>
            We source and import premium quality food products from around the globe, delivering exceptional flavors and trusted brands to businesses across the nation.
          </p>

          <div className="flex flex-wrap gap-4 animate-slide-up-reveal" style={{ animationDelay: "0.45s" }}>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-full px-8 py-6 text-base transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 hover:-translate-y-1 animate-pulse-glow">
              Contact Us
            </Button>
            <Button
              variant="outline"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 font-body rounded-full px-8 py-6 text-base group transition-all duration-300 hover:-translate-y-1"
            >
              Take The Quiz
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
