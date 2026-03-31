import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const glowPos = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isInteractive = el.closest(
        "a, button, [role='button'], input, textarea, select, [data-interactive]"
      ) !== null;
      hovering.current = isInteractive;
    };

    const animate = () => {
      // Dot follows faster
      dotPos.current.x += (target.current.x - dotPos.current.x) * 0.12;
      dotPos.current.y += (target.current.y - dotPos.current.y) * 0.12;
      // Glow trails behind
      glowPos.current.x += (target.current.x - glowPos.current.x) * 0.06;
      glowPos.current.y += (target.current.y - glowPos.current.y) * 0.06;

      const dotScale = hovering.current ? 1.5 : 1;
      const glowScale = hovering.current ? 2 : 1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 6}px, ${dotPos.current.y - 6}px) scale(${dotScale})`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowPos.current.x - 20}px, ${glowPos.current.y - 20}px) scale(${glowScale})`;
      }

      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Trailing glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] will-change-transform"
        style={{ transition: "none" }}
      >
        <div className="w-10 h-10 rounded-full bg-accent/20 blur-xl" />
      </div>
      {/* Green dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
        style={{ transition: "none" }}
      >
        <div
          className="w-3 h-3 rounded-full bg-accent"
          style={{
            boxShadow:
              "0 0 0 1.5px white, 0 0 6px hsl(75 38% 45% / 0.8), 0 0 12px hsl(75 38% 45% / 0.4)",
            transition: "transform 0.15s ease",
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
