import { motion } from "framer-motion";
import {
  Heart, Users, RefreshCw, Shield, ArrowUpRight,
  Boxes, Headset, Workflow, Handshake, type LucideIcon,
} from "lucide-react";
import { useState } from "react";

const approachItems: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    Icon: Boxes,
    title: "Consistent, dependable supply",
    body: "Stock you can plan against. We don't run out at the wrong moment.",
  },
  {
    Icon: Headset,
    title: "Professional, personal service",
    body: "One dedicated sales rep per account — a single point of contact who knows your business and replies within the hour.",
  },
  {
    Icon: Workflow,
    title: "Structured systems for reliability",
    body: "SOPs across cold-chain and bonded storage so every order ships to the same standard.",
  },
  {
    Icon: Handshake,
    title: "Flexible terms for trusted partners",
    body: "Credit and timing flexibility for partners we trust, offered as a relationship, not as a sales lever.",
  },
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
    desc: "Your success is our success. We invest in the businesses we serve.",
  },
  {
    icon: RefreshCw,
    title: "Consistency & Professionalism",
    desc: "Every interaction, every delivery, every communication, held to the same high standard.",
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

type Value = (typeof coreValues)[number];

const FlipCard = ({ value, index }: { value: Value; index: number }) => {
  const [flipped, setFlipped] = useState(false);
  const Icon = value.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
      className="relative h-44 sm:h-48 cursor-pointer select-none"
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full"
      >
        {/* Front */}
        <div
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          className="absolute inset-0 rounded-xl border border-border bg-card p-6 flex flex-col justify-between overflow-hidden shadow-card"
        >
          <span
            aria-hidden
            className="absolute top-0 right-0 w-16 h-16 rounded-bl-[3rem] bg-primary/5 pointer-events-none"
          />
          <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" strokeWidth={1.7} />
          </div>
          <div>
            <h4 className="font-display text-base lg:text-lg font-bold text-foreground tracking-tight leading-snug">
              {value.title}
            </h4>
            <span className="block w-8 h-[2px] rounded-full bg-primary mt-3" />
          </div>
        </div>

        {/* Back */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          className="absolute inset-0 rounded-xl bg-primary text-primary-foreground p-6 flex flex-col justify-between overflow-hidden shadow-card"
        >
          <p className="font-body text-[14px] leading-relaxed">{value.desc}</p>
          <div className="flex items-center justify-between">
            <span className="font-body text-[10.5px] tracking-[0.28em] uppercase text-primary-foreground/70">
              {String(index + 1).padStart(2, "0")} / {String(coreValues.length).padStart(2, "0")}
            </span>
            <ArrowUpRight className="w-4 h-4 text-primary-foreground/80" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

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
            At Olive Foods, we believe distribution is more than just supply. It's about building
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
            "We don't chase transactions. We build relationships."
          </p>
        </motion.div>

        {/* Our Approach — editorial card grid */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-9 max-w-2xl"
          >
            <p className="font-body text-[11px] font-semibold tracking-[0.28em] uppercase text-accent mb-3">
              How we work
            </p>
            <h3 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-[1.05]">
              Our <span className="text-gradient-gold">approach</span>
            </h3>
            <p className="font-body text-base text-muted-foreground leading-relaxed mt-4">
              Four commitments that turn a supplier into a partner — the standards behind every order we ship.
            </p>
          </motion.div>

          {/* Vertical step rail with icon markers */}
          <div className="relative">
            {/* Connecting rail — draws in on scroll */}
            <motion.span
              aria-hidden
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top" }}
              className="absolute left-[23px] top-6 bottom-6 w-[2px] rounded-full bg-gradient-to-b from-primary via-primary/60 to-primary/10"
            />

            <ol className="space-y-7">
              {approachItems.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex items-start gap-5 transition-transform duration-300 hover:translate-x-1.5"
                >
                  {/* Icon marker on the rail — fills with accent on hover */}
                  <div className="relative z-10 shrink-0 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-background bg-background text-accent shadow-card ring-1 ring-accent/25 transition-colors duration-300 group-hover:bg-accent group-hover:text-white group-hover:ring-accent">
                    <item.Icon className="h-5 w-5" strokeWidth={1.8} />
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-accent"
                      initial={{ scale: 1, opacity: 0 }}
                      whileInView={{ scale: [1, 1.6], opacity: [0.32, 0] }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: 0.6 + i * 0.15, ease: "easeOut" }}
                    />
                  </div>

                  <div className="flex-1 pt-1.5">
                    <p className="font-body text-[10px] font-semibold tracking-[0.24em] uppercase tabular-nums text-accent/70 mb-1">
                      {String(i + 1).padStart(2, "0")} / {String(approachItems.length).padStart(2, "0")}
                    </p>
                    <h4 className="font-display text-base lg:text-lg font-semibold text-foreground tracking-tight leading-snug transition-colors duration-300 group-hover:text-accent">
                      {item.title}
                    </h4>
                    <p className="font-body text-[14px] text-muted-foreground leading-relaxed mt-1.5 max-w-prose">
                      {item.body}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
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
            interact with. Our team works as one, not as individuals, so our clients always depend
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
          We are a partner you can rely on, not just a supplier you order from.
        </motion.p>

        {/* Core Values — 3-D flip cards */}
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
          <div className="grid sm:grid-cols-2 gap-4" style={{ perspective: "1400px" }}>
            {coreValues.map((value, i) => (
              <FlipCard key={value.title} value={value} index={i} />
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
          We are here for the long term, to grow with the businesses we work with, and to become a
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
