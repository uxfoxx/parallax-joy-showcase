import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ArrowRight, Star, Tag, Grid3x3 } from "lucide-react";
import { useCategories } from "@/lib/api";

type Props = {
  isDark: boolean;
  mutedText: string;
  isActive: boolean;
};

const BROWSE = [
  { label: "All Products", to: "/products", Icon: Grid3x3, desc: "The full catalogue" },
  { label: "Featured", to: "/products?featured=true", Icon: Star, desc: "Our premium picks" },
  { label: "Shop by Brand", to: "/brands", Icon: Tag, desc: "Browse by maker" },
];

/**
 * Desktop "Products" mega-menu. The label still links to /products; hovering
 * (or focusing) drops a FULL-WIDTH panel from directly beneath the navbar with
 * category shortcuts + browse options, each navigating to /products with the
 * matching filter pre-activated via the URL (handled in ProductsPage). A short
 * close delay bridges the gap between the trigger and the panel.
 */
const ProductsMegaMenu = ({ isDark, mutedText, isActive }: Props) => {
  const reduced = useReducedMotion();
  const { data: categories = [] } = useCategories();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openNow = () => { cancelClose(); setOpen(true); };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  const cats = categories.slice(0, 10);

  const panelSurface = isDark
    ? "bg-[hsl(150_26%_6%/0.98)] border-white/10 text-primary-foreground"
    : "bg-background/98 border-foreground/10 text-foreground";
  const itemHover = "hover:bg-accent/10 hover:text-accent";
  const subtle = isDark ? "text-primary-foreground/45" : "text-muted-foreground";
  const eyebrow = `font-body text-[10px] tracking-[0.28em] uppercase mb-3 ${subtle}`;

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
      onFocusCapture={openNow}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
    >
      <Link
        to="/products"
        aria-haspopup="true"
        aria-expanded={open}
        className={`inline-flex items-center gap-1 font-body text-[12px] uppercase tracking-[0.2em] transition-colors duration-300 ${
          isActive ? "font-bold text-accent" : `font-medium ${mutedText}`
        }`}
      >
        Products
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            onMouseEnter={openNow}
            onMouseLeave={scheduleClose}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed left-0 right-0 top-16 z-40 border-b backdrop-blur-xl shadow-[0_28px_64px_-28px_rgba(0,0,0,0.5)] ${panelSurface}`}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-9 grid grid-cols-12 gap-8 lg:gap-10">
              {/* Editorial intro */}
              <div className="col-span-12 lg:col-span-3 flex flex-col">
                <p className="font-display text-2xl font-bold leading-tight">
                  Explore the <span className="text-gradient-gold">catalogue</span>
                </p>
                <p className={`mt-2.5 font-body text-sm leading-relaxed ${subtle}`}>
                  Globally sourced food brands for Sri Lanka's hotels, restaurants and retail trade.
                </p>
                <Link
                  to="/products"
                  className="mt-auto pt-5 inline-flex items-center gap-1.5 font-body text-[12px] font-semibold uppercase tracking-[0.18em] text-accent hover:gap-2.5 transition-all"
                >
                  Browse all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Categories */}
              <div className="col-span-12 lg:col-span-5">
                <p className={eyebrow}>Shop by Category</p>
                {cats.length > 0 ? (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
                    {cats.map((c) => (
                      <Link
                        key={c.id}
                        to={`/products?category=${encodeURIComponent(c.name)}`}
                        className={`group/cat flex items-center justify-between rounded-md px-3 py-2 font-body text-sm transition-colors duration-200 ${itemHover}`}
                      >
                        {c.name}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover/cat:opacity-100 group-hover/cat:translate-x-0" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link to="/products" className={`block rounded-md px-3 py-2 font-body text-sm ${itemHover}`}>
                    Browse all categories
                  </Link>
                )}
              </div>

              {/* Browse */}
              <div className={`col-span-12 lg:col-span-4 lg:pl-10 ${isDark ? "lg:border-l lg:border-white/10" : "lg:border-l lg:border-foreground/10"}`}>
                <p className={eyebrow}>Browse</p>
                <div className="grid gap-2">
                  {BROWSE.map(({ label, to, Icon, desc }) => (
                    <Link
                      key={label}
                      to={to}
                      className={`group/item flex items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors duration-200 hover:border-accent/20 ${itemHover}`}
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="flex items-center gap-1 font-body text-sm font-semibold">
                          {label}
                          <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                        </span>
                        <span className={`font-body text-[11px] ${subtle}`}>{desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsMegaMenu;
