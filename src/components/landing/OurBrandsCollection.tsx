import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import SplitText from "@/components/motion/SplitText";
import { usePartnerLogos } from "@/lib/api";
import { EASE_OUT_EXPO } from "@/lib/motion";

const OurBrandsCollection = () => {
  const reduced = useReducedMotion();
  const { ref: inViewRef, isInView } = useInView({ threshold: 0.1 });
  const { data: logos = [] } = usePartnerLogos({ onlyActive: true });

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  // Individual logo animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: EASE_OUT_EXPO },
    },
  };

  // Hover animation for logos
  const logoHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.08,
      y: -4,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={inViewRef as React.RefObject<HTMLDivElement>}
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, hsl(140 50% 8%) 0%, hsl(150 45% 14%) 50%, hsl(140 50% 10%) 100%)",
      }}
    >
      {/* Dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient orbs */}
      <div
        aria-hidden
        className="absolute rounded-full blur-[120px] pointer-events-none animate-orb"
        style={{
          top: "-10%",
          right: "-5%",
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
          left: "-5%",
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={reduced ? {} : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        >
          <p className="text-primary-foreground/40 font-body text-xs uppercase tracking-[0.25em] mb-4">
            <SplitText
              text="Trusted Partners"
              by="letter"
              stagger={0.025}
              as="span"
            />
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            <SplitText
              text="Our Brands"
              by="word"
              stagger={0.08}
              as="span"
            />
          </h2>
        </motion.div>

        {/* Logo grid */}
        {logos.length > 0 && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {logos.map((logo, idx) => (
              <motion.div
                key={logo.id}
                variants={itemVariants}
                className="group relative"
              >
                {/* Background glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 blur-xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Border */}
                <div className="absolute inset-0 rounded-xl border border-primary-foreground/10 group-hover:border-accent/40 transition-colors duration-300 pointer-events-none" />

                {/* Inner container */}
                <motion.div
                  className="relative h-32 md:h-40 lg:h-44 rounded-xl bg-primary-foreground/[0.02] backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden cursor-pointer"
                  variants={logoHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                    style={{ pointerEvents: "none" }}
                  />

                  {/* Logo link or static */}
                  {logo.link_url ? (
                    <a
                      href={logo.link_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={logo.name}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={logo.image_url}
                        alt={`${logo.name} logo`}
                        loading="lazy"
                        className="h-full w-full object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 transition-all duration-300"
                      />
                    </a>
                  ) : (
                    <img
                      src={logo.image_url}
                      alt={`${logo.name} logo`}
                      loading="lazy"
                      className="h-full w-full object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 transition-all duration-300"
                    />
                  )}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {logos.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-primary-foreground/50 font-body">
              Brand logos coming soon
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default OurBrandsCollection;
