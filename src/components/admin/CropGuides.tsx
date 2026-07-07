import { useRef } from "react";
import type { GuideSide, Guides } from "@/hooks/useCropGuides";

type Props = {
  guides: Guides;
  setGuide: (side: GuideSide, value: number) => void;
  show: boolean;
};

/**
 * Four draggable alignment guides overlaid on the crop viewport. Horizontal
 * (top/bottom) lines drag vertically, vertical (left/right) lines drag
 * horizontally. Only the thin guide strips capture pointer events — the rest of
 * the overlay is pass-through so react-easy-crop still pans/zooms underneath.
 * Reference only: does not affect the exported crop.
 */
const CropGuides = ({ guides, setGuide, show }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  if (!show) return null;

  const startDrag =
    (side: GuideSide, axis: "x" | "y") => (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const el = ref.current;
      if (!el) return;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      const move = (ev: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const frac =
          axis === "y" ? (ev.clientY - r.top) / r.height : (ev.clientX - r.left) / r.width;
        setGuide(side, frac);
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };

  const lineColor = "hsl(var(--accent))";

  return (
    <div ref={ref} className="absolute inset-0 z-30 pointer-events-none">
      {/* Horizontal guides (top / bottom) */}
      {(["top", "bottom"] as GuideSide[]).map((side) => (
        <div
          key={side}
          onPointerDown={startDrag(side, "y")}
          className="absolute left-0 right-0 h-[11px] -translate-y-1/2 pointer-events-auto cursor-ns-resize group/guide"
          style={{ top: `${guides[side] * 100}%` }}
        >
          <div
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
            style={{ background: lineColor, opacity: 0.85, boxShadow: "0 0 0 0.5px rgba(0,0,0,0.4)" }}
          />
          <span
            className="absolute left-1/2 top-1/2 h-2.5 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 group-hover/guide:opacity-100"
            style={{ background: lineColor }}
          />
        </div>
      ))}

      {/* Vertical guides (left / right) */}
      {(["left", "right"] as GuideSide[]).map((side) => (
        <div
          key={side}
          onPointerDown={startDrag(side, "x")}
          className="absolute top-0 bottom-0 w-[11px] -translate-x-1/2 pointer-events-auto cursor-ew-resize group/guide"
          style={{ left: `${guides[side] * 100}%` }}
        >
          <div
            className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2"
            style={{ background: lineColor, opacity: 0.85, boxShadow: "0 0 0 0.5px rgba(0,0,0,0.4)" }}
          />
          <span
            className="absolute top-1/2 left-1/2 w-2.5 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 group-hover/guide:opacity-100"
            style={{ background: lineColor }}
          />
        </div>
      ))}
    </div>
  );
};

export default CropGuides;
