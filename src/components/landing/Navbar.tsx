import { useState, useEffect, useMemo, type FormEvent } from "react";
import { Menu, X, Phone, Search, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoSvg from "@/assets/olive-mark.svg";
import ProductsMegaMenu from "@/components/landing/ProductsMegaMenu";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";
import { useSuppliedCategories } from "@/hooks/useSuppliedCategories";
import { categorySlug } from "@/lib/categories";
import { useProducts } from "@/lib/api";
import { searchProducts } from "@/lib/products";
import { cdnImg, fallbackToOriginal } from "@/lib/img";
import { PHONE_DISPLAY, PHONE_TEL, whatsappHref, whatsappMessage } from "@/lib/contact";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Brands", href: "/brands" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const location = useLocation();
  const navigate = useNavigate();
  const categories = useSuppliedCategories();
  const { data: products = [] } = useProducts();
  // Phone menu: product search + every category (first few until expanded).
  const [menuQuery, setMenuQuery] = useState("");
  const [allCats, setAllCats] = useState(false);
  const menuResults = useMemo(() => (menuQuery.trim() ? searchProducts(products, menuQuery).slice(0, 5) : []), [products, menuQuery]);
  const onMenuSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = menuQuery.trim();
    if (!q) return;
    setMobileOpen(false);
    navigate(`/products?q=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile nav: Escape closes; route change closes
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname, location.search]);
  useEffect(() => {
    if (!mobileOpen) { setMenuQuery(""); setAllCats(false); }
  }, [mobileOpen]);

  // While the full-screen menu is open the page behind it must not scroll.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  // Section-theme detection — deterministic hit-test at a fixed line just under
  // the navbar (rAF-throttled on scroll). The old IntersectionObserver picked a
  // "winner" by ratio, which rapidly flip-flopped near section boundaries and
  // made the colour flicker. Exactly one section spans a given y, so this is
  // stable; the bar's `transition-colors` then crossfades smoothly.
  useEffect(() => {
    const LINE = 72; // px below the viewport top (navbar is 64px)
    let raf = 0;
    const update = () => {
      raf = 0;
      const sections = document.querySelectorAll("[data-navbar-theme]");
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= LINE && r.bottom > LINE) {
          // A section can ask for a bar that differs from its own content theme
          // (the hero is light inside but wants the dark bar on top of it).
          const t = s.getAttribute("data-navbar-bar") ?? s.getAttribute("data-navbar-theme");
          if (t === "light" || t === "dark") setTheme((prev) => (prev === t ? prev : t));
          break;
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [location.pathname]);

  // `isDark` tracks the section underneath the navbar. The bar *matches* it —
  // dark section → near-black bar, light section → light bar — as a frosted
  // glass strip spanning edge-to-edge.
  // The bar goes dark under dark sections, and always while the menu is open
  // (the menu itself is dark, and a light bar made its close button faint).
  const isDark = theme === "dark" || mobileOpen;

  // NB: the dark-bar colour bakes its alpha INTO the arbitrary value
  // (`hsl(… / 0.75)`) — the `/75` opacity modifier does NOT work on an
  // arbitrary `bg-[hsl(...)]` and silently resolves to transparent.
  const barBg = isDark
    ? // dark section underneath → near-black frosted bar (hint of forest)
      `bg-[hsl(150_26%_6%/0.75)] border-b border-white/10 ${scrolled ? "bg-[hsl(150_26%_6%/0.92)] shadow-[0_8px_30px_-14px_rgba(0,0,0,0.6)]" : ""}`
    : // light section underneath → LIGHT frosted bar
      `bg-background/70 border-b border-foreground/10 ${scrolled ? "bg-background/85 shadow-[0_8px_30px_-14px_rgba(0,0,0,0.25)]" : ""}`;

  // Inactive link + control colours follow the bar (= the section).
  const mutedText = isDark
    ? "text-primary-foreground/55 hover:text-primary-foreground"
    : "text-muted-foreground hover:text-foreground";

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        // Accent text follows the bar: bright olive on the dark bar, the darker
        // text-safe olive on the light one (see --accent-fg in index.css).
        style={{ ["--accent-fg" as string]: isDark ? "var(--accent)" : "var(--accent-ink)" }}
        className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-500 ${barBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16">
            {/* Left — logo */}
            <div className="flex items-center">
              <Link to="/" aria-label="Olive Foods home" className="group inline-flex items-center shrink-0">
                <motion.img
                  src={logoSvg}
                  alt="Olive Foods"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  /* Keep the olive mark in its native colours on every bar —
                   * no white/inverted treatment. */
                  className="h-10 w-auto transition-[filter] duration-500 group-hover:drop-shadow-[0_0_12px_hsl(42_80%_55%/0.5)]"
                />
              </Link>
            </div>

            {/* Center — links */}
            <nav aria-label="Main" className="hidden md:flex items-center gap-9 justify-center">
              {links.map((link) => {
                const isActive =
                  link.href === "/"
                    ? location.pathname === "/"
                    : (location.pathname + location.search).startsWith(link.href);
                if (link.label === "Products") {
                  return (
                    <ProductsMegaMenu
                      key={link.label}
                      isDark={isDark}
                      mutedText={mutedText}
                      isActive={isActive}
                    />
                  );
                }
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`font-body text-[12px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                      isActive ? "font-bold text-accent" : `font-medium ${mutedText}`
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right — contact + mobile toggle. col-start-3: on phones the centre
                nav is display:none, so without it this cell slid into the middle
                column and the menu button sat in the centre of the bar. */}
            <div className="col-start-3 flex items-center justify-end gap-2">
              <Link
                to="/contact"
                className={`hidden md:inline-flex items-center h-9 px-4 rounded-md border font-body text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
                  isDark
                    ? "border-white/20 text-primary-foreground hover:bg-white/10"
                    : "border-foreground/15 text-foreground hover:bg-foreground/[0.06]"
                }`}
              >
                Contact
              </Link>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                className={`md:hidden w-11 h-11 -mr-2 rounded-full flex items-center justify-center transition-colors duration-500 ${
                  isDark ? "text-primary-foreground hover:bg-white/10" : "text-foreground hover:bg-foreground/[0.06]"
                }`}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ ["--accent-fg" as string]: "var(--accent)" }}
            // Scrolls on short phones instead of cutting the menu off; the bar
            // (z-50) stays on top with its close button.
            className="fixed inset-0 z-[45] bg-forest-deep/[0.98] backdrop-blur-2xl overflow-y-auto overscroll-contain"
          >
            <nav aria-label="Menu" className="min-h-full flex flex-col justify-center gap-7 px-6 pt-24 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
              {links.map((link, i) => {
                const active = link.href === "/" ? location.pathname === "/" : location.pathname.startsWith(link.href);
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`font-display text-4xl font-bold transition-colors duration-300 ${active ? "text-accent" : "text-primary-foreground hover:text-accent"}`}
                    >
                      {link.label}
                    </Link>

                    {/* Product search + every category — hover menus don't exist on touch. */}
                    {link.label === "Products" && (
                      <div className="mt-4 space-y-4">
                        <form onSubmit={onMenuSearch} role="search" className="relative">
                          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/50" />
                          <input
                            type="search"
                            value={menuQuery}
                            onChange={(e) => setMenuQuery(e.target.value)}
                            placeholder={products.length ? `Search ${products.length} products…` : "Search products…"}
                            aria-label="Search products"
                            enterKeyHint="search"
                            className="h-12 w-full rounded-xl border border-white/15 bg-white/[0.06] pl-10 pr-4 font-body text-base text-primary-foreground outline-none placeholder:text-primary-foreground/40 focus:border-accent/60 [&::-webkit-search-cancel-button]:hidden"
                          />
                        </form>
                        {menuQuery.trim() && (
                          <ul className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]" aria-live="polite">
                            {menuResults.length ? (
                              <>
                                {menuResults.map((p) => (
                                  <li key={p.id} className="border-b border-white/[0.06] last:border-0">
                                    <Link to={`/products/${p.slug}`} className="flex items-center gap-3 px-3 py-2.5">
                                      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                                        {p.image_url && <img src={cdnImg(p.image_url, 80)} onError={fallbackToOriginal(p.image_url)} alt="" className="h-full w-full object-contain p-1" />}
                                      </span>
                                      <span className="min-w-0">
                                        <span className="block truncate font-body text-sm font-semibold text-primary-foreground">{p.name}</span>
                                        <span className="block truncate font-body text-xs text-primary-foreground/50">{p.brands?.name}</span>
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                                <li>
                                  <button type="button" onClick={onMenuSearch} className="flex w-full items-center justify-center gap-1.5 py-3 font-body text-sm font-semibold text-accent">
                                    See all results <ArrowRight className="h-4 w-4" />
                                  </button>
                                </li>
                              </>
                            ) : (
                              <li className="px-4 py-3 font-body text-sm text-primary-foreground/60">
                                No match. <Link to="/contact" className="font-semibold text-accent">Ask us to source it</Link>
                              </li>
                            )}
                          </ul>
                        )}
                        {categories.length > 0 && (
                          <div>
                            <p className="mb-2 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/45">Categories · {categories.length}</p>
                            <div className="flex flex-wrap gap-2">
                              {(allCats ? categories : categories.slice(0, 8)).map((c) => (
                                <Link
                                  key={c.name}
                                  to={`/categories/${categorySlug(c.name)}`}
                                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/20 px-3.5 font-body text-sm text-primary-foreground/80 transition-colors hover:border-accent/60 hover:text-accent"
                                >
                                  {c.name}
                                  <span className="text-xs text-primary-foreground/40">{c.count}</span>
                                </Link>
                              ))}
                              {categories.length > 8 && (
                                <button
                                  type="button"
                                  onClick={() => setAllCats((v) => !v)}
                                  aria-expanded={allCats}
                                  className="inline-flex h-9 items-center gap-1 px-2 font-body text-sm font-semibold text-accent"
                                >
                                  {allCats ? "Show fewer" : `All ${categories.length}`}
                                  <ChevronDown className={`h-4 w-4 transition-transform ${allCats ? "rotate-180" : ""}`} />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-x-5 gap-y-2 font-body text-sm font-semibold">
                          <Link to="/brands" className="text-accent hover:underline">All brands</Link>
                          <Link to="/products?featured=true" className="text-accent hover:underline">Featured picks</Link>
                          <Link to="/categories" className="text-accent hover:underline">Category overview</Link>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ delay: 0.32, duration: 0.4 }}
                className="mt-4 grid grid-cols-2 gap-3"
              >
                <Button asChild className="col-span-2 h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold text-base rounded-md">
                  <Link to="/contact">Contact us</Link>
                </Button>
                <a
                  href={PHONE_TEL}
                  className="inline-flex items-center justify-center gap-2 h-12 rounded-md border border-white/25 font-body text-sm font-medium text-primary-foreground hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a
                  href={whatsappHref(whatsappMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-12 rounded-md border border-[#25D366]/50 font-body text-sm font-medium text-primary-foreground hover:bg-white/10 transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" /> WhatsApp
                </a>
                <p className="col-span-2 text-center font-body text-xs text-primary-foreground/60">{PHONE_DISPLAY}</p>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
