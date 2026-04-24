import { useState } from "react";
import {
  usePartnerLogos,
  useCreatePartnerLogo,
  useUpdatePartnerLogo,
  useDeletePartnerLogo,
  useReorderPartnerLogos,
  type PartnerLogo,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import ImageUploadField from "@/components/admin/ImageUploadField";
import XlsxSyncBar from "@/components/admin/XlsxSyncBar";
import { parseBool, type SheetColumn } from "@/lib/xlsxSheet";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

type PartnerRow = {
  name: string;
  image_url: string;
  link_url: string;
  display_order: number | string;
  active: boolean;
};

const partnerColumns: SheetColumn<keyof PartnerRow & string>[] = [
  { key: "name",          header: "Name",          sample: "Acme Estate" },
  { key: "image_url",     header: "Image URL",     sample: "https://…/logo.svg" },
  { key: "link_url",      header: "Link URL",      sample: "https://acme.example" },
  { key: "display_order", header: "Order",         sample: 1 },
  { key: "active",        header: "Active",        sample: "yes", parse: parseBool },
];

type FormState = {
  name: string;
  image_url: string;
  link_url: string;
  active: boolean;
};

const emptyForm: FormState = { name: "", image_url: "", link_url: "", active: true };

const AdminPartners = () => {
  const { data: logos = [], isLoading } = usePartnerLogos();
  const createLogo = useCreatePartnerLogo();
  const updateLogo = useUpdatePartnerLogo();
  const deleteLogo = useDeletePartnerLogo();
  const reorder = useReorderPartnerLogos();
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PartnerLogo | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (logo: PartnerLogo) => {
    setEditing(logo);
    setForm({
      name: logo.name,
      image_url: logo.image_url,
      link_url: logo.link_url ?? "",
      active: logo.active,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.image_url) return toast.error("Logo image is required");
    try {
      if (editing) {
        await updateLogo.mutateAsync({
          id: editing.id,
          name: form.name.trim(),
          image_url: form.image_url,
          link_url: form.link_url.trim() || null,
          active: form.active,
        });
        toast.success("Partner logo updated");
      } else {
        await createLogo.mutateAsync({
          name: form.name.trim(),
          image_url: form.image_url,
          link_url: form.link_url.trim() || null,
          active: form.active,
          display_order: logos.length, // append at end
        });
        toast.success("Partner logo added");
      }
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message ?? "Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLogo.mutateAsync(id);
      toast.success("Partner logo deleted");
    } catch (err: any) {
      toast.error(err.message ?? "Delete failed");
    }
  };

  const handleToggleActive = async (logo: PartnerLogo) => {
    try {
      await updateLogo.mutateAsync({ id: logo.id, active: !logo.active });
    } catch (err: any) {
      toast.error(err.message ?? "Update failed");
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const next = index + direction;
    if (next < 0 || next >= logos.length) return;
    const ordered = [...logos];
    [ordered[index], ordered[next]] = [ordered[next], ordered[index]];
    try {
      await reorder.mutateAsync(ordered.map((l) => l.id));
    } catch (err: any) {
      toast.error(err.message ?? "Reorder failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Partner Logos</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Curated logos shown in the landing page "Our Brand Partners" marquee. Order and active state here control what appears.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2 font-body">
              <Plus className="w-4 h-4" /> Add Logo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{editing ? "Edit Partner Logo" : "New Partner Logo"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="font-body">Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Acme Estate"
                  className="font-body"
                />
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Used for the image alt text and aria-label. Not displayed on the marquee.
                </p>
              </div>
              <ImageUploadField
                label="Logo"
                hint="Transparent PNG or SVG works best — logos are unified with a brightness-0 invert treatment on the dark background."
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                folder="partner-logos"
                previewClassName="h-16 w-28"
              />
              <div>
                <Label className="font-body">Link URL (optional)</Label>
                <Input
                  value={form.link_url}
                  onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                  placeholder="https://…"
                  className="font-body"
                />
                <p className="font-body text-xs text-muted-foreground mt-1">
                  When set, clicking the logo opens this URL in a new tab.
                </p>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <Label className="font-body">Active</Label>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">
                    Only active logos appear on the landing page.
                  </p>
                </div>
                <Switch
                  checked={form.active}
                  onCheckedChange={(v) => setForm({ ...form, active: v })}
                />
              </div>
              <Button onClick={handleSave} className="w-full font-body">
                {editing ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <XlsxSyncBar
        templateFilename="partner-logos.xlsx"
        columns={partnerColumns}
        currentRows={logos.map((l) => ({
          name: l.name,
          image_url: l.image_url,
          link_url: l.link_url ?? "",
          display_order: l.display_order,
          active: l.active ? "yes" : "no",
        }))}
        downloadLabel={logos.length > 0 ? "Download logos" : "Download sample"}
        description="Rows match by Name — unknown names create new logos, existing ones get their URL, order, and active flag updated. Image URLs must point to hosted images."
        onUpload={async (rows) => {
          const existing = new Map<string, string>();
          logos.forEach((l) => existing.set(l.name.trim().toLowerCase(), l.id));
          let created = 0; let updated = 0; let skipped = 0;
          const errors: string[] = [];
          for (let i = 0; i < rows.length; i++) {
            const r = rows[i] as Partial<PartnerRow>;
            const name = String(r.name ?? "").trim();
            const image_url = String(r.image_url ?? "").trim();
            if (!name) { skipped++; errors.push(`Row ${i + 2}: missing Name — skipped.`); continue; }
            if (!image_url) { skipped++; errors.push(`Row ${i + 2} (${name}): missing Image URL — skipped.`); continue; }
            const orderRaw = r.display_order;
            const display_order =
              typeof orderRaw === "number" ? orderRaw : Number(String(orderRaw ?? "").trim()) || 0;
            const payload = {
              name,
              image_url,
              link_url: r.link_url ? String(r.link_url).trim() : null,
              display_order,
              active: r.active === undefined ? true : !!r.active,
            };
            const id = existing.get(name.toLowerCase());
            try {
              if (id) {
                const { error } = await supabase.from("partner_logos" as any).update(payload as any).eq("id", id);
                if (error) throw error;
                updated++;
              } else {
                const { error } = await supabase.from("partner_logos" as any).insert(payload as any);
                if (error) throw error;
                created++;
              }
            } catch (err: any) {
              skipped++;
              errors.push(`Row ${i + 2} (${name}): ${err.message ?? "save failed"}`);
            }
          }
          qc.invalidateQueries({ queryKey: ["partner_logos"] });
          return { created, updated, skipped, errors };
        }}
      />

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body w-24">Order</TableHead>
              <TableHead className="font-body w-24">Logo</TableHead>
              <TableHead className="font-body">Name</TableHead>
              <TableHead className="font-body">Link</TableHead>
              <TableHead className="font-body w-20">Active</TableHead>
              <TableHead className="font-body w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center font-body text-muted-foreground py-10">
                  Loading…
                </TableCell>
              </TableRow>
            ) : logos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center font-body text-muted-foreground py-10">
                  No partner logos yet. Click "Add Logo" to upload one.
                </TableCell>
              </TableRow>
            ) : (
              logos.map((logo, index) => (
                <TableRow key={logo.id}>
                  <TableCell>
                    <div className="flex gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={index === 0 || reorder.isPending}
                        onClick={() => move(index, -1)}
                        aria-label="Move up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={index === logos.length - 1 || reorder.isPending}
                        onClick={() => move(index, 1)}
                        aria-label="Move down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-10 w-20 rounded-md bg-forest-deep/90 flex items-center justify-center p-1">
                      <img
                        src={logo.image_url}
                        alt={logo.name}
                        className="max-h-full max-w-full object-contain filter brightness-0 invert opacity-80"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-body font-medium">{logo.name}</TableCell>
                  <TableCell className="font-body text-muted-foreground max-w-[240px] truncate">
                    {logo.link_url ?? <span className="text-muted-foreground/60">—</span>}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={logo.active}
                      onCheckedChange={() => handleToggleActive(logo)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(logo)} aria-label="Edit">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive" aria-label="Delete">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {logo.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove the logo from the landing marquee. The image file in storage is not deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(logo.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
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

export default AdminPartners;
