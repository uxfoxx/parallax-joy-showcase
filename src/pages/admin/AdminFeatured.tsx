import { useFeaturedProducts, useOurProducts, useUpdateProduct, type Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Package, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const AdminFeatured = () => {
  const { data: featured, isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: ourProducts, isLoading: loadingOur } = useOurProducts();
  const updateProduct = useUpdateProduct();
  const qc = useQueryClient();

  const handleUnfeature = async (p: Product) => {
    try {
      await updateProduct.mutateAsync({ id: p.id, featured: false });
      toast.success(`${p.name} removed from featured`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRemoveOurProduct = async (p: Product) => {
    try {
      await (supabase.from("products").update({ our_product: false } as any).eq("id", p.id) as any);
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(`${p.name} removed from Our Products`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const renderTable = (products: Product[] | undefined, isLoading: boolean, onRemove: (p: Product) => void, emptyMsg: string) => (
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
            <TableRow><TableCell colSpan={5} className="text-center font-body text-muted-foreground py-10">{emptyMsg}</TableCell></TableRow>
          ) : (
            products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.image_url ? <img src={p.image_url} alt={p.name} className="h-10 w-10 rounded-md object-cover" /> : <div className="h-10 w-10 rounded-md bg-muted" />}</TableCell>
                <TableCell className="font-body font-medium">{p.name}</TableCell>
                <TableCell className="font-body text-muted-foreground">{p.brands?.name ?? "—"}</TableCell>
                <TableCell><Badge variant="outline" className="font-body text-xs">{p.category}</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="gap-1 font-body text-xs" onClick={() => onRemove(p)}>
                      Remove
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
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Product Showcase</h1>

      <Tabs defaultValue="featured" className="space-y-4">
        <TabsList className="font-body">
          <TabsTrigger value="featured" className="gap-2"><Star className="w-4 h-4" /> Featured ({featured?.length ?? 0}/3)</TabsTrigger>
          <TabsTrigger value="our" className="gap-2"><Package className="w-4 h-4" /> Our Products ({ourProducts?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-4">
          <p className="font-body text-sm text-muted-foreground">
            Up to 3 products shown in the "Featured Products" section on the landing page. Toggle from the Products page.
          </p>
          {(featured?.length ?? 0) >= 3 && (
            <Badge variant="destructive" className="font-body">Max 3 featured products reached</Badge>
          )}
          {renderTable(featured, loadingFeatured, handleUnfeature, "No featured products. Mark up to 3 products as featured from the Products page.")}
        </TabsContent>

        <TabsContent value="our" className="space-y-4">
          <p className="font-body text-sm text-muted-foreground">
            Products shown in the "Our Products" section on the landing page. Toggle from the Products page.
          </p>
          {renderTable(ourProducts, loadingOur, handleRemoveOurProduct, "No products marked as 'Our Product'. Toggle from the Products page.")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFeatured;
