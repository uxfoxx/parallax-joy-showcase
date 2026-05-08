import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import SplitText from "@/components/motion/SplitText";
import { useBrands } from "@/lib/api";
import { EASE_OUT_EXPO } from "@/lib/motion";

const OurPartnersHexagon = () => {
  const reduced = useReducedMotion();
  const { ref: inViewRef, isInView } = useInView({ threshold: 0.15 });
  const { data: allBrands = [] } = useBrands();
  
  // Show all brands, use logo_url if available, otherwise image_url
  const logos = allBrands.map((brand) => ({
    ...brand,
    displayUrl: brand.logo_url || brand.image_url,
  })).filter((brand) => brand.displayUrl);

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.3,
      },
    },
  };

  // Individual hex animation
  const hexVariants = {
    hidden: { opacity: 0, scale: 0.5, rotateZ: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateZ: 0,
      transition: { duration: 0.6, ease: EASE_OUT_EXPO },
    },
  };

  // Hex hover animation
  const hexHoverVariants = {
    rest: { scale: 1, rotateZ: 0, y: 0 },
    hover: {
      scale: 1.12,
      rotateZ: 3,
      y: -6,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  // Create grid positions for hexagon pattern (honeycomb layout)
  // Using a simplified hex grid layout
  const hexPositions = logos.map((_, idx) => {
    const itemsPerRow = 4;
    const row = Math.floor(idx / itemsPerRow);
    const col = idx % itemsPerRow;
    const isOddRow = row % 2 === 1;
    const offsetX = isOddRow ? 60 : 0;

    return {
      x: col * 120 + offsetX,
      y: row * 105,
    };
  });

  return (
    <section
      ref={inViewRef as React.RefObject<HTMLDivElement>}
      className="relative py-24 lg:py-32 overflow-hidden bg-white"
    >
      {/* Subtle gradient overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(245, 247, 250, 0.4) 0%, rgba(240, 250, 245, 0.2) 100%)",
        }}
      />

      {/* Decorative elements */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(140, 155, 100, 0.08) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(180, 150, 100, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading section */}
        <motion.div
          className="text-center mb-20 lg:mb-24"
          initial={reduced ? {} : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        >
          <p className="text-forest-deep/50 font-body text-xs uppercase tracking-[0.25em] mb-3">
            <SplitText
              text="Our Partnerships"
              by="letter"
              stagger={0.025}
              as="span"
            />
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-forest-deep leading-tight tracking-tight mb-6">
            <SplitText
              text="Brands We Partner"
              by="word"
              stagger={0.08}
              as="span"
            />
            <span className="block text-accent">
              <SplitText
                text="With"
                by="word"
                stagger={0.08}
                delay={0.24}
                as="span"
              />
            </span>
          </h2>
          <motion.p
            className="font-body text-lg text-forest-deep/60 leading-relaxed max-w-2xl mx-auto"
            initial={reduced ? {} : { opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.15 }}
          >
            We collaborate with leading brands globally, bringing premium products and
            trusted solutions to the Sri Lankan market.
          </motion.p>
        </motion.div>

        {/* Octagon grid - 2 rows */}
        {logos.length > 0 && (
          <motion.div
            className="relative mx-auto"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(4, minmax(140px, 1fr))`,
              maxWidth: "700px",
              gap: "1.5rem",
              justifyContent: "center",
              justifyItems: "center",
            }}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {logos.map((logo, idx) => (
              <motion.div
                key={logo.id}
                variants={hexVariants}
                className="relative group"
                style={{
                  width: 120,
                  height: 140,
                }}
              >
                {/* Hexagon background with clip-path */}
                <motion.div
                  className="absolute inset-0 rounded-lg overflow-hidden border-2"
                  style={{
                    clipPath:
                      "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                    borderColor: "hsl(var(--forest-deep))",
                  }}
                  variants={hexHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  {/* Gradient background */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-forest-deep/80 via-forest-deep to-forest-deep/90 border"
                    style={{
                      borderColor: "rgba(140, 155, 100, 0.3)",
                    }}
                  />

                  {/* Hover glow background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.7 }}
                    style={{ pointerEvents: "none" }}
                  />

                  {/* Logo container */}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <img
                      src={logo.displayUrl}
                      alt={`${logo.name} logo`}
                      loading="lazy"
                      className="max-w-[70%] max-h-[70%] object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300 filter brightness-0 invert"
                    />
                  </div>

                  {/* Border highlight on hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none border-2"
                    style={{
                      clipPath:
                        "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                      borderColor: "hsl(var(--accent))",
                    }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Logo name on hover */}
                <motion.div
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-none"
                  initial={{ opacity: 0, y: -5 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-body text-xs text-forest-deep font-medium">
                    {logo.name}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {logos.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-forest-deep/50 font-body text-lg">
              No brands available
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default OurPartnersHexagon;
