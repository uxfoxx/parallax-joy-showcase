import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const team = [
  { initials: "SM", name: "Sales & Marketing", role: "Commercial Team", bio: "Driving brand growth across HoReCa, Modern Trade, and General Trade channels island-wide." },
  { initials: "PR", name: "Procurement", role: "Sourcing Team", bio: "Managing global supplier relationships across 8+ countries to secure the best products at competitive prices." },
  { initials: "WH", name: "Warehousing", role: "Operations Team", bio: "Running customs-approved bonded warehouse facilities with cold-chain storage at -18°C." },
  { initials: "LG", name: "Logistics", role: "Distribution Team", bio: "Ensuring reliable, on-time delivery through our island-wide distribution network." },
];

const TeamSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax decorative element
  const orbY = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);

  return (
    <section ref={sectionRef} className="relative bg-muted/30 overflow-hidden">
      {/* Parallax decorative circle */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: orbY }}>
        <div
          className="absolute w-[450px] h-[450px] -bottom-32 -right-32 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsl(140 50% 30%), transparent 70%)" }}
        />
        <div
          className="absolute w-[300px] h-[300px] top-10 -left-20 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsl(42 60% 50%), transparent 70%)" }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28 w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium border border-accent/20 mb-8 tracking-widest uppercase">
            Our Team
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Three Decades of
            <br />
            <span className="text-gradient-gold">Industry Experience</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            Dedicated departments working together to deliver seamless import-to-distribution solutions
          </p>
        </motion.div>

        {/* Team grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all duration-500 hover:shadow-lg text-center glow-border"
            >
              <motion.div
                whileHover={{ scale: 1.12 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-20 h-20 rounded-full bg-forest-deep flex items-center justify-center mx-auto mb-5"
              >
                <span className="text-primary-foreground font-display text-xl font-bold">
                  {member.initials}
                </span>
              </motion.div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1 tracking-tight">
                {member.name}
              </h3>
              <p className="text-accent font-body text-sm font-medium mb-4">
                {member.role}
              </p>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
