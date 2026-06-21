import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoSvg from "@/assets/olive-mark.svg";

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

  // Section-theme detection — deterministic hit-test at a fixed line just under
  // the navbar (rAF-throttled on scroll). The old IntersectionObserver picked a
  // "winner" by ratio, which rapidly flip-flopped near section boundaries and
  // made the colour flicker. Exactly one section spans a given y, so this is
  // stable; the bar's `transition-colors` then crossfades smoothly.
  useEffect(() => {
    const LINE = 72; // px below the viewport top (navbar is 64px)
    let raf = 0;
    const update = () => {
      raf = 0;
      const sections = document.querySelectorAll("[data-navbar-theme]");
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= LINE && r.bottom > LINE) {
          const t = s.getAttribute("data-navbar-theme");
          if (t === "light" || t === "dark") setTheme((prev) => (prev === t ? prev : t));
          break;
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [location.pathname]);

  // `isDark` tracks the section underneath the navbar. The bar *matches* it —
  // dark section → near-black bar, light section → light bar — as a frosted
  // glass strip spanning edge-to-edge.
  const isDark = theme === "dark";

  // NB: the dark-bar colour bakes its alpha INTO the arbitrary value
  // (`hsl(… / 0.75)`) — the `/75` opacity modifier does NOT work on an
  // arbitrary `bg-[hsl(...)]` and silently resolves to transparent.
  const barBg = isDark
    ? // dark section underneath → near-black frosted bar (hint of forest)
      `bg-[hsl(150_26%_6%/0.75)] border-b border-white/10 ${scrolled ? "bg-[hsl(150_26%_6%/0.92)] shadow-[0_8px_30px_-14px_rgba(0,0,0,0.6)]" : ""}`
    : // light section underneath → LIGHT frosted bar
      `bg-background/70 border-b border-foreground/10 ${scrolled ? "bg-background/85 shadow-[0_8px_30px_-14px_rgba(0,0,0,0.25)]" : ""}`;

  // Inactive link + control colours follow the bar (= the section).
  const mutedText = isDark
    ? "text-primary-foreground/55 hover:text-primary-foreground"
    : "text-muted-foreground hover:text-foreground";

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-500 ${barBg}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16">
            {/* Left — logo */}
            <div className="flex items-center">
              <Link to="/" className="group inline-flex items-center shrink-0">
                <motion.img
                  src={logoSvg}
                  alt="Olive Foods"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  /* Bar matches section: near-black bar (over dark section)
                   * needs the white-logo treatment; light bar keeps native
                   * colours. */
                  className={`h-8 w-auto object-contain transition-[filter] duration-500 group-hover:drop-shadow-[0_0_12px_hsl(42_80%_55%/0.5)] ${
                    isDark ? "brightness-0 invert" : ""
                  }`}
                />
              </Link>
            </div>

            {/* Center — links */}
            <nav className="hidden md:flex items-center gap-9 justify-center">
              {links.map((link) => {
                const isActive =
                  link.href === "/"
                    ? location.pathname === "/"
                    : (location.pathname + location.search).startsWith(link.href);
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`font-body text-[12px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                      isActive ? "font-bold text-accent" : `font-medium ${mutedText}`
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right — contact + mobile toggle */}
            <div className="flex items-center justify-end gap-2">
              <Link
                to="/contact"
                className={`hidden md:inline-flex items-center h-9 px-4 rounded-md border font-body text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
                  isDark
                    ? "border-white/20 text-primary-foreground hover:bg-white/10"
                    : "border-foreground/15 text-foreground hover:bg-foreground/[0.06]"
                }`}
              >
                Contact
              </Link>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className={`md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
                  isDark ? "text-primary-foreground hover:bg-white/10" : "text-foreground hover:bg-foreground/[0.06]"
                }`}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.button>
            </div>
          </div>
        </div>
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
                <Button className="bg-transparent text-white hover:bg-white/10 font-body font-semibold rounded-md px-10 py-6 text-lg border-2 border-white/70">
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
