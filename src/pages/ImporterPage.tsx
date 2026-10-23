import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, ChevronDown, FileText, Globe2, Snowflake, Truck, Warehouse } from "lucide-react";
import Seo, { SITE_URL } from "@/components/Seo";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";
import { useBrands, useProducts } from "@/lib/api";
import { productCategories, useSuppliedCategories } from "@/hooks/useSuppliedCategories";
import { categorySlug, faqSchema, type Faq } from "@/lib/categories";
import { isHouseBrand, listOf } from "@/lib/brands";
import { SECTORS } from "@/lib/sectors";
import { GUIDES } from "@/lib/guides";
import { AT_A_GLANCE, IMPORTER_PATH, ORGANIZATION_ID } from "@/lib/site";
import { PHONE_DISPLAY, SALES_DISPLAY, quoteHref, whatsappHref, whatsappMessage, type EnquiryTarget } from "@/lib/contact";

/**
 * Pillar page for the head searches Search Console shows the site close on —
 * "food importers in sri lanka", "food distributors in sri lanka", "food
 * suppliers in sri lanka" — which until now landed on the homepage, a visual
 * landing page with little text about the business itself.
 *
 * One page that states plainly what Olive Foods is and does, and links with
 * descriptive anchors to every category, brand, sector and guide (so it also
 * passes weight down to them). Facts only from src/data/company.json and the
 * live catalogue; FAQs are rendered visibly and as FAQPage JSON-LD.
 */

const STEPS = [
  { icon: Globe2, title: "Sourced from 30+ countries", text: "We buy from producers abroad and import the products ourselves." },
  { icon: Warehouse, title: "Held in our bonded warehouse", text: "Stock is kept in our bonded warehouse at 292 Sea Street, Colombo 11." },
  { icon: Snowflake, title: "Frozen lines at −18 °C", text: "Frozen products are stored and delivered under cold chain." },
  { icon: Truck, title: "Delivered island-wide", text: "Wholesale delivery to businesses in all 25 districts of Sri Lanka." },
];

const ImporterPage = () => {
  const { data: products = [] } = useProducts();
  const { data: brands = [] } = useBrands();
  const categories = useSuppliedCategories();

  const brandCounts: Record<string, number> = {};
  for (const p of products) if (p.brand_id) brandCounts[p.brand_id] = (brandCounts[p.brand_id] ?? 0) + 1;
  const importedBrands = brands.filter((b) => brandCounts[b.id] && !isHouseBrand(b.name));
  const brandsIn = (cat: string) => [
    ...new Set(products.filter((p) => productCategories(p).includes(cat)).map((p) => p.brands?.name).filter((b): b is string => !!b && !isHouseBrand(b))),
  ];

  const enquiry: EnquiryTarget = { kind: "sector", name: "Wholesale food supply", path: IMPORTER_PATH };
  const n = products.length;
  const description = `Olive Foods (Pvt) Ltd is a food importer and distributor in Colombo${
    n ? `: ${n} products and ${importedBrands.length} imported brands` : ""
  }, sourced from 30+ countries, with bonded warehousing, a −18 °C cold chain and wholesale delivery to all 25 districts.`;

  const faqs: Faq[] = [
    {
      q: "What does a food importer and distributor do?",
      a: "An importer buys food from producers abroad and brings it into the country; a distributor stores it and delivers it to businesses. Olive Foods does both: it imports from producers in 30+ countries, holds stock in its bonded warehouse and cold store in Colombo, and delivers wholesale to hotels, restaurants, cafés, caterers, supermarkets and retailers in all 25 districts of Sri Lanka.",
    },
    {
      q: "Is Olive Foods a wholesale food supplier?",
      a: "Yes. Olive Foods supplies businesses: hotels, restaurants, cafés, caterers, supermarkets and retailers. Prices are quoted on request, by product and volume, and the team replies within one business day.",
    },
    ...(importedBrands.length
      ? [
          {
            q: "Which brands does Olive Foods import into Sri Lanka?",
            a: `Olive Foods imports and distributes ${listOf(importedBrands.map((b) => b.name))} in Sri Lanka, alongside its own range.`,
          },
        ]
      : []),
    ...(categories.length
      ? [
          {
            q: "What food products does Olive Foods import?",
            a: `${categories.length} categories, including ${listOf(categories.slice(0, 6).map((c) => c.name.toLowerCase()))}. The full catalogue is on the products page, and the sourcing team can bring in lines that aren't listed.`,
          },
        ]
      : []),
    {
      q: "Does Olive Foods deliver outside Colombo?",
      a: "Yes. Olive Foods delivers island-wide, to all 25 districts of Sri Lanka, from its warehouse at 292 Sea Street, Colombo 11. Frozen lines are stored and delivered under cold chain at −18 °C.",
    },
    {
      q: "How do I open an account or place an order?",
      a: `For bulk enquiries, WhatsApp or call ${SALES_DISPLAY}, or send the products and quantities you need through the quote form. For personal enquiries, call ${PHONE_DISPLAY}. The team replies within one business day.`,
    },
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Food importer and distributor in Sri Lanka",
      description,
      url: `${SITE_URL}${IMPORTER_PATH}`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": ORGANIZATION_ID },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Food import and wholesale distribution in Sri Lanka",
      serviceType: "Wholesale food import and distribution",
      description,
      url: `${SITE_URL}${IMPORTER_PATH}`,
      provider: { "@id": ORGANIZATION_ID },
      areaServed: { "@type": "Country", name: "Sri Lanka" },
      audience: { "@type": "BusinessAudience", name: "Hotels, restaurants, cafés, caterers, supermarkets and retailers" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Food importer & distributor", item: `${SITE_URL}${IMPORTER_PATH}` },
      ],
    },
    faqSchema(faqs),
  ];

  return (
    <PageLayout enquiry={enquiry}>
      <Seo title="Food Importer & Distributor in Sri Lanka" description={description} path={IMPORTER_PATH} schema={schema} />
      <PageHero
        eyebrow="Olive Foods / Food importer & distributor"
        title={
          <>
            Food <span className="text-gradient-gold italic">importer</span> and <span className="text-gradient-gold italic">distributor</span> in Sri Lanka
          </>
        }
        subtitle="Olive Foods (Pvt) Ltd imports food from producers in 30+ countries, holds it in its bonded warehouse and cold store in Colombo, and supplies hotels, restaurants, cafés, caterers, supermarkets and retailers wholesale, island-wide."
        subheading
      />

      <div data-navbar-theme="light">
        <section className="relative bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            {/* At a glance */}
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Olive Foods at a glance</h2>
            <dl className="mt-6 grid gap-x-10 gap-y-0 border-t border-border sm:grid-cols-2">
              {[
                ...(n ? ([["Catalogue", `${n} products in ${categories.length} categories, ${importedBrands.length} imported brands`]] as [string, string][]) : []),
                ...AT_A_GLANCE.filter(([k]) => k !== "Contact"),
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-4 border-b border-border py-4 sm:grid-cols-[130px_1fr]">
                  <dt className="pt-0.5 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{k}</dt>
                  <dd className="font-body text-sm leading-relaxed text-foreground">{v}</dd>
                </div>
              ))}
            </dl>

            {/* How supply works */}
            <h2 className="mt-16 font-display text-2xl font-bold text-foreground md:text-3xl">How our supply works</h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-display text-xs font-semibold tracking-[0.2em] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-4 font-display font-semibold text-foreground">{title}</p>
                  <p className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">{text}</p>
                </li>
              ))}
            </ol>

            {/* What we import */}
            <div className="mt-16 flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">What we import</h2>
              <Link to="/products" className="inline-flex shrink-0 items-center gap-1.5 font-body text-sm text-accent hover:underline">
                All products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => {
                const from = brandsIn(c.name);
                return (
                  <li key={c.name}>
                    <Link
                      to={`/categories/${categorySlug(c.name)}`}
                      className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent/40"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-display font-semibold text-foreground group-hover:text-accent">{c.name} in Sri Lanka</span>
                        <span className="shrink-0 font-body text-xs text-muted-foreground">{c.count}</span>
                      </span>
                      {from.length > 0 && (
                        <span className="mt-1 font-body text-xs text-muted-foreground">
                          From {listOf(from.slice(0, 3))}
                          {from.length > 3 ? " and more" : ""}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Brands */}
            {importedBrands.length > 0 && (
              <>
                <div className="mt-16 flex items-end justify-between gap-4">
                  <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Brands we import and distribute</h2>
                  <Link to="/brands" className="inline-flex shrink-0 items-center gap-1.5 font-body text-sm text-accent hover:underline">
                    All brands <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {importedBrands.map((b) => (
                    <li key={b.id}>
                      <Link
                        to={`/brands/${b.slug}`}
                        className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-4 font-body text-sm text-foreground transition-colors hover:border-accent/50 hover:text-accent"
                      >
                        {b.name}
                        {b.origin && <span className="text-xs text-muted-foreground">{b.origin}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Who we supply */}
            <h2 className="mt-16 font-display text-2xl font-bold text-foreground md:text-3xl">Who we supply</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SECTORS.map((s) => (
                <li key={s.slug}>
                  <Link to={`/supply/${s.slug}`} className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent/40">
                    <span className="font-display font-semibold text-foreground group-hover:text-accent">{s.heading}</span>
                    <span className="mt-1 line-clamp-3 font-body text-sm leading-relaxed text-muted-foreground">{s.description}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Order */}
            <div className="mt-16 flex max-w-3xl flex-col gap-4 rounded-xl border border-accent/20 bg-accent/5 p-6 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex-1">
                <p className="font-display text-lg font-semibold text-foreground">Set up wholesale supply</p>
                <p className="mt-1 font-body text-sm text-muted-foreground">
                  Tell us the products and volumes you need. Prices are quoted on request; we reply within one business day.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={quoteHref(enquiry)}
                  data-track="request_quote"
                  data-track-item="importer page"
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 font-body text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  <FileText className="h-4 w-4" /> Request a quote
                </Link>
                <a
                  href={whatsappHref(whatsappMessage(enquiry))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#25D366]/40 bg-background px-4 font-body text-sm font-medium text-foreground transition-colors hover:border-[#25D366]"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> WhatsApp
                </a>
              </div>
            </div>

            {/* Guides */}
            {GUIDES.length > 0 && (
              <>
                <h2 className="mt-16 font-display text-2xl font-bold text-foreground md:text-3xl">Buying guides</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {GUIDES.map((g) => (
                    <li key={g.slug}>
                      <Link to={`/guides/${g.slug}`} className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent/40">
                        <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span className="font-body text-sm font-medium text-foreground group-hover:text-accent">{g.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* FAQ — native <details> so every answer is in the HTML */}
            <div className="mt-16 max-w-3xl">
              <h2 className="mb-4 font-display text-2xl font-bold text-foreground">Frequently asked questions</h2>
              <div className="divide-y divide-border border-y border-border">
                {faqs.map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body font-medium text-foreground [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default ImporterPage;
