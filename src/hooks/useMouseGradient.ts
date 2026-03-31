import { useRef, useEffect, useCallback } from "react";

export const useMouseGradient = () => {
  const ref = useRef<HTMLElement>(null);
  const raf = useRef<number>(0);
  const target = useRef({ x: 50, y: 50 });
  const current = useRef({ x: 50, y: 50 });

  const animate = useCallback(() => {
    current.current.x += (target.current.x - current.current.x) * 0.08;
    current.current.y += (target.current.y - current.current.y) * 0.08;

    const el = ref.current;
    if (el) {
      el.style.setProperty("--mouse-x", `${current.current.x}%`);
      el.style.setProperty("--mouse-y", `${current.current.y}%`);
    }

    raf.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      target.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
    };

    el.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [animate]);

  const gradientStyle: React.CSSProperties = {
    background: `radial-gradient(circle 500px at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(42 80% 55% / 0.07), transparent)`,
  };

  return { ref, gradientStyle };
};
