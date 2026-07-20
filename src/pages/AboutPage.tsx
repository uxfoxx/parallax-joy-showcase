import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Seo from "@/components/Seo";
import { Users, Package, Warehouse, Thermometer, Truck, ShoppingBag, Hotel, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ImmersiveBackground from "@/components/landing/ImmersiveBackground";
import ScrollFloatingElement from "@/components/landing/ScrollFloatingElement";
import SectionTransition from "@/components/landing/SectionTransition";
import CompanyPhilosophy from "@/components/about/CompanyPhilosophy";
import CertificationSection from "@/components/about/CertificationSection";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/ui/eyebrow";
import { useMouseGradient } from "@/hooks/useMouseGradient";

const businessActivities = [
  { icon: Package, title: "Import & Brand Representation", desc: "Exclusive brand agency and import operations for leading international brands." },
  { icon: Warehouse, title: "Bonded Warehousing", desc: "Customs-approved bonded warehouse facilities for duty efficiency and secure storage." },
  { icon: Thermometer, title: "Cold-Chain Logistics", desc: "Temperature-controlled storage and transport at -18°C for frozen and chilled product lines." },
  { icon: Truck, title: "HoReCa Distribution", desc: "Direct supply to hotels, restaurants, and catering companies across Sri Lanka." },
  { icon: ShoppingBag, title: "Modern Trade & General Trade", desc: "Distribution to supermarket chains, retail outlets, and general trade networks island-wide." },
];

const clientSegments = [
  {
    icon: Hotel,
    label: "Hotels & Resorts",
    description:
      "Five-star kitchens and resort F&B teams rely on our cold-chain for premium meats, dairy, and specialty imports, delivered on schedule, every week.",
    examples: ["Premium beef cuts", "Aged dairy & cheese", "Specialty ingredients"],
  },
  {
    icon: UtensilsCrossed,
    label: "Restaurants & Cafes",
    description:
      "From flagship restaurants to neighbourhood cafes, we keep menus consistent with reliable supply of frozen staples, sauces, and finishing items.",
    examples: ["Frozen seafood", "Pastas & sauces", "Bakery essentials"],
  },
  {
    icon: Users,
    label: "Catering Companies",
    description:
      "Volume-focused catering operations get scaled procurement, bulk packs, and the kind of lead-time predictability event work demands.",
    examples: ["Bulk packs", "Multi-channel logistics", "Tailored credit terms"],
  },
  {
    icon: ShoppingBag,
    label: "Supermarket Chains",
    description:
      "Modern Trade and General Trade partners stock our brands across the island with shelf-ready packaging and dedicated category support.",
    examples: ["Shelf-ready packaging", "Trade marketing support", "Island-wide replenishment"],
  },
];

/**
 * The five business activities as the thing they literally are — one supply
 * chain. A spine draws itself down the rail as you scroll, linking numbered
 * stations from port to shelf; each station is a node ON the line, so the
 * "fully integrated, no handoffs" claim is carried by the layout itself
 * rather than by five disconnected cards.
 */
const SupplyChain = () => {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.78", "end 0.6"] });
  const drawn = useSpring(scrollYProgress, { stiffness: 70, damping: 22 });

  return (
    <ol ref={ref} className="relative">
      {/* Rail + the drawn-in chain */}
      <span aria-hidden className="absolute left-7 top-4 bottom-10 w-px bg-primary-foreground/10" />
      <motion.span
        aria-hidden
        style={{ scaleY: drawn }}
        className="absolute left-7 top-4 bottom-10 w-px bg-accent origin-top"
      />

      {businessActivities.map((a, i) => (
        <motion.li
          key={a.title}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="group relative py-6 pl-24 pr-2"
        >
          {/* Station node, sitting on the line */}
          <span className="absolute left-0 top-6 flex h-14 w-14 items-center justify-center rounded-full border border-primary-foreground/15 bg-[hsl(150_38%_8%)] transition-colors duration-300 group-hover:border-accent/60">
            <a.icon className="h-5 w-5 text-accent" />
          </span>

          {/* Ghost station number */}
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-display text-6xl sm:text-7xl font-black tabular-nums text-primary-foreground/[0.05] transition-colors duration-300 group-hover:text-primary-foreground/[0.09]"
          >
            {String(i + 1).padStart(2, "0")}
          </span>

          <h3 className="relative font-display text-lg sm:text-xl font-semibold tracking-tight text-primary-foreground transition-colors duration-300 group-hover:text-accent">
            {a.title}
          </h3>
          <p className="relative mt-1.5 max-w-md font-body text-sm leading-relaxed text-primary-foreground/60">
            {a.desc}
          </p>
        </motion.li>
      ))}
    </ol>
  );
};

const WhoWeServe = () => {
  const [active, setActive] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);

  // Auto-cycle every 5s until user picks a tab.
  useEffect(() => {
    if (userInteracted) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % clientSegments.length),
      5000,
    );
    return () => window.clearInterval(id);
  }, [userInteracted]);

  const current = clientSegments[active];
  const Icon = current.icon;

  return (
    <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14 items-start">
      {/* Tab strip */}
      <div className="relative">
        <ul className="flex flex-col gap-1">
          {clientSegments.map((s, i) => {
            const isActive = i === active;
            return (
              <li key={s.label}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setUserInteracted(true);
                  }}
                  onMouseEnter={() => {
                    setActive(i);
                    setUserInteracted(true);
                  }}
                  className={`relative w-full flex items-center justify-between gap-4 px-4 py-4 rounded-lg transition-colors duration-300 group ${
                    isActive
                      ? "bg-primary/[0.06] text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="serve-active"
                      className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="flex items-center gap-3">
                    <span className="font-display text-[11px] tabular-nums tracking-[0.22em] text-muted-foreground/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-body text-[15px] font-medium tracking-tight">
                      {s.label}
                    </span>
                  </span>
                  <s.icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground"
                    }`}
                    strokeWidth={1.7}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Preview panel */}
      <div className="relative rounded-2xl border border-border bg-card p-7 lg:p-8 min-h-[300px] shadow-card overflow-hidden">
        {/* Soft corner accent */}
        <span
          aria-hidden
          className="absolute top-0 right-0 w-32 h-32 rounded-bl-[5rem] bg-primary/5 pointer-events-none"
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={current.label}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-display text-[44px] lg:text-[56px] font-black leading-none text-primary/15 tabular-nums">
                {String(active + 1).padStart(2, "0")}
              </span>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" strokeWidth={1.7} />
              </div>
            </div>

            <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground tracking-tight leading-snug mb-3">
              {current.label}
            </h3>
            <span className="block w-12 h-[2px] rounded-full bg-primary mb-5" />
            <p className="font-body text-[14.5px] text-foreground/80 leading-relaxed mb-6 max-w-prose">
              {current.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {current.examples.map((ex) => (
                <span
                  key={ex}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background text-foreground/85 font-body text-[12px]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {ex}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const { ref: mouseRef, gradientStyle } = useMouseGradient();
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);

  return (
    <div className="smooth-scroll overflow-x-hidden">
      <Seo
        title="About Olive Foods: Sri Lanka's Premium Food Import Partner"
        description="Thirty-plus years of food-industry experience. Olive Foods sources globally and distributes island-wide to Sri Lanka's hotels, restaurants and retailers, built on relationships, not transactions."
        path="/about"
      />
      <ImmersiveBackground />
      <ScrollFloatingElement />
      <Navbar />
      <FloatingWhatsApp />

      <PageHero
        eyebrow="Olive Foods / About"
        title={<>Sri Lanka's <span className="text-gradient-gold italic">trusted</span> import partner.</>}
        subtitle="Import, bonded warehousing & distribution, built on thirty-plus years of supplier relationships brought to Sri Lanka's hospitality and retail trade."
        subheading
      />

      <SectionTransition />

      {/* Who We Are — Light */}
      <div data-navbar-theme="light">
        <section className="relative overflow-hidden py-28 lg:py-36 bg-background">
          <div className="absolute w-[400px] h-[400px] -top-20 -left-20 rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />
          <div className="absolute w-[300px] h-[300px] bottom-10 right-10 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
              {/* Sticky editorial label */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-4 lg:sticky lg:top-28 self-start"
              >
                <Eyebrow variant="pill" tone="accent" className="mb-6">
                  Our Story
                </Eyebrow>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-[1.05] tracking-tight">
                  Who
                  <span className="block text-gradient-gold italic">we are.</span>
                </h2>
              </motion.div>

              {/* Standfirst + body */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-8"
              >
                <p className="font-body text-xl md:text-2xl font-medium text-foreground leading-relaxed">
                  Olive Foods is built on thirty-plus years of food-industry experience — and
                  the supplier relationships that come with it. We import and distribute across
                  Sri Lanka, supplying the hospitality and retail trade through relationships
                  that came first.
                </p>
                <div className="mt-7 space-y-5 font-body text-muted-foreground leading-relaxed">
                  <p>Our focus is frozen lines (french fries, meat, seafood, fruits, vegetables) alongside dairy, grocery staples, edible oils, and specialty imports, with vegan, gluten-free, and organic ranges supported throughout. Suppliers across Europe, Asia, and the Middle East, and growing.</p>
                  <p>The integrated model covers every step from sourcing and customs through our bonded warehouse, into −18 °C cold-chain storage, and onto the road in our own island-wide delivery fleet, serving hotels, restaurants, cafés, catering operations, and major supermarkets.</p>
                </div>
              </motion.div>
            </div>

            {/* Record strip — hairlines, not cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 border-y border-border divide-x divide-border"
            >
              {[
                { value: "30+", label: "Years of trade" },
                { value: "10+", label: "Source countries" },
                { value: "25", label: "Districts served" },
                { value: "−18°C", label: "Cold chain" },
              ].map((s) => (
                <div key={s.label} className="py-8 px-5 md:px-8">
                  <p className="font-display text-3xl md:text-4xl font-bold text-foreground tabular-nums">{s.value}</p>
                  <p className="mt-1.5 font-body text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      <SectionTransition />

      {/* Company Philosophy — Light */}
      <div data-navbar-theme="light">
        <CompanyPhilosophy />
      </div>

      <SectionTransition />

      {/* Core Business Activities — Dark */}
      <div data-navbar-theme="dark">
        <section ref={mouseRef as React.RefObject<HTMLElement>} className="relative overflow-hidden py-28 lg:py-36">
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(ellipse at 30% 20%, hsl(140 50% 19% / 0.5) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, hsl(150 40% 14% / 0.4) 0%, transparent 50%),
              linear-gradient(180deg, hsl(150 40% 6%), hsl(140 50% 14%), hsl(150 40% 10%))
            `,
          }} />
          <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ y: bgY }}>
            <div className="absolute w-[500px] h-[500px] -top-32 -left-32 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)" }} />
            <div className="absolute w-[350px] h-[350px] bottom-0 right-10 rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)" }} />
          </motion.div>
          <div className="absolute inset-0 pointer-events-none z-[1] opacity-30" style={gradientStyle} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Sticky header — stays alongside while the chain draws */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-5 lg:sticky lg:top-28 self-start"
              >
                <Eyebrow variant="pill" tone="primary" className="mb-6">
                  What We Do
                </Eyebrow>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-[1.05] tracking-tight">
                  From port to shelf,
                  <span className="block text-gradient-gold-dark italic">one unbroken chain.</span>
                </h2>
                <p className="mt-6 font-body text-lg text-primary-foreground/60 leading-relaxed max-w-md">
                  Five operations, one integrated supply chain — no handoffs, no
                  third parties between the source and your kitchen.
                </p>
              </motion.div>

              {/* The chain itself */}
              <div className="lg:col-span-7">
                <SupplyChain />
              </div>
            </div>
          </div>
        </section>
      </div>

      <SectionTransition />

      {/* Mission & Vision — Light */}
      <div data-navbar-theme="light">
        <section className="relative overflow-hidden py-28 lg:py-36 bg-background">
          <div className="absolute w-[350px] h-[350px] top-1/4 -right-20 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />
          <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-14"
            >
              <Eyebrow variant="pill" tone="accent">
                Our Purpose
              </Eyebrow>
            </motion.div>

            {/* Two statements set large, split by a hairline — no boxes, no icons */}
            <div className="grid md:grid-cols-2 border-y border-border md:divide-x divide-border">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="py-14 md:pr-14 border-b border-border md:border-b-0"
              >
                <p className="font-body text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Mission</p>
                <p className="mt-6 font-display text-2xl sm:text-[28px] font-semibold leading-snug text-foreground">
                  To bring globally sourced food products to Sri Lanka's hospitality and
                  retail trade — through{" "}
                  <span className="text-gradient-gold italic">trusted, long-term relationships</span>,
                  consistent service, and reliable supply.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="py-14 md:pl-14"
              >
                <p className="font-body text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Vision</p>
                <p className="mt-6 font-display text-2xl sm:text-[28px] font-semibold leading-snug text-foreground">
                  To be Sri Lanka's most trusted premium food distribution partner — known not
                  for chasing transactions, but for{" "}
                  <span className="text-gradient-gold italic">the partnerships we build</span>.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <SectionTransition />

      {/* Certification — Dark. The purpose above is the promise; this is the
          independent audit of it. (#certificate anchor target from the home seal.) */}
      <div data-navbar-theme="dark">
        <CertificationSection />
      </div>

      <SectionTransition />

      {/* Who We Serve — Light */}
      <div data-navbar-theme="light">
        <section className="relative overflow-hidden py-28 lg:py-36 bg-background">
          <div className="absolute w-[400px] h-[400px] -bottom-20 -left-20 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="text-center max-w-3xl mx-auto mb-20">
              <Eyebrow variant="pill" tone="accent" className="mb-8">
                Our Clients
              </Eyebrow>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                Who We Serve
              </h2>
              <p className="text-muted-foreground font-body text-lg leading-relaxed">
                We partner with businesses across Sri Lanka's food and hospitality ecosystem
              </p>
            </motion.div>

            <WhoWeServe />
          </div>
        </section>
      </div>

      <SectionTransition />

      {/* Location — Dark */}
      <div data-navbar-theme="dark">
        <section className="relative overflow-hidden py-28 lg:py-36">
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(ellipse at 40% 30%, hsl(140 50% 19% / 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 70%, hsl(150 40% 14% / 0.3) 0%, transparent 50%),
              linear-gradient(180deg, hsl(150 40% 6%), hsl(140 50% 14%), hsl(150 40% 10%))
            `,
          }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <Eyebrow variant="pill" tone="primary" className="mb-6">
                Find Us
              </Eyebrow>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground leading-tight tracking-tight">Our Location</h2>
            </motion.div>

            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
              {/* Spec-sheet rows — hairlines, not boxes */}
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <dl className="border-y border-primary-foreground/10 divide-y divide-primary-foreground/10">
                  {[
                    { label: "Address", value: "Olive Foods (Pvt) Ltd\nColombo, Sri Lanka", href: undefined },
                    { label: "Phone", value: "+94 11 207 1717", href: "tel:+94112071717" },
                    { label: "Email", value: "info@olivefoods.lk", href: "mailto:info@olivefoods.lk" },
                    { label: "Hours", value: "Mon – Fri: 8:30 AM – 5:30 PM", href: undefined },
                  ].map((info) => (
                    <div key={info.label} className="grid grid-cols-[92px_1fr] sm:grid-cols-[120px_1fr] gap-5 py-5">
                      <dt className="font-body text-[11px] uppercase tracking-[0.18em] text-primary-foreground/45 pt-0.5">{info.label}</dt>
                      <dd>
                        {info.href ? (
                          <a href={info.href} className="text-primary-foreground/90 font-body text-sm hover:text-accent transition-colors duration-300 whitespace-pre-line">
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-primary-foreground/90 font-body text-sm whitespace-pre-line">{info.value}</p>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-lg overflow-hidden border border-primary-foreground/15 shadow-xl">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585953498!2d79.7861!3d6.9271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Olive Foods Location" className="w-full h-[400px] block" scrolling="no" />
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <SectionTransition />

      {/* CTA — Light */}
      <div data-navbar-theme="light">
        <section className="relative overflow-hidden py-28 lg:py-36 bg-background">
          <div className="absolute w-[480px] h-[480px] -top-32 left-1/2 -translate-x-1/2 rounded-full opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />
          <div className="max-w-3xl mx-auto px-6 text-center space-y-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Eyebrow variant="pill" tone="accent">
                Get Started
              </Eyebrow>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight tracking-tight">
              Ready to <span className="text-gradient-gold italic">partner</span> with us?
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="font-body text-muted-foreground text-lg leading-relaxed">Tell us what your operation needs, single venue or national chain. We'd like to understand before we quote a price.</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact"><Button className="shine-sweep bg-accent text-white hover:bg-accent/90 font-body font-semibold rounded-lg px-8 h-12 text-base">Contact Us</Button></Link>
              <Link to="/products"><Button variant="outline" className="border-border text-foreground hover:bg-foreground/5 font-body rounded-lg px-8 h-12 text-base">Explore Products</Button></Link>
            </motion.div>
          </div>
        </section>
      </div>

      <SectionTransition />

      <div data-navbar-theme="dark">
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
