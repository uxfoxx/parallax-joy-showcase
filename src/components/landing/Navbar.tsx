import { useState, useEffect } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const links = [
    { label: "About", href: "/about" },
    { label: "Brands", href: "/brands" },
    { label: "Products", href: "/products" },
  ];

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-10"
    >
      {/* Left pill */}
      <div
        className={`flex items-center gap-6 rounded-full px-4 py-2.5 transition-all duration-500 ${
          scrolled
            ? "bg-forest-deep/95 backdrop-blur-md shadow-lg shadow-forest-deep/30"
            : "bg-forest-deep/90 backdrop-blur-sm"
        }`}
      >
        <Link to="/" className="flex items-center group">
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-full bg-forest-mid flex items-center justify-center transition-colors duration-300"
          >
            <Leaf className="w-5 h-5 text-forest-light" />
          </motion.div>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {links.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              <Link
                to={link.href}
                className="relative text-primary-foreground/80 hover:text-primary-foreground font-body text-sm font-medium tracking-wide transition-colors duration-300 py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right pill */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className={`hidden md:flex items-center gap-2 rounded-full px-2 py-1.5 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg border border-border"
            : "bg-background/90 backdrop-blur-sm border border-border/50"
        }`}
      >
        <span className="text-foreground/70 font-body text-sm font-medium px-4 cursor-pointer hover:text-foreground transition-colors">
          Inquire
        </span>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-foreground text-background hover:bg-foreground/90 font-body font-medium rounded-full h-9 px-5 text-sm transition-all duration-300">
            Contact US
          </Button>
        </motion.div>
      </motion.div>

      {/* Mobile toggle */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden w-10 h-10 rounded-full bg-forest-deep flex items-center justify-center text-primary-foreground"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </motion.button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full mt-2 left-4 right-4 rounded-2xl bg-forest-deep/98 backdrop-blur-lg border border-primary-foreground/10 px-6 py-5 space-y-3"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={link.href}
                  className="block text-primary-foreground/80 hover:text-primary-foreground font-body py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <div className="flex gap-3 pt-2">
              <span className="text-primary-foreground/80 font-body text-sm py-2">Inquire</span>
              <Button className="bg-background text-foreground font-body rounded-full px-5 text-sm">
                Contact US
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
