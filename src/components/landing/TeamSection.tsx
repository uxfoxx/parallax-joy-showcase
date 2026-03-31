import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll();
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section ref={sectionRef} className="relative min-h-[80vh] overflow-hidden flex items-center">
      {/* Video background */}
      <div className="absolute inset-0">
        <motion.div className="absolute inset-0" style={{ y: videoY }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => videoRef.current?.play().catch(() => {})}
            className="w-full h-[120%] object-cover"
            src="https://videos.pexels.com/video-files/5532765/5532765-hd_1920_1080_25fps.mp4"
            poster="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=1080&fit=crop"
          />
        </motion.div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-forest-deep/70" />
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseTeam"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
            <rect width="100%" height="100%" filter="url(#noiseTeam)" />
          </svg>
        </div>
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
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-xs font-medium border border-primary-foreground/15 mb-6 tracking-[0.2em] uppercase">
              Our Team
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-6 leading-[1.1] tracking-tight">
              Three Decades
              <br />
              of <span className="text-gradient-gold">Excellence</span>
            </h2>
            <p className="text-primary-foreground/50 font-body text-base lg:text-lg leading-relaxed max-w-md">
              Dedicated departments working together to deliver seamless solutions.
            </p>
          </motion.div>

          {/* Right — sliding photo cards (no text) */}
          <div className="overflow-hidden">
            <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused] w-max">
              {duplicatedTeam.map((member, index) => (
                <div
                  key={`${member.name}-${index}`}
                  className="flex-shrink-0 w-36 h-48 sm:w-44 sm:h-56 md:w-48 md:h-60 rounded-lg overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer group relative"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
