import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import GoldHairline from "@/components/GoldHairline";
import SplitText from "@/components/motion/SplitText";
import SpotlightHover from "@/components/motion/SpotlightHover";
import Eyebrow from "@/components/ui/eyebrow";

const faqs = [
  {
    q: "What types of food products do you import?",
    a: "Multiple categories, with a particular focus on frozen lines (french fries, meat, seafood, frozen fruits and vegetables), alongside dairy, grocery staples, edible oils, and specialty imports. Vegan, gluten-free, and organic ranges round out the catalogue. Suppliers across Europe, Asia, and the Middle East, and growing.",
  },
  {
    q: "Who do you supply to?",
    a: "Sri Lanka's hospitality and retail trade: five-star hotel chains, restaurants, cafés, catering operations, and major supermarkets. From a single venue to a national chain, we deliver island-wide.",
  },
  {
    q: "Are your products certified and safe?",
    a: "Every product is verified for certification and compliance with local food safety regulations before distribution. Frozen lines stay at −18 °C from origin port to delivery.",
  },
  {
    q: "Can I request specific products for import?",
    a: "Yes. If you need a brand or product line we don't currently carry, our sourcing team can locate and import it through our supplier network. Tell us what you need.",
  },
  {
    q: "Do you only sell what's in your catalogue?",
    a: "No — the catalogue is where we start, not where we stop. Need a product or brand that isn't listed, even one we don't already represent? Our sourcing team will track it down and import it through our global supplier network. Tell us what you're looking for.",
  },
  {
    q: "Do you handle seasonal or one-off requests?",
    a: "Yes. Inventory rotates with the seasons (turkey and Dutch specialties around December, fresh imports as demand patterns shift). Happy to source one-off products for events or specific menus.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-section-base lg:py-section-base-lg bg-background">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--forest-mid) / 0.10) 1px, transparent 1px)`,
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
            
            <div className="relative">
              <Eyebrow variant="pill" tone="accent" className="mb-4">
                FAQs
              </Eyebrow>
              <GoldHairline width={56} delay={0.15} className="mb-6 block" />
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                <SplitText text="Frequently" by="word" stagger={0.04} as="span" className="block" />
                <SplitText text="Asked Questions" by="word" stagger={0.04} delay={0.15} as="span" className="block" />
              </h2>
              <p className="text-muted-foreground font-body text-base leading-relaxed max-w-sm">
                How sourcing, supply, and delivery work at Olive Foods.
              </p>

              {/* Still-have-a-question CTA */}
              <Link
                to="/contact"
                className="group/cta mt-8 inline-flex items-center gap-4 rounded-2xl border border-border bg-card/50 px-5 py-4 transition-colors duration-300 hover:border-accent/40 hover:bg-accent/[0.04]"
              >
                <span className="flex flex-col">
                  <span className="font-body text-[10px] font-semibold tracking-[0.24em] uppercase text-muted-foreground">
                    Still curious?
                  </span>
                  <span className="font-display text-base font-semibold text-foreground transition-colors group-hover/cta:text-accent">
                    Talk to our team
                  </span>
                </span>
                <span className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-transform duration-300 group-hover/cta:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
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
                className={`relative border-b transition-colors duration-300 ${
                  openIndex === i ? "border-accent/30" : "border-border"
                }`}
              >
                {/* Active accent rail */}
                <motion.span
                  aria-hidden
                  className="absolute left-0 top-2 bottom-2 w-[2px] origin-top rounded-full bg-accent"
                  initial={false}
                  animate={{ scaleY: openIndex === i ? 1 : 0, opacity: openIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />

                <SpotlightHover
                  className={`block rounded-lg transition-colors duration-300 ${
                    openIndex === i ? "bg-accent/[0.03]" : ""
                  }`}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between py-6 pl-4 pr-2 text-left group"
                  >
                    <div className="flex items-center gap-4 pr-4">
                      <motion.span
                        animate={{
                          color: openIndex === i ? "hsl(var(--accent))" : "hsl(var(--muted-foreground) / 0.5)",
                          scale: openIndex === i ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        className="font-display text-sm font-bold shrink-0 tabular-nums origin-left"
                      >
                        {String(i + 1).padStart(2, "0")}.
                      </motion.span>
                      <div className="flex flex-col gap-1.5">
                        <span className={`font-body font-medium text-base transition-colors duration-300 ${openIndex === i ? "text-accent" : "text-foreground group-hover:text-accent"}`}>
                          {faq.q}
                        </span>
                        <GoldHairline width={28} inView className="opacity-70" />
                      </div>
                    </div>
                    {/* Toggle — "+" spins into "×" and fills accent when open */}
                    <motion.span
                      animate={{ rotate: openIndex === i ? 135 : 0 }}
                      transition={{ type: "spring", stiffness: 320, damping: 20 }}
                      className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-xl font-light leading-none transition-colors duration-300 ${
                        openIndex === i
                          ? "border-accent bg-accent text-white"
                          : "border-border text-muted-foreground group-hover:border-accent/40 group-hover:text-accent"
                      }`}
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                          className="pl-12 pr-6 pb-6"
                        >
                          <p className="font-body text-muted-foreground text-sm leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SpotlightHover>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
