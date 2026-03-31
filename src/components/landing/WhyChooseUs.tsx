import { motion, useScroll, useTransform } from "framer-motion";
import { Package, Warehouse, Thermometer, Truck } from "lucide-react";
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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();

  const gridShift = useTransform(scrollYProgress, [0.47, 0.62, 0.77], [0, -90, 0]);
  const gridSkew = useTransform(scrollYProgress, [0.47, 0.62, 0.77], [0, -1.5, 0]);
  const headerShift = useTransform(scrollYProgress, [0.47, 0.62, 0.77], [0, -50, 0]);
  const headerSkew = useTransform(scrollYProgress, [0.47, 0.62, 0.77], [0, -2, 0]);
  const lastCardScale = useTransform(scrollYProgress, [0.47, 0.62, 0.77], [1, 0.82, 1]);
  const lastCardOpacity = useTransform(scrollYProgress, [0.47, 0.62, 0.77], [1, 0.35, 1]);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden py-28 lg:py-36">
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
          <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium border border-accent/20 mb-8 tracking-widest uppercase">
            Why Choose Us
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
            Your Complete FMCG
            <br />
            Distribution Partner
          </h2>
          <p className="text-primary-foreground/40 font-body text-lg leading-relaxed">
            Three decades of experience in import, warehousing, and distribution — built on strong global supplier relationships
          </p>
        </motion.div>

        {/* Feature cards with alternating entry */}
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" style={{ x: gridShift, skewX: gridSkew }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60, rotateZ: i % 2 === 0 ? -3 : 3 }}
              whileInView={{ opacity: 1, x: 0, rotateZ: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -10, scale: 1.03, transition: { duration: 0.3 } }}
              className="group relative p-10 rounded-2xl glass hover:shadow-xl hover:shadow-accent/15 transition-all duration-500"
              style={i === 3 ? { scale: lastCardScale, opacity: lastCardOpacity } : undefined}
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 rounded-xl bg-accent/15 flex items-center justify-center mb-7 shadow-lg shadow-accent/10 group-hover:bg-accent/25 group-hover:shadow-[0_0_20px_hsl(75_38%_45%_/_0.2)] transition-all duration-500"
              >
                <f.icon className="w-6 h-6 text-accent" />
              </motion.div>
              <h3 className="font-display text-xl font-semibold text-primary-foreground mb-4 tracking-tight">
                {f.title}
              </h3>
              <p className="text-primary-foreground/40 font-body leading-relaxed text-sm">
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
