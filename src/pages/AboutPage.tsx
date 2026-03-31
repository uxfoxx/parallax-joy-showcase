import { motion } from "framer-motion";
import { Globe, Shield, Zap, Users, Package, Warehouse, Thermometer, Truck, ShoppingBag, Hotel, UtensilsCrossed, Factory } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const advantages = [
  { icon: Package, title: "Integrated Model", description: "End-to-end import-to-distribution — sourcing, customs, warehousing, and delivery under one roof." },
  { icon: Zap, title: "Faster Lead Times", description: "Streamlined processes and bonded warehousing mean shorter turnaround from port to shelf." },
  { icon: Globe, title: "Strong Supplier Relationships", description: "Long-term partnerships with producers across Australia, Italy, Netherlands, Thailand, Singapore, UAE, India, and China." },
  { icon: Shield, title: "Consistent Quality Control", description: "Rigorous testing and compliance with international food safety standards at every stage." },
];

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
  { icon: Truck, label: "Retail Distributors" },
  { icon: Factory, label: "Food Manufacturers" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const AboutPage = () => {
  return (
    <PageLayout>
      {/* Hero Banner */}
      <section className="relative overflow-hidden py-28 lg:py-36">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(150 40% 10%), hsl(140 50% 19%), hsl(150 40% 10%))' }} />
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"><svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg"><filter id="noiseA"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#noiseA)" /></svg></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body text-lg text-primary-foreground/70 max-w-2xl mx-auto"
          >
            Olive Foods (Pvt) Ltd — Sri Lanka's trusted import, bonded warehousing & FMCG distribution partner for over three decades.
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Who We Are
            </h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed text-lg">
              <p>
                Olive Foods (Pvt) Ltd is a trusted import, bonded warehousing, and FMCG distribution company based in Sri Lanka. With over three decades of industry experience, we have built strong relationships with global suppliers and established ourselves as a reliable partner for businesses across the island.
              </p>
              <p>
                We specialize in importing and distributing a wide range of food products — from frozen goods and dairy to grocery staples, edible oils, and specialty imports — sourced from leading producers in Australia, Italy, the Netherlands, Thailand, Singapore, UAE, India, and China.
              </p>
              <p>
                Our integrated model covers every step of the supply chain: from international sourcing and customs clearance through our bonded warehouse facilities, to cold-chain logistics and island-wide distribution across HoReCa, Modern Trade, and General Trade channels.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Business Activities */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-16"
          >
            Core Business Activities
          </motion.h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {businessActivities.slice(0, 3).map((a) => (
              <motion.div
                key={a.title}
                variants={item}
                className="p-6 rounded-lg border border-border bg-card hover:border-forest-mid/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-forest-deep/10 flex items-center justify-center mb-4">
                  <a.icon className="w-6 h-6 text-forest-mid" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-3">{a.title}</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-5 mt-5 max-w-2xl mx-auto lg:max-w-none lg:px-[16.666%]"
          >
            {businessActivities.slice(3).map((a) => (
              <motion.div
                key={a.title}
                variants={item}
                className="p-6 rounded-lg border border-border bg-card hover:border-forest-mid/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-forest-deep/10 flex items-center justify-center mb-4">
                  <a.icon className="w-6 h-6 text-forest-mid" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-3">{a.title}</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="font-display text-2xl font-bold text-foreground">Our Mission</h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              To deliver superior products and seamless distribution solutions through strong global sourcing, advanced logistics infrastructure and customer-focused service, empowering our partners to grow sustainably.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="font-display text-2xl font-bold text-foreground">Our Vision</h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              To be Sri Lanka's most trusted and progressive FMCG distribution partner, connecting world-class brands with businesses and households through reliability, innovation and operational excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-16"
          >
            Our Competitive Advantage
          </motion.h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {advantages.map((v) => (
              <motion.div
                key={v.title}
                variants={item}
                className="text-center space-y-4 p-5 rounded-lg border border-border hover:border-forest-mid/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-forest-deep/5 flex items-center justify-center mx-auto">
                  <v.icon className="w-7 h-7 text-forest-mid" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground">{v.title}</h4>
                <p className="font-body text-sm text-muted-foreground">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Client Segments */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-6"
          >
            Who We Serve
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-body text-muted-foreground text-center mb-16 max-w-2xl mx-auto"
          >
            We partner with businesses across Sri Lanka's food and hospitality ecosystem
          </motion.p>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-5"
          >
            {clientSegments.map((s) => (
              <motion.div
                key={s.label}
                variants={item}
                className="flex flex-col items-center gap-4 p-6 rounded-lg border border-border hover:border-forest-mid/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-forest-deep/10 flex items-center justify-center">
                  <s.icon className="w-6 h-6 text-forest-mid" />
                </div>
                <span className="font-body text-sm font-medium text-foreground text-center">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Location */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12"
          >
            Our Location
          </motion.h2>
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-1">Address</h4>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  Olive Foods (Pvt) Ltd<br />Colombo, Sri Lanka
                </p>
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-1">Phone</h4>
                <p className="text-muted-foreground font-body text-sm">+94 11 234 5678</p>
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-1">Email</h4>
                <p className="text-muted-foreground font-body text-sm">info@olivefoods.lk</p>
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-1">Hours</h4>
                <p className="text-muted-foreground font-body text-sm">Mon – Fri: 8:30 AM – 5:30 PM</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-lg overflow-hidden border border-border shadow-lg"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585953498!2d79.7861!3d6.9271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Olive Foods Location"
                className="w-full h-[350px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(150 40% 10%), hsl(140 50% 19%), hsl(150 40% 10%))' }} />
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-primary-foreground"
          >
            Ready to Partner With Us?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-body text-primary-foreground/60 text-lg"
          >
            Let's discuss how Olive Foods can support your business with reliable import and distribution solutions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link to="/products">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-xl px-8 h-12 text-base">
                Explore Products
              </Button>
            </Link>
            <Link to="/brands">
              <Button variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 font-body rounded-xl px-8 h-12 text-base">
                View Brands
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default AboutPage;
