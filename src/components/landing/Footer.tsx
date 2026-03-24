import { Leaf } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="snap-section-auto relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, #194B22 0%, #194B22 41%, #08120A 100%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-16 items-start"
        >
          {/* Brand */}
          <div className="space-y-5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10"
            >
              <Leaf className="w-8 h-8 text-forest-light" />
            </motion.div>
            <p className="text-primary-foreground/45 font-body text-sm leading-relaxed max-w-xs">
              Your trusted partner in premium food imports, delivering quality and reliability across Sri Lanka.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-sm font-semibold text-primary-foreground mb-5 tracking-widest uppercase">Quick Links</h4>
            <ul className="space-y-4">
              {["Brands", "Products"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-primary-foreground/45 hover:text-primary-foreground font-body text-sm transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="font-body text-sm font-semibold text-primary-foreground mb-5 tracking-widest uppercase">Follow</h4>
            <ul className="space-y-4">
              {["Facebook", "LinkedIn"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-primary-foreground/45 hover:text-primary-foreground font-body text-sm transition-colors duration-300 underline underline-offset-4 decoration-primary-foreground/20 hover:decoration-primary-foreground/60"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 pt-8 border-t border-primary-foreground/10 text-center"
        >
          <p className="text-primary-foreground/25 font-body text-sm tracking-wide">
            ©2026 . All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
