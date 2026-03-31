import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, MessageCircle } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import { useBrand, useProducts } from "@/lib/api";

const BrandDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: brand, isLoading } = useBrand(slug || "");
  const { data: allProducts = [] } = useProducts();
  const brandProducts = brand ? allProducts.filter((p) => p.brand_id === brand.id) : [];

  if (isLoading) return <PageLayout><div className="py-40 text-center font-body text-muted-foreground">Loading...</div></PageLayout>;

  if (!brand) {
    return (
      <PageLayout>
        <div className="py-40 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Brand Not Found</h1>
          <Link to="/brands" className="font-body text-forest-mid hover:underline">← Back to Brands</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"><svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg"><filter id="noiseBD"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#noiseBD)" /></svg></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm font-body text-primary-foreground/50 mb-8">
            <Link to="/" className="hover:text-primary-foreground/80 transition-colors">Home</Link><span>/</span>
            <Link to="/brands" className="hover:text-primary-foreground/80 transition-colors">Brands</Link><span>/</span>
            <span className="text-primary-foreground/80">{brand.name}</span>
          </motion.div>
          <div className="flex items-start gap-6">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <span className="font-display text-3xl font-bold text-primary-foreground">{brand.name.charAt(0)}</span>
            </motion.div>
            <div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">{brand.name}</motion.h1>
              <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="font-body text-primary-foreground/60 text-lg max-w-2xl">{brand.description}</motion.p>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex items-center gap-6 mt-6 text-sm font-body text-primary-foreground/50">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {brand.origin}</span>
                {brand.established && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Est. {brand.established}</span>}
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-6">
                <Link
                  to={`/contact?subject=Brand+Inquiry&brand=${encodeURIComponent(brand.name)}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground text-forest-deep px-6 h-11 text-sm font-body font-semibold hover:bg-primary-foreground/90 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Inquire About This Brand
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-background/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Products by {brand.name}</h2>
            <Link to="/brands" className="flex items-center gap-2 text-sm font-body text-forest-mid hover:underline"><ArrowLeft className="w-4 h-4" /> All Brands</Link>
          </div>
          {brandProducts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-5">{brandProducts.map((product) => <ProductCard key={product.id} product={product} large />)}</div>
          ) : (
            <p className="font-body text-muted-foreground text-center py-16">No products available for this brand yet.</p>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default BrandDetailPage;
