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
 * Desktop "Products" hover mega-menu. The label itself still links to
 * /products; hovering (or focusing) reveals a panel of category shortcuts and
 * browse options, each navigating to /products with the matching filter
 * pre-activated via the URL (handled in ProductsPage). A short close delay +
 * a pt-3 hover bridge keep it from flickering when moving cursor into the panel.
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
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 150);
  };

  const cats = categories.slice(0, 6);

  const panelSurface = isDark
    ? "bg-[hsl(150_26%_6%/0.97)] border-white/10 text-primary-foreground"
    : "bg-background/97 border-foreground/10 text-foreground";
  const itemHover = "hover:bg-accent/10 hover:text-accent";
  const subtle = isDark ? "text-primary-foreground/45" : "text-muted-foreground";

  return (
    <div
      className="relative"
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
      onFocusCapture={() => { cancelClose(); setOpen(true); }}
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
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
          >
            <div
              className={`w-[480px] grid grid-cols-[1.3fr_1fr] gap-2 rounded-2xl border p-3 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl ${panelSurface}`}
            >
              {/* Categories */}
              <div className="p-1">
                <p className={`px-3 pb-2 pt-1 font-body text-[10px] tracking-[0.28em] uppercase ${subtle}`}>
                  Categories
                </p>
                {cats.length > 0 ? (
                  <div className="grid grid-cols-2 gap-0.5">
                    {cats.map((c) => (
                      <Link
                        key={c.id}
                        to={`/products?category=${encodeURIComponent(c.name)}`}
                        className={`rounded-md px-3 py-2 font-body text-[13px] leading-snug transition-colors duration-200 ${itemHover}`}
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to="/products"
                    className={`block rounded-md px-3 py-2 font-body text-[13px] transition-colors duration-200 ${itemHover}`}
                  >
                    Browse all categories
                  </Link>
                )}
              </div>

              {/* Browse */}
              <div className={`p-1 ${isDark ? "border-l border-white/10" : "border-l border-foreground/10"}`}>
                <p className={`px-3 pb-2 pt-1 font-body text-[10px] tracking-[0.28em] uppercase ${subtle}`}>
                  Browse
                </p>
                <div className="flex flex-col gap-0.5">
                  {BROWSE.map(({ label, to, Icon, desc }) => (
                    <Link
                      key={label}
                      to={to}
                      className={`group/item flex items-start gap-2.5 rounded-md px-3 py-2 transition-colors duration-200 ${itemHover}`}
                    >
                      <Icon className="mt-0.5 w-4 h-4 shrink-0 text-accent" />
                      <span className="flex flex-col">
                        <span className="flex items-center gap-1 font-body text-[13px] font-medium">
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
