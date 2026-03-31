import { motion } from "framer-motion";

const team = [
  { name: "Sales & Marketing", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face" },
  { name: "Procurement", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face" },
  { name: "Warehousing", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face" },
  { name: "Logistics", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face" },
  { name: "Quality Control", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face" },
  { name: "Customer Service", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face" },
];

const duplicatedTeam = [...team, ...team];

const TeamSection = () => {
  return (
    <section className="relative min-h-[80vh] overflow-hidden flex items-center">
      {/* Video background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://cdn.pixabay.com/video/2020/07/30/45645-445039937_large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 w-full py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-0 items-center max-w-[1600px] mx-auto px-6 lg:px-12">
          {/* Left — heading */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pr-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white font-body text-xs font-medium border border-white/20 mb-6 tracking-[0.2em] uppercase">
              Our Team
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Three Decades
              <br />
              of <span className="text-olive-mid">Excellence</span>
            </h2>
            <p className="text-white/70 font-body text-base lg:text-lg leading-relaxed max-w-md">
              Dedicated departments working together to deliver seamless solutions.
            </p>
          </motion.div>

          {/* Right — sliding photo cards */}
          <div className="overflow-hidden">
            <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused] w-max">
              {duplicatedTeam.map((member, index) => (
                <div
                  key={`${member.name}-${index}`}
                  className="flex-shrink-0 w-36 h-48 sm:w-44 sm:h-56 md:w-48 md:h-60 rounded-lg overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer group relative shadow-md"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-white font-body text-xs font-medium">{member.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
