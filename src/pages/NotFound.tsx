import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import ImmersiveBackground from "@/components/landing/ImmersiveBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-hidden flex flex-col">
      <ImmersiveBackground />
      <Navbar />

      <div
        data-navbar-theme="dark"
        className="flex-1 flex items-center justify-center relative min-h-screen"
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 50% 40%, hsl(140 50% 19% / 0.6) 0%, transparent 55%),
              radial-gradient(ellipse at 20% 80%, hsl(150 40% 14% / 0.4) 0%, transparent 50%),
              linear-gradient(180deg, hsl(150 40% 6%), hsl(140 50% 14%), hsl(150 40% 8%))
            `,
          }}
        />

        {/* Decorative orbs */}
        <div
          className="absolute w-[600px] h-[600px] -top-40 -right-40 rounded-full opacity-[0.05] pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)" }}
        />
        <div
          className="absolute w-[400px] h-[400px] bottom-10 -left-20 rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)" }}
        />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="noise404">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.7"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise404)" />
          </svg>
        </div>

        <div className="relative z-10 text-center px-6 py-24">
          {/* Large animated 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-6 select-none"
          >
            <span
              className="font-display font-bold leading-none tracking-tighter text-[clamp(7rem,25vw,18rem)]"
              style={{
                background: "linear-gradient(135deg, hsl(60 20% 95% / 0.08), hsl(60 20% 95% / 0.03))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                WebkitTextStroke: "1px hsl(60 20% 95% / 0.08)",
              }}
            >
              404
            </span>
            {/* Glowing number overlay */}
            <span
              className="absolute inset-0 font-display font-bold leading-none tracking-tighter text-[clamp(7rem,25vw,18rem)] flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, hsl(60 20% 95% / 0.15), hsl(75 38% 45% / 0.25))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "blur(12px)",
              }}
              aria-hidden
            >
              404
            </span>
          </motion.div>

          {/* Label */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 mb-6 tracking-widest uppercase"
          >
            Page Not Found
          </motion.span>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-4 leading-tight tracking-tight"
          >
            This page doesn't exist
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="font-body text-primary-foreground/50 text-base leading-relaxed mb-10 max-w-sm mx-auto"
          >
            The page you're looking for has been moved, deleted, or never existed.
            Let's get you back on track.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/">
              <Button className="shine-sweep bg-primary-foreground text-forest-deep hover:bg-primary-foreground/90 font-body font-semibold rounded-lg px-8 h-12 text-base gap-2 border border-white/15">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
            <button onClick={() => window.history.back()}>
              <Button
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 font-body rounded-lg px-8 h-12 text-base gap-2 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
