import { useInView } from "@/hooks/useInView";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "What types of food products do you import?", a: "We import a wide range of food products including grains, processed foods, beverages, dairy, frozen goods, spices, oils, and specialty gourmet items from over 25 countries worldwide." },
  { q: "How do you ensure product quality?", a: "Every product undergoes rigorous quality checks including laboratory testing, certification verification, and compliance with local food safety regulations before distribution." },
  { q: "What are your minimum order quantities?", a: "Minimum order quantities vary by product category. We work with businesses of all sizes and can accommodate both bulk wholesale and smaller curated orders." },
  { q: "Do you offer custom sourcing services?", a: "Yes! If you're looking for a specific product or brand not in our catalogue, our sourcing team can locate and import it for you through our extensive network of global suppliers." },
  { q: "What regions do you deliver to?", a: "We currently deliver nationwide with temperature-controlled logistics. We also offer international re-export services for select markets in Southeast Asia." },
];

const FAQSection = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="snap-section flex items-center bg-background">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-24 w-full">
        <div className={`text-center mb-12 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent-foreground font-body text-xs font-semibold uppercase tracking-[0.15em] border border-accent/20 mb-4">
            FAQs
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className={`border border-border rounded-xl px-6 hover:border-accent/30 transition-all duration-500 data-[state=open]:border-accent/40 data-[state=open]:shadow-md data-[state=open]:shadow-accent/5 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: isInView ? `${i * 80}ms` : "0ms" }}
            >
              <AccordionTrigger className="font-body font-medium text-foreground hover:no-underline hover:text-accent transition-colors py-5 text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
