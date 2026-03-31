import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ShoppingCart, Globe, Warehouse, Truck, ChevronLeft, ChevronRight } from "lucide-react";

const team = [
  {
    icon: ShoppingCart,
    initials: "SM",
    name: "Sales & Marketing",
    role: "Commercial Team",
    bio: "Driving brand growth across HoReCa, Modern Trade, and General Trade channels island-wide. Our dedicated sales force ensures maximum market penetration and brand visibility.",
  },
  {
    icon: Globe,
    initials: "PR",
    name: "Procurement",
    role: "Sourcing Team",
    bio: "Managing global supplier relationships across 8+ countries to secure the best products at competitive prices. We source from Italy, Turkey, Thailand, China, India, UAE, Malaysia, and Singapore.",
  },
  {
    icon: Warehouse,
    initials: "WH",
    name: "Warehousing",
    role: "Operations Team",
    bio: "Running customs-approved bonded warehouse facilities with cold-chain storage at -18°C. Our warehousing ensures product integrity from arrival to dispatch.",
  },
  {
    icon: Truck,
    initials: "LG",
    name: "Logistics",
    role: "Distribution Team",
    bio: "Ensuring reliable, on-time delivery through our island-wide distribution network. We maintain a fleet that covers every corner of Sri Lanka.",
  },
];

const TeamSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // Manual autoplay
  useEffect(() => {
    if (!emblaApi || isHovered) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi, isHovered]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <section ref={sectionRef} className="relative bg-muted/30 overflow-hidden">
      {/* Parallax decorative circles */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: orbY }}>
        <div
          className="absolute w-[450px] h-[450px] -bottom-32 -right-32 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsl(140 50% 30%), transparent 70%)" }}
        />
        <div
          className="absolute w-[300px] h-[300px] top-10 -left-20 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsl(42 60% 50%), transparent 70%)" }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28 w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium border border-accent/20 mb-8 tracking-widest uppercase">
            Our Team
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Three Decades of
            <br />
            <span className="text-gradient-gold">Industry Experience</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            Dedicated departments working together to deliver seamless import-to-distribution solutions
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          {/* Prev / Next */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-card/80 backdrop-blur border border-border hover:border-accent/40 transition-colors shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-card/80 backdrop-blur border border-border hover:border-accent/40 transition-colors shadow-lg"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          <div ref={emblaRef} className="overflow-hidden rounded-2xl lg:mx-14">
            <div className="flex">
              {team.map((member, i) => {
                const Icon = member.icon;
                return (
                  <div key={member.name} className="flex-[0_0_100%] min-w-0 px-2">
                    <AnimatePresence mode="wait">
                      {activeIndex === i && (
                        <motion.div
                          key={`slide-${i}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-12 lg:p-16 rounded-2xl bg-card/80 backdrop-blur-sm border border-border min-h-[280px]"
                        >
                          {/* Icon */}
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="shrink-0"
                          >
                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-forest-deep flex items-center justify-center shadow-xl">
                              <Icon className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
                            </div>
                          </motion.div>

                          {/* Text */}
                          <div className="text-center md:text-left flex-1">
                            <motion.h3
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                              className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2 tracking-tight"
                            >
                              {member.name}
                            </motion.h3>
                            <motion.p
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                              className="text-accent font-body text-base font-medium mb-4"
                            >
                              {member.role}
                            </motion.p>
                            <motion.p
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="text-muted-foreground font-body text-base md:text-lg leading-relaxed max-w-xl"
                            >
                              {member.bio}
                            </motion.p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {team.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: activeIndex === i ? 32 : 8 }}
              >
                <div className="absolute inset-0 bg-foreground/20 rounded-full" />
                {activeIndex === i && (
                  <motion.div
                    className="absolute inset-0 bg-accent rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
