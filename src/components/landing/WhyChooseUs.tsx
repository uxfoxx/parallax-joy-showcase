import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { staggerGrid, EASE_OUT_EXPO } from "@/lib/motion";
import SplitText from "@/components/motion/SplitText";
import FeatureArt, { type FeatureArtKey } from "@/components/art/FeatureArt";
import Eyebrow from "@/components/ui/eyebrow";

const features: Array<{ art: FeatureArtKey; number: string; title: string; desc: string }> = [
  {
    art: "import",
    number: "01",
    title: "Integrated Import-to-Distribution",
    desc: "End-to-end import and brand representation services — from sourcing and customs clearance to shelf-ready distribution across Sri Lanka.",
  },
  {
    art: "warehouse",
    number: "02",
    title: "Bonded Warehousing",
    desc: "Customs-approved bonded warehouse facilities enabling duty optimization, secure storage, and streamlined import processing.",
  },
  {
    art: "cold",
    number: "03",
    title: "Cold-Chain Logistics",
    desc: "Temperature-controlled storage and transport at -18°C for frozen and chilled products, ensuring quality from port to point of sale.",
  },
  {
    art: "distribution",
    number: "04",
    title: "Island-Wide Distribution",
    desc: "Comprehensive distribution network serving HoReCa, Modern Trade, and General Trade channels across Sri Lanka with reliable, on-time delivery.",
  },
];

const FeatureCard = ({ feature: f, index: i }: { feature: typeof features[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.65, delay: staggerGrid(i, 2), ease: EASE_OUT_EXPO }}
    className="group"
  >
    <div className="relative h-full p-8 rounded-2xl bg-white/95 backdrop-blur-sm border border-white/20 hover:border-accent/40 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
      {/* Accent line on left */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-accent/50 to-transparent" />
      
      {/* Top accent — appears on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Number + Icon row */}
      <div className="flex items-start justify-between mb-6">
        <span className="font-display text-5xl font-black text-foreground/8">
          {f.number}
        </span>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 240, damping: 18 }}
          className="transition-colors duration-300"
        >
          <FeatureArt
            kind={f.art}
            className="w-16 h-16 text-accent"
          />
        </motion.div>
      </div>

      {/* Content */}
      <h3 className="font-display text-xl font-bold text-foreground mb-3 leading-snug tracking-tight">
        {f.title}
      </h3>
      <p className="text-foreground/65 font-body leading-relaxed text-sm mb-5">
        {f.desc}
      </p>

      {/* Learn more link */}
      <motion.div
        className="flex items-center gap-2 text-accent font-body text-sm font-semibold cursor-pointer"
        whileHover={{ x: 4 }}
      >
        <span>Learn more</span>
        <ArrowRight className="w-4 h-4" />
      </motion.div>
    </div>
  </motion.div>
);

const WhyChooseUs = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-section-base lg:py-section-base-lg"
    >
      {/* Background image with optimized overlay */}
      <img
        src="https://vqvspkuhqthvbtsgfgbo.supabase.co/storage/v1/object/public/olive-uploads/Backgrounds/pexels-freestocks-1366594.jpg"
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      
      {/* Sophisticated overlay — lets image breathe while maintaining readability */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 1200px 600px at 50% 0%, rgba(255,255,255,0.08), transparent 40%),
            linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.5), rgba(0,0,0,0.6))
          `
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Header — more prominent with better visual hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          className="max-w-4xl mb-20"
        >
          <Eyebrow variant="pill" tone="white" className="mb-6">
            Why Choose Olive Foods
          </Eyebrow>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
            <SplitText text="Your Complete FMCG" by="word" stagger={0.05} as="span" className="block" />
            <span className="text-gradient-gold block">
              <SplitText text="Distribution Partner" by="word" stagger={0.05} delay={0.15} as="span" className="block" />
            </span>
          </h2>
          <p className="text-white/80 font-body text-lg leading-relaxed max-w-2xl">
            Three decades of experience in import, warehousing, and distribution — built on strong global supplier relationships and a commitment to excellence.
          </p>
        </motion.div>

        {/* Feature cards — full-width responsive grid with better spacing */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
