import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import logoSvg from "@/assets/olive-foods-logo.svg";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, hsl(140 50% 19% / 0.3) 0%, transparent 50%),
            linear-gradient(180deg, transparent, hsl(150 40% 8% / 0.6))
          `,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-16 items-start"
        >
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img src={logoSvg} alt="Olive Foods" className="h-10 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-primary-foreground/35 font-body text-sm leading-relaxed max-w-xs">
              Your trusted import, bonded warehousing & FMCG distribution partner — delivering quality and reliability across Sri Lanka for over 30 years.
            </p>
            <p className="text-primary-foreground/25 font-body text-xs">
              info@olivefoods.lk · +94 11 207 1717
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-sm font-semibold text-primary-foreground mb-5 tracking-widest uppercase">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { label: "About", href: "/about" },
                { label: "Brands", href: "/brands" },
                { label: "Products", href: "/products" },
                { label: "Featured", href: "/featured" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/35 hover:text-primary-foreground font-body text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
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
                    className="text-primary-foreground/35 hover:text-primary-foreground font-body text-sm transition-colors duration-300 underline underline-offset-4 decoration-primary-foreground/15 hover:decoration-primary-foreground/50"
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
          className="mt-16 pt-8 border-t border-primary-foreground/8 flex items-center justify-between"
        >
          <p className="text-primary-foreground/20 font-body text-sm tracking-wide">
            ©2026 Olive Foods (Pvt) Ltd. All rights reserved.
          </p>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center text-primary-foreground/50 hover:text-accent transition-colors duration-300"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
