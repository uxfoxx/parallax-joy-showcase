import { useParams, Link } from "react-router-dom";
import Seo, { SITE_URL } from "@/components/Seo";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, MessageCircle, FileText, ChevronDown, ExternalLink } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";
import { useBrand, useProducts } from "@/lib/api";
import { categorySlug, faqSchema } from "@/lib/categories";
import { brandFaqs, brandProfile, isHouseBrand, listOf } from "@/lib/brands";
import { productCategories } from "@/hooks/useSuppliedCategories";
import { quoteHref, whatsappHref, whatsappMessage, type EnquiryTarget } from "@/lib/contact";

/**
 * "[Brand] in Sri Lanka" — the page meant to own brand searches. Answer-first
 * copy, the brand profile (src/data/brand-profiles.json), every product as a
 * crawlable link, an order CTA and a brand FAQ. Neutral wording: Olive Foods
 * imports and distributes the brand — no "official"/"exclusive" claims.
 */
const BrandDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: brand, isLoading } = useBrand(slug || "");
  const { data: allProducts = [], isLoading: productsLoading } = useProducts();

  if (isLoading) return <PageLayout><div className="py-40 text-center font-body text-muted-foreground">Loading...</div></PageLayout>;

  if (!brand) {
    // Same as a missing product: keep removed brand URLs out of search.
    return (
      <PageLayout>
        <Seo
          title="Brand Not Found"
          description="This brand is no longer listed. See the brands Olive Foods imports and distributes in Sri Lanka."
          path={`/brands/${slug}`}
          noindex
        />
        <div className="py-40 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Brand Not Found</h1>
          <Link to="/brands" className="font-body text-forest-mid hover:underline">← Back to Brands</Link>
        </div>
      </PageLayout>
    );
  }

  const brandProducts = allProducts.filter((p) => p.brand_id === brand.id);
  const n = brandProducts.length;
  const profile = brandProfile(brand.slug);
  const aliases = profile.aliases ?? [];
  const house = isHouseBrand(brand.name);
  const path = `/brands/${brand.slug}`;
  const url = `${SITE_URL}${path}`;
  const aboutParagraphs = (profile.about ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  // No products and no profile = a thin page Google reports as a soft 404:
  // keep it for visitors, out of search (and out of the sitemap — see
  // scripts/seo/collect-routes.mjs). Decided only once products have loaded.
  const thin = !productsLoading && n === 0 && aboutParagraphs.length === 0;

  const catCounts: Record<string, number> = {};
  for (const p of brandProducts) for (const c of productCategories(p)) catCounts[c] = (catCounts[c] ?? 0) + 1;
  const brandCategories = Object.keys(catCounts).sort((a, b) => catCounts[b] - catCounts[a] || a.localeCompare(b));

  const named = aliases.length ? `${brand.name} (also written ${aliases.join(" or ")})` : brand.name;
  const answer = house
    ? `These ${n} product${n === 1 ? " is" : "s are"} supplied by Olive Foods under its own name and delivered to hotels, restaurants, cafés and retailers island-wide from Colombo.`
    : `Olive Foods imports and distributes ${named} in Sri Lanka, supplying hotels, restaurants, cafés and retailers island-wide from Colombo.` +
      (n
        ? ` ${n} ${brand.name} product${n === 1 ? " is" : "s are"} currently available${brandCategories.length ? ` in ${listOf(brandCategories.slice(0, 3))}` : ""}.`
        : "");
  const faqs = brandFaqs(brand.name, brandProducts.map((p) => p.name));
  const enquiry: EnquiryTarget = { kind: "brand", name: brand.name, path };

  return (
    <PageLayout enquiry={enquiry}>
      <Seo
        title={`${brand.name}: Imported & Distributed in Sri Lanka`}
        description={
          (brand.description || "").replace(/\s+/g, " ").trim().slice(0, 160) ||
          `${brand.name}${brand.origin ? ` from ${brand.origin}` : ""}, imported and distributed across Sri Lanka by Olive Foods.`
        }
        path={path}
        image={brand.image_url || undefined}
        noindex={thin}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Brand",
            "@id": `${url}#brand`,
            name: brand.name,
            url,
            description: aboutParagraphs[0] || brand.description || answer,
            ...(aliases.length ? { alternateName: aliases } : {}),
            ...(profile.website ? { sameAs: [profile.website] } : {}),
            ...(brand.image_url ? { logo: brand.image_url, image: brand.image_url } : {}),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Brands", item: `${SITE_URL}/brands` },
              { "@type": "ListItem", position: 3, name: brand.name, item: url },
            ],
          },
          ...(n
            ? [{
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: `${brand.name} products in Sri Lanka`,
                numberOfItems: n,
                itemListElement: brandProducts.slice(0, 100).map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `${SITE_URL}/products/${p.slug}`,
                  name: p.name,
                })),
              }]
            : []),
          faqSchema(faqs),
        ]}
      />
      <PageHero
        eyebrow={`Brands / ${brand.name}`}
        title={<><span className="text-gradient-gold italic">{brand.name}</span> in Sri Lanka</>}
        subtitle={brand.description ?? undefined}
      >
        <div className="flex flex-wrap items-center gap-4">
          {brand.origin && (
            <span className="inline-flex items-center gap-1.5 text-sm font-body text-white/65">
              <MapPin className="w-4 h-4" /> {brand.origin}
            </span>
          )}
          {brand.established && (
            <span className="inline-flex items-center gap-1.5 text-sm font-body text-white/65">
              <Calendar className="w-4 h-4" /> Est. {brand.established}
            </span>
          )}
          <Link
            to={quoteHref(enquiry)}
            data-track="brand_enquiry"
            data-track-item={brand.name}
            className="inline-flex items-center gap-2 rounded-full bg-accent text-white px-6 h-11 text-sm font-body font-semibold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/25"
          >
            <MessageCircle className="w-4 h-4" /> Inquire About This Brand
          </Link>
        </div>
      </PageHero>

      <section className="py-20 lg:py-28 bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          {/* Answer first — the sentence search engines and AI assistants quote. */}
          <p className="max-w-3xl font-body text-lg text-foreground leading-relaxed">{answer}</p>

          {aboutParagraphs.length > 0 && (
            <div className="mt-12 max-w-3xl">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">About {brand.name}</h2>
              <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                {aboutParagraphs.map((para) => <p key={para.slice(0, 40)}>{para}</p>)}
              </div>
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 font-body text-sm text-accent hover:underline"
                >
                  {brand.name} official website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {brandCategories.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-2">
              <span className="font-body text-sm text-muted-foreground mr-1">{brand.name} by category:</span>
              {brandCategories.map((c) => (
                <Link
                  key={c}
                  to={`/categories/${categorySlug(c)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 h-9 font-body text-sm text-foreground hover:border-accent/50 hover:text-accent transition-colors"
                >
                  {c}
                  <span className="text-xs text-muted-foreground">{catCounts[c]}</span>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-14 mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{brand.name} products in Sri Lanka</h2>
            <Link to="/brands" className="flex items-center gap-2 text-sm font-body text-forest-mid hover:underline shrink-0"><ArrowLeft className="w-4 h-4" /> All Brands</Link>
          </div>
          {n > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="grid sm:grid-cols-2 md:grid-cols-3 gap-5"
            >
              {/* Every product, not a first page — each card is a crawlable link. */}
              {brandProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} columns={3} />
              ))}
            </motion.div>
          ) : (
            <p className="font-body text-muted-foreground text-center py-16">No products available for this brand yet.</p>
          )}

          {/* Order CTA */}
          <div className="mt-14 max-w-3xl rounded-xl border border-accent/20 bg-accent/5 p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <h2 className="font-display text-lg font-semibold text-foreground">How to order {brand.name} wholesale</h2>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Tell us the products and quantities you need — we reply with trade pricing within one business day.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={quoteHref(enquiry)}
                data-track="request_quote"
                data-track-item={`brand: ${brand.name}`}
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

          {/* FAQ — native <details> so every answer is in the HTML. */}
          <div className="mt-14 max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              {house ? "Frequently asked questions" : `${brand.name} in Sri Lanka: frequently asked questions`}
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
        </div>
      </section>
    </PageLayout>
  );
};

export default BrandDetailPage;
