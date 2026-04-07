import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logoSvg from "@/assets/olive-foods-logo.svg";

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Brands", href: "/brands" },
  { label: "Products", href: "/products" },
  { label: "Our Products", href: "/products?our=true" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = ["Facebook", "LinkedIn"];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Standardized dark gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 100%, hsl(140 50% 19% / 0.5) 0%, transparent 50%),
            linear-gradient(180deg, hsl(150 40% 6%), hsl(140 50% 10%), hsl(150 40% 14%))
          `,
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
            <div className="flex items-center gap-3">
              <img
                src={logoSvg}
                alt="Olive Foods"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-primary-foreground/45 font-body text-sm leading-relaxed max-w-xs">
              Your trusted import, bonded warehousing & FMCG distribution partner — delivering
              quality and reliability across Sri Lanka for over 30 years.
            </p>
            <p className="text-primary-foreground/30 font-body text-xs">
              <a
                href="mailto:info@olivefoods.lk"
                className="hover:text-primary-foreground/60 transition-colors duration-300"
              >
                info@olivefoods.lk
              </a>
              {" · "}
              <a
                href="tel:+94112071717"
                className="hover:text-primary-foreground/60 transition-colors duration-300"
              >
                +94 11 207 1717
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-sm font-semibold text-primary-foreground mb-5 tracking-widest uppercase">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="group text-primary-foreground/45 hover:text-primary-foreground font-body text-sm transition-colors duration-300 flex items-center gap-1.5"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      {link.label}
                    </span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="font-body text-sm font-semibold text-primary-foreground mb-5 tracking-widest uppercase">
              Follow
            </h4>
            <ul className="space-y-4">
              {socialLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="group text-primary-foreground/45 hover:text-primary-foreground font-body text-sm transition-colors duration-300 flex items-center gap-1.5 underline underline-offset-4 decoration-primary-foreground/20 hover:decoration-primary-foreground/60"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      {link}
                    </span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0" />
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
            ©2026 Olive Foods (Pvt) Ltd. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
