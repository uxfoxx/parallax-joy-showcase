import { useMemo } from "react";
import { Link } from "react-router-dom";
import Seo, { SITE_URL } from "@/components/Seo";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import { categorySlug } from "@/lib/categories";
import { SECTORS } from "@/lib/sectors";
import { isHouseBrand, brandProfile } from "@/lib/brands";
import { useBrands, useProducts } from "@/lib/api";
import { productCategories } from "@/hooks/useSuppliedCategories";
import { GUIDES } from "@/lib/guides";

const MAIN_PAGES = [
  { label: "Home", to: "/" },
  { label: "About Olive Foods", to: "/about" },
  { label: "All products", to: "/products" },
  { label: "All brands", to: "/brands" },
  { label: "All categories", to: "/categories" },
  ...(GUIDES.length ? [{ label: "Buying guides", to: "/guides" }] : []),
  { label: "Contact & quotes", to: "/contact" },
];

const Heading = ({ children, count }: { children: React.ReactNode; count?: number }) => (
  <h2 className="font-display text-xl font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-baseline gap-2">
    {children}
    {count != null && <span className="font-body text-xs font-normal text-muted-foreground">{count}</span>}
  </h2>
);

const linkClass = "inline-block py-1 font-body text-sm text-foreground/80 hover:text-accent transition-colors";

/**
 * /site-map — every public page on one page, as plain links: the pages, who we
 * supply, every brand and every product grouped by category. For people who
 * want the whole range at a glance, and a one-hop crawl path to every page
 * (the XML sitemap tells search engines what exists; this links it).
 * Lists exactly what has a page: brands with products (or a profile) and
 * categories with products, as on /brands and /categories.
 */
const SiteMapPage = () => {
  const { data: brands = [], isLoading: brandsLoading } = useBrands();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  const { byCategory, liveBrands } = useMemo(() => {
    const byCategory = new Map<string, typeof products>();
    // Each product once, under its main category.
    for (const p of products) {
      const main = productCategories(p)[0];
      if (main) (byCategory.get(main) ?? byCategory.set(main, []).get(main)!).push(p);
    }
    const counts = new Map<string, number>();
    for (const p of products) if (p.brand_id) counts.set(p.brand_id, (counts.get(p.brand_id) ?? 0) + 1);
    const liveBrands = brands
      .filter((b) => counts.get(b.id) || brandProfile(b.slug).about?.trim())
      .map((b) => ({ ...b, count: counts.get(b.id) ?? 0 }));
    return { byCategory, liveBrands };
  }, [brands, products]);

  const categories = [...byCategory.keys()].sort((a, b) => a.localeCompare(b));
  const loading = brandsLoading || productsLoading;

  return (
    <PageLayout>
      <Seo
        title="Site Map: Every Page, Brand and Product | Olive Foods"
        description="Every page on the Olive Foods website in one place: who we supply, the brands we import and distribute in Sri Lanka, and every product by category."
        path="/site-map"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Olive Foods site map",
          url: `${SITE_URL}/site-map`,
          isPartOf: { "@id": `${SITE_URL}/#website` },
        }}
      />
      <PageHero
        eyebrow="Olive Foods / Site map"
        title={
          <>
            Everything on <span className="text-gradient-gold italic">one page</span>.
          </>
        }
        subtitle="Every page, brand and product on the Olive Foods website."
        subheading
      />

      <div data-navbar-theme="light">
        <section className="relative py-16 lg:py-24 bg-background/90 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 space-y-14">
            <div className="grid gap-10 md:grid-cols-3">
              <nav aria-label="Main pages">
                <Heading>Pages</Heading>
                <ul className="space-y-0.5">
                  {MAIN_PAGES.map((p) => (
                    <li key={p.to}>
                      <Link to={p.to} className={linkClass}>{p.label}</Link>
                    </li>
                  ))}
                </ul>
                {GUIDES.length > 0 && (
                  <>
                    <h3 className="font-body text-sm font-semibold text-foreground mt-6 mb-2">Buying guides</h3>
                    <ul className="space-y-0.5">
                      {GUIDES.map((g) => (
                        <li key={g.slug}>
                          <Link to={`/guides/${g.slug}`} className={linkClass}>{g.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </nav>
              <nav aria-label="Who we supply">
                <Heading>Who we supply</Heading>
                <ul className="space-y-0.5">
                  {SECTORS.map((s) => (
                    <li key={s.slug}>
                      <Link to={`/supply/${s.slug}`} className={linkClass}>{s.heading}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav aria-label="Brands">
                <Heading count={liveBrands.length || undefined}>Brands</Heading>
                {loading ? (
                  <p className="font-body text-sm text-muted-foreground">Loading…</p>
                ) : (
                  <ul className="space-y-0.5">
                    {liveBrands.map((b) => (
                      <li key={b.id}>
                        <Link to={`/brands/${b.slug}`} className={linkClass}>
                          {isHouseBrand(b.name) ? "Olive Foods own range" : `${b.name} in Sri Lanka`}
                        </Link>
                        <span className="ml-1.5 font-body text-xs text-muted-foreground">{b.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </nav>
            </div>

            <nav aria-label="Products by category">
              <Heading count={products.length || undefined}>Products by category</Heading>
              {loading ? (
                <p className="font-body text-sm text-muted-foreground">Loading…</p>
              ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-10">
                  {categories.map((c) => (
                    <div key={c} className="break-inside-avoid mb-8">
                      <h3 className="mb-2">
                        <Link
                          to={`/categories/${categorySlug(c)}`}
                          className="font-body text-sm font-semibold text-foreground hover:text-accent transition-colors"
                        >
                          {c}
                        </Link>
                      </h3>
                      <ul className="space-y-0">
                        {byCategory.get(c)!.map((p) => (
                          <li key={p.id}>
                            <Link to={`/products/${p.slug}`} className={linkClass}>
                              {p.name}
                              {p.brands?.name && !isHouseBrand(p.brands.name) && (
                                <span className="text-muted-foreground"> · {p.brands.name}</span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </nav>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default SiteMapPage;
