import { motion, useScroll, useTransform } from "framer-motion";
import { Package, Warehouse, Thermometer, Truck } from "lucide-react";
import { useMouseGradient } from "@/hooks/useMouseGradient";
import { useRef } from "react";

const features = [
  {
    icon: Package,
    title: "Integrated Import-to-Distribution",
    desc: "End-to-end import and brand representation services — from sourcing and customs clearance to shelf-ready distribution across Sri Lanka.",
  },
  {
    icon: Warehouse,
    title: "Bonded Warehousing",
    desc: "Customs-approved bonded warehouse facilities enabling duty optimization, secure storage, and streamlined import processing.",
  },
  {
    icon: Thermometer,
    title: "Cold-Chain Logistics",
    desc: "Temperature-controlled storage and transport at -18°C for frozen and chilled products, ensuring quality from port to point of sale.",
  },
  {
    icon: Truck,
    title: "Island-Wide Distribution",
    desc: "Comprehensive distribution network serving HoReCa, Modern Trade, and General Trade channels across Sri Lanka with reliable, on-time delivery.",
  },
];

const WhyChooseUs = () => {
  const { ref, gradientStyle } = useMouseGradient();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Amplified: Element is at right side during scroll 50-75%, so grid shifts left
  const gridShift = useTransform(scrollYProgress, [0.47, 0.62, 0.77], [0, -90, 0]);
  const gridSkew = useTransform(scrollYProgress, [0.47, 0.62, 0.77], [0, -1.5, 0]);
  const headerShift = useTransform(scrollYProgress, [0.47, 0.62, 0.77], [0, -50, 0]);
  const headerSkew = useTransform(scrollYProgress, [0.47, 0.62, 0.77], [0, -2, 0]);
  const lastCardScale = useTransform(scrollYProgress, [0.47, 0.62, 0.77], [1, 0.82, 1]);
  const lastCardOpacity = useTransform(scrollYProgress, [0.47, 0.62, 0.77], [1, 0.35, 1]);

  // Parallax background
  const bgY = useTransform(sectionProgress, [0, 1], ["-70px", "70px"]);
  const orbY = useTransform(sectionProgress, [0, 1], ["40px", "-40px"]);

  return (
    <section
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLElement | null>).current = el;
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      id="about"
      className="relative overflow-hidden py-28 lg:py-36"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, hsl(140 50% 19% / 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, hsl(150 40% 14% / 0.4) 0%, transparent 50%),
            linear-gradient(180deg, hsl(150 40% 10%), hsl(140 50% 19%), hsl(150 40% 10%))
          `,
        }}
      />

      {/* Parallax decorative elements */}
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ y: bgY }}>
        <motion.div
          className="absolute w-[500px] h-[500px] -top-32 -left-32 rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)",
            y: orbY,
          }}
        />
        <div
          className="absolute w-[350px] h-[350px] bottom-0 right-10 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsl(42 70% 50%), transparent 70%)" }}
        />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none z-[1] opacity-30" style={gradientStyle} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
          style={{ x: headerShift, skewX: headerSkew }}
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 mb-8 tracking-widest uppercase">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
            Your Complete FMCG
            <br />
            Distribution Partner
          </h2>
          <p className="text-primary-foreground/45 font-body text-lg leading-relaxed">
            Three decades of experience in import, warehousing, and distribution — built on strong global supplier relationships
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" style={{ x: gridShift, skewX: gridSkew }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative p-10 rounded-2xl border border-primary-foreground/10 hover:border-primary-foreground/20 transition-all duration-500 hover:shadow-xl hover:shadow-forest-mid/20"
              style={{
                background: `
                  radial-gradient(ellipse at 30% 20%, hsl(140 30% 16% / 0.4) 0%, transparent 60%),
                  linear-gradient(180deg, hsl(140 40% 12%), hsl(140 45% 10%))
                `,
                ...(i === 3 ? { scale: lastCardScale, opacity: lastCardOpacity } : {}),
              }}
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 rounded-xl bg-primary-foreground flex items-center justify-center mb-7 shadow-lg shadow-primary-foreground/10"
              >
                <f.icon className="w-6 h-6 text-forest-deep" />
              </motion.div>
              <h3 className="font-display text-xl font-semibold text-primary-foreground mb-4 tracking-tight">
                {f.title}
              </h3>
              <p className="text-primary-foreground/45 font-body leading-relaxed text-sm">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
