import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { ZoomIn, ZoomOut, Loader2, RotateCw, Ruler, SkipForward } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { getCroppedFile } from "@/lib/cropImage";
import { uploadImage } from "@/lib/upload";
import { useUpdateProduct } from "@/lib/api";
import { useCropGuides } from "@/hooks/useCropGuides";
import CropGuides from "@/components/admin/CropGuides";

export type BatchItem = { id: string; name: string; image_url: string };

const ASPECTS: { label: string; value: number | undefined }[] = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
];

const ASPECT_KEY = "olive.cropAspect";
const loadAspect = (): number | undefined => {
  try {
    const raw = localStorage.getItem(ASPECT_KEY);
    if (raw === "free") return undefined;
    if (raw) return Number(raw);
  } catch {
    /* ignore */
  }
  return 4 / 5;
};

type Props = {
  products: BatchItem[];
  folder: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone?: () => void;
};

/**
 * Sequential "Crop all" flow: walks every product image one-by-one (crop →
 * save → next → finish). Reuses getCroppedFile (white-fills a smaller-than-crop
 * source) + uploadImage, then persists each result to the product's image_url.
 * The alignment guides + chosen aspect persist across every image.
 */
const BatchCropDialog = ({ products, folder, open, onOpenChange, onDone }: Props) => {
  const updateProduct = useUpdateProduct();
  const { guides, setGuide, show, setShow } = useCropGuides();

  const [i, setI] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(loadAspect);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  // Reset the transient crop state (but keep guides + aspect) on open + per image.
  useEffect(() => {
    if (open) {
      setI(0);
      setSavedCount(0);
    }
  }, [open]);
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAreaPixels(null);
  }, [i]);

  useEffect(() => {
    try {
      localStorage.setItem(ASPECT_KEY, aspect === undefined ? "free" : String(aspect));
    } catch {
      /* ignore */
    }
  }, [aspect]);

  const onCropComplete = useCallback((_a: Area, px: Area) => setAreaPixels(px), []);

  const n = products.length;
  const current = products[i];
  const isLast = i >= n - 1;

  const finish = (saved: number) => {
    onOpenChange(false);
    onDone?.();
    toast.success(`Cropped ${saved} of ${n} ${n === 1 ? "image" : "images"}`);
  };

  const advance = (didSave: boolean) => {
    const saved = savedCount + (didSave ? 1 : 0);
    setSavedCount(saved);
    if (isLast) finish(saved);
    else setI((v) => v + 1);
  };

  const handleSaveNext = async () => {
    if (!current || !areaPixels) return;
    setSaving(true);
    try {
      const file = await getCroppedFile(current.image_url, areaPixels, rotation, "product-cropped");
      const url = await uploadImage(file, folder);
      await updateProduct.mutateAsync({ id: current.id, image_url: url } as any);
      advance(true);
    } catch (err: any) {
      toast.error(err.message ?? "Could not save this crop.");
    } finally {
      setSaving(false);
    }
  };

  if (!current) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!saving) onOpenChange(o); }}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="font-display flex items-center justify-between gap-3">
            <span>Crop all products</span>
            <span className="font-body text-xs font-normal text-muted-foreground tabular-nums">
              {i + 1} / {n}
            </span>
          </DialogTitle>
          <p className="font-body text-xs text-muted-foreground truncate">{current.name}</p>
          {/* Progress bar */}
          <div className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-accent transition-[width] duration-300"
              style={{ width: `${(i / n) * 100}%` }}
            />
          </div>
        </DialogHeader>

        {/* Crop stage */}
        <div className="relative h-[340px] bg-[hsl(150_20%_10%)]">
          <Cropper
            key={current.id}
            image={current.image_url}
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
          <CropGuides guides={guides} setGuide={setGuide} show={show} />
        </div>

        {/* Controls */}
        <div className="px-5 py-4 space-y-4">
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
              onClick={() => setShow(!show)}
              className={`font-body text-xs px-3 h-8 rounded-md border inline-flex items-center gap-1 ml-auto transition-colors ${
                show ? "border-accent text-accent bg-accent/5" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Ruler className="w-3.5 h-3.5" /> Guides
            </button>
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="font-body text-xs px-3 h-8 rounded-md border border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <RotateCw className="w-3.5 h-3.5" /> Rotate
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))}
              className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <Slider value={[zoom]} min={1} max={4} step={0.01} onValueChange={([v]) => setZoom(v)} className="flex-1" />
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

        <DialogFooter className="px-5 pb-5 gap-2 sm:justify-between">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => advance(false)} disabled={saving} className="gap-2">
              <SkipForward className="w-4 h-4" /> Skip
            </Button>
            <Button type="button" onClick={handleSaveNext} disabled={saving || !areaPixels} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving…" : isLast ? "Save & finish" : "Save & next"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchCropDialog;
