import { useState } from "react";
import { useContactSubmissions, useDeleteSubmission, type ContactSubmission } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminSubmissions = () => {
  const { data: submissions, isLoading } = useContactSubmissions();
  const deleteSubmission = useDeleteSubmission();
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<ContactSubmission | null>(null);

  const filtered = submissions?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.subject.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleDelete = async (id: string) => {
    try {
      await deleteSubmission.mutateAsync(id);
      toast.success("Submission deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Contact Submissions</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or subject..." className="pl-10 font-body" />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Date</TableHead>
              <TableHead className="font-body">Name</TableHead>
              <TableHead className="font-body">Email</TableHead>
              <TableHead className="font-body">Subject</TableHead>
              <TableHead className="font-body w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center font-body text-muted-foreground py-10">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center font-body text-muted-foreground py-10">No submissions found</TableCell></TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-body text-muted-foreground text-sm">{format(new Date(s.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="font-body font-medium">{s.name}</TableCell>
                  <TableCell className="font-body text-muted-foreground">{s.email}</TableCell>
                  <TableCell className="font-body text-muted-foreground">{s.subject}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setViewing(s)}><Eye className="w-4 h-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete this submission?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(s.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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

      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Submission Details</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-4 font-body">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{viewing.name}</p></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{viewing.email}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{viewing.phone || "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{format(new Date(viewing.created_at), "PPP")}</p></div>
              </div>
              <div><p className="text-xs text-muted-foreground">Subject</p><p className="font-medium">{viewing.subject}</p></div>
              <div><p className="text-xs text-muted-foreground">Message</p><p className="whitespace-pre-wrap text-sm">{viewing.message}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubmissions;
