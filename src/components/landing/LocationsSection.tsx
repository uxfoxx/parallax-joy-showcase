import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useRef } from "react";
import Parallax from "@/components/motion/Parallax";
import SplitText from "@/components/motion/SplitText";

const contactItems = [
  { icon: MapPin, title: "Address", value: "Olive Foods (Pvt) Ltd\nColombo, Sri Lanka" },
  { icon: Phone, title: "Phone", value: "+94 11 207 1717" },
  { icon: Mail, title: "Email", value: "info@olivefoods.lk" },
  { icon: Clock, title: "Hours", value: "Mon – Fri: 8:30 AM – 5:30 PM" },
];

const LocationsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-80px", "80px"]);
  const mapY = useTransform(scrollYProgress, [0, 1], ["-24px", "24px"]);

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
            radial-gradient(ellipse at 40% 30%, hsl(140 50% 19% / 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 70%, hsl(150 40% 14% / 0.3) 0%, transparent 50%),
            linear-gradient(180deg, hsl(150 40% 6%), hsl(140 50% 14%), hsl(150 40% 10%))
          `,
        }}
      />

      {/* Parallax decorative orbs */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ y: bgY }}
      >
        <div
          className="absolute w-[500px] h-[500px] -top-40 -left-40 rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)",
          }}
        />
        <div
          className="absolute w-[350px] h-[350px] bottom-10 right-0 rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)",
          }}
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground font-body text-sm font-medium border border-primary-foreground/15 mb-8 tracking-widest uppercase">
            Our Location
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
            <SplitText text="Where to Find Us" by="word" stagger={0.05} as="span" />
          </h2>
        </motion.div>

        {/* Map with floating glassmorphism card */}
        <div className="relative">
          {/* Full-width map — scroll-linked vertical drift for parallax feel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: mapY }}
            className="rounded-2xl overflow-hidden shadow-2xl border border-primary-foreground/15"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585953498!2d79.7861!3d6.9271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="500"
              style={{ border: 0, display: "block", overflow: "hidden" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Olive Foods Location"
              scrolling="no"
            />
          </motion.div>

          {/* Dark glassmorphism overlay card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute bottom-8 left-8 right-8 lg:right-auto lg:w-[420px] backdrop-blur-xl rounded-2xl border border-primary-foreground/15 shadow-2xl p-8"
            style={{
              background: "linear-gradient(135deg, hsl(140 50% 19% / 0.85), hsl(150 40% 10% / 0.9))",
            }}
          >
            <h3 className="font-display text-2xl font-bold text-primary-foreground mb-6">
              Get in Touch
            </h3>
            <div className="space-y-5">
              {contactItems.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary-foreground/60" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-primary-foreground/60 mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-primary-foreground/80 font-body text-sm whitespace-pre-line">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
