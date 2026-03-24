import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["About", "Brands", "Products"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-forest-deep/95 backdrop-blur-md shadow-lg shadow-forest-deep/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-display font-bold text-accent-foreground text-lg transition-transform duration-300 group-hover:scale-110">
              F
            </div>
            <span className="font-display text-xl font-bold text-primary-foreground tracking-wide">
              FoodImport
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="relative text-primary-foreground/80 hover:text-primary-foreground font-body text-sm font-medium tracking-wide transition-colors duration-300 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-accent after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 font-body">
              Login
            </Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-full px-6 transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5">
              Contact Us
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-primary-foreground p-2"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 bg-forest-deep/98 backdrop-blur-lg ${
          mobileOpen ? "max-h-80 border-t border-primary-foreground/10" : "max-h-0"
        }`}
      >
        <div className="px-6 py-6 space-y-4">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="block text-primary-foreground/80 hover:text-primary-foreground font-body py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="text-primary-foreground/80 font-body">Login</Button>
            <Button className="bg-accent text-accent-foreground font-body rounded-full px-6">Contact Us</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
