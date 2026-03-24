import { useEffect, useRef } from "react";

export const useScrollSpeed = () => {
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const timeout = useRef<number>();

  useEffect(() => {
    const container = document.querySelector(".snap-container") as HTMLElement | null;
    const target = container || window;

    const handleScroll = () => {
      const now = Date.now();
      const currentY = container ? container.scrollTop : window.scrollY;
      const dt = now - lastTime.current;

      if (dt > 0) {
        const speed = Math.abs(currentY - lastScrollY.current) / dt; // px/ms
        const clamped = Math.min(speed, 3); // cap at 3 px/ms
        const duration = 5 - (clamped / 3) * 3.5; // 5s → 1.5s
        document.documentElement.style.setProperty("--gradient-duration", `${duration}s`);
      }

      lastScrollY.current = currentY;
      lastTime.current = now;

      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => {
        document.documentElement.style.setProperty("--gradient-duration", "5s");
      }, 300);
    };

    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", handleScroll);
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);
};
