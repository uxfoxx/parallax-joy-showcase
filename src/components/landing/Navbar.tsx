import { useState, useEffect } from "react";
import { Menu, X, Leaf } from "lucide-react";
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
    <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div
        className={`flex items-center justify-between w-full max-w-4xl rounded-full px-4 py-2 transition-all duration-500 ${
          scrolled
            ? "bg-forest-deep/95 backdrop-blur-md shadow-lg shadow-forest-deep/30"
            : "bg-forest-deep/80 backdrop-blur-sm"
        }`}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <Leaf className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-primary-foreground tracking-wide">
            FoodImport
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="relative text-primary-foreground/70 hover:text-primary-foreground font-body text-sm font-medium tracking-wide transition-colors duration-300 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-accent after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 font-body text-sm h-9 px-4">
            Login
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold rounded-full h-9 px-5 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5">
            Contact Us
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-primary-foreground p-2"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full mt-2 left-4 right-4 rounded-2xl bg-forest-deep/98 backdrop-blur-lg border border-primary-foreground/10 px-6 py-5 space-y-3">
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
            <Button variant="ghost" className="text-primary-foreground/80 font-body text-sm">Login</Button>
            <Button className="bg-accent text-accent-foreground font-body rounded-full px-5 text-sm">Contact Us</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
