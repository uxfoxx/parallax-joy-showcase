import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import SplitText from "@/components/motion/SplitText";
import FeatureArt, { type FeatureArtKey } from "@/components/art/FeatureArt";
import Eyebrow from "@/components/ui/eyebrow";
import { useRef, useState } from "react";

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

const FeatureCard = ({ feature: f, index: i }: { feature: typeof features[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  // Mouse position tracking for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring smooth the mouse movement
  const springX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 100 });
  
  // Transform mouse movement to rotation
  const rotateX = useTransform(springY, [-100, 100], [10, -10]);
  const rotateY = useTransform(springX, [-100, 100], [-10, 10]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    mouseX.set(e.clientX - rect.left - centerX);
    mouseY.set(e.clientY - rect.top - centerY);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  // Card layout varies by index for visual interest
  const isWide = i === 0 || i === 3;
  const isTall = i === 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ 
        duration: 0.7, 
        delay: i * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1200,
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
      }}
      className={`group cursor-pointer ${isWide ? 'lg:col-span-2' : ''} ${isTall ? 'lg:row-span-2' : ''}`}
    >
      {/* Card container with layered depth */}
      <motion.div
        className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.95] via-white/90 to-white/85 backdrop-blur-xl border border-white/30 shadow-2xl"
        animate={{
          boxShadow: isHovered 
            ? '0 20px 60px rgba(0,0,0,0.3), 0 0 60px rgba(80, 200, 120, 0.2)'
            : '0 10px 30px rgba(0,0,0,0.15)'
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Animated gradient background on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={{ backgroundPosition: '0% 0%' }}
          animate={isHovered ? { backgroundPosition: '100% 100%' } : { backgroundPosition: '0% 0%' }}
          transition={{ duration: 3, repeat: isHovered ? Infinity : 0 }}
          style={{
            backgroundImage: 'linear-gradient(45deg, rgba(80,200,120,0.05), rgba(80,200,120,0.02))',
            backgroundSize: '200% 200%'
          }}
        />

        {/* Glow effect on hover */}
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-radial opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(80,200,120,0.3) 0%, transparent 70%)',
          }}
        />

        {/* Content wrapper */}
        <div className={`relative z-10 h-full p-8 lg:p-10 flex flex-col ${isTall ? 'justify-between' : ''}`}>
          
          {/* Header with number and icon */}
          <div>
            {/* Animated number background */}
            <motion.div
              className="absolute -top-8 -right-8 text-white/5 font-display text-9xl font-black pointer-events-none"
              animate={isHovered ? { scale: 1.2, opacity: 0.1 } : { scale: 1, opacity: 0.05 }}
              transition={{ duration: 0.5 }}
            >
              {f.number}
            </motion.div>

            {/* Icon with complex animation */}
            <motion.div
              className="mb-8 inline-block"
              initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: i * 0.12 + 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.15,
                rotate: 10,
              }}
            >
              <motion.div
                animate={isHovered ? { 
                  boxShadow: '0 0 30px rgba(80,200,120,0.4)'
                } : { 
                  boxShadow: '0 0 0px rgba(80,200,120,0)'
                }}
                transition={{ duration: 0.4 }}
                className="p-3 rounded-xl bg-accent/10 border border-accent/20"
              >
                <FeatureArt
                  kind={f.art}
                  className="w-12 h-12 text-accent"
                />
              </motion.div>
            </motion.div>

            {/* Title with staggered letter animation */}
            <motion.h3 
              className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4 leading-tight tracking-tight"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 + 0.15 }}
            >
              <motion.span
                animate={isHovered ? { color: '#50C878' } : { color: 'currentColor' }}
                transition={{ duration: 0.3 }}
                className="block"
              >
                {f.title}
              </motion.span>
            </motion.h3>

            {/* Decorative line */}
            <motion.div
              className="w-12 h-1 bg-gradient-to-r from-accent to-accent/50 rounded-full mb-6"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 + 0.2, ease: "easeOut" }}
              style={{ originX: 0 }}
            />

            {/* Description with reveal animation */}
            <motion.p 
              className="text-foreground/70 font-body leading-relaxed text-base"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 + 0.2 }}
            >
              {f.desc}
            </motion.p>
          </div>

          {/* CTA with sophisticated animation */}
          <motion.div
            className="flex items-center gap-3 text-accent font-body text-base font-semibold cursor-pointer mt-8 pt-6 border-t border-foreground/5"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 + 0.25 }}
            whileHover={{ x: 6 }}
          >
            <motion.span
              animate={isHovered ? { x: 4 } : { x: 0 }}
              transition={{ duration: 0.3 }}
            >
              Learn more
            </motion.span>
            <motion.div
              animate={isHovered ? { x: 4, rotate: 45 } : { x: 0, rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </motion.div>
          </motion.div>
        </div>

        {/* Border gradient animation */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={isHovered ? {
            boxShadow: 'inset 0 0 20px rgba(80,200,120,0.2)'
          } : {
            boxShadow: 'inset 0 0 0px rgba(80,200,120,0)'
          }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </motion.div>
  );
};

const WhyChooseUs = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-section-base lg:py-section-base-lg"
    >
      {/* Background image with sophisticated overlay */}
      <img
        src="https://vqvspkuhqthvbtsgfgbo.supabase.co/storage/v1/object/public/olive-uploads/Backgrounds/pexels-freestocks-1366594.jpg"
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      
      {/* Multi-layered overlay with depth */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 1400px 700px at 50% 0%, rgba(255,255,255,0.12), transparent 50%),
            linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45), rgba(0,0,0,0.65))
          `
        }}
      />

      {/* Animated gradient orbs for ambiance */}
      <motion.div
        className="absolute top-1/4 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          y: [0, 50, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none"
        animate={{
          y: [0, -40, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Header section with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="max-w-4xl mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Eyebrow variant="pill" tone="white" className="mb-6">
              Why Choose Olive Foods
            </Eyebrow>
          </motion.div>

          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
            <SplitText text="Your Complete FMCG" by="word" stagger={0.05} as="span" className="block" />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gradient-gold block"
            >
              <SplitText text="Distribution Partner" by="word" stagger={0.05} delay={0.15} as="span" className="block" />
            </motion.div>
          </h2>

          <motion.p 
            className="text-white/80 font-body text-lg leading-relaxed max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Three decades of experience in import, warehousing, and distribution — built on strong global supplier relationships and a commitment to excellence.
          </motion.p>
        </motion.div>

        {/* Dynamic grid layout with masonry effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 auto-rows-max">
          {/* First card — spans 3 columns, taller */}
          <div className="lg:col-span-3 lg:row-span-2">
            <FeatureCard feature={features[0]} index={0} />
          </div>

          {/* Second and third cards — stack on right */}
          <div className="lg:col-span-3">
            <FeatureCard feature={features[1]} index={1} />
          </div>
          <div className="lg:col-span-3">
            <FeatureCard feature={features[2]} index={2} />
          </div>

          {/* Fourth card — spans full width on bottom */}
          <div className="lg:col-span-6">
            <FeatureCard feature={features[3]} index={3} />
          </div>
        </div>

        {/* Bottom CTA with animation */}
        <motion.div
          className="mt-20 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div>
            <h3 className="text-white text-xl font-bold mb-2">Ready to partner with Olive?</h3>
            <p className="text-white/60 font-body">Discover how we can streamline your FMCG distribution.</p>
          </div>
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-accent to-accent/80 text-foreground rounded-full font-semibold whitespace-nowrap shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
