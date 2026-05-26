import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import SplitText from "@/components/motion/SplitText";
import { EASE_OUT_EXPO } from "@/lib/motion";

const TeamSection = () => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, isInView } = useInView({ threshold: 0.2 });

  return (
    <section
      data-navbar-theme="dark"
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://vqvspkuhqthvbtsgfgbo.supabase.co/storage/v1/object/sign/Backgrounds/dark.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZWY2OGMyNy1mZDY2LTRkYWEtODA3OC1kZTQ1NjI3MmFmMTEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJCYWNrZ3JvdW5kcy9kYXJrLnBuZyIsImlhdCI6MTc3OTgxNzA2NSwiZXhwIjoxODExMzUzMDY1fQ.8zDz5JBP19qJXASwofWsFBIrizZJPicfl3yHC1zx0oc')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark scrim — keeps headings legible over the bg photo */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "hsl(150 40% 5% / 0.7)" }}
      />

      {/* Ambient orbs */}
      <div
        aria-hidden
        className="absolute rounded-full blur-[120px] pointer-events-none animate-orb"
        style={{
          top: "-10%",
          left: "-5%",
          width: 540,
          height: 540,
          background:
            "radial-gradient(circle, hsl(140 55% 22%) 0%, transparent 70%)",
          opacity: 0.25,
        }}
      />
      <div
        aria-hidden
        className="absolute rounded-full blur-[100px] pointer-events-none animate-orb"
        style={{
          bottom: "-5%",
          right: "-5%",
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)",
          opacity: 0.09,
          animationDelay: "7s",
        }}
      />

      {/* Film-grain texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Content */}
      <div
        ref={inViewRef as React.RefObject<HTMLDivElement>}
        className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-24 text-center"
      >
        {/* Heading */}
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-8">
          <SplitText
            text="Building Partnerships"
            by="word"
            stagger={0.06}
            as="span"
            className="block"
          />
          <span className="block mt-1">
            <SplitText
              text="That Last"
              by="word"
              stagger={0.06}
              delay={0.18}
              as="span"
              className="text-gradient-gold"
            />
          </span>
        </h2>

        {/* Accent rule */}
        <motion.div
          className="mx-auto mb-10 h-[2px] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(75 38% 45%), transparent)",
            maxWidth: 120,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            isInView ? { scaleX: 1, opacity: 1 } : {}
          }
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.35 }}
        />

        {/* Body */}
        <motion.p
          className="font-body text-lg sm:text-xl text-white/65 leading-relaxed max-w-2xl mx-auto"
          initial={reduced ? {} : { opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : {}
          }
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.45 }}
        >
          Olive Foods exists because of relationships — thirty-plus years
          of them, between our team and the suppliers, hoteliers, and
          retailers who shape Sri Lanka's food trade. We value
          relationships more than transactions; consistency more than
          sales; trust more than speed.
        </motion.p>
      </div>
    </section>
  );
};

export default TeamSection;
