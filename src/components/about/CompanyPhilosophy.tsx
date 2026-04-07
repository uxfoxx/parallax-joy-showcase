import { motion } from "framer-motion";
import { Heart, Users, RefreshCw, Shield } from "lucide-react";

const approachItems = [
  "Consistent and dependable supply",
  "Professional service and communication",
  "Structured systems that ensure reliability",
  "Credit support and flexibility where it matters",
];

const coreValues = [
  {
    icon: Heart,
    title: "Long-term Relationships",
    desc: "We build partnerships that stand the test of time, not just transactions.",
  },
  {
    icon: Users,
    title: "Support Client Growth",
    desc: "Your success is our success — we invest in the businesses we serve.",
  },
  {
    icon: RefreshCw,
    title: "Consistency & Professionalism",
    desc: "Every interaction, every delivery, every communication — held to the same high standard.",
  },
  {
    icon: Shield,
    title: "Accountability & Trust",
    desc: "Our clients depend on the company, not just a single point of contact.",
  },
];

const titleWords = [
  { text: "Built", accent: false },
  { text: "on", accent: false },
  { text: "Relationships.", accent: false },
  { text: "Driven", accent: true },
  { text: "by", accent: true },
  { text: "Growth.", accent: true },
];

const CompanyPhilosophy = () => {
  return (
    <section className="relative overflow-hidden py-28 lg:py-36 bg-background">
      {/* Decorative orbs */}
      <div
        className="absolute w-[500px] h-[500px] -top-40 -right-40 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }}
      />
      <div
        className="absolute w-[400px] h-[400px] bottom-10 -left-20 rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium border border-accent/20 tracking-widest uppercase">
            Our Philosophy
          </span>
        </motion.div>

        {/* Title — word-by-word reveal */}
        <div className="mb-12">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.09 } },
            }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 40,
                    clipPath: "inset(0 0 100% 0)",
                  },
                  show: {
                    opacity: 1,
                    y: 0,
                    clipPath: "inset(0 0 0% 0)",
                    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className={`inline-block mr-[0.28em] last:mr-0 ${word.accent ? "text-accent" : "text-foreground"}`}
              >
                {word.text}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        {/* Intro paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4 font-body text-muted-foreground text-lg leading-relaxed mb-14"
        >
          <p>
            At Olive Foods, we believe distribution is more than just supply — it's about building
            lasting partnerships.
          </p>
          <p>
            We work closely with every client to understand their business, their needs, and their
            growth. Whether it's a restaurant, hotel, or retail outlet, our focus is not just on
            delivering products, but on becoming a reliable part of their daily operations.
          </p>
        </motion.div>

        {/* Pull quote with growing left border */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative pl-8 mb-14"
        >
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-accent to-accent/20"
          />
          <p className="font-display text-2xl sm:text-3xl text-foreground font-semibold italic leading-relaxed">
            "We don't chase transactions — we build relationships."
          </p>
        </motion.div>

        {/* Our Approach */}
        <div className="mb-14">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-2xl font-bold text-foreground mb-8 tracking-tight"
          >
            Our Approach
          </motion.h3>
          <div className="space-y-5">
            {approachItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4 group"
              >
                {/* Animated number */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300 mt-0.5">
                  <span className="font-display text-xs font-bold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="font-body text-foreground text-base leading-relaxed pt-1.5">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Behind the scenes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-4 font-body text-muted-foreground text-base leading-relaxed mb-5"
        >
          <p>
            Behind the scenes, Olive Foods operates with strong systems and a centralised structure
            to ensure every client receives the same level of service, regardless of who they
            interact with. Our team works as one — not as individuals — so our clients always depend
            on the company, not just a single point of contact.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-body text-foreground text-base font-medium mb-14"
        >
          We are a partner you can rely on — not just a supplier you order from.
        </motion.p>

        {/* Core Values */}
        <div className="mb-14">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-2xl font-bold text-foreground mb-8 tracking-tight"
          >
            Our Team Values
          </motion.h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {coreValues.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group relative p-6 rounded-lg border border-border bg-card hover:border-accent/30 hover:shadow-lg transition-all duration-500 overflow-hidden"
              >
                {/* Corner accent */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="absolute top-0 right-0 w-16 h-16 rounded-bl-[3rem] bg-accent/5 group-hover:bg-accent/10 transition-colors duration-500 pointer-events-none"
                />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4"
                >
                  <value.icon className="w-5 h-5 text-accent" />
                </motion.div>
                <h4 className="font-display text-base font-bold text-foreground mb-2 tracking-tight">
                  {value.title}
                </h4>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Closing text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-body text-muted-foreground text-base leading-relaxed mb-8"
        >
          We are here for the long term — to grow with the businesses we work with, and to become a
          trusted name in every partnership we build.
        </motion.p>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-display text-lg sm:text-xl font-bold leading-relaxed">
            <span className="text-gradient-gold">Olive Foods</span>
            <span className="text-foreground">
              {" "}— Built on Trust. Structured for Stability. Focused on Growth.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CompanyPhilosophy;
