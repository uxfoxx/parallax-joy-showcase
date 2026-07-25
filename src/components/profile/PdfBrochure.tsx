import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import * as pdfjs from "pdfjs-dist";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
// Vite resolves `?url` to the built worker asset; pdf.js runs parsing off the
// main thread from there.
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

type Props = {
  pdfUrl: string;
  /** Return to the profile chooser; null when the brochure is the only view. */
  onBack: (() => void) | null;
};

/**
 * Responsive PDF reader. Each page is rasterised by pdf.js to a canvas whose
 * CSS width tracks the reading column, so pages fit the screen at any size
 * instead of the fixed-width, pinch-to-zoom experience of an <iframe> PDF.
 * Rendered at devicePixelRatio (capped at 2) for crispness and re-rendered on
 * resize. Falls back to a download link if the document can't be fetched
 * (e.g. CORS) or the browser can't render it.
 */
const PdfBrochure = ({ pdfUrl, onBack }: Props) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  const tasksRef = useRef<RenderTask[]>([]);
  const paintedRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [numPages, setNumPages] = useState(0);
  // Safety net: if pages never actually paint (a browser/document pdf.js can't
  // rasterise), surface a download nudge rather than leaving blank pages.
  const [stalled, setStalled] = useState(false);

  // ── Load the document ──
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setStalled(false);
    paintedRef.current = false;
    const loadingTask = pdfjs.getDocument({ url: pdfUrl });
    loadingTask.promise
      .then((doc) => {
        if (cancelled) return;
        docRef.current = doc;
        canvasRefs.current = new Array(doc.numPages).fill(null);
        setNumPages(doc.numPages);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
      loadingTask.destroy();
      docRef.current?.destroy();
      docRef.current = null;
    };
  }, [pdfUrl]);

  // Watchdog — nudge to download if the first page hasn't painted in time.
  useEffect(() => {
    if (status !== "ready") return;
    const t = window.setTimeout(() => {
      if (!paintedRef.current) setStalled(true);
    }, 9000);
    return () => window.clearTimeout(t);
  }, [status]);

  // ── Render pages to width, re-render on resize ──
  useEffect(() => {
    if (status !== "ready") return;
    const doc = docRef.current;
    const column = columnRef.current;
    if (!doc || !column) return;

    let cancelled = false;
    let debounce: number | undefined;
    let renderedWidth = 0;
    let running = false;
    let queuedWidth = 0;

    const renderAll = async (width: number) => {
      if (cancelled || !width) return;
      // Coalesce: if a pass is mid-flight, remember the newest width and let the
      // running pass pick it up when it finishes, rather than overlapping renders.
      if (running) {
        queuedWidth = width;
        return;
      }
      if (Math.abs(width - renderedWidth) < 8) return;
      running = true;
      renderedWidth = width;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      for (let p = 1; p <= doc.numPages; p++) {
        if (cancelled) break;
        const canvas = canvasRefs.current[p - 1];
        if (!canvas) continue;
        const page = await doc.getPage(p);
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: (width / base.width) * dpr });
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.aspectRatio = `${base.width} / ${base.height}`;
        const task = page.render({ canvasContext: ctx, viewport });
        tasksRef.current.push(task);
        try {
          await task.promise;
          if (p === 1) {
            paintedRef.current = true;
            setStalled(false);
          }
        } catch {
          /* cancelled — a newer pass supersedes this one */
        }
      }

      running = false;
      if (!cancelled && queuedWidth && Math.abs(queuedWidth - renderedWidth) >= 8) {
        const next = queuedWidth;
        queuedWidth = 0;
        renderAll(next);
      }
    };

    const onResize = () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => renderAll(column.clientWidth), 180);
    };

    renderAll(column.clientWidth);
    const ro = new ResizeObserver(onResize);
    ro.observe(column);
    return () => {
      cancelled = true;
      ro.disconnect();
      window.clearTimeout(debounce);
      tasksRef.current.forEach((t) => t.cancel());
      tasksRef.current = [];
    };
  }, [status, numPages]);

  return (
    <main className="flex h-[100dvh] w-full flex-col bg-forest-deep">
      {/* Reading bar */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-forest-deep px-4 py-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 font-body text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <Link to="/" className="inline-flex items-center gap-1.5 font-body text-sm text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> olivefoods.lk
          </Link>
        )}
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40 hidden sm:block">
          Product Brochure
        </span>
        <a
          href={pdfUrl}
          download
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.1em] text-white hover:bg-accent/90 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Download
        </a>
      </div>

      {/* Scrollable page column */}
      <div className="relative flex-1 overflow-y-auto overscroll-contain">
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        )}

        {status === "error" && (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-body text-sm text-white/60">This brochure can't be displayed here.</p>
            <a
              href={pdfUrl}
              download
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-body text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
            >
              <Download className="w-4 h-4" /> Download the PDF
            </a>
          </div>
        )}

        {status === "ready" && (
          <div ref={columnRef} className="mx-auto w-full max-w-3xl px-3 py-5 sm:px-5 sm:py-8 space-y-5 sm:space-y-7">
            {Array.from({ length: numPages }, (_, i) => (
              <canvas
                key={i}
                ref={(el) => {
                  canvasRefs.current[i] = el;
                }}
                className="block w-full rounded-md bg-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)]"
                aria-label={`Brochure page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stall nudge — non-blocking escape hatch to the raw file */}
      {stalled && (
        <div className="shrink-0 border-t border-white/10 bg-forest-deep px-4 py-2.5 text-center">
          <span className="font-body text-xs text-white/50">Trouble displaying the brochure? </span>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="font-body text-xs font-semibold text-accent hover:underline">
            Open the PDF ↗
          </a>
        </div>
      )}
    </main>
  );
};

export default PdfBrochure;
