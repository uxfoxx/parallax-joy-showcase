import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, Download, Mail, Phone, ShoppingCart, Store, UtensilsCrossed } from "lucide-react";
import Seo, { SITE_URL } from "@/components/Seo";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import FactSheet from "@/components/FactSheet";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import ContactLanes from "@/components/ContactLanes";
import { useBrands, useProducts } from "@/lib/api";
import { faqSchema, type Faq } from "@/lib/categories";
import { isHouseBrand } from "@/lib/brands";
import { BRAND_OWNERS_PATH, IMPORTER_PATH, ORGANIZATION_ID, PROFILE_PDF_PATH } from "@/lib/site";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, SALES_DISPLAY, whatsappHref } from "@/lib/contact";

/**
 * The page for the other side of the business: international manufacturers and
 * brand owners looking for a distributor in Sri Lanka ("exclusive distributor
 * sri lanka", "food distributor for my brand in sri lanka"). The importer pillar
 * page speaks to buyers; this one speaks to principals, with the same facts as
 * the company profile PDF it offers for download.
 *
 * Facts only from src/data/company.json, the company profile and the live
 * catalogue; FAQs are rendered visibly and as FAQPage JSON-LD.
 */

const REASONS = [
  { title: "Customers from day one", text: "800+ hotels, restaurants, cafés, caterers, supermarkets and retailers already buy from Olive Foods, so a new range launches into live demand." },
  { title: "Three channels, one partner", text: "HoReCa, modern trade and general trade, covered under a single appointment." },
  { title: "Importation handled", text: "We import your products and hold stock in our bonded warehouse at 292 Sea Street, Colombo 11." },
  { title: "Cold chain intact", text: "Frozen storage and temperature-controlled delivery, with frozen lines kept at −18 °C, to all 25 districts." },
  { title: "Active selling", text: "Dedicated sales execution, product launches and brand building that drive adoption and repeat orders." },
  { title: "GMP certified", text: "Product integrity, traceability and stock rotation built into every order." },
];

const APPOINTMENT = [
  "One sole authorised distributor for Sri Lanka",
  "Clear territory commitments",
  "Consistent, competitive pricing in the market",
  "A long-term focus on volume and market share",
];

const COMMITMENTS = [
  { title: "Market entry", text: "A launch plan into hospitality, food service and retail through our established channels." },
  { title: "Commercial alignment", text: "Competitive positioning and pricing that build sustainable volume." },
  { title: "Brand development", text: "Investment in positioning, launches, customer adoption and repeat purchasing." },
  { title: "Long-term partnership", text: "Sole-distributor terms, clear territory commitments and shared growth goals." },
];

const CHANNELS = [
  { icon: UtensilsCrossed, name: "HoReCa", text: "Hotels, resorts, restaurants, cafés, bakeries, caterers and institutional food service." },
  { icon: ShoppingCart, name: "Modern trade", text: "Supermarket chains and premium retail shelves." },
  { icon: Store, name: "General trade", text: "Independent grocers and retailers across all 25 districts." },
];

const PRINCIPAL_MESSAGE =
  "Hi Olive Foods, we are a food manufacturer / brand owner interested in distribution in Sri Lanka.\nCompany: \nBrand and products: \nCountry: ";

const BrandOwnersPage = () => {
  const { data: products = [] } = useProducts();
  const { data: brands = [] } = useBrands();

  const withProducts = new Set(products.map((p) => p.brand_id).filter(Boolean));
  const importedBrands = brands.filter((b) => withProducts.has(b.id) && !isHouseBrand(b.name));

  const description =
    "Olive Foods is an importer and distributor in Colombo offering international food manufacturers exclusive distribution in Sri Lanka: 800+ trade customers across HoReCa, modern and general trade, bonded warehousing, a −18 °C cold chain and delivery to all 25 districts.";

  const faqs: Faq[] = [
    {
      q: "How do I find a food distributor in Sri Lanka for my brand?",
      a: "Look for an importer that already sells to the customers you want (hotels, restaurants, supermarkets or retailers), can hold stock in a bonded warehouse, keeps a cold chain if your products are chilled or frozen, and covers the whole island rather than Colombo alone. Olive Foods does all of this and offers international manufacturers exclusive distribution for Sri Lanka. Send your range to info@olivefoods.lk to start.",
    },
    {
      q: "What is an exclusive distributor?",
      a: "An exclusive (sole authorised) distributor is the one company a manufacturer appoints to import and sell its products in a territory. For the brand owner it means one accountable partner, consistent pricing and no competing importers of the same products; for the distributor it justifies investing in launches, sales and brand building.",
    },
    {
      q: "Does Olive Foods handle importation and storage?",
      a: "Yes. Olive Foods imports products from producers abroad, holds stock in its bonded warehouse at 292 Sea Street, Colombo 11, stores frozen lines under cold chain at −18 °C and delivers to businesses in all 25 districts of Sri Lanka.",
    },
    {
      q: "Which customers and channels would my products reach?",
      a: "More than 800 business customers across three channels: HoReCa (hotels, resorts, restaurants, cafés, bakeries and caterers, including leading Colombo hotels), modern trade (supermarket chains) and general trade (independent grocers and retailers island-wide).",
    },
    {
      q: "Which international brands does Olive Foods already distribute?",
      a: importedBrands.length
        ? `Brands from Europe, the Americas and Asia, including ${importedBrands
            .slice(0, 8)
            .map((b) => b.name)
            .join(", ")}. The full list is on the brands page.`
        : "Brands from Europe, the Americas and Asia. The full list is on the brands page.",
    },
    {
      q: "How do I propose my brand to Olive Foods?",
      a: `Email ${EMAIL} with your company, brand, product range and country, or WhatsApp ${SALES_DISPLAY} (the line for bulk enquiries); for general enquiries, call ${PHONE_DISPLAY}. The company profile (PDF) on this page sets out what Olive Foods commits to as an exclusive distributor.`,
    },
  ];

  const url = `${SITE_URL}${BRAND_OWNERS_PATH}`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Exclusive food distributor in Sri Lanka for international brands",
      description,
      url,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": ORGANIZATION_ID },
      significantLink: `${SITE_URL}${PROFILE_PDF_PATH}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Exclusive food distribution in Sri Lanka",
      serviceType: "Exclusive import and distribution for international food brands",
      description,
      url,
      provider: { "@id": ORGANIZATION_ID },
      areaServed: { "@type": "Country", name: "Sri Lanka" },
      audience: { "@type": "BusinessAudience", name: "International food manufacturers and brand owners" },
    },
    {
      "@context": "https://schema.org",
      "@type": "DigitalDocument",
      name: "Olive Foods company profile",
      encodingFormat: "application/pdf",
      url: `${SITE_URL}${PROFILE_PDF_PATH}`,
      author: { "@id": ORGANIZATION_ID },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "For brand owners", item: url },
      ],
    },
    faqSchema(faqs),
  ];

  return (
    <PageLayout>
      <Seo title="Exclusive Food Distributor in Sri Lanka for International Brands" description={description} path={BRAND_OWNERS_PATH} schema={schema} />
      <PageHero
        eyebrow="Olive Foods / For brand owners & manufacturers"
        title={
          <>
            Your <span className="text-gradient-gold italic">exclusive</span> distribution partner in Sri Lanka
          </>
        }
        subtitle="Olive Foods imports, stores, sells and builds international food brands across Sri Lanka, as one sole authorised distributor with 800+ trade customers."
        subheading
      >
        <div className="flex flex-wrap gap-3">
          <a
            href={PROFILE_PDF_PATH}
            download
            data-track="download_profile"
            data-track-item="brand owners hero"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 font-body text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            <Download className="h-4 w-4" /> Company profile (PDF)
          </a>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent("Distribution in Sri Lanka")}`}
            data-track="contact_principal_email"
            data-track-item="brand owners hero"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-5 font-body text-sm font-semibold text-foreground transition-colors hover:border-foreground/30"
          >
            <Mail className="h-4 w-4" /> {EMAIL}
          </a>
        </div>
      </PageHero>

      <div data-navbar-theme="light">
        <section className="relative bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            {/* Why appoint */}
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Why appoint Olive Foods</h2>
            <p className="mt-2 max-w-3xl font-body text-muted-foreground">One accountable partner for your brand in Sri Lanka, from the port to the customer’s kitchen and shelf.</p>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {REASONS.map(({ title, text }, i) => (
                <li key={title} className="rounded-xl border border-border bg-card p-5">
                  <span className="font-display text-xs font-semibold tracking-[0.2em] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 font-display font-semibold text-foreground">{title}</p>
                  <p className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">{text}</p>
                </li>
              ))}
            </ol>

            {/* What an exclusive appointment means */}
            <div className="mt-10 rounded-xl bg-forest-deep p-6 md:p-8">
              <h2 className="font-display text-xl font-bold text-primary-foreground md:text-2xl">An exclusive appointment means</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {APPOINTMENT.map((t) => (
                  <li key={t} className="flex items-start gap-3 font-body text-primary-foreground/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--accent))]" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Channels */}
            <h2 className="mt-16 font-display text-2xl font-bold text-foreground md:text-3xl">Where your products go</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {CHANNELS.map(({ icon: Icon, name, text }) => (
                <li key={name} className="rounded-xl border border-border bg-card p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-display font-semibold text-foreground">{name}</p>
                  <p className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">{text}</p>
                </li>
              ))}
            </ul>

            {/* Our commitments */}
            <h2 className="mt-16 font-display text-2xl font-bold text-foreground md:text-3xl">What we commit to as your distributor</h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {COMMITMENTS.map(({ title, text }, i) => (
                <li key={title} className="border-t-2 border-foreground/80 pt-4">
                  <span className="font-display text-xs font-semibold tracking-[0.2em] text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 font-display font-semibold text-foreground">{title}</p>
                  <p className="mt-1 font-body text-sm leading-relaxed text-muted-foreground">{text}</p>
                </li>
              ))}
            </ol>

            {/* Brands already distributed */}
            {importedBrands.length > 0 && (
              <>
                <div className="mt-16 flex items-end justify-between gap-4">
                  <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">Brands that trust us with Sri Lanka</h2>
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

            {/* Fact sheet */}
            <div className="mt-16">
              <FactSheet />
            </div>

            {/* Contact */}
            <div className="mt-16 flex flex-col gap-4 rounded-xl border border-accent/20 bg-accent/5 p-6 lg:flex-row lg:items-center lg:gap-6">
              <div className="flex-1">
                <p className="font-display text-lg font-semibold text-foreground">Let’s build your brand in Sri Lanka</p>
                <p className="mt-1 font-body text-sm text-muted-foreground">
                  Tell us about your range and your plans for the market. Buying for a kitchen or shop instead? See the{" "}
                  <Link to={IMPORTER_PATH} className="text-accent hover:underline">
                    wholesale supply page
                  </Link>
                  .
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`mailto:${EMAIL}?subject=${encodeURIComponent("Distribution in Sri Lanka")}`}
                    data-track="contact_principal_email"
                    data-track-item="brand owners footer"
                    className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent px-5 font-body text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                  >
                    <Mail className="h-4 w-4" /> Email us
                  </a>
                  <a
                    href={whatsappHref(PRINCIPAL_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="contact_principal_whatsapp"
                    data-track-item="brand owners footer"
                    className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#25D366]/40 bg-background px-4 font-body text-sm font-medium text-foreground transition-colors hover:border-[#25D366]"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" /> WhatsApp
                  </a>
                  <a
                    href={PHONE_TEL}
                    data-track="contact_general_call"
                    data-track-item="brand owners footer"
                    className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 font-body text-sm font-medium text-foreground transition-colors hover:border-foreground/30"
                  >
                    <Phone className="h-4 w-4" /> Call
                  </a>
                </div>
                {/* Never a bare number: both lines, labelled as the client asked. */}
                <ContactLanes layout="inline" source="brand_owners_cta" />
              </div>
            </div>

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

export default BrandOwnersPage;
