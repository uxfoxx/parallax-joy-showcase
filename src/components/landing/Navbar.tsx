import { useState, useEffect } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Brands", href: "/brands" },
  { label: "Products", href: "/products" },
  { label: "Featured", href: "/featured" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isLanding = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Determine if we're on a "dark header" context
  const useLightText = isLanding || scrolled;

  const barBg = scrolled
    ? "bg-forest-deep/90 backdrop-blur-xl shadow-2xl shadow-forest-deep/30 border border-primary-foreground/10"
    : isLanding
      ? "bg-forest-deep/50 backdrop-blur-md border border-primary-foreground/5"
      : "bg-background/90 backdrop-blur-xl shadow-lg border border-border";

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 left-0 right-0 z-50 mx-auto w-[calc(100%-2rem)] max-w-5xl"
      >
        <motion.div
          animate={{
            paddingTop: scrolled ? 8 : 12,
            paddingBottom: scrolled ? 8 : 12,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`flex items-center justify-between px-5 rounded-2xl transition-all duration-500 ${barBg}`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${useLightText ? "bg-forest-mid" : "bg-forest-deep/10"}`}
            >
              <Leaf className={`w-5 h-5 ${useLightText ? "text-forest-light" : "text-forest-mid"}`} />
            </motion.div>
            <span className={`font-display font-semibold text-lg hidden sm:block tracking-tight transition-colors duration-300 ${useLightText ? "text-primary-foreground" : "text-foreground"}`}>
              FreshLine
            </span>
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-1 relative">
            {links.map((link) => {
              const isActive = link.href === "/" ? location.pathname === "/" : location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="relative px-5 py-2 text-sm font-body font-medium transition-colors duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className={`absolute inset-0 rounded-xl ${useLightText ? "bg-primary-foreground/10" : "bg-forest-deep/10"}`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors duration-300 ${
                    isActive
                      ? (useLightText ? "text-primary-foreground" : "text-foreground")
                      : (useLightText ? "text-primary-foreground/60 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground")
                  }`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-xl h-10 px-6 text-sm transition-all duration-300 shadow-lg shadow-accent/20">
                Contact Us
              </Button>
            </motion.div>
          </div>

          {/* Mobile toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center ${useLightText ? "bg-primary-foreground/10 text-primary-foreground" : "bg-forest-deep/10 text-foreground"}`}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </motion.button>
        </motion.div>
      </motion.nav>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
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
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-xl px-10 py-6 text-lg">
                Contact Us
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
