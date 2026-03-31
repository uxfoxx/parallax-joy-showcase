import PageLayout from "@/components/PageLayout";
import ProductCard from "@/components/ProductCard";
import { useFeaturedProducts } from "@/lib/api";

const FeaturedPage = () => {
  const { data: featured = [], isLoading } = useFeaturedProducts();

  return (
    <PageLayout>
      <section className="bg-background border-b border-border/40 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-tight uppercase">
            Featured Products
          </h1>
          <p className="font-body text-muted-foreground mt-3 max-w-lg">
            Our handpicked selection of standout products — chosen for exceptional quality, unique origin, and outstanding taste.
          </p>
        </div>
      </section>

      <section className="bg-background py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {isLoading ? (
            <p className="text-center font-body text-muted-foreground py-20">Loading featured products...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border/40">
              {featured.map((product) => (
                <div key={product.id} className="bg-background">
                  <ProductCard product={product} large />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default FeaturedPage;
