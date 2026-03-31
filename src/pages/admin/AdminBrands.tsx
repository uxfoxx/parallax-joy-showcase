import { useState } from "react";
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand, type Brand } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

const emptyBrand = { name: "", slug: "", description: "", origin: "", established: undefined as number | undefined, image_url: "" };

const AdminBrands = () => {
  const { data: brands, isLoading } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form, setForm] = useState(emptyBrand);

  const filtered = brands?.filter((b) => b.name.toLowerCase().includes(search.toLowerCase())) ?? [];

  const openCreate = () => { setEditing(null); setForm(emptyBrand); setOpen(true); };
  const openEdit = (b: Brand) => { setEditing(b); setForm({ name: b.name, slug: b.slug, description: b.description, origin: b.origin, established: b.established ?? undefined, image_url: b.image_url ?? "" }); setOpen(true); };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateBrand.mutateAsync({ id: editing.id, ...form });
        toast.success("Brand updated");
      } else {
        await createBrand.mutateAsync({ ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-") });
        toast.success("Brand created");
      }
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBrand.mutateAsync(id);
      toast.success("Brand deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Brands</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2 font-body"><Plus className="w-4 h-4" /> Add Brand</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit Brand" : "New Brand"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label className="font-body">Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="font-body" /></div>
              <div><Label className="font-body">Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className="font-body" /></div>
              <div><Label className="font-body">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="font-body" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-body">Origin</Label><Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className="font-body" /></div>
                <div><Label className="font-body">Established</Label><Input type="number" value={form.established ?? ""} onChange={(e) => setForm({ ...form, established: e.target.value ? Number(e.target.value) : undefined })} className="font-body" /></div>
              </div>
              <Button onClick={handleSave} className="w-full font-body">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search brands..." className="pl-10 font-body" />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Name</TableHead>
              <TableHead className="font-body">Origin</TableHead>
              <TableHead className="font-body">Est.</TableHead>
              <TableHead className="font-body w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center font-body text-muted-foreground py-10">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center font-body text-muted-foreground py-10">No brands found</TableCell></TableRow>
            ) : (
              filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-body font-medium">{b.name}</TableCell>
                  <TableCell className="font-body text-muted-foreground">{b.origin}</TableCell>
                  <TableCell className="font-body text-muted-foreground">{b.established ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="w-4 h-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete {b.name}?</AlertDialogTitle><AlertDialogDescription>This will also delete all products under this brand.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(b.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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

export default AdminBrands;
