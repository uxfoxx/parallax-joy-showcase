import { useRef, useState, useEffect } from "react";
import { useProducts, useBrands, useCategories, useCreateProduct, useUpdateProduct, useDeleteProduct, useProductImages, useAddProductImage, useDeleteProductImage, type Product } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, ImagePlus, X, Loader2, Crop } from "lucide-react";
import { toast } from "sonner";
import ImageUploadField from "@/components/admin/ImageUploadField";
import ImageCropDialog from "@/components/admin/ImageCropDialog";
import BatchCropDialog from "@/components/admin/BatchCropDialog";
import { cdnImg } from "@/lib/img";
import { uploadImage } from "@/lib/upload";
import PaginationControls from "@/components/PaginationControls";
import XlsxSyncBar from "@/components/admin/XlsxSyncBar";
import { parseBool, parseCommaList, type SheetColumn } from "@/lib/xlsxSheet";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const emptyForm = { name: "", slug: "", brand_id: "", categories: [] as string[], description: "", featured: false, our_product: false, premium: false, tags: "" as string, origin: "", sku: "", image_url: "" };

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

/* Public-style product card with admin actions (edit / crop / delete). */
const AdminProductCard = ({
  p,
  onEdit,
  onCrop,
  onDelete,
}: {
  p: Product;
  onEdit: () => void;
  onCrop: () => void;
  onDelete: () => void;
}) => (
  <div className="group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
    <button type="button" onClick={onEdit} className="relative block aspect-[4/5] w-full bg-white text-left">
      {p.image_url ? (
        <img
          src={cdnImg(p.image_url, 600)}
          alt={p.name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-scale-down p-2"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/40">
          <ImagePlus className="h-8 w-8 text-muted-foreground/40" />
        </div>
      )}
      <div className="absolute left-2 top-2 flex flex-col gap-1">
        {p.featured && <Badge className="h-4 border-0 bg-accent px-1.5 py-0 text-[9px] text-white">Featured</Badge>}
        {(p as any).our_product && <Badge className="h-4 border-0 bg-forest-deep px-1.5 py-0 text-[9px] text-white">Our</Badge>}
        {(p as any).premium && <Badge className="h-4 border-0 bg-accent/80 px-1.5 py-0 text-[9px] text-white">Premium</Badge>}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2 pt-6">
        <p className="font-body text-xs font-semibold leading-snug text-white line-clamp-2">{p.name}</p>
        <p className="font-body text-[10px] text-white/70 line-clamp-1">{p.brands?.name ?? p.category}</p>
      </div>
    </button>

    <div className="flex items-center gap-1 border-t border-border bg-card px-2 py-1.5">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-md font-body text-xs text-muted-foreground transition-colors hover:bg-accent/5 hover:text-accent"
      >
        <Pencil className="h-3.5 w-3.5" /> Edit
      </button>
      <button
        type="button"
        onClick={onCrop}
        disabled={!p.image_url}
        className="inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-md font-body text-xs text-muted-foreground transition-colors hover:bg-accent/5 hover:text-accent disabled:opacity-40"
      >
        <Crop className="h-3.5 w-3.5" /> Crop
      </button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10"
            aria-label={`Delete ${p.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {p.name}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
);

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
  const [imagePopupUrl, setImagePopupUrl] = useState<string | null>(null);
  const [cropProduct, setCropProduct] = useState<Product | null>(null);
  const [batchOpen, setBatchOpen] = useState(false);

  const filtered = products?.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())) ?? [];
  const withImages = (products ?? []).filter((p) => p.image_url);

  // ── Client-side pagination ──
  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  // Snap back to a valid page when the filtered set shrinks (search/delete).
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
  // Reset to page 1 whenever the search term changes.
  useEffect(() => { setPage(1); }, [search]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    const cats = (p as any).categories?.length ? (p as any).categories : p.category ? [p.category] : [];
    setForm({ name: p.name, slug: p.slug, brand_id: p.brand_id, categories: cats, description: p.description, featured: p.featured, our_product: (p as any).our_product ?? false, premium: (p as any).premium ?? false, tags: (p.tags ?? []).join(", "), origin: p.origin, sku: p.sku, image_url: p.image_url ?? "" });
    setOpen(true);
  };

  const toggleFormCategory = (name: string) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(name) ? f.categories.filter((c) => c !== name) : [...f.categories, name],
    }));
  };

  const handleSave = async () => {
    try {
      const payload: any = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
        brand_id: form.brand_id,
        category: form.categories[0] ?? "",
        categories: form.categories,
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

  const handleCardCrop = async (id: string, url: string) => {
    try {
      await updateProduct.mutateAsync({ id, image_url: url } as any);
    } catch (err: any) {
      toast.error(err.message ?? "Could not update the image.");
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
        errors.push(`${rowLabel}: missing SKU, skipped.`);
        continue;
      }
      if (!name) {
        skipped++;
        errors.push(`${rowLabel} (${sku}): missing Name, skipped.`);
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setBatchOpen(true)}
            disabled={withImages.length === 0}
            className="gap-2 font-body"
          >
            <Crop className="w-4 h-4" /> Crop all{withImages.length ? ` (${withImages.length})` : ""}
          </Button>
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
                <Label className="font-body">Categories (select one or more)</Label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {categories?.map((c) => {
                    const active = form.categories.includes(c.name);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleFormCategory(c.name)}
                        className={`font-body text-xs px-2.5 h-7 rounded-full border transition-colors ${
                          active
                            ? "border-accent bg-accent text-white"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
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
                <Label className="font-body">Premium (product attribute)</Label>
              </div>
              <p className="text-xs text-muted-foreground font-body -mt-2 ml-11">
                Mark products as premium for internal tracking. Add tag "seasonal" to feature in the Seasonal Rail.
              </p>
              <Button onClick={handleSave} className="w-full font-body">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <XlsxSyncBar
        templateFilename="products.xlsx"
        columns={productColumns}
        currentRows={currentRows}
        onUpload={handleXlsxUpload}
        description="Download to edit all products in Excel, then upload to apply changes. Rows match by SKU. Unknown SKUs create new products. Brand must already exist (add brands on the Brands page)."
        downloadLabel={products && products.length > 0 ? "Download products" : "Download sample"}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-10 font-body" />
      </div>

      {isLoading ? (
        <p className="text-center font-body text-muted-foreground py-16">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-center font-body text-muted-foreground py-16">No products found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {paginated.map((p) => (
            <AdminProductCard
              key={p.id}
              p={p}
              onEdit={() => openEdit(p)}
              onCrop={() => setCropProduct(p)}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination + count */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <p className="font-body text-xs text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <Dialog open={!!imagePopupUrl} onOpenChange={(open) => !open && setImagePopupUrl(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 border-0">
          <button
            onClick={() => setImagePopupUrl(null)}
            className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label="Close image"
          >
            <X className="w-4 h-4" />
          </button>
          {imagePopupUrl && (
            <img src={imagePopupUrl} alt="Product" className="w-full h-full object-contain rounded-lg" />
          )}
        </DialogContent>
      </Dialog>

      {/* Per-card crop */}
      <ImageCropDialog
        src={cropProduct?.image_url ?? null}
        open={!!cropProduct}
        onOpenChange={(o) => { if (!o) setCropProduct(null); }}
        folder="product-images"
        defaultAspect={4 / 5}
        onCropped={(url) => { if (cropProduct) handleCardCrop(cropProduct.id, url); }}
      />

      {/* Batch "Crop all" — sequential */}
      <BatchCropDialog
        products={withImages.map((p) => ({ id: p.id, name: p.name, image_url: p.image_url as string }))}
        folder="product-images"
        open={batchOpen}
        onOpenChange={setBatchOpen}
        onDone={() => qc.invalidateQueries({ queryKey: ["products"] })}
      />
    </div>
  );
};

export default AdminProducts;
