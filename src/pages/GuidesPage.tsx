import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Seo, { SITE_URL } from "@/components/Seo";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import NotFound from "@/pages/NotFound";
import { GUIDES } from "@/lib/guides";

/** /guides — the buying-guides hub. A 404 until the first guide is published. */
const GuidesPage = () => {
  if (!GUIDES.length) return <NotFound />;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Olive Foods buying guides",
    url: `${SITE_URL}/guides`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: GUIDES.length,
      itemListElement: GUIDES.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: g.title,
        url: `${SITE_URL}/guides/${g.slug}`,
      })),
    },
  };

  return (
    <PageLayout>
      <Seo
        title="Buying Guides for Hotels, Restaurants and Cafés | Olive Foods"
        description="Practical guides for kitchens in Sri Lanka buying imported food: Thai ingredients, frozen food and cold chain, fruit purees, cheese, pasta, fries and more."
        path="/guides"
        schema={schema}
      />
      <PageHero
        eyebrow="Olive Foods / Guides"
        title={
          <>
            Buying <span className="text-gradient-gold italic">guides</span>.
          </>
        }
        subtitle="Practical know-how for kitchens in Sri Lanka that buy imported food."
        subheading
      />

      <div data-navbar-theme="light">
        <section className="relative py-16 lg:py-24 bg-background/90 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <ul className="grid sm:grid-cols-2 gap-4">
              {GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link
                    to={`/guides/${g.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 hover:border-accent/40 hover:bg-accent/5 transition-colors"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors text-balance">
                        {g.title}
                      </span>
                      <ArrowUpRight className="w-4 h-4 mt-1.5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                    </span>
                    <span className="mt-2 font-body text-sm text-muted-foreground leading-relaxed">{g.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default GuidesPage;
