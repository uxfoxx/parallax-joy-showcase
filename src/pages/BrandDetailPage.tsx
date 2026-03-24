import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import { getBrandBySlug, getProductsByBrand } from "@/data/products";

const BrandDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const brand = getBrandBySlug(slug || "");
  const brandProducts = getProductsByBrand(slug || "");

  if (!brand) {
    return (
      <PageLayout>
        <div className="py-40 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Brand Not Found</h1>
          <Link to="/brands" className="font-body text-forest-mid hover:underline">
            ← Back to Brands
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-deep py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-deep via-forest-mid/20 to-forest-deep" />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm font-body text-primary-foreground/50 mb-8"
          >
            <Link to="/" className="hover:text-primary-foreground/80 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/brands" className="hover:text-primary-foreground/80 transition-colors">Brands</Link>
            <span>/</span>
            <span className="text-primary-foreground/80">{brand.name}</span>
          </motion.div>

          <div className="flex items-start gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 rounded-2xl bg-forest-mid/30 flex items-center justify-center shrink-0"
            >
              <span className="font-display text-3xl font-bold text-primary-foreground">
                {brand.name.charAt(0)}
              </span>
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4"
              >
                {brand.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-body text-primary-foreground/60 text-lg max-w-2xl"
              >
                {brand.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex items-center gap-6 mt-6 text-sm font-body text-primary-foreground/50"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {brand.origin}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Est. {brand.established}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Products by {brand.name}
            </h2>
            <Link
              to="/brands"
              className="flex items-center gap-2 text-sm font-body text-forest-mid hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> All Brands
            </Link>
          </div>

          {brandProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {brandProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="font-body text-muted-foreground text-center py-16">
              No products available for this brand yet.
            </p>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default BrandDetailPage;
