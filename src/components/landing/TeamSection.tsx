import { useInView } from "@/hooks/useInView";

const team = [
  { initials: "AK", name: "Ahmed Khan", role: "CEO & Founder", bio: "Over 15 years of experience in global food trade and supply chain management." },
  { initials: "SM", name: "Sarah Mitchell", role: "Operations Manager", bio: "Streamlines logistics and ensures seamless delivery across all partner networks." },
  { initials: "RJ", name: "Raj Patel", role: "Quality Assurance Lead", bio: "Oversees rigorous testing and certification for every product we import." },
  { initials: "LN", name: "Lina Nguyen", role: "Logistics Coordinator", bio: "Manages international shipping routes and customs clearance processes." },
];

const TeamSection = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="snap-section flex items-center bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 w-full">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium border border-accent/20 mb-6">
            Our Team
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight">
            Meet the People Behind
            <br />
            <span className="text-gradient-gold">Our Success</span>
          </h2>
          <p className="text-muted-foreground font-body text-lg">
            A passionate team dedicated to delivering quality food products from around the world
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div
              key={member.name}
              className={`group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 text-center ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isInView ? `${i * 120}ms` : "0ms" }}
            >
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-forest-deep flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-primary-foreground font-display text-xl font-bold">
                  {member.initials}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                {member.name}
              </h3>
              <p className="text-accent font-body text-sm font-medium mb-3">
                {member.role}
              </p>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
