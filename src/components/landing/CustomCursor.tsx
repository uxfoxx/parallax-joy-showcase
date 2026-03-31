import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const target = useRef({ x: -100, y: -100 });
  const raf = useRef(0);
  const current = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only on desktop with fine pointer
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
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;
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

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Trailing glow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
        animate={{
          x: pos.x - 20,
          y: pos.y - 20,
          scale: isHovering ? 1.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      >
        <div className="w-10 h-10 rounded-full bg-accent/15 blur-md" />
      </motion.div>
      {/* Dot cursor */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          transform: `translate(${pos.x - 4}px, ${pos.y - 4}px)`,
        }}
      >
        <div
          className="w-2 h-2 rounded-full bg-accent transition-transform duration-150"
          style={{ transform: isHovering ? "scale(2)" : "scale(1)" }}
        />
      </div>
    </>
  );
};

export default CustomCursor;
