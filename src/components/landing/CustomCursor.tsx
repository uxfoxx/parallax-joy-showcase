import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const dotPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const glowPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const hovering = useRef(false);
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      hovering.current = el.closest(
        "a, button, [role='button'], input, textarea, select, [data-interactive]"
      ) !== null;
    };

    const animate = () => {
      // Fast lerp for snappy feel
      dotPos.current.x += (target.current.x - dotPos.current.x) * 0.35;
      dotPos.current.y += (target.current.y - dotPos.current.y) * 0.35;
      glowPos.current.x += (target.current.x - glowPos.current.x) * 0.15;
      glowPos.current.y += (target.current.y - glowPos.current.y) * 0.15;

      const dotScale = hovering.current ? 1.6 : 1;
      const glowScale = hovering.current ? 2.2 : 1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 10}px, ${dotPos.current.y - 10}px) scale(${dotScale})`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowPos.current.x - 24}px, ${glowPos.current.y - 24}px) scale(${glowScale})`;
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
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{ zIndex: 99997, transition: "none" }}
      >
        <div className="w-12 h-12 rounded-full bg-accent/25 blur-xl" />
      </div>
      {/* Green dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{ zIndex: 99999, transition: "none" }}
      >
        <div
          className="w-5 h-5 rounded-full"
          style={{
            background: "hsl(75 38% 45%)",
            boxShadow:
              "0 0 0 2.5px white, 0 0 0 4px rgba(0,0,0,0.4), 0 0 12px 2px hsl(75 38% 45% / 0.8)",
            transition: "transform 0.12s ease",
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
