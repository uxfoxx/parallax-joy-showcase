import { useParams, Link } from "react-router-dom";
import { ArrowRight, ChevronDown, FileText } from "lucide-react";
import Seo, { SITE_URL } from "@/components/Seo";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import NotFound from "@/pages/NotFound";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";
import { categorySlug, faqSchema } from "@/lib/categories";
import { guideBySlug, GUIDES } from "@/lib/guides";
import { SECTORS } from "@/lib/sectors";
import { isHouseBrand } from "@/lib/brands";
import { quoteHref, whatsappHref, whatsappMessage, type EnquiryTarget } from "@/lib/contact";
import { useBrands, useProducts } from "@/lib/api";

const chip =
  "inline-flex items-center rounded-full border border-border bg-card px-4 h-9 font-body text-sm text-foreground hover:border-accent/50 hover:text-accent transition-colors";

/**
 * /guides/:slug — one buying guide. Answer-first summary, the article, the
 * catalogue pages it mentions, a quote CTA and its FAQ, with Article + FAQPage
 * + BreadcrumbList structured data. Content comes from src/data/guides.json.
 */
const GuidePage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const guide = guideBySlug(slug);
  const { data: products = [] } = useProducts();
  const { data: brands = [] } = useBrands();

  if (!guide) return <NotFound />;

  const path = `/guides/${guide.slug}`;
  const productLinks = guide.links.products
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => !!p);
  const brandLinks = guide.links.brands
    .map((s) => brands.find((b) => b.slug === s))
    .filter((b): b is NonNullable<typeof b> => !!b);
  const sectorLinks = guide.links.sectors.map((s) => SECTORS.find((x) => x.slug === s)).filter((s): s is NonNullable<typeof s> => !!s);
  const mainCategory = guide.links.categories[0];
  const enquiry: EnquiryTarget | undefined = mainCategory ? { kind: "category", name: mainCategory, path } : undefined;
  const others = GUIDES.filter((g) => g.slug !== guide.slug);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${SITE_URL}${path}#article`,
      headline: guide.title,
      description: guide.description,
      url: `${SITE_URL}${path}`,
      mainEntityOfPage: `${SITE_URL}${path}`,
      datePublished: guide.published,
      dateModified: guide.updated ?? guide.published,
      inLanguage: "en",
      author: { "@id": `${SITE_URL}/#organization` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: [...guide.links.categories, ...brandLinks.map((b) => b.name)],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
        { "@type": "ListItem", position: 3, name: guide.title, item: `${SITE_URL}${path}` },
      ],
    },
    faqSchema(guide.faqs),
  ];

  return (
    <PageLayout enquiry={enquiry}>
      <Seo title={`${guide.seoTitle} | Olive Foods`} description={guide.description} path={path} type="article" schema={schema} />
      <PageHero eyebrow="Olive Foods / Guides" title={guide.title} subtitle={guide.description} />

      <div data-navbar-theme="light">
        <section className="relative py-16 lg:py-24 bg-background/90 backdrop-blur-sm">
          <article className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-body text-lg leading-relaxed text-foreground">{guide.summary}</p>
            <p className="mt-3 font-body text-xs text-muted-foreground">
              Updated{" "}
              <time dateTime={guide.updated ?? guide.published}>
                {new Date(guide.updated ?? guide.published).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </time>
            </p>

            {guide.sections.map((s) => (
              <section key={s.heading} className="mt-12">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 text-balance">{s.heading}</h2>
                <div className="space-y-4 font-body text-base leading-relaxed text-foreground/85">
                  {s.paragraphs?.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
                  {s.items && (
                    <ul className="list-disc pl-5 space-y-2 marker:text-accent">
                      {s.items.map((i) => <li key={i.slice(0, 40)}>{i}</li>)}
                    </ul>
                  )}
                  {s.steps && (
                    <ol className="list-decimal pl-5 space-y-2 marker:text-accent marker:font-semibold">
                      {s.steps.map((i) => <li key={i.slice(0, 40)}>{i}</li>)}
                    </ol>
                  )}
                  {s.table && (
                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/40">
                          <tr>
                            {s.table.head.map((h) => (
                              <th key={h} className="text-left font-semibold text-foreground px-4 py-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {s.table.rows.map((r) => (
                            <tr key={r[0]}>
                              {r.map((c, i) => (
                                <td key={i} className={`px-4 py-3 align-top ${i === 0 ? "font-medium text-foreground" : "text-foreground/80"}`}>{c}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            ))}

            {/* The catalogue pages this guide is about — its crawl path into the shop. */}
            {(productLinks.length > 0 || brandLinks.length > 0 || guide.links.categories.length > 0) && (
              <section className="mt-14">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">In this guide</h2>
                <div className="flex flex-wrap gap-2">
                  {guide.links.categories.map((c) => (
                    <Link key={c} to={`/categories/${categorySlug(c)}`} className={chip}>{c}</Link>
                  ))}
                  {brandLinks.map((b) => (
                    <Link key={b.id} to={`/brands/${b.slug}`} className={chip}>
                      {isHouseBrand(b.name) ? "Olive Foods own range" : `${b.name} in Sri Lanka`}
                    </Link>
                  ))}
                </div>
                {productLinks.length > 0 && (
                  <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {productLinks.map((p) => (
                      <li key={p.id}>
                        <Link to={`/products/${p.slug}`} className="font-body text-sm text-accent hover:underline">
                          {p.name}
                          {p.brands?.name && !isHouseBrand(p.brands.name) && <span className="text-muted-foreground"> · {p.brands.name}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* Quote CTA */}
            <div className="mt-14 rounded-xl border border-accent/20 bg-accent/5 p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className="flex-1">
                <p className="font-display text-lg font-semibold text-foreground">Need these for your kitchen?</p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Send us the products and quantities. We reply with trade pricing and delivery details within one business day.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={enquiry ? quoteHref(enquiry) : "/contact"}
                  data-track="request_quote"
                  data-track-item={`guide: ${guide.slug}`}
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
            <section className="mt-14">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Frequently asked questions</h2>
              <div className="divide-y divide-border border-y border-border">
                {guide.faqs.map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body font-medium text-foreground [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 font-body text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {sectorLinks.length > 0 && (
              <section className="mt-14">
                <h2 className="font-display text-lg font-semibold text-foreground mb-3">Who we supply</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {sectorLinks.map((s) => (
                    <Link key={s.slug} to={`/supply/${s.slug}`} className="font-body text-sm text-accent hover:underline">{s.heading}</Link>
                  ))}
                </div>
              </section>
            )}

            {others.length > 0 && (
              <section className="mt-14">
                <h2 className="font-display text-lg font-semibold text-foreground mb-3">More guides</h2>
                <ul className="space-y-2">
                  {others.map((g) => (
                    <li key={g.slug}>
                      <Link to={`/guides/${g.slug}`} className="inline-flex items-center gap-1.5 font-body text-sm text-accent hover:underline">
                        {g.title} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </section>
      </div>
    </PageLayout>
  );
};

export default GuidePage;
