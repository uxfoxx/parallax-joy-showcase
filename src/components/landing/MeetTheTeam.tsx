import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const teamPhotos = [
  {
    label: "Leadership Team",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop",
    span: "col-span-1 sm:col-span-2 row-span-2",
  },
  {
    label: "Sales & Distribution",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    label: "Warehouse Operations",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    label: "Quality Assurance",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=500&fit=crop",
    span: "col-span-1 row-span-1",
  },
  {
    label: "Logistics & Supply Chain",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop",
    span: "col-span-1 sm:col-span-2 row-span-1",
  },
];

const MeetTheTeam = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["-50px", "50px"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-28 lg:py-36"
    >
      {/* Dark gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, hsl(140 50% 19% / 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, hsl(150 40% 14% / 0.4) 0%, transparent 50%),
            linear-gradient(180deg, hsl(150 40% 6%), hsl(140 50% 14%), hsl(150 40% 10%))
          `,
        }}
      />

      {/* Parallax orbs */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ y: bgY }}
      >
        <div
          className="absolute w-[500px] h-[500px] -top-32 right-0 rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)",
          }}
        />
        <div
          className="absolute w-[350px] h-[350px] bottom-20 -left-20 rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)",
          }}
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 mb-8 tracking-widest uppercase">
            Our People
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
            Meet the Team
          </h2>
          <p className="text-primary-foreground/45 font-body text-lg leading-relaxed">
            Dedicated departments working together to deliver seamless supply chain solutions across Sri Lanka
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 auto-rows-[200px] sm:auto-rows-[220px]">
          {teamPhotos.map((photo, i) => (
            <motion.div
              key={photo.label}
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              whileInView={{ clipPath: "inset(0% 0 0 0)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`${photo.span} relative rounded-xl overflow-hidden cursor-pointer group`}
            >
              {/* Image */}
              <img
                src={photo.image}
                alt={photo.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Permanent subtle gradient at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Caption — slides up on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white font-body text-xs font-medium border border-white/20 tracking-wider">
                  {photo.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetTheTeam;
