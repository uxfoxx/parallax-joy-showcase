import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, ChevronDown, Check, ArrowRight } from "lucide-react";
import Seo, { SITE_URL } from "@/components/Seo";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";
import { useProducts, type Product } from "@/lib/api";
import { categorySlug, faqSchema } from "@/lib/categories";
import { SECTORS, sectorBySlug, sectorFaqs } from "@/lib/sectors";
import { quoteHref, whatsappHref, whatsappMessage, type EnquiryTarget } from "@/lib/contact";

/** The generated DB types predate the `categories` array column. */
const productCategories = (p: Product): string[] => {
  const cats = (p as Product & { categories?: string[] | null }).categories;
  return cats?.length ? cats : p.category ? [p.category] : [];
};

/** Gold-italic the "supplier"/"distributor" word, matching the category pages. */
const styledHeading = (heading: string) =>
  heading.split(/(supplier|distributor)/i).map((part, i) =>
    /^(supplier|distributor)$/i.test(part) ? (
      <span key={i} className="text-gradient-gold italic">{part}</span>
    ) : (
      part
    ),
  );

/**
 * Buyer-sector landing page: /supply/:slug — e.g. "Food supplier for hotels in
 * Sri Lanka", "Frozen food supplier in Sri Lanka". Targets the commercial
 * searches named in the SEO proposal. Not linked from the main nav (same
 * policy as the category pages); found via the sitemap, prerendered, and
 * cross-linked to the other sectors and to its categories.
 */
const SectorPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const sector = slug ? sectorBySlug(slug) : undefined;
  const { data: allProducts = [], isLoading } = useProducts();

  if (!sector) return <Navigate to="/products" replace />;

  const inSector = allProducts.filter((p) => productCategories(p).some((c) => sector.categories.includes(c)));
  const featuredFirst = [...inSector].sort((a, b) => Number(b.featured) - Number(a.featured));
  const showcase = featuredFirst.slice(0, 12);
  const counts = Object.fromEntries(
    sector.categories.map((c) => [c, allProducts.filter((p) => productCategories(p).includes(c)).length]),
  );
  const liveCategories = sector.categories.filter((c) => counts[c] > 0);
  const brands = [...new Set(inSector.map((p) => p.brands?.name).filter((b): b is string => !!b))].sort();
  const faqs = sectorFaqs(sector, brands);
  const path = `/supply/${sector.slug}`;
  const enquiry: EnquiryTarget = { kind: "sector", name: sector.name, path };

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: sector.title,
      description: sector.description,
      url: `${SITE_URL}${path}`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: sector.heading,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: inSector.length,
        itemListElement: showcase.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}/products/${p.slug}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: sector.heading,
      serviceType: "Wholesale food import and distribution",
      description: sector.description,
      url: `${SITE_URL}${path}`,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Sri Lanka" },
      audience: { "@type": "BusinessAudience", name: sector.name },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: sector.heading, item: `${SITE_URL}${path}` },
      ],
    },
    faqSchema(faqs),
  ];

  return (
    <PageLayout enquiry={enquiry}>
      <Seo title={sector.title} description={sector.description} path={path} schema={schema} />
      <PageHero
        eyebrow={`Olive Foods / Supply / ${sector.name}`}
        title={<>{styledHeading(sector.heading)}</>}
        subtitle={sector.intro}
        subheading
      />

      <div data-navbar-theme="light">
        <section className="relative py-16 lg:py-24 bg-background/90 backdrop-blur-sm overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
            {/* What this buyer needs — and how we cover it */}
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              What {sector.audience} need from a supplier
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {sector.needs.map((n) => (
                <div key={n.title} className="rounded-xl border border-border bg-card p-5">
                  <p className="font-display font-semibold text-foreground flex items-start gap-2">
                    <Check className="w-4 h-4 mt-1 shrink-0 text-accent" />
                    {n.title}
                  </p>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed mt-2">{n.body}</p>
                </div>
              ))}
            </div>

            {/* Categories */}
            <h2 className="font-display text-2xl font-bold text-foreground mt-14 mb-4">
              What we supply to {sector.audience}
            </h2>
            <div className="flex flex-wrap gap-2">
              {liveCategories.map((c) => (
                <Link
                  key={c}
                  to={`/categories/${categorySlug(c)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 h-9 font-body text-sm text-foreground hover:border-accent/50 hover:text-accent transition-colors"
                >
                  {c}
                  <span className="text-xs text-muted-foreground">{counts[c]}</span>
                </Link>
              ))}
            </div>

            {/* Products */}
            <div className="flex items-end justify-between gap-4 mt-14 mb-5">
              <h2 className="font-display text-2xl font-bold text-foreground">Popular with {sector.audience}</h2>
              <Link to="/products" className="inline-flex items-center gap-1.5 font-body text-sm text-accent hover:underline shrink-0">
                All products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {isLoading ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[4/5]" />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3"
              >
                {showcase.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} columns={4} />
                ))}
              </motion.div>
            )}

            {/* Quote CTA */}
            <div className="mt-14 max-w-3xl rounded-xl border border-accent/20 bg-accent/5 p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="flex-1">
                <p className="font-display text-lg font-semibold text-foreground">Set up supply for your business</p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Tell us what you need and in what volumes — we&apos;ll come back with trade pricing within one business day.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={quoteHref(enquiry)}
                  data-track="request_quote"
                  data-track-item={`sector: ${sector.name}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-5 h-11 text-sm font-body font-semibold hover:bg-accent/90 transition-colors"
                >
                  <FileText className="w-4 h-4" /> Request a quote
                </Link>
                <a
                  href={whatsappHref(whatsappMessage(enquiry))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#25D366]/40 bg-background px-4 h-11 text-sm font-body font-medium text-foreground hover:border-[#25D366] transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" /> WhatsApp
                </a>
              </div>
            </div>

            {/* FAQ — native <details> so every answer is in the HTML for crawlers + AI engines. */}
            <div className="mt-14 max-w-3xl">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Frequently asked questions</h2>
              <div className="divide-y divide-border border-y border-border">
                {faqs.map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body font-medium text-foreground [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 font-body text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Other sectors */}
            <div className="mt-14">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">We also supply</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {SECTORS.filter((s) => s.slug !== sector.slug).map((s) => (
                  <Link key={s.slug} to={`/supply/${s.slug}`} className="font-body text-sm text-accent hover:underline">
                    {s.heading}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default SectorPage;
