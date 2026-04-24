import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { staggerGrid, EASE_OUT_EXPO } from "@/lib/motion";
import SplitText from "@/components/motion/SplitText";
import Parallax from "@/components/motion/Parallax";
import FeatureArt, { type FeatureArtKey } from "@/components/art/FeatureArt";

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
    initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.65, delay: staggerGrid(i, 2), ease: EASE_OUT_EXPO }}
  >
    <Tilt
      tiltMaxAngleX={4}
      tiltMaxAngleY={4}
      perspective={1400}
      glareEnable
      glareMaxOpacity={0.1}
      glareColor="#e6c96b"
      glareBorderRadius="12px"
      transitionSpeed={900}
    >
      <div className="group relative p-6 rounded-xl border-l-2 border-l-primary-foreground/15 hover:border-l-accent border border-primary-foreground/8 hover:border-primary-foreground/15 bg-primary-foreground/[0.04] hover:bg-primary-foreground/[0.07] transition-all duration-300 cursor-default overflow-hidden">
        {/* Background number decoration */}
        <span className="absolute -top-4 -right-2 font-display text-8xl font-black text-primary-foreground/[0.04] select-none pointer-events-none leading-none">
          {f.number}
        </span>

        {/* Number + art row */}
        <div className="flex items-center gap-4 mb-5">
          <span className="font-display text-xs font-bold text-accent tracking-widest">{f.number}</span>
          <FeatureArt
            kind={f.art}
            className="w-14 h-14 text-primary-foreground/75 group-hover:text-accent transition-colors duration-300"
          />
        </div>

        <h3 className="font-display text-lg font-semibold text-primary-foreground mb-3 leading-snug tracking-tight">
          {f.title}
        </h3>
        <p className="text-primary-foreground/70 font-body leading-relaxed text-sm">
          {f.desc}
        </p>
      </div>
    </Tilt>
  </motion.div>
);

const WhyChooseUs = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-28 lg:py-36"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, hsl(140 50% 19% / 0.5) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, hsl(150 40% 14% / 0.4) 0%, transparent 50%),
          linear-gradient(180deg, hsl(150 40% 6%), hsl(140 50% 14%), hsl(150 40% 10%))
        `,
      }}
    >
      {/* Decorative orbs — animated */}
      <div className="absolute w-[500px] h-[500px] -top-32 -left-32 rounded-full opacity-[0.08] pointer-events-none animate-orb"
        style={{ background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)" }} />
      <div className="absolute w-[350px] h-[350px] bottom-0 right-10 rounded-full opacity-[0.06] pointer-events-none animate-orb"
        style={{ background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)", animationDelay: "7s" }} />
      {/* Gold accent orb — center */}
      <div className="absolute w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.04] pointer-events-none animate-orb"
        style={{ background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)", animationDelay: "13s" }} />

      {/* Parallax SVG arc for depth */}
      <Parallax strength={80} className="absolute inset-x-0 top-0 pointer-events-none">
        <svg viewBox="0 0 1200 300" className="w-full h-auto opacity-[0.06]" aria-hidden>
          <defs>
            <linearGradient id="arcGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="hsl(75 40% 60%)" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(75 40% 60%)" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(75 40% 60%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 0 250 Q 600 0 1200 250" stroke="url(#arcGrad)" strokeWidth="2" fill="none" />
        </svg>
      </Parallax>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 mb-8 tracking-widest uppercase">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
            <SplitText text="Your Complete FMCG" by="word" stagger={0.05} as="span" className="block" />
            <SplitText text="Distribution Partner" by="word" stagger={0.05} delay={0.18} as="span" className="block" />
          </h2>
          <p className="text-primary-foreground/70 font-body text-lg leading-relaxed">
            Three decades of experience in import, warehousing, and distribution — built on strong global supplier relationships.
          </p>
        </motion.div>

        {/* Feature cards — 2×2 grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
