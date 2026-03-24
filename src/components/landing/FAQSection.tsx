import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "What types of food products do you import?", a: "We import a wide range of food products including grains, processed foods, beverages, dairy, frozen goods, spices, oils, and specialty gourmet items from over 25 countries worldwide." },
  { q: "Do you supply wholesale and retail businesses?", a: "Yes, we serve both wholesale distributors and retail businesses. Our flexible ordering system accommodates bulk purchases as well as smaller curated selections." },
  { q: "Are your products certified and safe?", a: "Every product undergoes rigorous quality checks including laboratory testing, certification verification, and compliance with local food safety regulations before distribution." },
  { q: "Can I request specific products for import?", a: "Absolutely! If you're looking for a specific product or brand not in our catalogue, our sourcing team can locate and import it through our extensive network of global suppliers." },
  { q: "What are your delivery timelines?", a: "Delivery timelines vary by product origin and destination. Domestic deliveries typically take 3-5 business days, while international sourcing may take 2-6 weeks depending on the product." },
  { q: "Do you offer bulk pricing or discounts?", a: "Yes, we offer competitive bulk pricing and volume-based discounts. Contact our sales team for a customized quote based on your specific requirements." },
];

const FAQSection = () => {
  const { ref, isInView } = useInView();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section ref={ref} className="snap-section flex items-center relative overflow-hidden">
      {/* Animated dark gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, hsl(140 35% 16% / 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, hsl(140 30% 14% / 0.4) 0%, transparent 50%),
            linear-gradient(180deg, hsl(140 45% 8%), hsl(140 40% 10%), hsl(140 45% 8%))
          `,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 items-start">
          {/* Left — Header */}
          <div
            className={`transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 mb-6">
              FAQs
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground mb-5 leading-tight">
              Frequently
              <br />
              Asked Questions
            </h2>
            <p className="text-primary-foreground/40 font-body text-base leading-relaxed max-w-sm">
              In the digital age, your voice on social media is your brand's heartbeat.
            </p>
          </div>

          {/* Right — Custom Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-xl border border-primary-foreground/15 overflow-hidden transition-all duration-500 hover:border-primary-foreground/25 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{
                  transitionDelay: isInView ? `${i * 80}ms` : "0ms",
                  background: `linear-gradient(135deg, hsl(140 35% 14% / 0.8), hsl(140 40% 12% / 0.6))`,
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left group"
                >
                  <span className="font-body font-medium text-primary-foreground text-base pr-4">
                    {faq.q}
                  </span>
                  <div className="flex-shrink-0 w-8 h-8 rounded-md border border-primary-foreground/20 flex items-center justify-center group-hover:border-primary-foreground/40 transition-colors">
                    {openIndex === i ? (
                      <Minus className="w-4 h-4 text-primary-foreground/60" />
                    ) : (
                      <Plus className="w-4 h-4 text-primary-foreground/60" />
                    )}
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 pb-5 font-body text-primary-foreground/50 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
