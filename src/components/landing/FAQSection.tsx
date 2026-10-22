import { useId, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SplitText from "@/components/motion/SplitText";
import Eyebrow from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

/**
 * FAQ — the questions trade buyers ask before a first order.
 *
 * Deliberately quiet: the heading and one way to reach the team on the left
 * (sticky on desktop), and on the right a plain list of questions divided by
 * hairlines that open in place. No filters, numbering, cards or badges — the
 * questions are the content.
 *
 * Every answer is in the HTML whether or not it's open (collapsed by row
 * height, not unmounted), so search engines and AI answer engines read them
 * all; the same Q&As go out as FAQPage structured data.
 *
 * Answers use only facts the site states (src/data/company.json).
 */

type Faq = { id: string; q: string; a: string; link?: { label: string; to: string } };

const FAQS: Faq[] = [
  {
    id: "what-do-you-import",
    q: "What types of food products do you import?",
    a: "Multiple categories, with a particular focus on frozen lines (french fries, meat, seafood, frozen fruits and vegetables), alongside dairy, grocery staples, edible oils and specialty imports. Vegan, gluten-free and organic ranges round out the catalogue, from suppliers across Europe, Asia and the Middle East.",
    link: { label: "Browse all categories", to: "/categories" },
  },
  {
    id: "request-a-product",
    q: "Can I request a product you don't list?",
    a: "Yes. The catalogue is a starting point, not a limit. If you need a brand or product line we don't currently carry, our sourcing team can locate it and import it through our supplier network. Tell us what you're after.",
    link: { label: "Request a product", to: "/contact" },
  },
  {
    id: "seasonal-requests",
    q: "Do you handle seasonal or one-off requests?",
    a: "Yes. Inventory rotates with the seasons (turkey and Dutch specialties around December, fresh imports as demand patterns shift), and we're happy to source one-off products for events or specific menus.",
  },
  {
    id: "who-do-you-supply",
    q: "Who do you supply to?",
    a: "Hotels, restaurants, cafés, caterers, supermarkets and retailers across Sri Lanka, from a single venue to a national chain.",
    link: { label: "Supply for hotels", to: "/supply/hotels" },
  },
  {
    id: "how-to-order",
    q: "How do I place an order or get a quote?",
    a: "Businesses and bulk buyers: WhatsApp or call the sales line on +94 77 330 0700, or send the products and quantities you need through the contact form. For anything else, call the office on +94 11 207 1717. We reply within one business day.",
    link: { label: "Request a quote", to: "/contact" },
  },
  {
    id: "delivery-outside-colombo",
    q: "Do you deliver outside Colombo?",
    a: "Yes. We deliver island-wide, to all 25 districts of Sri Lanka, from our warehouse at 292 Sea Street, Colombo 11. Frozen lines are stored and delivered under cold chain at −18 °C.",
  },
  {
    id: "location-and-hours",
    q: "Where are you, and when are you open?",
    a: "Our office, bonded warehouse and cold store are at 292 Sea Street, Colombo 11. We're open Monday to Friday 8:30 AM to 5:30 PM and Saturday 8:30 AM to 1:00 PM, and closed on Sundays and public holidays.",
    link: { label: "Get directions", to: "/contact#find-us" },
  },
  {
    id: "certified-and-safe",
    q: "Are your products certified and safe?",
    a: "Every product is verified for certification and compliance with local food safety regulations before distribution. Olive Foods is GMP certified (Codex Alimentarius CXC 1-1969), and frozen lines are stored and delivered under cold chain at −18 °C.",
    link: { label: "See the certification", to: "/about#certificate" },
  },
];

// FAQPage structured data — makes the Q&As eligible for Google rich results
// and gives AI answer engines clean, quotable question/answer pairs.
// defer={false} on the Helmet below: without it the tag isn't committed in
// time for the prerender snapshot and never reaches the static HTML.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const ease = [0.22, 1, 0.36, 1] as const;

function FaqItem({ faq, index, open, onToggle, reduced }: { faq: Faq; index: number; open: boolean; onToggle: () => void; reduced: boolean }) {
  const uid = useId();
  return (
    <motion.li
      id={`faq-${faq.id}`}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.5, delay: index * 0.04, ease }}
      className="scroll-mt-28 border-b border-border"
    >
      <h3>
        <button
          id={`${uid}-q`}
          type="button"
          aria-expanded={open}
          aria-controls={`${uid}-a`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span
            className={cn(
              "font-display text-lg font-semibold leading-snug transition-colors duration-300 sm:text-xl",
              open ? "text-foreground" : "text-foreground/85 group-hover:text-foreground",
            )}
          >
            {faq.q}
          </span>
          {/* plus turns into a cross */}
          <span
            aria-hidden
            className={cn(
              "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color,transform] duration-300",
              open ? "rotate-45 border-transparent bg-forest-deep text-primary-foreground" : "border-border text-foreground/60 group-hover:border-foreground/30 group-hover:text-foreground",
            )}
          >
            <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
            <span className="absolute h-3.5 w-[1.5px] rounded-full bg-current" />
          </span>
        </button>
      </h3>
      <div
        id={`${uid}-a`}
        role="region"
        aria-labelledby={`${uid}-q`}
        className={cn("grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={cn(
              "max-w-2xl pb-7 pr-14 font-body text-[15.5px] leading-relaxed text-muted-foreground transition-opacity duration-500",
              open ? "opacity-100 delay-100" : "opacity-0",
            )}
          >
            {faq.a.replace(/−18 °C/g, "−18\u00a0°C")}
            {faq.link && (
              <>
                {" "}
                <Link
                  to={faq.link.to}
                  tabIndex={open ? undefined : -1}
                  className="whitespace-nowrap font-semibold text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {faq.link.label} →
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

const FAQSection = () => {
  const reduced = !!useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-background py-section-base lg:py-section-base-lg">
      <Helmet defer={false}>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:gap-24 lg:px-8">
        {/* ── Heading + one way to reach us ── */}
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease }}
          >
            <Eyebrow variant="pill" tone="accent" className="mb-7">
              FAQs
            </Eyebrow>
          </motion.div>
          <h2 id="faq-title" className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            <SplitText text="Frequently asked" by="word" stagger={0.05} as="span" className="block" />
            <SplitText text="questions." by="word" stagger={0.05} delay={0.15} as="span" className="block text-gradient-gold" tokenClassName="text-gradient-gold" />
          </h2>
          <p className="mt-5 max-w-sm font-body text-base leading-relaxed text-muted-foreground">
            How sourcing, ordering and delivery work at Olive Foods.
          </p>
          <p className="mt-8 font-body text-sm text-muted-foreground">
            Still have a question?
            <Link
              to="/contact"
              className="group ml-1.5 inline-flex items-center gap-1 font-semibold text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:decoration-foreground"
            >
              Talk to our team
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </p>
        </div>

        {/* ── The questions ── */}
        <ul className="min-w-0 border-t border-border">
          {FAQS.map((f, i) => (
            <FaqItem key={f.id} faq={f} index={i} open={openId === f.id} onToggle={() => setOpenId((cur) => (cur === f.id ? null : f.id))} reduced={reduced} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQSection;
