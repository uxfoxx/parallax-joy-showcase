import { motion } from "framer-motion";
import { useTextScramble } from "@/hooks/useTextScramble";
import { useInView } from "@/hooks/useInView";
import SplitText from "@/components/motion/SplitText";
import Eyebrow from "@/components/ui/eyebrow";

const HERITAGE_IMAGE =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=2000&q=80";

const TeamSection = () => {
  const { ref: inViewRef, inView } = useInView();
  const { displayText } = useTextScramble("Three Decades of Trust", inView, {
    speed: 35,
    scrambleDuration: 400,
  });

  return (
    <section
      ref={inViewRef as React.RefObject<HTMLElement>}
      className="relative min-h-[70vh] overflow-hidden flex items-center justify-center"
    >
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={HERITAGE_IMAGE}
          alt=""
          aria-hidden
          loading="lazy"
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Green tint overlay for visual distinction from other sections */}
        <div
          className="absolute inset-0"
          style={{ background: "hsl(140 50% 19% / 0.15)" }}
        />
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseTeam">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.7"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseTeam)" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-section-base lg:py-section-base-lg">
        {/* Label badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <Eyebrow variant="pill" tone="white">
            Our Heritage
          </Eyebrow>
        </motion.div>

        {/* Scramble heading */}
        <div className="mb-8">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight min-h-[1.2em]">
            {displayText || "\u00A0"}
          </h2>
        </div>

        {/* Animated horizontal line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "center" }}
          className="w-32 h-[2px] mx-auto mb-10"
        >
          <div
            className="w-full h-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, hsl(75 38% 45%), transparent)",
            }}
          />
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/75 font-body text-base lg:text-lg leading-relaxed max-w-lg mx-auto"
        >
          <SplitText
            text="For over three decades, Olive Foods has been Sri Lanka's bridge between global food producers and local businesses — building partnerships that stand the test of time."
            by="word"
            stagger={0.015}
            as="span"
          />
        </motion.p>
      </div>
    </section>
  );
};

export default TeamSection;
