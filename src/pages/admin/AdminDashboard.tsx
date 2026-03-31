import { useBrands, useProducts, useCategories } from "@/lib/api";
import { Box, Tag, Layers, Star } from "lucide-react";

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: number | undefined }) => (
  <div className="rounded-lg border border-border bg-card p-6 space-y-2">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-forest-deep/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-forest-mid" />
      </div>
      <span className="font-body text-sm text-muted-foreground">{label}</span>
    </div>
    <p className="font-display text-3xl font-bold text-foreground">{value ?? "—"}</p>
  </div>
);

const AdminDashboard = () => {
  const { data: brands } = useBrands();
  const { data: products } = useProducts();
  const { data: categories } = useCategories();
  const featured = products?.filter((p) => p.featured).length;

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Tag} label="Brands" value={brands?.length} />
        <StatCard icon={Box} label="Products" value={products?.length} />
        <StatCard icon={Star} label="Featured" value={featured} />
        <StatCard icon={Layers} label="Categories" value={categories?.length} />
      </div>
    </div>
  );
};

export default AdminDashboard;
