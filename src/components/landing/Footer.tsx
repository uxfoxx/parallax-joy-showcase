import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logoSvg from "@/assets/olive-foods-logo.svg";
import { EASE_OUT_EXPO } from "@/lib/motion";
import CountUp from "@/components/motion/CountUp";
import { useSuppliedCategories } from "@/hooks/useSuppliedCategories";
import { categorySlug } from "@/lib/categories";
import { SECTORS } from "@/lib/sectors";
import { SOCIAL_PROFILES } from "@/lib/site";
import { GUIDES } from "@/lib/guides";

type FooterStat = { value?: number; suffix?: string; text?: string; label: string };

const FOOTER_STATS: FooterStat[] = [
  { value: 30, suffix: "+", label: "Years of trade" },
  { value: 30, suffix: "+", label: "Source countries" },
  { value: 25, label: "Districts served" },
  { text: "Island-wide", label: "Delivery" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const columnVariants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE_OUT_EXPO },
  }),
};

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Brands", href: "/brands" },
  { label: "Products", href: "/products" },
  { label: "Our Products", href: "/products?our=true" },
  { label: "Contact", href: "/contact" },
  ...(GUIDES.length ? [{ label: "Guides", href: "/guides" }] : []),
  { label: "Site map", href: "/site-map" },
];

// Sector + category landing pages aren't in the main nav; these footer links
// are their sitewide internal links (crawl paths + link equity).
const sectorLinks = SECTORS.map((s) => ({ label: s.name, href: `/supply/${s.slug}` }));

const TOP_CATEGORY_COUNT = 6;

const Footer = () => {
  const topCategories = useSuppliedCategories()
    .slice(0, TOP_CATEGORY_COUNT)
    .map(({ name }) => ({ label: name, href: `/categories/${categorySlug(name)}` }));

  const columns = [
    { title: "Quick Links", links: quickLinks },
    { title: "Who We Supply", links: sectorLinks },
    { title: "Top Categories", links: [...topCategories, { label: "All categories", href: "/categories" }] },
  ];

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
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          variants={containerVariants}
          className="grid sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 lg:gap-16 items-start"
        >
          {/* Brand */}
          <motion.div custom={0} variants={columnVariants} className="space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={logoSvg}
                alt="Olive Foods"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="font-display text-sm font-semibold text-primary-foreground/85 tracking-[0.01em]">
              Quality You Can Trust. Excellence You Can Taste.
            </p>
            <p className="text-primary-foreground/45 font-body text-sm leading-relaxed max-w-xs">
              A premium food sourcing and distribution partner connecting globally
              sourced products with Sri Lanka's hospitality and retail trade,
              built on relationships, not transactions.
            </p>
            <p className="text-primary-foreground/55 font-body text-xs">
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
            {/* Official profiles — only real ones (see SOCIAL_PROFILES); rel="me"
                marks them as the same entity as this site. */}
            {SOCIAL_PROFILES.length > 0 && (
              <p className="flex flex-wrap gap-x-4 gap-y-2 font-body text-xs">
                {SOCIAL_PROFILES.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="text-primary-foreground/55 hover:text-primary-foreground underline underline-offset-4 decoration-primary-foreground/20 transition-colors duration-300"
                  >
                    {s.label}
                  </a>
                ))}
              </p>
            )}
          </motion.div>

          {/* Link columns */}
          {columns.map((col, i) => (
            <motion.div key={col.title} custom={i + 1} variants={columnVariants}>
              <h4 className="font-body text-sm font-semibold text-primary-foreground mb-5 tracking-widest uppercase">
                {col.title}
              </h4>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.href}>
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
            </motion.div>
          ))}
        </motion.div>

        {/* Stat band — animated counters */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          variants={containerVariants}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-9 border-t border-primary-foreground/10 pt-12"
        >
          {FOOTER_STATS.map((s, i) => (
            <motion.div key={s.label} custom={i} variants={columnVariants}>
              <span aria-hidden className="block w-7 h-[2px] bg-accent rounded-full mb-3" />
              <div
                className={`font-display font-bold text-primary-foreground leading-none tracking-tight ${
                  s.text ? "text-[26px] lg:text-[32px]" : "text-[38px] lg:text-[48px] tabular-nums"
                }`}
              >
                {s.text ? s.text : <CountUp to={s.value!} suffix={s.suffix} duration={2.4} />}
              </div>
              <p className="font-body text-[11px] tracking-[0.22em] uppercase text-primary-foreground/45 mt-3">
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 pt-8 border-t border-primary-foreground/10 text-center"
        >
          <p className="text-primary-foreground/55 font-body text-sm tracking-wide">
            ©2026 Olive Foods (Pvt) Ltd. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
