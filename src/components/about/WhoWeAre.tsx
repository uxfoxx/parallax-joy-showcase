import { useMemo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, MapPin, ShieldCheck } from "lucide-react";
import Eyebrow from "@/components/ui/eyebrow";
import { CERT_NO } from "@/components/FoilSeal";
import { useBrands, useProducts, type Product } from "@/lib/api";
import { productCategories, useSuppliedCategories } from "@/hooks/useSuppliedCategories";
import { categorySlug } from "@/lib/categories";
import { isHouseBrand, LIGHT_LOGO_BRANDS } from "@/lib/brands";
import { cdnImg, fallbackToOriginal } from "@/lib/img";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/motion";

/**
 * About → "Who we are". Shows the business rather than describing it: the
 * story in three lines, the address and certificate it stands behind, the
 * range ranked by what's actually stocked, and the brands brought in — all
 * live from the catalogue, so it never drifts from the products pages.
 * (The headline figures live in the fact sheet right below.)
 */
const LEDGER_SIZE = 6;
const ROSTER_SIZE = 10;

const reveal = (reduced: boolean, delay = 0) => ({
  initial: reduced ? false : { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease: EASE_OUT_EXPO },
});

/** Up to three product photos from a category, overlapped. */
const Thumbs = ({ items }: { items: Product[] }) => (
  <span aria-hidden className="hidden sm:flex items-center">
    {items.map((p, i) => (
      <span
        key={p.id}
        className="-ml-3 first:ml-0 flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-border/70 bg-white p-1 shadow-sm"
        style={{ zIndex: items.length - i }}
      >
        <img src={cdnImg(p.image_url!, 112)} onError={fallbackToOriginal(p.image_url!)} alt="" loading="lazy" className="h-full w-full scale-[1.35] object-contain mix-blend-multiply" />
      </span>
    ))}
  </span>
);

export default function WhoWeAre({ children }: { children?: ReactNode }) {
  const reduced = !!useReducedMotion();
  const { data: products = [] } = useProducts();
  const { data: brands = [] } = useBrands();
  const categories = useSuppliedCategories();

  // Three photos per category for the ledger.
  const thumbs = useMemo(() => {
    const by: Record<string, Product[]> = {};
    for (const p of products) {
      if (!p.image_url) continue;
      for (const c of productCategories(p)) if ((by[c] ??= []).length < 3) by[c].push(p);
    }
    return by;
  }, [products]);

  // Brands currently stocked (they have products), most products first.
  const roster = useMemo(() => {
    const count: Record<string, number> = {};
    for (const p of products) if (p.brand_id) count[p.brand_id] = (count[p.brand_id] ?? 0) + 1;
    return brands
      .filter((b): b is typeof b & { image_url: string } => !!b.image_url && !!count[b.id] && !isHouseBrand(b.name))
      .sort((a, b) => count[b.id] - count[a.id] || a.name.localeCompare(b.name));
  }, [brands, products]);

  const ledger = categories.slice(0, LEDGER_SIZE);
  const moreCategories = categories.length - ledger.length;

  return (
    <section className="relative overflow-hidden py-24 lg:py-32 bg-background">
      <div aria-hidden className="absolute w-[420px] h-[420px] -top-24 -left-24 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Headline */}
        <motion.div {...reveal(reduced)} className="max-w-4xl">
          <Eyebrow variant="pill" tone="accent" className="mb-6">
            Who we are
          </Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-foreground leading-[1.04] tracking-tight">
            Built on thirty years of <span className="text-gradient-gold italic">supplier relationships.</span>
          </h2>
        </motion.div>

        <div className="mt-14 lg:mt-20 grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Story + what it stands behind */}
          <motion.div {...reveal(reduced, 0.08)} className="lg:col-span-5">
            <p className="font-body text-lg md:text-xl font-medium text-foreground leading-relaxed">
              Olive Foods imports and distributes food across Sri Lanka, supplying the hospitality and retail trade.
              It is built on more than thirty years in the food industry and the supplier relationships that came
              with it, and those relationships have always come first.
            </p>
            <p className="mt-5 font-body text-muted-foreground leading-relaxed">
              Frozen lines lead the range (french fries, meat, seafood, fruits and vegetables), alongside dairy,
              grocery staples, edible oils and specialty imports, from suppliers across Europe, Asia and the Middle
              East.
            </p>
            <p className="mt-4 font-body text-muted-foreground leading-relaxed">
              One integrated chain covers every step: sourcing and customs, our bonded warehouse, −18&nbsp;°C cold
              storage and our own island-wide delivery fleet.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Vegan", "Gluten-free", "Organic"].map((r) => (
                <span key={r} className="inline-flex h-8 items-center rounded-full border border-border bg-card px-3 font-body text-[13px] text-foreground">
                  {r} ranges
                </span>
              ))}
            </div>

            <dl className="mt-10 divide-y divide-border border-y border-border">
              <div className="flex items-start gap-3 py-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <dt className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Address</dt>
                  <dd className="mt-1 font-body text-sm text-foreground">292 Sea Street, Colombo 11</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 py-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <dt className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">GMP certified</dt>
                  <dd className="mt-1 font-body text-sm text-foreground">
                    <a href="#certificate" className="group inline-flex items-center gap-1 tabular-nums hover:text-accent transition-colors">
                      {CERT_NO}
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-accent" />
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </motion.div>

          {/* What we carry — the range as stocked today */}
          <motion.div {...reveal(reduced, 0.16)} className="lg:col-span-7">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">What we carry</h3>
              {products.length > 0 && (
                <p className="font-body text-xs text-muted-foreground tabular-nums">
                  {products.length} products · {categories.length} categories
                </p>
              )}
            </div>
            <ol className="mt-4 border-t border-border">
              {ledger.map((c, i) => (
                <li key={c.name} className="border-b border-border">
                  <Link
                    to={`/categories/${categorySlug(c.name)}`}
                    aria-label={`${c.name}: ${c.count} products`}
                    className="group flex items-center gap-4 py-4 sm:py-5"
                  >
                    <span aria-hidden className="w-7 shrink-0 font-display text-sm font-semibold tabular-nums text-muted-foreground/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1 font-display text-base sm:text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
                      {c.name}
                    </span>
                    <Thumbs items={thumbs[c.name] ?? []} />
                    <span className="shrink-0 text-right font-body text-xs sm:w-24 sm:text-sm tabular-nums text-muted-foreground">
                      {c.count} {c.count === 1 ? "product" : "products"}
                    </span>
                    <ArrowRight aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ol>
            {moreCategories > 0 && (
              <Link to="/categories" className="mt-5 inline-flex items-center gap-1.5 font-body text-sm font-semibold text-accent hover:underline">
                {moreCategories} more categories <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </motion.div>
        </div>

        {/* Brands brought in */}
        {roster.length > 0 && (
          <motion.div {...reveal(reduced, 0.1)} className="mt-16 lg:mt-20 border-t border-border pt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Brands we import</h3>
              <Link to="/brands" className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-accent hover:underline">
                All {roster.length} brands <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {roster.slice(0, ROSTER_SIZE).map((b) => (
                <li key={b.id}>
                  <Link
                    to={`/brands/${b.slug}`}
                    title={b.name}
                    className={cn(
                      "group flex aspect-[3/2] items-center justify-center rounded-xl border p-3 transition-colors hover:border-accent/50 sm:p-4",
                      LIGHT_LOGO_BRANDS.has(b.slug) ? "border-forest-deep bg-forest-deep" : "border-border/70 bg-white",
                    )}
                  >
                    <img
                      src={cdnImg(b.image_url, 360)}
                      onError={fallbackToOriginal(b.image_url)}
                      alt={b.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {children}
      </div>
    </section>
  );
}
