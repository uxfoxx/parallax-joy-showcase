import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="snap-section-auto relative overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, #194B22 0%, #194B22 41%, #08120A 100%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-12 items-start">
          {/* Brand */}
          <div className="space-y-4">
            <div className="w-10 h-10">
              <Leaf className="w-8 h-8 text-forest-light" />
            </div>
            <p className="text-primary-foreground/50 font-body text-sm leading-relaxed max-w-xs">
              # Your trusted partner in premium food imports, delivering quality and reliability across Sri Lanka.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-sm font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["Brands", "Products"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-primary-foreground/50 hover:text-primary-foreground font-body text-sm transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="font-body text-sm font-semibold text-primary-foreground mb-4">Follow</h4>
            <ul className="space-y-3">
              {["Facebook", "LinkedIn"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-primary-foreground/50 hover:text-primary-foreground font-body text-sm transition-colors duration-300 underline underline-offset-2"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 text-center">
          <p className="text-primary-foreground/30 font-body text-sm">
            ©2026 . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
