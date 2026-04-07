import { motion, useScroll, useTransform } from "framer-motion";
import { Globe, Users, Package, Warehouse, Thermometer, Truck, ShoppingBag, Hotel, UtensilsCrossed, Target, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ImmersiveBackground from "@/components/landing/ImmersiveBackground";
import ScrollFloatingElement from "@/components/landing/ScrollFloatingElement";
import SectionTransition from "@/components/landing/SectionTransition";
import CompanyPhilosophy from "@/components/about/CompanyPhilosophy";
import { useMouseGradient } from "@/hooks/useMouseGradient";

const businessActivities = [
  { icon: Package, title: "Import & Brand Representation", desc: "Exclusive brand agency and import operations for leading international FMCG brands." },
  { icon: Warehouse, title: "Bonded Warehousing", desc: "Customs-approved bonded warehouse facilities enabling duty optimization and secure storage." },
  { icon: Thermometer, title: "Cold-Chain Logistics", desc: "Temperature-controlled storage and transport at -18°C for frozen and chilled product lines." },
  { icon: Truck, title: "HoReCa Distribution", desc: "Direct supply to hotels, restaurants, and catering companies across Sri Lanka." },
  { icon: ShoppingBag, title: "Modern Trade & General Trade", desc: "Distribution to supermarket chains, retail outlets, and general trade networks island-wide." },
];

const clientSegments = [
  { icon: Hotel, label: "Hotels & Resorts" },
  { icon: UtensilsCrossed, label: "Restaurants & Cafes" },
  { icon: Users, label: "Catering Companies" },
  { icon: ShoppingBag, label: "Supermarket Chains" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

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

      {/* Hero */}
      <div data-navbar-theme="dark" className="pt-24">
        <section className="relative overflow-hidden py-10 lg:py-14">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <filter id="noiseA"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
              <rect width="100%" height="100%" filter="url(#noiseA)" />
            </svg>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2">About Us</motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="font-body text-sm text-primary-foreground/70 max-w-xl mx-auto">Olive Foods (Pvt) Ltd — Sri Lanka's trusted import, bonded warehousing & FMCG distribution partner for over three decades.</motion.p>
          </div>
        </section>
      </div>

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
              <p className="text-primary-foreground/45 font-body text-lg leading-relaxed">
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
                  <p className="text-primary-foreground/45 font-body leading-relaxed text-sm">{a.desc}</p>
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
                  <p className="text-primary-foreground/45 font-body leading-relaxed text-sm">{a.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>

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

            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {clientSegments.map((s) => (
                <motion.div key={s.label} variants={item} whileHover={{ y: -6, transition: { duration: 0.3 } }} className="flex flex-col items-center gap-4 p-6 rounded-lg border border-border bg-card hover:border-accent/30 transition-all duration-500 hover:shadow-lg">
                  <motion.div whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }} className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <s.icon className="w-6 h-6 text-accent" />
                  </motion.div>
                  <span className="font-body text-sm font-medium text-foreground text-center">{s.label}</span>
                </motion.div>
              ))}
            </motion.div>
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
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="font-body text-primary-foreground/45 text-lg leading-relaxed">Let's discuss how Olive Foods can support your business with reliable import and distribution solutions.</motion.p>
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
