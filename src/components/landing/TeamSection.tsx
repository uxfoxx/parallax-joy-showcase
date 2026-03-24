import { motion } from "framer-motion";

const team = [
  { initials: "AK", name: "Ahmed Khan", role: "CEO & Founder", bio: "Over 15 years of experience in global food trade and supply chain management." },
  { initials: "SM", name: "Sarah Mitchell", role: "Operations Manager", bio: "Streamlines logistics and ensures seamless delivery across all partner networks." },
  { initials: "RJ", name: "Raj Patel", role: "Quality Assurance Lead", bio: "Oversees rigorous testing and certification for every product we import." },
  { initials: "LN", name: "Lina Nguyen", role: "Logistics Coordinator", bio: "Manages international shipping routes and customs clearance processes." },
];

const TeamSection = () => {
  return (
    <section className="snap-section flex items-center bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-28 w-full">
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
            Meet the People Behind
            <br />
            <span className="text-gradient-gold">Our Success</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            A passionate team dedicated to delivering quality food products from around the world
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
              {/* Avatar */}
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
