import { motion } from "framer-motion";
import { Leaf, Globe, Shield, Heart } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const values = [
  { icon: Leaf, title: "Sustainability", description: "We prioritize eco-friendly sourcing and packaging across our entire supply chain." },
  { icon: Globe, title: "Global Reach", description: "Partnerships with trusted producers in 30+ countries for diverse, premium selections." },
  { icon: Shield, title: "Quality Assurance", description: "Rigorous testing and compliance with international food safety standards." },
  { icon: Heart, title: "Community", description: "Supporting local farmers and fair-trade practices in every market we serve." },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const AboutPage = () => {
  return (
    <PageLayout>
      {/* Hero Banner */}
      <section className="relative overflow-hidden py-28 lg:py-36">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(140 45% 8%), hsl(140 40% 12%), hsl(140 45% 8%))' }} />
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
            From humble beginnings to becoming Sri Lanka's most trusted food import partner — driven by passion, quality, and integrity.
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
              Building Bridges Between Farms and Tables
            </h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed text-lg">
              <p>
                Founded with a vision to bring the world's finest food products to Sri Lanka, FreshLine has grown into a trusted name in premium food imports. We work directly with producers, farmers, and artisans across 30+ countries to source ingredients that meet the highest standards of quality and safety.
              </p>
              <p>
                Our team of food specialists, logistics experts, and quality assurance professionals ensures that every product — from hand-harvested saffron threads to sustainably caught Pacific salmon — arrives fresh, certified, and ready for your business.
              </p>
              <p>
                We believe that exceptional food starts with exceptional sourcing. That's why we invest in long-term relationships with our partners, visit farms and facilities personally, and maintain full traceability across our supply chain.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="font-display text-2xl font-bold text-foreground">Our Mission</h3>
            <p className="font-body text-muted-foreground leading-relaxed">
              To curate and deliver the world's best food products with unwavering commitment to quality, compliance, and reliability — empowering businesses across Sri Lanka to offer excellence to their customers.
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
              To be the most respected food import company in South Asia — known for transforming global sourcing into local access, and setting new benchmarks for quality and sustainability in the industry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-16"
          >
            What We Stand For
          </motion.h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={item}
                className="text-center space-y-4 p-6 rounded-2xl border border-border hover:border-forest-mid/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-forest-deep/5 flex items-center justify-center mx-auto">
                  <v.icon className="w-7 h-7 text-forest-mid" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground">{v.title}</h4>
                <p className="font-body text-sm text-muted-foreground">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(140 45% 8%), hsl(140 40% 12%), hsl(140 45% 8%))' }} />
        <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
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
            Let's discuss how we can bring world-class food products to your business.
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
