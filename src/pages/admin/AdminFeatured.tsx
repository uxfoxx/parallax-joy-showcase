import { useFeaturedProducts, useUpdateProduct, type Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminFeatured = () => {
  const { data: products, isLoading } = useFeaturedProducts();
  const updateProduct = useUpdateProduct();

  const handleUnfeature = async (p: Product) => {
    try {
      await updateProduct.mutateAsync({ id: p.id, featured: false });
      toast.success(`${p.name} removed from featured`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Featured Products</h1>
        <Badge variant="outline" className="font-body">{products?.length ?? 0} featured</Badge>
      </div>

      <p className="font-body text-sm text-muted-foreground">
        Manage which products appear in the Featured section on the landing page. Toggle featured status from the Products page.
      </p>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body w-14">Image</TableHead>
              <TableHead className="font-body">Name</TableHead>
              <TableHead className="font-body">Brand</TableHead>
              <TableHead className="font-body">Category</TableHead>
              <TableHead className="font-body w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center font-body text-muted-foreground py-10">Loading...</TableCell></TableRow>
            ) : !products?.length ? (
              <TableRow><TableCell colSpan={5} className="text-center font-body text-muted-foreground py-10">No featured products yet. Mark products as featured from the Products page.</TableCell></TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.image_url ? <img src={p.image_url} alt={p.name} className="h-10 w-10 rounded-md object-cover" /> : <div className="h-10 w-10 rounded-md bg-muted" />}</TableCell>
                  <TableCell className="font-body font-medium">{p.name}</TableCell>
                  <TableCell className="font-body text-muted-foreground">{p.brands?.name ?? "—"}</TableCell>
                  <TableCell><Badge variant="outline" className="font-body text-xs">{p.category}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="gap-1 font-body text-xs" onClick={() => handleUnfeature(p)}>
                        <Star className="w-3 h-3" /> Unfeature
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/products/${p.slug}`}><ExternalLink className="w-4 h-4" /></Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminFeatured;
