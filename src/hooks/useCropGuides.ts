import { useCallback, useEffect, useState } from "react";

export type Guides = { top: number; bottom: number; left: number; right: number };
export type GuideSide = keyof Guides;

const KEY = "olive.cropGuides";
const DEFAULTS: Guides = { top: 0.12, bottom: 0.88, left: 0.12, right: 0.88 };

const load = (): { guides: Guides; show: boolean } => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        guides: { ...DEFAULTS, ...(p.guides ?? {}) },
        show: p.show ?? true,
      };
    }
  } catch {
    /* ignore */
  }
  return { guides: DEFAULTS, show: true };
};

/**
 * Four adjustable alignment guides (fractions of the crop viewport) that persist
 * to localStorage — so a position set once stays consistent across every image
 * in a batch and across sessions. Purely visual; does not change the crop rect.
 */
export const useCropGuides = () => {
  const [{ guides, show }, setState] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ guides, show }));
    } catch {
      /* ignore */
    }
  }, [guides, show]);

  const setGuide = useCallback((side: GuideSide, value: number) => {
    const v = Math.min(1, Math.max(0, value));
    setState((s) => ({ ...s, guides: { ...s.guides, [side]: v } }));
  }, []);

  const setShow = useCallback((next: boolean) => setState((s) => ({ ...s, show: next })), []);
  const reset = useCallback(() => setState((s) => ({ ...s, guides: DEFAULTS })), []);

  return { guides, setGuide, show, setShow, reset };
};
