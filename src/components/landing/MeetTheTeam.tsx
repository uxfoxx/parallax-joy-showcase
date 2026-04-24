import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SplitText from "@/components/motion/SplitText";

const teamSlides = [
  {
    label: "Leadership Team",
    dept: "01",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop",
    desc: "Setting the vision and direction for over three decades of FMCG excellence across Sri Lanka.",
  },
  {
    label: "Sales & Distribution",
    dept: "02",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=800&fit=crop",
    desc: "Connecting world-class brands to retail partners across the island with precision and dedication.",
  },
  {
    label: "Warehouse Operations",
    dept: "03",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=800&fit=crop",
    desc: "Managing cold-chain and bonded storage facilities with zero-compromise quality standards.",
  },
  {
    label: "Quality Assurance",
    dept: "04",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop",
    desc: "Ensuring every product that reaches our partners meets the highest international benchmarks.",
  },
  {
    label: "Logistics & Supply Chain",
    dept: "05",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop",
    desc: "On-time island-wide delivery through a fully optimised and reliable logistics network.",
  },
];

const MeetTheTeam = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Track selected slide
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  // Autoplay — 5s interval
  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(timer);
  }, [emblaApi]);

  const total = teamSlides.length;
  const slide = teamSlides[selectedIndex];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-28 lg:py-36 bg-background"
    >
      {/* Subtle light orbs */}
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
          <span className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary font-body text-sm font-medium border border-primary/15 mb-8 tracking-widest uppercase">
            Our People
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            <SplitText text="Meet the Team" by="word" stagger={0.05} as="span" />
          </h2>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            Dedicated departments working together to deliver seamless supply chain solutions across Sri Lanka.
          </p>
        </motion.div>

        {/* Main carousel area: split panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm flex flex-col lg:flex-row"
          style={{ minHeight: 480 }}
        >
          {/* Left panel — info */}
          <div className="lg:w-[42%] flex flex-col justify-between p-8 lg:p-12 order-2 lg:order-1">
            <div className="flex flex-col gap-6">
              {/* Counter */}
              <div className="flex items-center gap-3">
                <span className="font-display text-4xl font-bold text-foreground/15 tabular-nums leading-none">
                  {String(selectedIndex + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-sm text-muted-foreground tabular-nums">
                  / {String(total).padStart(2, "0")}
                </span>
              </div>

              {/* Animated heading + description */}
              <div className="min-h-[120px] lg:min-h-[140px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedIndex}
                    initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4 leading-snug tracking-tight">
                      {slide.label}
                    </h3>
                    <p className="text-muted-foreground font-body text-base leading-relaxed">
                      {slide.desc}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-8 lg:mt-0">
              <button
                onClick={scrollPrev}
                className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors duration-200"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={scrollNext}
                className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors duration-200"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>

              {/* Dot indicators */}
              <div className="flex gap-1.5 ml-2">
                {teamSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === selectedIndex
                        ? "w-5 h-1.5 bg-accent"
                        : "w-1.5 h-1.5 bg-border hover:bg-muted-foreground/40"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — Embla carousel */}
          <div className="lg:w-[58%] relative order-1 lg:order-2">
            <div className="overflow-hidden h-full" ref={emblaRef} style={{ minHeight: 320 }}>
              <div className="flex h-full">
                {teamSlides.map((s, i) => (
                  <div
                    key={i}
                    className="flex-[0_0_100%] relative overflow-hidden group"
                    style={{ minHeight: 320 }}
                  >
                    <motion.img
                      src={s.image}
                      alt={s.label}
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={false}
                      animate={{ scale: i === selectedIndex ? 1.08 : 1 }}
                      transition={{ duration: 6, ease: "linear" }}
                    />
                    {/* Bottom gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    {/* Right-edge gradient fade into left panel (white bg) */}
                    <div className="hidden lg:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/60 to-transparent" />
                    {/* Department label */}
                    <div className="absolute bottom-5 left-5">
                      <span className="inline-block px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white font-body text-xs font-medium border border-white/20 tracking-wider">
                        {s.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="mt-4 h-[2px] bg-border rounded-full overflow-hidden">
          <div
            key={selectedIndex}
            className="h-full bg-accent origin-left animate-progress-bar"
          />
        </div>
      </div>
    </section>
  );
};

export default MeetTheTeam;
