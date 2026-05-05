import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
} from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { EASE_OUT_EXPO, softFadeUp } from "@/lib/motion";
import SplitText from "@/components/motion/SplitText";
import FeatureArt, { type FeatureArtKey } from "@/components/art/FeatureArt";
import Eyebrow from "@/components/ui/eyebrow";

const features: Array<{
  art: FeatureArtKey;
  number: string;
  title: string;
  tag: string;
  desc: string;
}> = [
  {
    art: "import",
    number: "01",
    tag: "Sourcing · Customs · Brand Rep",
    title: "Integrated Import-to-Distribution",
    desc: "End-to-end import and brand representation — from sourcing and customs clearance to shelf-ready distribution across Sri Lanka.",
  },
  {
    art: "warehouse",
    number: "02",
    tag: "Bonded · Duty-Optimised · Secure",
    title: "Bonded Warehousing",
    desc: "Customs-approved bonded facilities enabling duty optimisation, secure storage, and streamlined import processing.",
  },
  {
    art: "cold",
    number: "03",
    tag: "Frozen · Chilled · -18°C",
    title: "Cold-Chain Logistics",
    desc: "Temperature-controlled storage and transport for frozen and chilled products, ensuring quality from port to point of sale.",
  },
  {
    art: "distribution",
    number: "04",
    tag: "HoReCa · Modern Trade · General Trade",
    title: "Island-Wide Distribution",
    desc: "Comprehensive distribution network serving all trade channels across Sri Lanka with reliable, on-time delivery.",
  },
];

/* ─── Per-row feature strip ─────────────────────────────────────────── */

const FeatureStrip = ({
  feature: f,
  index: i,
  isLast,
}: {
  feature: (typeof features)[0];
  index: number;
  isLast: boolean;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: true, margin: "-80px" });

  return (
    <div ref={rowRef} className="relative group">
      {/* Animated wipe divider line */}
      <div className="relative h-px w-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <motion.div
          className="absolute inset-y-0 left-0"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: i * 0.08 }}
          style={{
            originX: 0,
            width: "100%",
            background: "linear-gradient(to right, hsl(var(--accent)/0.7), hsl(var(--accent)/0.25), transparent)",
          }}
        />
      </div>

      {/* Hover row glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: "linear-gradient(90deg, hsl(var(--accent)/0.04) 0%, transparent 60%)" }}
      />

      {/* Strip layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: i * 0.08 + 0.1 }}
        className="grid items-center gap-x-6 lg:gap-x-10 py-8 md:py-10"
        style={{ gridTemplateColumns: "5rem 1fr" }}
      >
        {/* Number */}
        <motion.span
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: i * 0.08 + 0.05 }}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-none select-none transition-colors duration-500"
          style={{ color: "rgba(255,255,255,0.08)" }}
        >
          {f.number}
        </motion.span>

        {/* Right content — three-column on md+ */}
        <div className="grid md:grid-cols-[1.2fr_1fr] lg:grid-cols-[1.2fr_1fr_9rem] items-center gap-x-8 lg:gap-x-12 gap-y-3">
          {/* Title + tag */}
          <div className="flex flex-col gap-1.5">
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: i * 0.08 + 0.2 }}
              className="font-body text-[10px] tracking-[0.32em] uppercase"
              style={{ color: "hsl(var(--accent)/0.65)" }}
            >
              {f.tag}
            </motion.span>

            <div className="overflow-hidden">
              <motion.h3
                initial={{ y: "108%" }}
                animate={isInView ? { y: "0%" } : {}}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: i * 0.08 + 0.13 }}
                className="font-display text-xl md:text-2xl lg:text-[1.75rem] font-bold text-white leading-tight group-hover:text-accent transition-colors duration-500"
              >
                {f.title}
              </motion.h3>
            </div>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, x: 16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: i * 0.08 + 0.24 }}
            className="hidden md:block font-body text-sm lg:text-base leading-relaxed"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {f.desc}
          </motion.p>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.65, rotate: -12 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.34, 1.56, 0.64, 1], delay: i * 0.08 + 0.17 }}
            className="hidden lg:flex items-center justify-end"
          >
            <div
              className="p-3 rounded-2xl transition-all duration-500"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <FeatureArt
                kind={f.art}
                className="w-11 h-11 transition-colors duration-300"
                style={{ color: "hsl(var(--accent)/0.75)" } as React.CSSProperties}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: i * 0.08 + 0.3 }}
        className="md:hidden font-body text-sm leading-relaxed pb-6 pl-[5.5rem]"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        {f.desc}
      </motion.p>

      {/* Closing wipe line on last item */}
      {isLast && (
        <div className="relative h-px w-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <motion.div
            className="absolute inset-y-0 left-0"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: i * 0.08 + 0.45 }}
            style={{
              originX: 0,
              width: "100%",
              background: "linear-gradient(to right, hsl(var(--accent)/0.7), hsl(var(--accent)/0.25), transparent)",
            }}
          />
        </div>
      )}
    </div>
  );
};

/* ─── Scroll progress spine ─────────────────────────────────────────── */

const ScrollSpine = ({ sectionRef }: { sectionRef: React.RefObject<HTMLElement> }) => {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });

  return (
    <div className="absolute left-6 lg:left-8 top-0 bottom-0 items-center pointer-events-none z-20 hidden lg:flex flex-col">
      <div className="relative flex-1 my-20 overflow-hidden rounded-full" style={{ width: 1, background: "rgba(255,255,255,0.08)" }}>
        <motion.div
          className="absolute top-0 left-0 right-0 rounded-full"
          style={{
            scaleY,
            height: "100%",
            transformOrigin: "top",
            background: "linear-gradient(to bottom, hsl(var(--accent)), hsl(var(--accent)/0.4), transparent)",
          }}
        />
      </div>
    </div>
  );
};

/* ─── Mouse spotlight hook ──────────────────────────────────────────── */

function useMouseSpotlight() {
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const springX = useSpring(rawX, { stiffness: 45, damping: 18 });
  const springY = useSpring(rawY, { stiffness: 45, damping: 18 });
  const pctX = useTransform(springX, (v) => `${v * 100}%`);
  const pctY = useTransform(springY, (v) => `${v * 100}%`);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width);
    rawY.set((e.clientY - r.top) / r.height);
  };

  return { pctX, pctY, onMouseMove };
}

/* ─── Main section ──────────────────────────────────────────────────── */

const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { pctX, pctY, onMouseMove } = useMouseSpotlight();

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden py-section-base lg:py-section-base-lg"
      onMouseMove={onMouseMove as React.MouseEventHandler<HTMLElement>}
    >
      {/* Background image */}
      <img
        src="https://vqvspkuhqthvbtsgfgbo.supabase.co/storage/v1/object/public/olive-uploads/Backgrounds/pexels-freestocks-1366594.jpg"
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Dark base overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.74) 50%, rgba(0,0,0,0.64) 100%)",
        }}
      />

      {/* Mouse-tracking spotlight */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 55% 45% at var(--sx) var(--sy), rgba(80,200,120,0.08) 0%, transparent 70%)",
          "--sx": pctX,
          "--sy": pctY,
        } as React.CSSProperties}
      />

      {/* Grain texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Ambient orbs */}
      <motion.div
        aria-hidden
        className="absolute rounded-full blur-[120px] pointer-events-none"
        style={{
          top: "20%", left: "15%", width: 560, height: 560,
          background: "hsl(var(--accent)/0.07)",
        }}
        animate={{ x: [0, 70, 0], y: [0, 45, 0], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute rounded-full blur-[100px] pointer-events-none"
        style={{
          bottom: "20%", right: "20%", width: 480, height: 480,
          background: "hsl(var(--accent)/0.05)",
        }}
        animate={{ x: [0, -50, 0], y: [0, -60, 0], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute rounded-full blur-[80px] pointer-events-none"
        style={{
          top: "60%", left: "55%", width: 380, height: 380,
          background: "rgba(255,255,255,0.025)",
        }}
        animate={{ x: [0, 90, -30, 0], y: [0, -35, 25, 0], opacity: [0.2, 0.38, 0.2] }}
        transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* One-time scan-line sweep on load */}
      <motion.div
        aria-hidden
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, hsl(var(--accent)/0.45), transparent)" }}
        initial={{ top: "0%", opacity: 1 }}
        animate={{ top: "102%", opacity: 0 }}
        transition={{ duration: 2.0, ease: "easeInOut", delay: 0.3 }}
      />

      {/* Scroll progress spine */}
      <ScrollSpine sectionRef={sectionRef as React.RefObject<HTMLElement>} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 w-full">

        {/* Section header */}
        <motion.div
          variants={softFadeUp}
          initial="hidden"
          whileInView="show"
          custom={0}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-4xl mb-16 lg:mb-20"
        >
          <Eyebrow variant="pill" tone="white" className="mb-6">
            Why Choose Olive Foods
          </Eyebrow>

          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            <SplitText text="Your Complete FMCG" by="word" stagger={0.05} as="span" className="block" />
            <span className="block">
              <SplitText
                text="Distribution Partner"
                by="word"
                stagger={0.05}
                delay={0.2}
                as="span"
                className="text-gradient-gold"
              />
            </span>
          </h2>

          <motion.p
            variants={softFadeUp}
            initial="hidden"
            whileInView="show"
            custom={0.35}
            viewport={{ once: true }}
            className="font-body text-lg leading-relaxed max-w-2xl"
            style={{ color: "rgba(255,255,255,0.58)" }}
          >
            Three decades of experience in import, warehousing, and distribution — built on strong global supplier relationships and an unwavering commitment to excellence.
          </motion.p>
        </motion.div>

        {/* Feature strips */}
        <div>
          {features.map((f, i) => (
            <FeatureStrip
              key={f.number}
              feature={f}
              index={i}
              isLast={i === features.length - 1}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          variants={softFadeUp}
          initial="hidden"
          whileInView="show"
          custom={0.2}
          viewport={{ once: true, margin: "-40px" }}
          className="mt-16 lg:mt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-white text-xl font-bold font-display mb-1">
              Ready to partner with Olive?
            </h3>
            <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Discover how we can streamline your FMCG distribution.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm shadow-lg whitespace-nowrap transition-shadow duration-300"
            style={{ background: "hsl(var(--accent))", color: "hsl(var(--foreground))" }}
          >
            Get in Touch
            <motion.span
              className="inline-block"
              animate={{ x: [0, 2, 0], y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
