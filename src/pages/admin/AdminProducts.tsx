import { useRef, useState } from "react";
import { useProducts, useBrands, useCategories, useCreateProduct, useUpdateProduct, useDeleteProduct, useProductImages, useAddProductImage, useDeleteProductImage, type Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { uploadImage } from "@/lib/upload";
import XlsxSyncBar from "@/components/admin/XlsxSyncBar";
import { parseBool, parseCommaList, type SheetColumn } from "@/lib/xlsxSheet";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const emptyForm = { name: "", slug: "", brand_id: "", category: "", description: "", featured: false, our_product: false, premium: false, tags: "" as string, origin: "", sku: "", image_url: "" };

const ProductImagesManager = ({ productId }: { productId: string }) => {
  const { data: images = [] } = useProductImages(productId);
  const addImage = useAddProductImage();
  const deleteImage = useDeleteProductImage();
  const [newUrl, setNewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAddUrl = async () => {
    if (!newUrl.trim()) return;
    try {
      await addImage.mutateAsync({ product_id: productId, image_url: newUrl.trim(), sort_order: images.length });
      setNewUrl("");
      toast.success("Image added");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handlePickFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      let sort = images.length;
      for (const file of Array.from(files)) {
        const url = await uploadImage(file, `product-gallery/${productId}`);
        await addImage.mutateAsync({ product_id: productId, image_url: url, sort_order: sort++ });
      }
      toast.success(files.length === 1 ? "Image added" : `${files.length} images added`);
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    try {
      await deleteImage.mutateAsync({ id: imageId, product_id: productId });
      toast.success("Image removed");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="font-body">Additional Images</Label>
      <p className="font-body text-xs text-muted-foreground -mt-1">
        Shown in the product-detail gallery. Upload multiple at once.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={(e) => {
          handlePickFiles(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="gap-1 shrink-0"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          {uploading ? "Uploading…" : "Upload files"}
        </Button>
        <div className="flex gap-2 flex-1 min-w-[240px]">
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="…or paste an external URL"
            className="font-body flex-1"
          />
          <Button type="button" size="sm" variant="outline" onClick={handleAddUrl} className="shrink-0">
            Add URL
          </Button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              <img src={img.image_url} alt="" className="h-16 w-full object-cover rounded-md border border-border" />
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

type ProductRow = {
  sku: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  origin: string;
  tags: string | string[];
  featured: boolean;
  our_product: boolean;
  premium: boolean;
  image_url: string;
};

const productColumns: SheetColumn<keyof ProductRow & string>[] = [
  { key: "sku",         header: "SKU",         sample: "OLV-001" },
  { key: "name",        header: "Name",        sample: "Extra Virgin Olive Oil 500ml" },
  { key: "slug",        header: "Slug",        sample: "extra-virgin-olive-oil-500ml" },
  { key: "brand",       header: "Brand",       sample: "Olive Foods" },
  { key: "category",    header: "Category",    sample: "Oil" },
  { key: "description", header: "Description", sample: "Cold-pressed olive oil…" },
  { key: "origin",      header: "Origin",      sample: "Italy" },
  { key: "tags",        header: "Tags",        sample: "organic, premium", parse: parseCommaList },
  { key: "featured",    header: "Featured",    sample: "no",  parse: parseBool },
  { key: "our_product", header: "Our Product", sample: "no",  parse: parseBool },
  { key: "premium",     header: "Premium",     sample: "no",  parse: parseBool },
  { key: "image_url",   header: "Image URL",   sample: "https://…/image.jpg" },
];

const AdminProducts = () => {
  const { data: products, isLoading } = useProducts();
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = products?.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())) ?? [];

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, slug: p.slug, brand_id: p.brand_id, category: p.category, description: p.description, featured: p.featured, our_product: (p as any).our_product ?? false, premium: (p as any).premium ?? false, tags: (p.tags ?? []).join(", "), origin: p.origin, sku: p.sku, image_url: p.image_url ?? "" });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload: any = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        brand_id: form.brand_id,
        category: form.category,
        description: form.description,
        featured: form.featured,
        our_product: form.our_product,
        premium: form.premium,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        origin: form.origin,
        sku: form.sku,
        image_url: form.image_url || null,
      };
      if (editing) {
        await updateProduct.mutateAsync({ id: editing.id, ...payload });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync(payload);
        toast.success("Product created");
      }
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Build export rows from current products (brand shown by name, not id).
  const currentRows: Record<keyof ProductRow & string, unknown>[] = (products ?? []).map((p) => ({
    sku: p.sku ?? "",
    name: p.name,
    slug: p.slug,
    brand: p.brands?.name ?? "",
    category: p.category,
    description: (p.description ?? "").replace(/<[^>]+>/g, "").trim(), // strip HTML for readability
    origin: p.origin ?? "",
    tags: (p.tags ?? []).join(", "),
    featured: p.featured ? "yes" : "no",
    our_product: (p as any).our_product ? "yes" : "no",
    premium: (p as any).premium ? "yes" : "no",
    image_url: p.image_url ?? "",
  }));

  const handleXlsxUpload = async (rows: Record<string, unknown>[]) => {
    const brandByName = new Map<string, string>();
    (brands ?? []).forEach((b) => brandByName.set(b.name.trim().toLowerCase(), b.id));
    const existingBySku = new Map<string, string>();
    (products ?? []).forEach((p) => {
      if (p.sku) existingBySku.set(String(p.sku).trim().toLowerCase(), p.id);
    });

    let created = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] as Partial<ProductRow>;
      const rowLabel = `Row ${i + 2}`; // +2 = 1 for header + 1 for 1-indexing
      const sku = String(row.sku ?? "").trim();
      const name = String(row.name ?? "").trim();
      const brandName = String(row.brand ?? "").trim();

      if (!sku) {
        skipped++;
        errors.push(`${rowLabel}: missing SKU — skipped.`);
        continue;
      }
      if (!name) {
        skipped++;
        errors.push(`${rowLabel} (${sku}): missing Name — skipped.`);
        continue;
      }
      const brand_id = brandByName.get(brandName.toLowerCase());
      if (!brand_id) {
        skipped++;
        errors.push(
          `${rowLabel} (${sku}): brand "${brandName || "—"}" not found. Add the brand first on the Brands page.`,
        );
        continue;
      }

      const slug = String(row.slug ?? "").trim() || name.toLowerCase().replace(/\s+/g, "-");
      const tags = Array.isArray(row.tags)
        ? (row.tags as string[])
        : parseCommaList(row.tags);
      const payload: any = {
        sku,
        name,
        slug,
        brand_id,
        category: String(row.category ?? "").trim(),
        description: String(row.description ?? "") || "",
        origin: String(row.origin ?? "").trim(),
        tags,
        featured: !!row.featured,
        our_product: !!row.our_product,
        premium: !!row.premium,
        image_url: String(row.image_url ?? "").trim() || null,
      };

      const existingId = existingBySku.get(sku.toLowerCase());
      try {
        if (existingId) {
          const { error } = await supabase.from("products").update(payload).eq("id", existingId);
          if (error) throw error;
          updated++;
        } else {
          const { error } = await supabase.from("products").insert(payload);
          if (error) throw error;
          created++;
        }
      } catch (err: any) {
        skipped++;
        errors.push(`${rowLabel} (${sku}): ${err.message ?? "save failed"}`);
      }
    }

    qc.invalidateQueries({ queryKey: ["products"] });
    return { created, updated, skipped, errors };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2 font-body"><Plus className="w-4 h-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label className="font-body">Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="font-body" /></div>
              <div><Label className="font-body">Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className="font-body" /></div>
              <div>
                <Label className="font-body">Brand</Label>
                <Select value={form.brand_id} onValueChange={(v) => setForm({ ...form, brand_id: v })}>
                  <SelectTrigger className="font-body"><SelectValue placeholder="Select brand" /></SelectTrigger>
                  <SelectContent>{brands?.map((b) => <SelectItem key={b.id} value={b.id} className="font-body">{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-body">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="font-body"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories?.map((c) => <SelectItem key={c.id} value={c.name} className="font-body">{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="font-body">Description</Label><RichTextEditor value={form.description} onChange={(html) => setForm({ ...form, description: html })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-body">Origin</Label><Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className="font-body" /></div>
                <div><Label className="font-body">SKU</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="font-body" /></div>
              </div>
              <ImageUploadField
                label="Main Image"
                hint="Primary image shown in product listings, cards, and the product detail hero."
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                folder="product-images"
                previewClassName="h-20 w-20"
              />
              
              {/* Multi-image manager only shown when editing */}
              {editing && <ProductImagesManager productId={editing.id} />}

              <div><Label className="font-body">Tags (comma separated)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="font-body" placeholder="organic, premium" /></div>
              <div className="flex items-center gap-3">
                <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                <Label className="font-body">Featured product (max 3)</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.our_product} onCheckedChange={(v) => setForm({ ...form, our_product: v })} />
                <Label className="font-body">Our Product (curated selection)</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.premium} onCheckedChange={(v) => setForm({ ...form, premium: v })} />
                <Label className="font-body">Premium (appears on the /premium page)</Label>
              </div>
              <p className="text-xs text-muted-foreground font-body -mt-2 ml-11">
                Premium products show on the dedicated Premium page AND in the main Products catalogue. Add tag "seasonal" to also feature in the Seasonal Rail.
              </p>
              <Button onClick={handleSave} className="w-full font-body">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <XlsxSyncBar
        templateFilename="products.xlsx"
        columns={productColumns}
        currentRows={currentRows}
        onUpload={handleXlsxUpload}
        description="Download to edit all products in Excel, then upload to apply changes. Rows match by SKU — unknown SKUs create new products. Brand must already exist (add brands on the Brands page)."
        downloadLabel={products && products.length > 0 ? "Download products" : "Download sample"}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-10 font-body" />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body w-14">Image</TableHead>
              <TableHead className="font-body">Name</TableHead>
              <TableHead className="font-body">Brand</TableHead>
              <TableHead className="font-body">Category</TableHead>
              <TableHead className="font-body">Featured</TableHead>
              <TableHead className="font-body">Our Product</TableHead>
              <TableHead className="font-body">Premium</TableHead>
              <TableHead className="font-body w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="text-center font-body text-muted-foreground py-10">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center font-body text-muted-foreground py-10">No products found</TableCell></TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.image_url ? <img src={p.image_url} alt={p.name} className="h-10 w-10 rounded-md object-cover" /> : <div className="h-10 w-10 rounded-md bg-muted" />}</TableCell>
                  <TableCell className="font-body font-medium">{p.name}</TableCell>
                  <TableCell className="font-body text-muted-foreground">{p.brands?.name ?? "—"}</TableCell>
                  <TableCell><Badge variant="outline" className="font-body text-xs">{p.category}</Badge></TableCell>
                  <TableCell>{p.featured ? <Badge className="bg-accent text-white font-body text-xs">Yes</Badge> : <span className="font-body text-muted-foreground text-xs">No</span>}</TableCell>
                  <TableCell>{(p as any).our_product ? <Badge className="bg-forest-deep text-white font-body text-xs">Yes</Badge> : <span className="font-body text-muted-foreground text-xs">No</span>}</TableCell>
                  <TableCell>{(p as any).premium ? <Badge className="bg-accent text-white font-body text-xs">Yes</Badge> : <span className="font-body text-muted-foreground text-xs">No</span>}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete {p.name}?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(p.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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

export default AdminProducts;
