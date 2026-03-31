import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useBrands, useProducts } from "@/lib/api";

const BrandsPage = () => {
  const { data: brands = [], isLoading } = useBrands();
  const { data: products = [] } = useProducts();

  return (
    <PageLayout>
      <section className="bg-background border-b border-border/40 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-tight uppercase">
            Our Brands
          </h1>
          <p className="font-body text-muted-foreground mt-3 max-w-lg">
            We partner with world-class producers to bring you the finest food products from around the globe.
          </p>
        </div>
      </section>

      <section className="bg-background py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {isLoading ? (
            <p className="text-center font-body text-muted-foreground py-20">Loading brands...</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-border/40">
              {brands.map((brand) => {
                const prodCount = products.filter((p) => p.brand_id === brand.id).length;
                return (
                  <Link key={brand.id} to={`/brands/${brand.slug}`} className="block group bg-background">
                    <div className="border-0">
                      {/* Image */}
                      <div className="aspect-[4/3] overflow-hidden bg-[hsl(35,25%,93%)]">
                        {brand.image_url ? (
                          <img
                            src={brand.image_url}
                            alt={brand.name}
                            className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-display text-4xl font-bold text-muted-foreground/20">{brand.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      {/* Details */}
                      <div className="px-5 py-4">
                        <h3 className="font-body text-sm tracking-wide uppercase text-foreground">
                          {brand.name}
                        </h3>
                        <p className="font-body text-[11px] text-muted-foreground mt-1 line-clamp-2">
                          {brand.description}
                        </p>
                        <div className="flex items-center justify-between mt-3 text-[11px] font-body text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {brand.origin}
                          </span>
                          <span>{prodCount} product{prodCount !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default BrandsPage;
