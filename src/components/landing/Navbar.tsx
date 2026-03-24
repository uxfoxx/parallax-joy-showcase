import { useState, useEffect } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const links = [
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
    const container = document.querySelector(".snap-container");
    const target = container || window;
    const onScroll = () => {
      const scrollY = container ? (container as HTMLElement).scrollTop : window.scrollY;
      setScrolled(scrollY > 50);
    };
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, []);

  // On inner pages (white bg), use dark text; on landing, use light text
  const textBase = isLanding ? "text-primary-foreground" : (scrolled ? "text-primary-foreground" : "text-foreground");
  const textMuted = isLanding ? "text-primary-foreground/60" : (scrolled ? "text-primary-foreground/60" : "text-muted-foreground");
  const barBg = isLanding
    ? scrolled
      ? "bg-forest-deep/80 backdrop-blur-xl shadow-2xl shadow-forest-deep/40 border border-primary-foreground/10"
      : "bg-forest-deep/60 backdrop-blur-md border border-primary-foreground/5"
    : scrolled
      ? "bg-forest-deep/80 backdrop-blur-xl shadow-2xl shadow-forest-deep/40 border border-primary-foreground/10"
      : "bg-background/80 backdrop-blur-xl shadow-lg border border-border";

  const logoIconBg = isLanding || scrolled ? "bg-forest-mid" : "bg-forest-deep/10";
  const logoIconColor = isLanding || scrolled ? "text-forest-light" : "text-forest-mid";
  const activePillBg = isLanding || scrolled ? "bg-primary-foreground/10" : "bg-forest-deep/10";
  const mobileToggleBg = isLanding || scrolled ? "bg-primary-foreground/10" : "bg-forest-deep/10";
  const mobileToggleColor = isLanding || scrolled ? "text-primary-foreground" : "text-foreground";

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
              className={`w-9 h-9 rounded-full ${logoIconBg} flex items-center justify-center transition-colors duration-300`}
            >
              <Leaf className={`w-5 h-5 ${logoIconColor}`} />
            </motion.div>
            <span className={`font-display font-semibold text-lg hidden sm:block tracking-tight ${textBase}`}>
              FreshLine
            </span>
          </Link>

          {/* Center links */}
          <div className="hidden md:flex items-center gap-1 relative">
            {links.map((link) => {
              const isActive = location.pathname === link.href || (link.href !== "/" && location.pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className="relative px-5 py-2 text-sm font-body font-medium transition-colors duration-300"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className={`absolute inset-0 ${activePillBg} rounded-xl`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? textBase : `${textMuted} hover:${textBase}`}`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <div className={`w-px h-5 ${isLanding || scrolled ? "bg-primary-foreground/10" : "bg-border"}`} />
            <span className={`${textMuted} font-body text-sm cursor-pointer hover:opacity-80 transition-colors`}>
              Inquire
            </span>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-xl h-9 px-5 text-sm transition-all duration-300 shadow-lg shadow-accent/20">
                Contact Us
              </Button>
            </motion.div>
          </div>

          {/* Mobile toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden w-10 h-10 rounded-xl ${mobileToggleBg} flex items-center justify-center ${mobileToggleColor}`}
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
              className="flex flex-col items-center gap-4 mt-8"
            >
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-xl px-10 py-6 text-lg">
                Contact Us
              </Button>
              <span className="text-primary-foreground/50 font-body text-sm">Inquire</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
