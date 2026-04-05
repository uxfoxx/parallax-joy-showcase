import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Plus } from "lucide-react";

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

  // Parallax bg
  const bgY = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28 lg:py-36">
      {/* Standardized dark gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, hsl(140 50% 19% / 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, hsl(150 40% 14% / 0.4) 0%, transparent 50%),
            linear-gradient(180deg, hsl(140 50% 14%), hsl(150 40% 10%), hsl(150 40% 6%))
          `,
        }}
      />

      {/* Parallax decorative */}
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ y: bgY }}>
        <div
          className="absolute w-[500px] h-[400px] top-1/3 -left-40 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(ellipse, hsl(80 50% 31%), transparent 70%)" }}
        />
        <div
          className="absolute w-[300px] h-[300px] bottom-20 right-10 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)" }}
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-20 items-start">
          {/* Left — Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 mb-8 tracking-widest uppercase">
              FAQs
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
              Frequently
              <br />
              Asked Questions
            </h2>
            <p className="text-primary-foreground/40 font-body text-base leading-relaxed max-w-sm">
              Everything you need to know about our food import services, from sourcing to delivery.
            </p>
          </motion.div>

          {/* Right — Custom Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-lg border border-primary-foreground/15 overflow-hidden hover:border-primary-foreground/25 transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, hsl(140 50% 19% / 0.8), hsl(150 40% 14% / 0.6))`,
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between px-7 py-6 text-left group"
                >
                  <span className="font-body font-medium text-primary-foreground text-base pr-4">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 w-8 h-8 rounded-md border border-primary-foreground/20 flex items-center justify-center group-hover:border-primary-foreground/40 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-primary-foreground/60" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-7 pb-6 font-body text-primary-foreground/50 text-sm leading-relaxed">
                        {faq.a}
                      </p>
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
