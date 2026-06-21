import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import SplitText from "@/components/motion/SplitText";
import MagneticButton from "@/components/motion/MagneticButton";
import DepthScene from "@/components/landing/DepthScene";

/**
 * TeamSection — "Building Partnerships That Last". Rendered on the shared
 * DepthScene so it reads as a visual sibling of BrandManifesto ("The Olive
 * Standard"): same near-black depth-parallax backdrop, ghost wordmark,
 * floor-grid, particles, cursor spotlight, and centred content layout.
 */
const TeamSection = () => {
  const reduced = useReducedMotion();

  return (
    <DepthScene ghostWord="partners">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Eyebrow variant="pill" tone="primary" className="mb-8">
          Built to Last
        </Eyebrow>
      </motion.div>

      <h2 className="font-display text-4xl sm:text-5xl lg:text-[64px] font-bold text-white leading-[1.05] tracking-tight">
        <SplitText text="Building partnerships" by="word" stagger={0.05} as="span" className="block" />
        <span className="block mt-1">
          <SplitText text="that" by="word" stagger={0.05} delay={0.18} as="span" className="mr-[0.28em]" />
          <SplitText text="last." by="word" stagger={0.05} delay={0.28} as="span" className="italic text-gradient-gold-dark" tokenClassName="text-gradient-gold-dark italic" />
        </span>
      </h2>

      <motion.p
        initial={reduced ? {} : { opacity: 0, y: 18, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="font-body text-base sm:text-lg text-white/60 leading-relaxed max-w-2xl mx-auto mt-8"
      >
        Olive Foods exists because of relationships, thirty-plus years of
        them, between our team and the suppliers, hoteliers, and retailers who
        shape Sri Lanka's food trade. We value relationships more than
        transactions; consistency more than sales; trust more than speed.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.6, delay: 0.66, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-center justify-center gap-3 mt-11"
      >
        <MagneticButton>
          <Link to="/contact" className="inline-block group">
            <Button variant="brand" size="pill" className="font-body">
              Become a partner
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </MagneticButton>
        <MagneticButton>
          <Link to="/about" className="inline-block">
            <Button variant="heroOutline" size="pill" className="font-body">
              Our story
            </Button>
          </Link>
        </MagneticButton>
      </motion.div>
    </DepthScene>
  );
};

export default TeamSection;
