import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import GoldHairline from "@/components/GoldHairline";
import SplitText from "@/components/motion/SplitText";

const faqs = [
  { q: "What types of food products do you import?", a: "We import across five core categories: Frozen foods, Dairy products, Grocery & Staples, Edible Oils, and Specialty Imports — sourced from leading producers in Australia, Italy, Netherlands, Thailand, Singapore, UAE, India, and China." },
  { q: "Who do you supply to?", a: "We distribute across three key channels: HoReCa (Hotels, Restaurants & Catering), Modern Trade (supermarket chains), and General Trade (retail outlets and distributors) — covering businesses island-wide across Sri Lanka." },
  { q: "Are your products certified and safe?", a: "Every product undergoes rigorous quality checks including laboratory testing, certification verification, and compliance with local food safety regulations before distribution. We maintain cold-chain integrity at -18°C for frozen products." },
  { q: "Can I request specific products for import?", a: "Absolutely! If you're looking for a specific product or brand not in our catalogue, our sourcing team can locate and import it through our extensive network of global suppliers across 8+ countries." },
  { q: "What are your delivery timelines?", a: "We provide island-wide delivery coverage. Domestic deliveries are handled through our own logistics fleet, ensuring timely and temperature-controlled transport for all product categories." },
  { q: "What brands do you represent?", a: "We are the exclusive Sri Lankan representatives for leading international brands including AZIZAA, Hungritos, Fletcher, Granoro, Daily Dairy, Snorre Foods, Wai Wai, and Royal Arm, among others." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28 lg:py-36 bg-background">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--forest-mid) / 0.15) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Decorative accent orbs */}
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ y: bgY }}>
        <div className="absolute w-[500px] h-[500px] -top-40 -right-40 rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />
        <div className="absolute w-[400px] h-[400px] bottom-20 -left-20 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-20 items-start">
          {/* Left — Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Large decorative FAQ text */}
            <span className="absolute -top-6 -left-2 font-display text-[8rem] font-black text-foreground/[0.04] leading-none select-none pointer-events-none">
              FAQ
            </span>
            <div className="relative">
              <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium border border-accent/20 mb-4 tracking-widest uppercase">
                FAQs
              </span>
              <GoldHairline width={56} delay={0.15} className="mb-6 block" />
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                <SplitText text="Frequently" by="word" stagger={0.04} as="span" className="block" />
                <SplitText text="Asked Questions" by="word" stagger={0.04} delay={0.15} as="span" className="block" />
              </h2>
              <p className="text-muted-foreground font-body text-base leading-relaxed max-w-sm">
                Everything you need to know about our food import services, from
                sourcing to delivery.
              </p>
            </div>
          </motion.div>

          {/* Right — Accordion */}
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className={`border-b transition-colors duration-300 ${
                  openIndex === i ? "border-accent/30" : "border-border"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <div className="flex items-center gap-4 pr-4">
                    <span className={`font-display text-sm font-bold transition-colors duration-300 shrink-0 ${openIndex === i ? "text-accent" : "text-muted-foreground/50"}`}>
                      {String(i + 1).padStart(2, "0")}.
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <span className={`font-body font-medium text-base transition-colors duration-300 ${openIndex === i ? "text-accent" : "text-foreground group-hover:text-accent"}`}>
                        {faq.q}
                      </span>
                      <GoldHairline width={28} inView className="opacity-70" />
                    </div>
                  </div>
                  <motion.span
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex-shrink-0 w-7 h-7 rounded-md border flex items-center justify-center transition-colors duration-300 text-lg font-light leading-none ${
                      openIndex === i
                        ? "border-accent/40 text-accent bg-accent/5"
                        : "border-border text-muted-foreground group-hover:border-accent/30"
                    }`}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-10 pb-6">
                        <p className="font-body text-muted-foreground text-sm leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
