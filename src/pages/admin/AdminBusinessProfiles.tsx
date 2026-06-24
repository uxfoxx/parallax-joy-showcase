import { useState } from "react";
import {
  useBusinessProfiles,
  useCreateBusinessProfile,
  useUpdateBusinessProfile,
  useDeleteBusinessProfile,
  type BusinessProfile,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, Link2, ExternalLink, User } from "lucide-react";
import { toast } from "sonner";
import ImageUploadField from "@/components/admin/ImageUploadField";
import PinGate from "@/components/admin/PinGate";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "").slice(0, 50);

type FormState = {
  name: string;
  slug: string;
  title: string;
  company: string;
  phone: string;
  phone_secondary: string;
  whatsapp: string;
  email: string;
  bio: string;
  photo_url: string;
  active: boolean;
};

const emptyForm: FormState = {
  name: "", slug: "", title: "", company: "Olive Foods", phone: "",
  phone_secondary: "", whatsapp: "", email: "", bio: "", photo_url: "", active: true,
};

const AdminBusinessProfilesInner = () => {
  const { data: profiles = [], isLoading } = useBusinessProfiles();
  const createProfile = useCreateBusinessProfile();
  const updateProfile = useUpdateBusinessProfile();
  const deleteProfile = useDeleteBusinessProfile();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BusinessProfile | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };

  const openEdit = (p: BusinessProfile) => {
    setEditing(p);
    setForm({
      name: p.name, slug: p.slug, title: p.title ?? "", company: p.company,
      phone: p.phone ?? "", phone_secondary: p.phone_secondary ?? "",
      whatsapp: p.whatsapp ?? "", email: p.email ?? "", bio: p.bio ?? "",
      photo_url: p.photo_url ?? "", active: p.active,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const name = form.name.trim();
    if (!name) return toast.error("Name is required");
    const slug = (form.slug.trim() && slugify(form.slug)) || slugify(name);
    if (!slug) return toast.error("Could not derive a link slug — add one manually");
    const payload = {
      slug,
      name,
      title: form.title.trim() || null,
      company: form.company.trim() || "Olive Foods",
      phone: form.phone.trim() || null,
      phone_secondary: form.phone_secondary.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      email: form.email.trim() || null,
      bio: form.bio.trim() || null,
      photo_url: form.photo_url || null,
      active: form.active,
    };
    try {
      if (editing) {
        await updateProfile.mutateAsync({ id: editing.id, ...payload });
        toast.success("Profile updated");
      } else {
        await createProfile.mutateAsync({ ...payload, display_order: profiles.length });
        toast.success("Profile created");
      }
      setOpen(false);
    } catch (err: any) {
      toast.error(
        /duplicate key|unique/i.test(err.message ?? "")
          ? "That link slug is already taken — choose another."
          : err.message ?? "Save failed"
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProfile.mutateAsync(id);
      toast.success("Profile deleted");
    } catch (err: any) {
      toast.error(err.message ?? "Delete failed");
    }
  };

  const handleToggleActive = async (p: BusinessProfile) => {
    try {
      await updateProfile.mutateAsync({ id: p.id, active: !p.active });
    } catch (err: any) {
      toast.error(err.message ?? "Update failed");
    }
  };

  const cardUrl = (slug: string) => `${window.location.origin}/profile/${slug}`;
  const copyLink = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(cardUrl(slug));
      toast.success("Share link copied");
    } catch {
      toast.error("Couldn't copy — link: " + cardUrl(slug));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">E Business Profiles</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Digital business cards for staff. Each profile gets a shareable link at <code>/profile/&lt;slug&gt;</code>.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2 font-body">
              <Plus className="w-4 h-4" /> New Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[88vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">{editing ? "Edit Profile" : "New Profile"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <ImageUploadField
                label="Photo"
                hint="A square headshot works best."
                value={form.photo_url}
                onChange={(url) => setForm({ ...form, photo_url: url })}
                folder="business-profiles"
                previewClassName="h-24 w-24 rounded-full"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-body">Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Perera" className="font-body" />
                </div>
                <div>
                  <Label className="font-body">Job title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Regional Sales Manager" className="font-body" />
                </div>
              </div>
              <div>
                <Label className="font-body">Company</Label>
                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="font-body" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-body">Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+94 77 123 4567" className="font-body" />
                </div>
                <div>
                  <Label className="font-body">Secondary phone</Label>
                  <Input value={form.phone_secondary} onChange={(e) => setForm({ ...form, phone_secondary: e.target.value })} placeholder="+94 11 207 1717" className="font-body" />
                </div>
                <div>
                  <Label className="font-body">WhatsApp</Label>
                  <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+94 77 123 4567" className="font-body" />
                </div>
                <div>
                  <Label className="font-body">Email</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@olivefoods.lk" className="font-body" />
                </div>
              </div>
              <div>
                <Label className="font-body">Bio / tagline</Label>
                <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="10+ years in HoReCa supply — frozen & dairy specialist." className="font-body" rows={2} />
              </div>
              <div>
                <Label className="font-body">Link slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={form.name ? slugify(form.name) : "auto from name"} className="font-body" />
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Shareable link: <code>/profile/{form.slug ? slugify(form.slug) : (form.name ? slugify(form.name) : "…")}</code>. Leave blank to auto-generate.
                </p>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <Label className="font-body">Active</Label>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">Inactive profiles are hidden from their public link.</p>
                </div>
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              </div>
              <Button onClick={handleSave} className="w-full font-body">{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body w-16"></TableHead>
              <TableHead className="font-body">Name</TableHead>
              <TableHead className="font-body">Title</TableHead>
              <TableHead className="font-body">Phone</TableHead>
              <TableHead className="font-body w-20">Active</TableHead>
              <TableHead className="font-body w-40">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center font-body text-muted-foreground py-10">Loading…</TableCell></TableRow>
            ) : profiles.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center font-body text-muted-foreground py-10">No profiles yet. Click "New Profile" to create one.</TableCell></TableRow>
            ) : (
              profiles.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                      {p.photo_url ? (
                        <img src={p.photo_url} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-body font-medium">{p.name}</TableCell>
                  <TableCell className="font-body text-muted-foreground">{p.title ?? <span className="text-muted-foreground/60">—</span>}</TableCell>
                  <TableCell className="font-body text-muted-foreground">{p.phone ?? <span className="text-muted-foreground/60">—</span>}</TableCell>
                  <TableCell><Switch checked={p.active} onCheckedChange={() => handleToggleActive(p)} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => copyLink(p.slug)} aria-label="Copy share link" title="Copy share link">
                        <Link2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" asChild aria-label="Open card" title="Open card">
                        <a href={cardUrl(p.slug)} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" /></a>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label="Edit"><Pencil className="w-4 h-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive" aria-label="Delete"><Trash2 className="w-4 h-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {p.name}?</AlertDialogTitle>
                            <AlertDialogDescription>This permanently removes the profile and its share link. The photo file in storage is not deleted.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(p.id)}>Delete</AlertDialogAction>
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

const AdminBusinessProfiles = () => (
  <PinGate>
    <AdminBusinessProfilesInner />
  </PinGate>
);

export default AdminBusinessProfiles;
