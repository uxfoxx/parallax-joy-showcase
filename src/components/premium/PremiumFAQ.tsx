import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "Do you publish prices on the website?",
    a: "No — our premium selection is priced per enquiry. Pricing depends on current import batches, exchange rates, and order size. We share a full quote within the hour on WhatsApp.",
  },
  {
    q: "What's the minimum order?",
    a: "For home deliveries, there's no strict minimum — though we recommend a basket of LKR 15,000+ to make delivery worthwhile. For HoReCa accounts, we offer volume pricing.",
  },
  {
    q: "How fresh is the product?",
    a: "All frozen goods arrive directly from our bonded warehouse at -18°C. Chilled products (cheese, fresh pasta) are delivered within 24–48 hours of order confirmation.",
  },
  {
    q: "Can you source something I don't see?",
    a: "Absolutely. If you're after a specific brand, cut, or cuisine that isn't in our current selection, let us know — sourcing bespoke imports is part of the concierge service.",
  },
  {
    q: "Do you deliver outside Colombo?",
    a: "Yes, island-wide. Our own cold-chain logistics fleet covers all major cities. Delivery timelines vary: 1 day in Colombo, 2–3 days for upcountry and coastal regions.",
  },
];

const PremiumFAQ = () => {
  return (
    <section className="relative py-28 bg-[hsl(150_40%_5%)]">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 grid md:grid-cols-[40%_60%] gap-12 md:gap-20">
        {/* Left — editorial header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="md:sticky md:top-28 md:h-fit"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-xs font-medium border border-accent/20 mb-6 tracking-[0.3em] uppercase">
            FAQ
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white italic leading-tight tracking-tight">
            Common
            <br />
            questions,
            <br />
            answered.
          </h2>
          <p className="font-body text-white/50 mt-6 leading-relaxed">
            Anything else? Our team is on WhatsApp.
          </p>
        </motion.div>

        {/* Right — accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-white/10"
              >
                <AccordionTrigger className="font-display text-lg md:text-xl text-white italic text-left hover:no-underline hover:text-accent py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-white/55 text-base leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumFAQ;
