import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, TrendingUp, Zap, Shield, Truck, CheckCircle2 } from "lucide-react";
import SplitText from "@/components/motion/SplitText";
import Eyebrow from "@/components/ui/eyebrow";
import CountUp from "@/components/motion/CountUp";

const teamSlides = [
  {
    label: "Leadership Team",
    dept: "01",
    icon: "chart",
    desc: "Thirty-plus years of food-industry experience setting the direction.",
    stats: [
      { label: "Years of Experience", value: 30, suffix: "+" },
      { label: "Trade Channels", value: 3, suffix: "" },
    ],
  },
  {
    label: "Sales & Distribution",
    dept: "02",
    icon: "trending",
    desc: "Connecting world-class brands to Sri Lanka's hospitality and retail partners.",
    stats: [
      { label: "Districts Covered", value: 25, suffix: "" },
      { label: "Trade Channels", value: 3, suffix: "" },
    ],
  },
  {
    label: "Warehouse Operations",
    dept: "03",
    icon: "warehouse",
    desc: "Managing cold-chain and bonded storage with zero-compromise standards.",
    stats: [
      { label: "Years of Experience", value: 30, suffix: "+" },
      { label: "Cold-chain", value: -18, suffix: " °C" },
    ],
  },
  {
    label: "Quality Assurance",
    dept: "04",
    icon: "shield",
    desc: "Verifying certification and food-safety compliance on every product before distribution.",
    stats: [
      { label: "Years of Experience", value: 30, suffix: "+" },
      { label: "Cold-chain", value: -18, suffix: " °C" },
    ],
  },
  {
    label: "Logistics & Supply",
    dept: "05",
    icon: "truck",
    desc: "Island-wide delivery in our own temperature-controlled fleet.",
    stats: [
      { label: "Districts Covered", value: 25, suffix: "" },
      { label: "Cold-chain", value: -18, suffix: " °C" },
    ],
  },
];

const DeptIcon = ({ kind, isActive }: { kind: string; isActive: boolean }) => {
  const baseClasses = "w-20 h-20 flex items-center justify-center rounded-2xl transition-all duration-500";
  
  if (kind === "chart") return <TrendingUp className={baseClasses + (isActive ? " text-accent bg-accent/10" : " text-foreground/40 bg-foreground/5")} strokeWidth={1.5} />;
  if (kind === "trending") return <TrendingUp className={baseClasses + (isActive ? " text-accent bg-accent/10" : " text-foreground/40 bg-foreground/5")} strokeWidth={1.5} />;
  if (kind === "warehouse") return <Zap className={baseClasses + (isActive ? " text-accent bg-accent/10" : " text-foreground/40 bg-foreground/5")} strokeWidth={1.5} />;
  if (kind === "shield") return <Shield className={baseClasses + (isActive ? " text-accent bg-accent/10" : " text-foreground/40 bg-foreground/5")} strokeWidth={1.5} />;
  if (kind === "truck") return <Truck className={baseClasses + (isActive ? " text-accent bg-accent/10" : " text-foreground/40 bg-foreground/5")} strokeWidth={1.5} />;
  return <CheckCircle2 className={baseClasses + (isActive ? " text-accent bg-accent/10" : " text-foreground/40 bg-foreground/5")} strokeWidth={1.5} />;
};

const StatCard = ({ label, value, suffix, index, isActive }: { label: string; value: number; suffix: string; index: number; isActive: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 10 }}
    transition={{ delay: index * 0.1 }}
    className="p-4 rounded-xl bg-gradient-to-br from-foreground/5 to-foreground/0 border border-foreground/10 hover:border-accent/30 transition-colors duration-300"
  >
    <p className="text-xs font-body text-foreground/60 mb-2 uppercase tracking-wider">{label}</p>
    <div className="flex items-baseline gap-1">
      {isActive ? (
        <CountUp end={value} suffix={suffix} className="font-display text-2xl font-bold text-foreground" />
      ) : (
        <span className="font-display text-2xl font-bold text-foreground">{value}{suffix}</span>
      )}
    </div>
  </motion.div>
);

const MeetTheTeam = () => {
  const sectionRef = useRef<HTMLSection>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(timer);
  }, [emblaApi]);

  const total = teamSlides.length;
  const slide = teamSlides[selectedIndex];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-section-base lg:py-section-base-lg bg-background"
    >
      {/* Unified dot-grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--forest-mid) / 0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Animated orbs */}
      <div
        className="absolute w-[500px] h-[500px] -top-32 right-0 rounded-full opacity-[0.04] pointer-events-none animate-orb"
        style={{ background: "radial-gradient(circle, hsl(140 50% 19%), transparent 70%)" }}
      />
      <div
        className="absolute w-[350px] h-[350px] bottom-20 -left-20 rounded-full opacity-[0.03] pointer-events-none animate-orb"
        style={{ background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)", animationDelay: "9s" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <Eyebrow variant="pill" tone="primary" className="mb-8 text-primary border-primary/20 bg-primary/10">
            Our People
          </Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            <SplitText text="Meet the Team" by="word" stagger={0.05} as="span" />
          </h2>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            Dedicated departments working seamlessly together to deliver excellence across Sri Lanka.
          </p>
        </motion.div>

        {/* Main content area */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-card/80 to-card backdrop-blur-sm shadow-lg"
        >
          {/* Desktop: Grid layout | Mobile: Stacked */}
          <div className="grid lg:grid-cols-2 min-h-[520px]">
            {/* Left: Info section */}
            <div className="p-8 lg:p-12 flex-col justify-between order-2 lg:order-1 border-r border-border/50 hidden lg:flex">
              <div className="space-y-8">
                {/* Department header */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-display text-5xl font-black text-foreground/10">
                      {slide.dept}
                    </span>
                    <DeptIcon kind={slide.icon} isActive={true} />
                  </div>
                </div>

                {/* Animated content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedIndex}
                    initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-4"
                  >
                    <h3 className="font-display text-3xl font-bold text-foreground leading-snug">
                      {slide.label}
                    </h3>
                    <p className="text-foreground/70 font-body text-base leading-relaxed">
                      {slide.desc}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Stats grid */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 gap-4 pt-4"
                  >
                    {slide.stats.map((stat, i) => (
                      <StatCard
                        key={i}
                        label={stat.label}
                        value={stat.value}
                        suffix={stat.suffix}
                        index={i}
                        isActive={true}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 pt-8 border-t border-border/30">
                <button
                  onClick={scrollPrev}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent/10 hover:border-accent transition-all duration-200"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button
                  onClick={scrollNext}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-accent/10 hover:border-accent transition-all duration-200"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>

                {/* Dots */}
                <div className="flex gap-1.5 ml-auto">
                  {teamSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => emblaApi?.scrollTo(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === selectedIndex
                          ? "w-6 h-1.5 bg-accent"
                          : "w-1.5 h-1.5 bg-border hover:bg-foreground/40"
                      }`}
                      aria-label={`Go to ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Carousel with animated visual representation */}
            <div className="relative order-1 lg:order-2">
              <div className="overflow-hidden h-full" ref={emblaRef} style={{ minHeight: 320 }}>
                <div className="flex h-full">
                  {teamSlides.map((s, i) => (
                    <div
                      key={i}
                      className="flex-[0_0_100%] relative flex items-center justify-center p-8 lg:p-12 min-h-[320px] lg:min-h-[520px]"
                    >
                      {/* Animated background gradient based on department */}
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          background: i === selectedIndex
                            ? "radial-gradient(circle at 50% 50%, hsl(75 38% 45% / 0.1), transparent 70%)"
                            : "radial-gradient(circle at 50% 50%, hsl(75 38% 45% / 0.02), transparent 70%)"
                        }}
                        transition={{ duration: 0.6 }}
                      />

                      {/* Main animated visual */}
                      <motion.div
                        className="relative z-10 flex flex-col items-center gap-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={i === selectedIndex ? { opacity: 1, scale: 1 } : { opacity: 0.3, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Large icon with animation */}
                        <motion.div
                          animate={i === selectedIndex ? { y: [0, -8, 0] } : {}}
                          transition={i === selectedIndex ? { duration: 3, repeat: Infinity } : {}}
                          className="text-foreground/40"
                        >
                          <DeptIcon kind={s.icon} isActive={i === selectedIndex} />
                        </motion.div>

                        {/* Department name */}
                        <AnimatePresence mode="wait">
                          {i === selectedIndex && (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-center"
                            >
                              <h4 className="font-display text-2xl font-bold text-foreground mb-2">
                                {s.label}
                              </h4>
                              <div className="flex gap-2 justify-center">
                                {s.stats.map((stat) => (
                                  <div
                                    key={stat.label}
                                    className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30"
                                  >
                                    <span className="font-body text-xs font-semibold text-accent">
                                      {stat.label.split(" ")[0]}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Animated rings */}
                        <motion.div
                          animate={i === selectedIndex ? { rotate: 360 } : {}}
                          transition={i === selectedIndex ? { duration: 20, repeat: Infinity, ease: "linear" } : {}}
                          className="absolute w-48 h-48 border border-accent/20 rounded-full pointer-events-none"
                        />
                        <motion.div
                          animate={i === selectedIndex ? { rotate: -180 } : {}}
                          transition={i === selectedIndex ? { duration: 30, repeat: Infinity, ease: "linear" } : {}}
                          className="absolute w-64 h-64 border border-accent/10 rounded-full pointer-events-none"
                        />
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile info section */}
          <div className="lg:hidden p-6 border-t border-border/50 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="font-display text-xl font-bold text-foreground">{slide.label}</h3>
                <p className="text-sm text-foreground/70 font-body">{slide.desc}</p>
                <div className="grid grid-cols-2 gap-3">
                  {slide.stats.map((stat, i) => (
                    <StatCard
                      key={i}
                      label={stat.label}
                      value={stat.value}
                      suffix={stat.suffix}
                      index={i}
                      isActive={true}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile controls */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={scrollPrev}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-accent/10 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1 mx-auto">
                {teamSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={`rounded-full transition-all ${
                      i === selectedIndex ? "w-5 h-1 bg-accent" : "w-1 h-1 bg-border"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={scrollNext}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-accent/10 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="mt-4 h-[2px] bg-border rounded-full overflow-hidden"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-accent/50"
            key={selectedIndex}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "linear" }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default MeetTheTeam;
