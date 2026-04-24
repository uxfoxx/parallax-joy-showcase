import { useRef, useState } from "react";
import { Download, Upload, Loader2, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  downloadSheet,
  parseSheetFile,
  type SheetColumn,
} from "@/lib/xlsxSheet";

/**
 * Reusable "Download sample / Upload update" bar for admin pages.
 *
 * The admin page supplies:
 *   - `templateFilename` — e.g. "products.xlsx"
 *   - `columns`          — column schema (headers, keys, parsers, examples)
 *   - `currentRows`      — existing DB rows mapped into the column shape,
 *                          so "Download" exports what's actually in the DB
 *                          (filled spreadsheet admins edit in place).
 *   - `onUpload(rows)`   — handler invoked with parsed rows. Returns
 *                          `{ created, updated, skipped }` for the toast.
 *
 * All bulk-write logic lives in the caller so it can use the right hooks
 * or supabase calls for that page.
 */
interface XlsxSyncBarProps<K extends string> {
  templateFilename: string;
  columns: SheetColumn<K>[];
  currentRows: Record<K, unknown>[];
  onUpload: (rows: Record<K, unknown>[]) => Promise<{
    created: number;
    updated: number;
    skipped: number;
    errors?: string[];
  }>;
  /** Short explanation shown below the buttons. */
  description?: string;
  /** Label override for the download button. */
  downloadLabel?: string;
}

export function XlsxSyncBar<K extends string>({
  templateFilename,
  columns,
  currentRows,
  onUpload,
  description,
  downloadLabel = "Download .xlsx",
}: XlsxSyncBarProps<K>) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleDownload = () => {
    try {
      downloadSheet(templateFilename, currentRows, columns);
      toast.success(
        currentRows.length === 0
          ? "Empty sample downloaded"
          : `Exported ${currentRows.length} row${currentRows.length === 1 ? "" : "s"}`,
      );
    } catch (err: any) {
      toast.error(err.message ?? "Download failed");
    }
  };

  const handleFile = async (file: File) => {
    setBusy(true);
    try {
      const rows = await parseSheetFile(file, columns);
      if (rows.length === 0) {
        toast.error("That file has no data rows.");
        return;
      }
      const result = await onUpload(rows);
      const parts: string[] = [];
      if (result.created) parts.push(`${result.created} created`);
      if (result.updated) parts.push(`${result.updated} updated`);
      if (result.skipped) parts.push(`${result.skipped} skipped`);
      toast.success(parts.length ? parts.join(" · ") : "No changes applied");
      if (result.errors && result.errors.length) {
        // Show the first 3 row errors so the admin can fix and re-upload.
        result.errors.slice(0, 3).forEach((e) => toast.error(e));
      }
    } catch (err: any) {
      toast.error(err.message ?? "Import failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-border bg-card/50 p-4 flex flex-wrap items-center gap-3">
      <FileSpreadsheet className="w-5 h-5 text-accent shrink-0" />
      <div className="flex-1 min-w-[200px]">
        <p className="font-body text-sm font-medium text-foreground">Bulk edit via spreadsheet</p>
        {description && (
          <p className="font-body text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) handleFile(file);
        }}
      />
      <Button type="button" variant="outline" size="sm" onClick={handleDownload} className="gap-2">
        <Download className="w-4 h-4" />
        {downloadLabel}
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        className="gap-2"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {busy ? "Importing…" : "Upload .xlsx"}
      </Button>
    </div>
  );
}

export default XlsxSyncBar;
