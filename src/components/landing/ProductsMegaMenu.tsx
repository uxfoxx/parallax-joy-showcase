import { useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, Grid3x3, LayoutGrid, Search, Sparkles, Star, Tag, X } from "lucide-react";
import { useBrands, useProducts, type Product } from "@/lib/api";
import { productCategories, useSuppliedCategories } from "@/hooks/useSuppliedCategories";
import { categorySlug } from "@/lib/categories";
import { cdnImg, fallbackToOriginal } from "@/lib/img";
import { cn } from "@/lib/utils";
import { searchProducts } from "@/lib/products";

type Props = {
  isDark: boolean;
  mutedText: string;
  isActive: boolean;
};

/** Small product thumbnail on a cream tile (product photos are cut-outs). */
function Thumb({ p, size = 48 }: { p: Product; size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white" style={{ width: size, height: size }}>
      {p.image_url ? (
        <img
          src={cdnImg(p.image_url, size * 2)}
          onError={fallbackToOriginal(p.image_url)}
          alt=""
          loading="lazy"
          width={size}
          height={size}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <Grid3x3 className="h-4 w-4 text-forest-mid/40" />
      )}
    </span>
  );
}

/**
 * Desktop "Products" mega-menu: the whole catalogue one hover away.
 *
 * The label still links to /products; hovering or focusing it drops a
 * full-width panel with
 *  - a live product search (every product, by name, brand, category or SKU;
 *    Enter opens the full results on /products?q=),
 *  - every category that has products, with counts, and a preview of the one
 *    under the pointer (its products, "view all"),
 *  - shortcuts (all products, featured, our own range, all brands) and the
 *    brands with the most products.
 * Category links go to the category landing pages (/categories/<slug>).
 * A short close delay bridges the gap between the trigger and the panel.
 */
const ProductsMegaMenu = ({ isDark, mutedText, isActive }: Props) => {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();
  const { data: brands = [] } = useBrands();
  const categories = useSuppliedCategories();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openNow = () => {
    cancelClose();
    setOpen(true);
  };
  const close = () => {
    cancelClose();
    setOpen(false);
    setQuery("");
    setHovered(null);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(close, 180);
  };

  const results = useMemo(() => searchProducts(products, query), [products, query]);
  const featured = useMemo(() => products.filter((p) => p.featured).slice(0, 4), [products]);
  const preview = useMemo(() => {
    if (!hovered) return null;
    const items = products.filter((p) => productCategories(p).includes(hovered));
    return { name: hovered, count: items.length, items: items.filter((p) => p.image_url).slice(0, 4) };
  }, [hovered, products]);
  const topBrands = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) if (p.brand_id) counts[p.brand_id] = (counts[p.brand_id] ?? 0) + 1;
    // Only brands with products have a brand page.
    return brands.filter((b) => counts[b.id]).sort((a, b) => counts[b.id] - counts[a.id]).slice(0, 10);
  }, [brands, products]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    close();
    navigate(`/products?q=${encodeURIComponent(q)}`);
  };

  const ourCount = products.filter((p) => p.our_product).length;
  const shortcuts = [
    { label: "All products", to: "/products", Icon: LayoutGrid, meta: products.length ? `${products.length}` : "" },
    { label: "Featured picks", to: "/products?featured=true", Icon: Star, meta: "" },
    ...(ourCount ? [{ label: "Our own range", to: "/products?our=true", Icon: Sparkles, meta: `${ourCount}` }] : []),
    { label: "All brands", to: "/brands", Icon: Tag, meta: brands.length ? `${brands.length}` : "" },
  ];

  // Fully opaque — this panel floats over whatever section is scrolled
  // beneath it, so a translucent surface can let that section show through.
  const panelSurface = isDark ? "bg-[hsl(150_26%_6%)] border-white/10 text-primary-foreground" : "bg-background border-foreground/10 text-foreground";
  const subtle = isDark ? "text-primary-foreground/50" : "text-muted-foreground";
  const line = isDark ? "border-white/10" : "border-foreground/10";
  const itemHover = isDark ? "hover:bg-white/[0.06]" : "hover:bg-foreground/[0.04]";
  const eyebrow = `font-body text-[11px] font-semibold tracking-[0.24em] uppercase ${subtle}`;

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
      onFocusCapture={openNow}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) close();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <Link
        to="/products"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={close}
        className={`inline-flex items-center gap-1 font-body text-[12px] uppercase tracking-[0.2em] transition-colors duration-300 ${
          isActive ? "font-bold text-accent" : `font-medium ${mutedText}`
        }`}
      >
        Products
        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
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
            className={`fixed left-0 right-0 top-16 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b shadow-[0_28px_64px_-28px_rgba(0,0,0,0.5)] ${panelSurface}`}
          >
            <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 py-8 lg:px-8 xl:gap-10">
              {/* ── Search + shortcuts ── */}
              <div className="col-span-4 flex flex-col lg:col-span-3">
                <form onSubmit={onSearch} role="search" className="relative">
                  <Search className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${subtle}`} />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={products.length ? `Search ${products.length} products…` : "Search products…"}
                    aria-label="Search products"
                    className={cn(
                      "h-11 w-full rounded-xl border pl-10 pr-9 font-body text-sm outline-none transition-colors [&::-webkit-search-cancel-button]:hidden",
                      isDark
                        ? "border-white/15 bg-white/[0.06] placeholder:text-primary-foreground/40 focus:border-accent/60 focus:bg-white/[0.09]"
                        : "border-foreground/15 bg-card placeholder:text-muted-foreground focus:border-accent/60",
                    )}
                  />
                  {query && (
                    <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className={`absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md ${subtle} ${itemHover}`}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </form>
                <p className={`mt-2 font-body text-[11px] ${subtle}`}>By name, brand, category or SKU</p>

                <ul className="mt-6 space-y-0.5">
                  {shortcuts.map(({ label, to, Icon, meta }) => (
                    <li key={label}>
                      <Link to={to} onClick={close} className={`group/sc flex items-center gap-3 rounded-lg px-2.5 py-2 font-body text-sm font-semibold transition-colors ${itemHover}`}>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex-1">{label}</span>
                        {meta && <span className={`font-body text-xs tabular-nums ${subtle}`}>{meta}</span>}
                        <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover/sc:translate-x-0 group-hover/sc:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {query.trim() ? (
                /* ── Search results ── */
                <div className={`col-span-8 border-l pl-8 lg:col-span-9 xl:pl-10 ${line}`}>
                  <div className="mb-4 flex items-baseline justify-between gap-4">
                    <p className={eyebrow} aria-live="polite">
                      {results.length} {results.length === 1 ? "product" : "products"} for “{query.trim()}”
                    </p>
                    {results.length > 0 && (
                      <Link
                        to={`/products?q=${encodeURIComponent(query.trim())}`}
                        onClick={close}
                        className="inline-flex items-center gap-1.5 font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-accent hover:gap-2.5"
                      >
                        See all results <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                  {results.length ? (
                    <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                      {results.slice(0, 12).map((p) => (
                        <li key={p.id}>
                          <Link to={`/products/${p.slug}`} onClick={close} className={`flex items-center gap-3 rounded-xl p-2 transition-colors ${itemHover}`}>
                            <Thumb p={p} />
                            <span className="min-w-0">
                              <span className="line-clamp-2 font-body text-[13px] font-semibold leading-snug">{p.name}</span>
                              <span className={`block truncate font-body text-[11px] ${subtle}`}>{p.brands?.name ?? productCategories(p)[0]}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={`rounded-2xl border border-dashed p-6 ${line}`}>
                      <p className="font-display text-lg font-semibold">Not in the catalogue yet.</p>
                      <p className={`mt-1 font-body text-sm ${subtle}`}>Our sourcing team can often bring in a product we don't list.</p>
                      <Link to="/contact" onClick={close} className="mt-3 inline-flex items-center gap-1.5 font-body text-sm font-semibold text-accent">
                        Ask us to source it <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* ── Every category ── */}
                  <div className={`col-span-8 border-l pl-8 lg:col-span-6 xl:pl-10 ${line}`} onMouseLeave={() => setHovered(null)}>
                    <div className="mb-3 flex items-baseline justify-between">
                      <p className={eyebrow}>Categories · {categories.length}</p>
                      <Link to="/categories" onClick={close} className="inline-flex items-center gap-1 font-body text-[12px] font-semibold text-accent hover:gap-2">
                        Overview <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                    <ul className="grid grid-cols-2 gap-x-4">
                      {categories.map((c) => (
                        <li key={c.name}>
                          <Link
                            to={`/categories/${categorySlug(c.name)}`}
                            onClick={close}
                            onMouseEnter={() => setHovered(c.name)}
                            onFocus={() => setHovered(c.name)}
                            className={cn(
                              "flex items-center justify-between gap-3 rounded-lg px-2.5 py-[7px] font-body text-[13.5px] transition-colors",
                              hovered === c.name ? (isDark ? "bg-white/[0.07] text-primary-foreground" : "bg-accent/10 text-foreground") : itemHover,
                            )}
                          >
                            <span className="truncate">{c.name}</span>
                            <span className={`shrink-0 font-body text-[11px] tabular-nums ${hovered === c.name ? "text-accent" : subtle}`}>{c.count}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ── Preview ── */}
                  <div className="hidden lg:col-span-3 lg:block">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={preview?.name ?? "featured"}
                        initial={reduced ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduced ? undefined : { opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                        className={`rounded-2xl border p-4 ${line} ${isDark ? "bg-white/[0.03]" : "bg-card"}`}
                      >
                        <p className={eyebrow}>{preview ? `${preview.count} products` : "Featured"}</p>
                        <p className="mt-1 font-display text-lg font-bold leading-tight">{preview ? preview.name : "Our premium picks"}</p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {(preview ? preview.items : featured).map((p) => (
                            <Link key={p.id} to={`/products/${p.slug}`} onClick={close} className="group/pv block" title={p.name}>
                              <span className="block aspect-square overflow-hidden rounded-xl bg-white">
                                {p.image_url && (
                                  <img
                                    src={cdnImg(p.image_url, 220)}
                                    onError={fallbackToOriginal(p.image_url)}
                                    alt=""
                                    loading="lazy"
                                    className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover/pv:scale-105"
                                  />
                                )}
                              </span>
                              <span className="mt-1 line-clamp-1 font-body text-[11px]">{p.name}</span>
                            </Link>
                          ))}
                        </div>
                        <Link
                          to={preview ? `/categories/${categorySlug(preview.name)}` : "/products?featured=true"}
                          onClick={close}
                          className="mt-3 inline-flex items-center gap-1.5 font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-accent hover:gap-2.5"
                        >
                          {preview ? `View all ${preview.count}` : "See featured"} <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </>
              )}

              {/* ── Brands ── */}
              {topBrands.length > 0 && (
                <div className={`col-span-12 flex items-center gap-4 border-t pt-5 ${line}`}>
                  <p className={`${eyebrow} shrink-0`}>Brands</p>
                  <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                    {topBrands.map((b) => (
                      <li key={b.id}>
                        <Link
                          to={`/brands/${b.slug}`}
                          onClick={close}
                          className={cn(
                            "inline-flex h-8 items-center rounded-full border px-3 font-body text-[12.5px] font-medium transition-colors",
                            isDark ? "border-white/15 hover:border-accent/50 hover:text-accent" : "border-foreground/15 hover:border-accent/50 hover:text-accent",
                          )}
                        >
                          {b.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link to="/brands" onClick={close} className="inline-flex shrink-0 items-center gap-1.5 font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-accent hover:gap-2.5">
                    All {brands.length} brands <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsMegaMenu;
