import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Seo, { SITE_URL } from "@/components/Seo";
import PageLayout from "@/components/PageLayout";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import { useCategories, useProducts } from "@/lib/api";
import { categorySlug, categoryFromSlug, categorySeo } from "@/lib/categories";

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
  if (!name) return <Navigate to="/products" replace />;

  const category = categories.find((c) => c.name === name);
  const seo = categorySeo(name);
  const intro = category?.description?.trim() || seo.intro;
  const path = `/categories/${slug}`;

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
  ];

  return (
    <PageLayout>
      <Seo title={`${seo.title} | Olive Foods`} description={seo.description} path={path} schema={schema} />
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

            {prodLoading ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[4/5]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3"
              >
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} columns={4} />
                ))}
              </motion.div>
            ) : (
              <p className="font-body text-muted-foreground py-16 text-center">
                No {name.toLowerCase()} listed right now.{" "}
                <Link to="/contact" className="text-accent hover:underline">Ask us to source it</Link>.
              </p>
            )}

            <div className="mt-14 max-w-3xl">
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                {name} for Sri Lanka&apos;s hotels, restaurants &amp; retail
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                Olive Foods imports {name.toLowerCase()} and distributes it island-wide to hotels,
                restaurants, cafés, catering operations and supermarkets across Sri Lanka. Need a{" "}
                {name.toLowerCase()} line we don&apos;t list yet? Our sourcing team will bring it in
                through our supplier network.{" "}
                <Link to="/contact" className="text-accent hover:underline">Talk to us</Link>.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default CategoryPage;
