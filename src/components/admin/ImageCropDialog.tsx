import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { ZoomIn, ZoomOut, Loader2, RotateCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { getCroppedFile } from "@/lib/cropImage";
import { uploadImage } from "@/lib/upload";

type AspectOption = { label: string; value: number | undefined };

const ASPECTS: AspectOption[] = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
];

interface ImageCropDialogProps {
  /** Image URL to crop (a freshly-selected object URL OR an already-saved URL). */
  src: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Storage folder for the re-uploaded result. */
  folder: string;
  /** Called with the new public URL once the crop is uploaded. */
  onCropped: (url: string) => void;
  /** Default aspect ratio; undefined = free crop. */
  defaultAspect?: number;
}

/**
 * Full crop UI for admin product images. Zoom in/out (slider + buttons),
 * a rule-of-thirds grid overlay, rotation, and aspect presets. On confirm it
 * renders the crop to a canvas, uploads it to Supabase, and returns the new
 * public URL — so it works for both new uploads and already-saved images.
 */
const ImageCropDialog = ({
  src,
  open,
  onOpenChange,
  folder,
  onCropped,
  defaultAspect,
}: ImageCropDialogProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(defaultAspect);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPx: Area) => {
    setAreaPixels(areaPx);
  }, []);

  const reset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const handleSave = async () => {
    if (!src || !areaPixels) return;
    setSaving(true);
    try {
      const file = await getCroppedFile(src, areaPixels, rotation, "product-cropped");
      const url = await uploadImage(file, folder);
      onCropped(url);
      toast.success("Image cropped & saved");
      onOpenChange(false);
      reset();
    } catch (err: any) {
      toast.error(err.message ?? "Could not save the crop.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!saving) onOpenChange(o); }}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="font-display">Crop image</DialogTitle>
        </DialogHeader>

        {/* Crop stage */}
        <div className="relative h-[340px] bg-[hsl(150_20%_10%)]">
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              showGrid
              restrictPosition={false}
            />
          )}
        </div>

        {/* Controls */}
        <div className="px-5 py-4 space-y-4">
          {/* Aspect presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-body text-xs text-muted-foreground mr-1">Ratio</span>
            {ASPECTS.map((a) => (
              <button
                key={a.label}
                type="button"
                onClick={() => setAspect(a.value)}
                className={`font-body text-xs px-3 h-8 rounded-md border transition-colors ${
                  aspect === a.value
                    ? "border-accent text-accent bg-accent/5"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {a.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="font-body text-xs px-3 h-8 rounded-md border border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-1 ml-auto"
            >
              <RotateCw className="w-3.5 h-3.5" /> Rotate
            </button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))}
              className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <Slider
              value={[zoom]}
              min={1}
              max={4}
              step={0.01}
              onValueChange={([v]) => setZoom(v)}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(4, +(z + 0.2).toFixed(2)))}
              className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        <DialogFooter className="px-5 pb-5 gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving || !areaPixels} className="gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : "Save crop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropDialog;
