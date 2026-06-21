import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import SplitText from "@/components/motion/SplitText";
import MagneticButton from "@/components/motion/MagneticButton";
import DepthScene from "@/components/landing/DepthScene";

/**
 * BrandManifesto — "The Olive Standard". A dark, cinematic statement moment
 * rendered on the shared DepthScene (3D depth-parallax backdrop). TeamSection
 * uses the same scene so the two read as visual siblings.
 */
const BrandManifesto = () => {
  const reduced = useReducedMotion();

  return (
    <DepthScene ghostWord="trust">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Eyebrow variant="pill" tone="primary" className="mb-8">
          The Olive Standard
        </Eyebrow>
      </motion.div>

      <h2 className="font-display text-4xl sm:text-5xl lg:text-[64px] font-bold text-white leading-[1.05] tracking-tight">
        <SplitText text="A supply chain is really" by="word" stagger={0.05} as="span" className="block" />
        <span className="block mt-1">
          <SplitText text="a chain of" by="word" stagger={0.05} delay={0.18} as="span" className="mr-[0.28em]" />
          <SplitText text="relationships." by="word" stagger={0.05} delay={0.32} as="span" className="italic text-gradient-gold-dark" tokenClassName="text-gradient-gold-dark italic" />
        </span>
      </h2>

      <motion.p
        initial={reduced ? {} : { opacity: 0, y: 18, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="font-body text-base sm:text-lg text-white/60 leading-relaxed max-w-2xl mx-auto mt-8"
      >
        For thirty-plus years we've connected leading growers and
        producers with Sri Lanka's hotels, restaurants, and retailers,
        sourced with intent, delivered with trust.
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
              Start a conversation
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </MagneticButton>
        <MagneticButton>
          <Link to="/products" className="inline-block">
            <Button variant="heroOutline" size="pill" className="font-body">
              Explore the range
            </Button>
          </Link>
        </MagneticButton>
      </motion.div>
    </DepthScene>
  );
};

export default BrandManifesto;
