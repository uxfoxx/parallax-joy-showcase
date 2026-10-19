import { useParams, Link } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import { motion } from "framer-motion";
import { FileText, ChevronDown } from "lucide-react";
import Seo, { SITE_URL } from "@/components/Seo";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";
import { useCategories, useProducts } from "@/lib/api";
import { categoryFromSlug, categorySeo, categoryFaqs, faqSchema, lowerCategory } from "@/lib/categories";
import { quoteHref, whatsappHref, whatsappMessage, type EnquiryTarget } from "@/lib/contact";
import RelatedGuides from "@/components/RelatedGuides";
import categoryIntros from "@/data/category-intros.json";

/**
 * SEO landing page for a product category: /categories/:slug.
 * Targets "[category] importer / distributor in Sri Lanka" search intent.
 * Intentionally not linked from the main nav / home page — discovered via the
 * sitemap and the /categories hub, and prerendered for crawlers + AI engines.
 */
const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: categories = [], isLoading: catsLoading } = useCategories();
  const names = categories.map((c) => c.name);
  const name = slug ? categoryFromSlug(slug, names) : undefined;

  const { data: products = [], isLoading: prodLoading } = useProducts(
    name ? { category: name } : undefined,
  );

  // Wait for categories to resolve before deciding a slug is invalid.
  if (catsLoading) return <PageLayout>{null}</PageLayout>;
  // Unknown slug → the real (noindex) 404 page. Redirecting to /products here
  // is what Google reports as a "Soft 404" (redirect to an unrelated page).
  if (!name) return <NotFound />;
  // A category with no products is thin — keep it for visitors, out of search.
  const empty = !prodLoading && products.length === 0;

  const category = categories.find((c) => c.name === name);
  const seo = categorySeo(name);
  // The admin description wins; then a reviewed intro (src/data/category-intros.json,
  // drafted in content/drafts/); then the generic template.
  const intro = category?.description?.trim() || (categoryIntros as Record<string, string>)[name] || seo.intro;
  const path = `/categories/${slug}`;
  const brandNames = [...new Set(products.map((p) => p.brands?.name).filter((b): b is string => !!b))].sort();
  const faqs = categoryFaqs(name, brandNames);
  const enquiry: EnquiryTarget = { kind: "category", name, path };

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: seo.title,
      description: seo.description,
      url: `${SITE_URL}${path}`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: name,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: products.length,
        itemListElement: products.slice(0, 40).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}/products/${p.slug}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Categories", item: `${SITE_URL}/categories` },
        { "@type": "ListItem", position: 3, name, item: `${SITE_URL}${path}` },
      ],
    },
    faqSchema(faqs),
  ];

  return (
    <PageLayout enquiry={enquiry}>
      <Seo title={`${seo.title} | Olive Foods`} description={seo.description} path={path} schema={schema} noindex={empty} />
      <PageHero
        eyebrow={`Olive Foods / Categories / ${name}`}
        title={
          <>
            {name} <span className="text-gradient-gold italic">supplier</span> in Sri Lanka
          </>
        }
        subtitle={intro}
        subheading
      />

      <div data-navbar-theme="light">
        <section className="relative py-16 lg:py-24 bg-background/90 backdrop-blur-sm overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
            <p className="font-body text-sm text-muted-foreground mb-7">
              {prodLoading ? "Loading…" : `${products.length} ${name} ${products.length === 1 ? "product" : "products"} imported and distributed by Olive Foods across Sri Lanka.`}
            </p>

            <h2 className="sr-only">{name} products</h2>
            {prodLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 sm:gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[4/5]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 sm:gap-4"
              >
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} columns={4} />
                ))}
              </motion.div>
            ) : (
              <p className="font-body text-muted-foreground py-16 text-center">
                No {lowerCategory(name)} listed right now.{" "}
                <Link to={quoteHref(enquiry)} data-track="sourcing_request" data-track-item={name} className="text-accent hover:underline">
                  Ask us to source it
                </Link>.
              </p>
            )}

            <div className="mt-14 max-w-3xl">
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                {name} for Sri Lanka&apos;s hotels, restaurants &amp; retail
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                Olive Foods imports {lowerCategory(name)} and distributes it island-wide to hotels,
                restaurants, cafés, catering operations and supermarkets across Sri Lanka. Need a{" "}
                {lowerCategory(name)} line we don&apos;t list yet? Our sourcing team will bring it in
                through our supplier network.
              </p>
            </div>

            {/* Sourcing CTA */}
            <div className="mt-8 max-w-3xl rounded-xl border border-accent/20 bg-accent/5 p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="flex-1">
                <p className="font-display text-lg font-semibold text-foreground">Can&apos;t find the {lowerCategory(name)} you need?</p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Tell us the product, brand or spec and we&apos;ll source it. We reply within one business day.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={quoteHref(enquiry)}
                  data-track="sourcing_request"
                  data-track-item={name}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-5 h-11 text-sm font-body font-semibold hover:bg-accent/90 transition-colors"
                >
                  <FileText className="w-4 h-4" /> Request sourcing
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

            {/* FAQ — rendered in the HTML (native <details>, not an unmounting
                accordion) so crawlers and AI engines read every answer; mirrored
                in the FAQPage JSON-LD above. */}
            <div className="mt-14 max-w-3xl">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                {name}: frequently asked questions
              </h2>
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

            <RelatedGuides category={name} className="mt-14 max-w-3xl" />
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default CategoryPage;
