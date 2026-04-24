import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { UploadCloud, Link as LinkIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/lib/upload";

interface ImageUploadFieldProps {
  /** Current image URL (or empty string / null). */
  value: string;
  /** Called with the new URL after upload or manual edit, or "" when cleared. */
  onChange: (url: string) => void;
  /** Visible label above the field. */
  label: string;
  /** Folder under the upload bucket — e.g. "brand-logos", "product-images". */
  folder: string;
  /** Extra helper copy shown under the label. */
  hint?: string;
  /** Aspect-ratio hint for the preview thumbnail. Defaults to square. */
  previewClassName?: string;
  /** Accepted MIME types for the file picker. */
  accept?: string;
}

/**
 * Admin-panel image field that supports BOTH:
 *   1. Drag-and-drop / click file upload → Supabase Storage → public URL
 *   2. Pasting an external URL (Unsplash, CDN, etc.)
 *
 * Writes the resulting public URL back through `onChange(url)` so form state
 * stays a plain string — drop-in replacement for a URL-only text input.
 */
const ImageUploadField = ({
  value,
  onChange,
  label,
  folder,
  hint,
  previewClassName = "h-24 w-24",
  accept = "image/png,image/jpeg,image/webp,image/svg+xml,image/gif",
}: ImageUploadFieldProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "image/svg+xml") {
      toast.error("Please choose an image file.");
      return;
    }
    try {
      setUploading(true);
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ""; // allow re-picking the same file
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="font-body">{label}</Label>
        <button
          type="button"
          onClick={() => setShowUrlField((v) => !v)}
          className="font-body text-xs text-muted-foreground hover:text-accent inline-flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlField ? "Hide URL" : "Paste URL"}
        </button>
      </div>
      {hint && <p className="font-body text-xs text-muted-foreground -mt-1">{hint}</p>}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        className={`relative cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200 font-body text-sm ${
          dragActive
            ? "border-accent bg-accent/5"
            : "border-border bg-card/50 hover:border-accent/50 hover:bg-accent/[0.02]"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          onChange={onPick}
          className="hidden"
          disabled={uploading}
        />

        {value ? (
          <div className="flex items-center gap-4 p-3">
            <img
              src={value}
              alt="Preview"
              className={`${previewClassName} object-contain rounded-md border border-border bg-muted shrink-0`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-foreground truncate text-xs">{value.split("/").pop()}</p>
              <p className="text-muted-foreground text-[11px] mt-0.5">
                Click or drop a new file to replace
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="shrink-0 text-muted-foreground hover:text-destructive"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 text-accent animate-spin mb-2" />
                <p className="text-muted-foreground">Uploading…</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-6 h-6 text-muted-foreground mb-2" />
                <p className="text-foreground font-medium">Click to upload or drag & drop</p>
                <p className="text-muted-foreground text-xs mt-1">
                  PNG, JPG, WEBP or SVG · stored in Supabase Storage
                </p>
              </>
            )}
          </div>
        )}

        {uploading && value && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
          </div>
        )}
      </div>

      {/* Optional manual URL field */}
      {showUrlField && (
        <div className="pt-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…  (external URL)"
            className="font-body text-sm"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
