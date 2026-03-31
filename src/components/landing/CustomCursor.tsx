import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const target = useRef({ x: -100, y: -100 });
  const raf = useRef(0);
  const current = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const checkHover = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setIsHovering(
        el.closest("a, button, [role='button'], input, textarea, select, [data-interactive]") !== null
      );
    };

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      setPos({ x: current.current.x, y: current.current.y });
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", checkHover);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", checkHover);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Trailing glow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{
          x: pos.x - 28,
          y: pos.y - 28,
          scale: isHovering ? 1.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      >
        <div className="w-14 h-14 rounded-full bg-accent/15 blur-xl" />
      </motion.div>
      {/* Dot cursor */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          transform: `translate(${pos.x - 4}px, ${pos.y - 4}px)`,
        }}
      >
        <div
          className="w-2 h-2 rounded-full bg-accent transition-transform duration-150"
          style={{
            transform: isHovering ? "scale(2)" : "scale(1)",
            boxShadow: "0 0 0 1px hsl(0 0% 0% / 0.3), 0 0 4px hsl(0 0% 0% / 0.2)",
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
