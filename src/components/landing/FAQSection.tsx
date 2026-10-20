import { forwardRef, useId, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, MessageSquareText } from "lucide-react";
import SplitText from "@/components/motion/SplitText";
import Eyebrow from "@/components/ui/eyebrow";
import StatusPill from "@/components/StatusPill";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";
import { cn } from "@/lib/utils";
import { whatsappHref, whatsappMessage } from "@/lib/contact";
import { openStatus, useColomboNow } from "@/lib/hours";

/**
 * FAQ — the questions trade buyers ask before a first order.
 *
 * Left (sticky on desktop): the heading, topic filters and a dark "ask us
 * directly" card with the live opening status. Right: the questions as cards
 * that open in place. Every answer is in the HTML whether or not it's open
 * (collapsed by row height, not unmounted), so search engines and AI answer
 * engines read them all; the same Q&As go out as FAQPage structured data.
 *
 * Answers use only facts the site states (src/data/company.json).
 */

type Topic = "Products" | "Ordering" | "Delivery" | "Quality";

type Faq = { id: string; topic: Topic; q: string; a: string; link?: { label: string; to: string } };

const FAQS: Faq[] = [
  {
    id: "what-do-you-import",
    topic: "Products",
    q: "What types of food products do you import?",
    a: "Multiple categories, with a particular focus on frozen lines (french fries, meat, seafood, frozen fruits and vegetables), alongside dairy, grocery staples, edible oils and specialty imports. Vegan, gluten-free and organic ranges round out the catalogue, from suppliers across Europe, Asia and the Middle East.",
    link: { label: "Browse all categories", to: "/categories" },
  },
  {
    id: "request-a-product",
    topic: "Products",
    q: "Can I request a product you don't list?",
    a: "Yes. The catalogue is a starting point, not a limit. If you need a brand or product line we don't currently carry, our sourcing team can locate it and import it through our supplier network. Tell us what you're after.",
    link: { label: "Request a product", to: "/contact" },
  },
  {
    id: "seasonal-requests",
    topic: "Products",
    q: "Do you handle seasonal or one-off requests?",
    a: "Yes. Inventory rotates with the seasons (turkey and Dutch specialties around December, fresh imports as demand patterns shift), and we're happy to source one-off products for events or specific menus.",
  },
  {
    id: "who-do-you-supply",
    topic: "Ordering",
    q: "Who do you supply to?",
    a: "Hotels, restaurants, cafés, caterers, supermarkets and retailers across Sri Lanka, from a single venue to a national chain.",
    link: { label: "Supply for hotels", to: "/supply/hotels" },
  },
  {
    id: "how-to-order",
    topic: "Ordering",
    q: "How do I place an order or get a quote?",
    a: "Send us the products and quantities you need through the contact form, message us on WhatsApp at +94 77 330 0700 or call the office on +94 11 207 1717. We reply within one business day.",
    link: { label: "Request a quote", to: "/contact" },
  },
  {
    id: "delivery-outside-colombo",
    topic: "Delivery",
    q: "Do you deliver outside Colombo?",
    a: "Yes. We deliver island-wide, to all 25 districts of Sri Lanka, from our warehouse at 292 Sea Street, Colombo 11. Frozen lines are stored and delivered under cold chain at −18 °C.",
  },
  {
    id: "location-and-hours",
    topic: "Delivery",
    q: "Where are you, and when are you open?",
    a: "Our office, bonded warehouse and cold store are at 292 Sea Street, Colombo 11. We're open Monday to Friday 8:30 AM to 5:30 PM and Saturday 8:30 AM to 1:00 PM, and closed on Sundays and public holidays.",
    link: { label: "Get directions", to: "/contact#find-us" },
  },
  {
    id: "certified-and-safe",
    topic: "Quality",
    q: "Are your products certified and safe?",
    a: "Every product is verified for certification and compliance with local food safety regulations before distribution. Olive Foods is GMP certified (Codex Alimentarius CXC 1-1969), and frozen lines are stored and delivered under cold chain at −18 °C.",
    link: { label: "See the certification", to: "/about#certificate" },
  },
];

const TOPICS: ("All" | Topic)[] = ["All", "Products", "Ordering", "Delivery", "Quality"];

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

type FaqItemProps = { faq: Faq; index: number; open: boolean; onToggle: () => void; reduced: boolean };

// forwardRef: AnimatePresence's popLayout measures each leaving item.
const FaqItem = forwardRef<HTMLLIElement, FaqItemProps>(function FaqItem({ faq, index, open, onToggle, reduced }, ref) {
  const uid = useId();
  return (
    <motion.li
      ref={ref}
      layout={reduced ? false : "position"}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
      transition={{ duration: 0.45, ease }}
      id={`faq-${faq.id}`}
      className={cn(
        "group/faq relative scroll-mt-28 overflow-hidden rounded-2xl border transition-[border-color,background-color,box-shadow] duration-300",
        open ? "border-accent/35 bg-card shadow-float" : "border-border bg-card/60 hover:border-accent/25 hover:bg-card hover:shadow-card",
      )}
    >
      {/* rail */}
      <span
        aria-hidden
        className={cn(
          "absolute bottom-5 left-0 top-5 w-[3px] origin-top rounded-r-full bg-gradient-to-b from-accent to-forest-light transition-transform duration-500",
          open ? "scale-y-100" : "scale-y-0",
        )}
      />
      <h3>
        <button
          id={`${uid}-q`}
          type="button"
          aria-expanded={open}
          aria-controls={`${uid}-a`}
          onClick={onToggle}
          className="flex w-full items-start gap-4 px-5 py-5 text-left sm:gap-5 sm:px-6"
        >
          <span
            className={cn(
              "mt-0.5 font-display text-sm font-bold tabular-nums transition-colors duration-300",
              open ? "text-accent" : "text-muted-foreground/60 group-hover/faq:text-accent",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{faq.topic}</span>
            <span className="mt-1 block font-display text-[17px] font-semibold leading-snug text-foreground sm:text-lg">{faq.q}</span>
          </span>
          {/* plus → minus */}
          <span
            aria-hidden
            className={cn(
              "relative mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
              open ? "border-transparent bg-forest-deep text-primary-foreground" : "border-border text-foreground/70 group-hover/faq:border-accent/40",
            )}
          >
            <span className="absolute h-[2px] w-3.5 rounded-full bg-current" />
            <span className={cn("absolute h-3.5 w-[2px] rounded-full bg-current transition-transform duration-300", open && "rotate-90 scale-y-0")} />
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
          <div
            className={cn(
              "px-5 pb-6 pl-[3.25rem] transition-[opacity,transform] duration-500 sm:px-6 sm:pl-[3.75rem]",
              open ? "translate-y-0 opacity-100 delay-100" : "-translate-y-1 opacity-0",
            )}
          >
            <p className="max-w-2xl font-body text-[15px] leading-relaxed text-muted-foreground">{faq.a.replace(/−18 °C/g, "−18\u00a0°C")}</p>
            {faq.link && (
              <Link
                to={faq.link.to}
                tabIndex={open ? undefined : -1}
                className="group/link mt-4 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/[0.06] px-3.5 py-1.5 font-body text-[13px] font-semibold text-accent transition-colors hover:border-accent/60 hover:bg-accent/10"
              >
                {faq.link.label}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
});

const FAQSection = () => {
  const reduced = !!useReducedMotion();
  const [topic, setTopic] = useState<"All" | Topic>("All");
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);
  const now = useColomboNow();
  const status = openStatus(now.day, now.hour);

  const shown = topic === "All" ? FAQS : FAQS.filter((f) => f.topic === topic);
  const count = (t: "All" | Topic) => (t === "All" ? FAQS.length : FAQS.filter((f) => f.topic === t).length);

  const pickTopic = (t: "All" | Topic) => {
    setTopic(t);
    // Open the first question of the topic so the switch shows an answer.
    const first = t === "All" ? FAQS[0] : FAQS.find((f) => f.topic === t);
    setOpenId(first?.id ?? null);
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative overflow-hidden bg-background py-section-base lg:py-section-base-lg">
      <Helmet defer={false}>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Ground: faint dot grid and one soft olive glow. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_80%_70%_at_30%_40%,black,transparent)]"
        style={{ backgroundImage: "radial-gradient(circle, hsl(var(--forest-mid) / 0.14) 1px, transparent 1px)", backgroundSize: "26px 26px" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:gap-20 lg:px-8">
        {/* ── Left: heading, topics, ask us ── */}
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
            How sourcing, ordering and delivery work at Olive Foods, answered.
          </p>

          {/* Topics */}
          <div role="group" aria-label="Filter questions by topic" className="-mx-6 mt-8 flex gap-1.5 overflow-x-auto px-6 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
            <LayoutGroup id="faq-topics">
              {TOPICS.map((t) => {
                const on = topic === t;
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={on}
                    onClick={() => pickTopic(t)}
                    className={cn(
                      "relative inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 font-body text-[13px] font-semibold transition-colors duration-300",
                      on ? "border-transparent text-primary-foreground" : "border-border bg-card/70 text-foreground/75 hover:border-accent/40 hover:text-foreground",
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId="faq-topic-pill"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        className="absolute inset-0 rounded-full bg-forest-deep"
                      />
                    )}
                    <span className="relative">{t}</span>
                    <span className={cn("relative font-body text-xs tabular-nums", on ? "text-gold-light" : "text-muted-foreground")}>{count(t)}</span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>

          {/* Ask us directly */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="relative mt-10 hidden overflow-hidden rounded-3xl p-6 text-primary-foreground lg:block"
            style={{ background: "linear-gradient(150deg, hsl(150 40% 10%) 0%, hsl(140 50% 17%) 60%, hsl(75 38% 34%) 130%)" }}
          >
            <AskUs status={status} reduced={reduced} />
          </motion.div>
        </div>

        {/* ── Right: the questions ── */}
        <div className="min-w-0">
          <ul className="space-y-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((f, i) => (
                <FaqItem key={f.id} faq={f} index={i} open={openId === f.id} onToggle={() => setOpenId((cur) => (cur === f.id ? null : f.id))} reduced={reduced} />
              ))}
            </AnimatePresence>
          </ul>

          {/* Phones: the ask-us card follows the questions */}
          <div
            className="relative mt-8 overflow-hidden rounded-3xl p-6 text-primary-foreground lg:hidden"
            style={{ background: "linear-gradient(150deg, hsl(150 40% 10%) 0%, hsl(140 50% 17%) 60%, hsl(75 38% 34%) 130%)" }}
          >
            <AskUs status={status} reduced={reduced} />
          </div>
        </div>
      </div>
    </section>
  );
};

function AskUs({ status, reduced }: { status: { open: boolean; label: string }; reduced: boolean }) {
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-light/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">Still curious?</p>
          <StatusPill compact open={status.open} label={status.open ? "Open now" : status.label} reduced={reduced} />
        </div>
        <p className="mt-3 font-display text-2xl font-bold leading-tight">Ask our team directly.</p>
        <p className="mt-1.5 font-body text-sm text-primary-foreground/65">We reply within one business day.</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <a
            href={whatsappHref(whatsappMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary-foreground px-4 font-body text-sm font-semibold text-forest-deep transition-colors hover:bg-primary-foreground/90"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#1da851]" /> WhatsApp
          </a>
          <Link
            to="/contact"
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-primary-foreground/30 px-4 font-body text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
          >
            <MessageSquareText className="h-4 w-4" /> Message us
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default FAQSection;
