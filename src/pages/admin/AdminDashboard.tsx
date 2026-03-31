import { useBrands, useProducts, useCategories, useContactSubmissions } from "@/lib/api";
import { Box, Tag, Layers, Star, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const StatCard = ({ icon: Icon, label, value, to }: { icon: any; label: string; value: number | undefined; to: string }) => (
  <Link to={to} className="rounded-lg border border-border bg-card p-6 space-y-2 hover:border-primary/30 transition-colors group">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-forest-deep/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-forest-mid" />
      </div>
      <span className="font-body text-sm text-muted-foreground">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <p className="font-display text-3xl font-bold text-foreground">{value ?? "—"}</p>
      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </Link>
);

const AdminDashboard = () => {
  const { data: brands } = useBrands();
  const { data: products } = useProducts();
  const { data: categories } = useCategories();
  const { data: submissions } = useContactSubmissions();
  const featured = products?.filter((p) => p.featured).length;

  const recentSubmissions = submissions?.slice(0, 5) ?? [];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Tag} label="Brands" value={brands?.length} to="/admin/brands" />
        <StatCard icon={Box} label="Products" value={products?.length} to="/admin/products" />
        <StatCard icon={Star} label="Featured" value={featured} to="/admin/featured" />
        <StatCard icon={Layers} label="Categories" value={categories?.length} to="/admin/categories" />
        <StatCard icon={MessageSquare} label="Submissions" value={submissions?.length} to="/admin/submissions" />
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">Recent Submissions</h2>
          <Link to="/admin/submissions" className="font-body text-sm text-primary hover:underline">View all</Link>
        </div>
        {recentSubmissions.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">No submissions yet.</p>
        ) : (
          <div className="space-y-3">
            {recentSubmissions.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-body text-sm font-medium">{s.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{s.subject}</p>
                </div>
                <span className="font-body text-xs text-muted-foreground">{format(new Date(s.created_at), "MMM d")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
