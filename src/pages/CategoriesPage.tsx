import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Seo, { SITE_URL } from "@/components/Seo";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import { useCategories } from "@/lib/api";
import { categorySlug } from "@/lib/categories";

/**
 * Category hub: /categories. Lists every category landing page so crawlers (and
 * the /categories/:slug pages) are linked, not orphaned. Not surfaced in the
 * main navigation — reachable by direct URL and via the sitemap.
 */
const CategoriesPage = () => {
  const { data: categories = [] } = useCategories();
  const sorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Food Categories We Import & Distribute in Sri Lanka",
    url: `${SITE_URL}/categories`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: sorted.length,
      itemListElement: sorted.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        url: `${SITE_URL}/categories/${categorySlug(c.name)}`,
      })),
    },
  };

  return (
    <PageLayout>
      <Seo
        title="Food Categories: What Olive Foods Imports to Sri Lanka"
        description="The food categories Olive Foods imports and distributes across Sri Lanka — frozen meat, imported cheese, pasta, nuts, oils, sauces and more — supplied to hotels, restaurants and supermarkets island-wide."
        path="/categories"
        schema={schema}
      />
      <PageHero
        eyebrow="Olive Foods / Categories"
        title={
          <>
            What we <span className="text-gradient-gold italic">import</span>, by category.
          </>
        }
        subtitle="The food categories we import and distribute across Sri Lanka, from frozen lines to specialty imports."
        subheading
      />

      <div data-navbar-theme="light">
        <section className="relative py-16 lg:py-24 bg-background/90 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sorted.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/categories/${categorySlug(c.name)}`}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4 hover:border-accent/40 hover:bg-accent/5 transition-colors"
                  >
                    <span className="font-body font-semibold text-foreground group-hover:text-accent transition-colors">
                      {c.name}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
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

export default CategoriesPage;
