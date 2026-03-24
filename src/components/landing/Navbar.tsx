import { useState, useEffect } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "About", href: "/about" },
    { label: "Brands", href: "/brands" },
    { label: "Products", href: "/products" },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-10">
      {/* Left pill — Logo + Nav links */}
      <div
        className={`flex items-center gap-6 rounded-full px-4 py-2.5 transition-all duration-500 ${
          scrolled
            ? "bg-forest-deep/95 backdrop-blur-md shadow-lg shadow-forest-deep/30"
            : "bg-forest-deep/90 backdrop-blur-sm"
        }`}
      >
        <Link to="/" className="flex items-center group">
          <div className="w-9 h-9 rounded-full bg-forest-mid flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <Leaf className="w-5 h-5 text-forest-light" />
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-primary-foreground/80 hover:text-primary-foreground font-body text-sm font-medium tracking-wide transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right pill — Inquire + Contact US */}
      <div
        className={`hidden md:flex items-center gap-2 rounded-full px-2 py-1.5 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg border border-border"
            : "bg-background/90 backdrop-blur-sm border border-border/50"
        }`}
      >
        <span className="text-foreground/70 font-body text-sm font-medium px-4 cursor-pointer hover:text-foreground transition-colors">
          Inquire
        </span>
        <Button className="bg-foreground text-background hover:bg-foreground/90 font-body font-medium rounded-full h-9 px-5 text-sm transition-all duration-300">
          Contact US
        </Button>
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden w-10 h-10 rounded-full bg-forest-deep flex items-center justify-center text-primary-foreground"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full mt-2 left-4 right-4 rounded-2xl bg-forest-deep/98 backdrop-blur-lg border border-primary-foreground/10 px-6 py-5 space-y-3">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="block text-primary-foreground/80 hover:text-primary-foreground font-body py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <span className="text-primary-foreground/80 font-body text-sm py-2">Inquire</span>
            <Button className="bg-background text-foreground font-body rounded-full px-5 text-sm">
              Contact US
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
