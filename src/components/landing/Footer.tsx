import { Facebook, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="snap-section-auto bg-forest-deep text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-display font-bold text-accent-foreground text-lg">
                F
              </div>
              <span className="font-display text-xl font-bold">FoodImport</span>
            </div>
            <p className="text-primary-foreground/50 font-body text-sm leading-relaxed max-w-xs">
              Bringing the world's finest foods to your table since 2014. Premium imports, trusted quality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["About Us", "Our Products", "Brands", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-primary-foreground/50 hover:text-accent font-body text-sm transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              {[Facebook, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-primary-foreground/15 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/30 font-body text-sm">
            © {new Date().getFullYear()} FoodImport. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
