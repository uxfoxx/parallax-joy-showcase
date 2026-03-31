import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const ImmersiveBackground = () => {
  const { scrollYProgress } = useScroll();
  const glowRef = useRef<HTMLDivElement>(null);
  const current = useRef({ x: 50, y: 50 });
  const smooth = useRef({ x: 50, y: 50 });
  const raf = useRef(0);

  const orb1Y = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["10%", "80%"]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], ["50%", "20%"]);
  const orb1Scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 0.8]);
  const orb2Scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 1.2]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      current.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
    };

    const animate = () => {
      smooth.current.x += (current.current.x - smooth.current.x) * 0.05;
      smooth.current.y += (current.current.y - smooth.current.y) * 0.05;

      if (glowRef.current) {
        glowRef.current.style.left = `${smooth.current.x}%`;
        glowRef.current.style.top = `${smooth.current.y}%`;
      }

      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, 
            hsl(150 40% 6%) 0%, 
            hsl(150 40% 8%) 20%, 
            hsl(140 50% 10%) 40%, 
            hsl(150 40% 8%) 60%, 
            hsl(150 40% 6%) 80%, 
            hsl(150 40% 5%) 100%
          )`,
        }}
      />

      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.12] animate-orb"
        style={{
          background: "radial-gradient(circle, hsl(140 50% 19%), transparent 70%)",
          left: "10%",
          top: orb1Y,
          scale: orb1Scale,
        }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.08] animate-orb"
        style={{
          background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)",
          right: "5%",
          top: orb2Y,
          scale: orb2Scale,
          animationDelay: "-7s",
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06] animate-orb"
        style={{
          background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)",
          left: "40%",
          top: orb3Y,
          animationDelay: "-14s",
        }}
      />

      {/* Mouse-following glow — ref-based, no setState */}
      <div
        ref={glowRef}
        className="absolute w-[600px] h-[600px] rounded-full hidden md:block"
        style={{
          background: `radial-gradient(circle, hsl(75 38% 45% / 0.06), transparent 70%)`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Floating particles */}
      <div className="hidden md:block">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent/30 animate-particle"
            style={{
              left: `${8 + i * 8}%`,
              bottom: `-${i * 3}%`,
              animationDuration: `${12 + i * 3}s`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="immersiveNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#immersiveNoise)" />
        </svg>
      </div>
    </div>
  );
};

export default ImmersiveBackground;
