import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoSvg from "@/assets/olive-foods-logo.svg";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile nav: Escape closes; route change closes
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // IntersectionObserver to detect section theme
  useEffect(() => {
    const sections = document.querySelectorAll("[data-navbar-theme]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          }
        });
        if (best) {
          const t = (best as IntersectionObserverEntry).target.getAttribute("data-navbar-theme");
          if (t === "light" || t === "dark") setTheme(t);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.1, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [location.pathname]);

  // `isDark` tracks the section underneath the navbar. We *invert* the pill
  // so it stands out as a floating contrast island: dark section → light
  // pill, light section → dark pill.
  const isDark = theme === "dark";

  const barBg = isDark
    ? `bg-background/95 border border-border/60 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18),0_8px_20px_-6px_rgba(0,0,0,0.12)] ${scrolled ? "shadow-[0_28px_70px_-12px_rgba(0,0,0,0.22)]" : ""}`
    : `bg-forest-deep/90 border border-primary-foreground/10 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55),0_8px_20px_-6px_rgba(0,0,0,0.35)] ${scrolled ? "shadow-[0_28px_70px_-12px_rgba(0,0,0,0.65),0_10px_24px_-6px_rgba(0,0,0,0.4)]" : ""}`;

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 left-0 right-0 z-50 mx-auto w-[calc(100%-4rem)] "
      >
        <motion.div
          animate={{
            paddingTop: scrolled ? 8 : 12,
            paddingBottom: scrolled ? 8 : 12,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`flex items-center justify-between pl-6 pr-3 rounded-[16px] backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 ${barBg}`}
        >
          <Link to="/" className="flex items-center shrink-0 group">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="transition-[filter] duration-500 group-hover:drop-shadow-[0_0_12px_hsl(42_80%_55%/0.5)]"
            >
              <img
                src={logoSvg}
                alt="Olive Foods"
                /* Pill flipped: dark pill (over light section) needs the
                 * white-logo treatment; light pill (over dark section)
                 * keeps the logo in its native colours. */
                className={`h-11 w-auto object-contain transition-all duration-500 ${!isDark ? "brightness-0 invert" : ""}`}
              />
            </motion.div>
          </Link>

            <div className="hidden md:flex items-center gap-1 relative">
              {links.map((link) => {
                const isActive =
                  link.href === "/"
                    ? location.pathname === "/"
                    : (location.pathname + location.search).startsWith(link.href);
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="relative px-4 py-2.5 font-body transition-colors duration-500"
                  >
                    <span
                      /* All-caps + tracked-out reads as the premium directory
                       * style (Linear / Vercel / Mercury nav). Active stays
                       * bold-accent gold (PR #22). Inactive colour flips with
                       * the inverted pill — light pill needs dark text, dark
                       * pill needs muted-white text. */
                      className={`relative z-10 inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.18em] transition-all duration-500 ${
                        isActive
                          ? "font-bold text-accent"
                          : `font-medium ${isDark ? "text-muted-foreground hover:text-foreground" : "text-primary-foreground/55 hover:text-primary-foreground"}`
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/contact">
                  <Button
                    /* Pill is inverted → stroke + text colour flip too. Dark
                     * pill (over light section) → white stroke; light pill
                     * (over dark section) → forest-deep stroke. */
                    className={`font-body font-semibold rounded-[12px] h-10 px-6 text-[12px] uppercase tracking-[0.18em] bg-transparent border-2 transition-colors duration-300 shadow-none ${
                      isDark
                        ? "border-primary text-primary hover:bg-primary/[0.06]"
                        : "border-white/70 text-white hover:bg-white/10"
                    }`}
                  >
                    Contact Us
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              /* Pill inverted: burger now sits inside the inverted pill, so
               * its background tint + icon colour flip with it. */
              className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${isDark ? "bg-forest-deep/10 text-foreground" : "bg-primary-foreground/10 text-primary-foreground"}`}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
        </motion.div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => { if (e.target === e.currentTarget) setMobileOpen(false); }}
            role="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-forest-deep/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={link.href}
                  className="font-display text-4xl font-bold text-primary-foreground hover:text-accent transition-colors duration-300"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mt-8"
            >
              <Link to="/contact" onClick={() => setMobileOpen(false)}>
                <Button className="bg-transparent text-white hover:bg-white/10 font-body font-semibold rounded-full px-10 py-6 text-lg border-2 border-white/70">
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
