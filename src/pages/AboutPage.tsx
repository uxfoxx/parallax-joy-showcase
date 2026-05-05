import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Globe, Users, Package, Warehouse, Thermometer, Truck, ShoppingBag, Hotel, UtensilsCrossed, Target, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BrandCard from "@/components/BrandCard";
import { useBrands, useProducts } from "@/lib/api";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ImmersiveBackground from "@/components/landing/ImmersiveBackground";
import ScrollFloatingElement from "@/components/landing/ScrollFloatingElement";
import SectionTransition from "@/components/landing/SectionTransition";
import CompanyPhilosophy from "@/components/about/CompanyPhilosophy";
import PageHero from "@/components/PageHero";
import { useMouseGradient } from "@/hooks/useMouseGradient";

const businessActivities = [
  { icon: Package, title: "Import & Brand Representation", desc: "Exclusive brand agency and import operations for leading international FMCG brands." },
  { icon: Warehouse, title: "Bonded Warehousing", desc: "Customs-approved bonded warehouse facilities enabling duty optimization and secure storage." },
  { icon: Thermometer, title: "Cold-Chain Logistics", desc: "Temperature-controlled storage and transport at -18°C for frozen and chilled product lines." },
  { icon: Truck, title: "HoReCa Distribution", desc: "Direct supply to hotels, restaurants, and catering companies across Sri Lanka." },
  { icon: ShoppingBag, title: "Modern Trade & General Trade", desc: "Distribution to supermarket chains, retail outlets, and general trade networks island-wide." },
];

const clientSegments = [
  {
    icon: Hotel,
    label: "Hotels & Resorts",
    description:
      "Five-star kitchens and resort F&B teams rely on our cold-chain for premium meats, dairy, and specialty imports — delivered on schedule, every week.",
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

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

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

const BrandsShowcase = () => {
  const { data: brands = [], isLoading } = useBrands();
  const { data: products = [] } = useProducts();
  const preview = brands.slice(0, 6);

  return (
    <div data-navbar-theme="light">
      <section className="relative overflow-hidden py-28 lg:py-36 bg-background">
        <div
          className="absolute w-[400px] h-[400px] -top-20 -right-20 rounded-full pointer-events-none opacity-[0.07]"
          style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium border border-accent/20 mb-8 tracking-widest uppercase">
              Our Brands
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight tracking-tight mb-5">
              The Makers Behind Our Shelves
            </h2>
            <p className="font-body text-muted-foreground text-lg leading-relaxed">
              We partner with world-class producers to bring the finest food products from around the globe.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-[4/5]" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {preview.map((brand, i) => {
                const prodCount = products.filter((p) => p.brand_id === brand.id).length;
                return (
                  <BrandCard
                    key={brand.id}
                    brand={brand}
                    prodCount={prodCount}
                    index={i}
                    columns={3}
                  />
                );
              })}
            </motion.div>
          )}

          {brands.length > 6 && (
            <motion.div
              className="flex justify-center mt-12"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/brands">
                <Button
                  variant="outline"
                  className="rounded-full px-8 h-12 font-body font-semibold text-sm border-2 border-accent/40 text-accent hover:bg-accent/5 hover:border-accent transition-all duration-300 gap-2"
                >
                  View All Brands
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

const AboutPage = () => {
  const { ref: mouseRef, gradientStyle } = useMouseGradient();
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);

  return (
    <div className="smooth-scroll overflow-x-hidden">
      <ImmersiveBackground />
      <ScrollFloatingElement />
      <Navbar />
      <FloatingWhatsApp />

      <PageHero
        eyebrow="Olive Foods / About"
        title={<>Sri Lanka's <span className="text-gradient-gold italic">trusted</span> import partner.</>}
        subtitle="Import, bonded warehousing & FMCG distribution — built on three decades of relationships with global suppliers and island-wide retail."
      />

      <SectionTransition />

      {/* Who We Are — Light */}
      <div data-navbar-theme="light">
        <section className="relative overflow-hidden py-28 lg:py-36 bg-background">
          <div className="absolute w-[400px] h-[400px] -top-20 -left-20 rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />
          <div className="absolute w-[300px] h-[300px] bottom-10 right-10 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />
          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="space-y-8">
              <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium border border-accent/20 tracking-widest uppercase">
                Our Story
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight tracking-tight">Who We Are</h2>
              <div className="space-y-5 font-body text-muted-foreground leading-relaxed text-lg">
                <p>Olive Foods (Pvt) Ltd is a trusted import, bonded warehousing, and FMCG distribution company based in Sri Lanka. With over three decades of industry experience, we have built strong relationships with global suppliers and established ourselves as a reliable partner for businesses across the island.</p>
                <p>We specialise in importing and distributing a wide range of food products — from frozen goods and dairy to grocery staples, edible oils, and specialty imports — sourced from leading producers in Australia, Italy, the Netherlands, Thailand, Singapore, UAE, India, and China.</p>
                <p>Our integrated model covers every step of the supply chain: from international sourcing and customs clearance through our bonded warehouse facilities, to cold-chain logistics and island-wide distribution across HoReCa, Modern Trade, and General Trade channels.</p>
              </div>
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
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="text-center max-w-3xl mx-auto mb-20">
              <span className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 mb-8 tracking-widest uppercase">
                What We Do
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
                Core Business Activities
              </h2>
              <p className="text-primary-foreground/70 font-body text-lg leading-relaxed">
                A fully integrated supply chain covering every step from port to shelf
              </p>
            </motion.div>

            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {businessActivities.slice(0, 3).map((a) => (
                <motion.div key={a.title} variants={item} whileHover={{ y: -6, transition: { duration: 0.3 } }} className="group relative p-6 rounded-lg border border-primary-foreground/10 hover:border-primary-foreground/20 transition-all duration-500 hover:shadow-xl hover:shadow-forest-mid/20" style={{ background: `radial-gradient(ellipse at 30% 20%, hsl(140 50% 19% / 0.4) 0%, transparent 60%), linear-gradient(180deg, hsl(140 50% 19%), hsl(150 40% 10%))` }}>
                  <motion.div whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }} className="w-12 h-12 rounded-lg bg-primary-foreground flex items-center justify-center mb-4 shadow-lg shadow-primary-foreground/10">
                    <a.icon className="w-6 h-6 text-forest-deep" />
                  </motion.div>
                  <h3 className="font-display text-xl font-semibold text-primary-foreground mb-4 tracking-tight">{a.title}</h3>
                  <p className="text-primary-foreground/70 font-body leading-relaxed text-sm">{a.desc}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 gap-5 mt-5 max-w-2xl mx-auto lg:max-w-none lg:px-[16.666%]">
              {businessActivities.slice(3).map((a) => (
                <motion.div key={a.title} variants={item} whileHover={{ y: -6, transition: { duration: 0.3 } }} className="group relative p-6 rounded-lg border border-primary-foreground/10 hover:border-primary-foreground/20 transition-all duration-500 hover:shadow-xl hover:shadow-forest-mid/20" style={{ background: `radial-gradient(ellipse at 30% 20%, hsl(140 50% 19% / 0.4) 0%, transparent 60%), linear-gradient(180deg, hsl(140 50% 19%), hsl(150 40% 10%))` }}>
                  <motion.div whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }} className="w-12 h-12 rounded-lg bg-primary-foreground flex items-center justify-center mb-4 shadow-lg shadow-primary-foreground/10">
                    <a.icon className="w-6 h-6 text-forest-deep" />
                  </motion.div>
                  <h3 className="font-display text-xl font-semibold text-primary-foreground mb-4 tracking-tight">{a.title}</h3>
                  <p className="text-primary-foreground/70 font-body leading-relaxed text-sm">{a.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      <SectionTransition />

      {/* Brands Showcase — Light */}
      <BrandsShowcase />

      <SectionTransition />

      {/* Mission & Vision — Light */}
      <div data-navbar-theme="light">
        <section className="relative overflow-hidden py-28 lg:py-36 bg-background">
          <div className="absolute w-[350px] h-[350px] top-1/4 -right-20 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="text-center max-w-3xl mx-auto mb-20">
              <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium border border-accent/20 mb-8 tracking-widest uppercase">
                Our Purpose
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight tracking-tight">
                Mission & Vision
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} whileHover={{ y: -6, transition: { duration: 0.3 } }} className="p-8 rounded-lg border border-border bg-card hover:border-accent/30 transition-all duration-500 hover:shadow-lg">
                <motion.div whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }} className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-accent" />
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4 tracking-tight">Our Mission</h3>
                <p className="font-body text-muted-foreground leading-relaxed">To deliver superior products and seamless distribution solutions through strong global sourcing, advanced logistics infrastructure and customer-focused service, empowering our partners to grow sustainably.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} whileHover={{ y: -6, transition: { duration: 0.3 } }} className="p-8 rounded-lg border border-border bg-card hover:border-accent/30 transition-all duration-500 hover:shadow-lg">
                <motion.div whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }} className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-accent" />
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4 tracking-tight">Our Vision</h3>
                <p className="font-body text-muted-foreground leading-relaxed">To be Sri Lanka's most trusted and progressive FMCG distribution partner, connecting world-class brands with businesses and households through reliability, innovation and operational excellence.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <SectionTransition />

      {/* Who We Serve — Light */}
      <div data-navbar-theme="light">
        <section className="relative overflow-hidden py-28 lg:py-36 bg-background">
          <div className="absolute w-[400px] h-[400px] -bottom-20 -left-20 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="text-center max-w-3xl mx-auto mb-20">
              <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium border border-accent/20 mb-8 tracking-widest uppercase">
                Our Clients
              </span>
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
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-20">
              <span className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 mb-8 tracking-widest uppercase">
                Find Us
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground leading-tight tracking-tight">Our Location</h2>
            </motion.div>

            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 items-start">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
                {[
                  { label: "Address", value: "Olive Foods (Pvt) Ltd\nColombo, Sri Lanka", href: undefined },
                  { label: "Phone", value: "+94 11 207 1717", href: "tel:+94112071717" },
                  { label: "Email", value: "info@olivefoods.lk", href: "mailto:info@olivefoods.lk" },
                  { label: "Hours", value: "Mon – Fri: 8:30 AM – 5:30 PM", href: undefined },
                ].map((info) => (
                  <div key={info.label} className="p-5 rounded-lg border border-primary-foreground/15" style={{ background: `linear-gradient(135deg, hsl(140 50% 19% / 0.8), hsl(150 40% 14% / 0.6))` }}>
                    <h4 className="font-display text-sm font-semibold text-primary-foreground/60 uppercase tracking-widest mb-2">{info.label}</h4>
                    {info.href ? (
                      <a href={info.href} className="text-primary-foreground font-body text-sm hover:text-accent transition-colors duration-300 whitespace-pre-line">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-primary-foreground font-body text-sm whitespace-pre-line">{info.value}</p>
                    )}
                  </div>
                ))}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-lg overflow-hidden border border-primary-foreground/15 shadow-xl">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585953498!2d79.7861!3d6.9271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Olive Foods Location" className="w-full h-[400px] block" scrolling="no" />
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <SectionTransition />

      {/* CTA — Dark */}
      <div data-navbar-theme="dark">
        <section className="relative overflow-hidden py-28 lg:py-36">
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(ellipse at 50% 50%, hsl(140 50% 19% / 0.6) 0%, transparent 50%),
              linear-gradient(180deg, hsl(150 40% 6%), hsl(140 50% 14%), hsl(150 40% 8%))
            `,
          }} />
          <div className="max-w-3xl mx-auto px-6 text-center space-y-8 relative z-10">
            <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 tracking-widest uppercase">
              Get Started
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-display text-4xl sm:text-5xl font-bold text-primary-foreground leading-tight tracking-tight">Ready to Partner With Us?</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="font-body text-primary-foreground/70 text-lg leading-relaxed">Let's discuss how Olive Foods can support your business with reliable import and distribution solutions.</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact"><Button className="shine-sweep bg-accent text-white hover:bg-accent/90 font-body font-semibold rounded-lg px-8 h-12 text-base backdrop-blur-sm border border-white/15">Contact Us</Button></Link>
              <Link to="/products"><Button variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 font-body rounded-lg px-8 h-12 text-base backdrop-blur-sm">Explore Products</Button></Link>
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
