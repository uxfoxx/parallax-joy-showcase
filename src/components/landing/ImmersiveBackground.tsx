import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

const ImmersiveBackground = () => {
  const { scrollYProgress } = useScroll();
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  // Orbs shift based on scroll
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["-10%", "60%"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["20%", "80%"]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], ["50%", "100%"]);
  const orb4Y = useTransform(scrollYProgress, [0, 1], ["10%", "70%"]);

  const orb1Scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 0.8]);
  const orb2Scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1.2, 1, 0.9]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base gradient that shifts with scroll */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, 
              hsl(150 40% 6%) 0%, 
              hsl(150 40% 8%) 20%, 
              hsl(140 50% 10%) 40%, 
              hsl(150 40% 8%) 60%, 
              hsl(140 50% 12%) 80%, 
              hsl(150 40% 6%) 100%
            )
          `,
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.15]"
        style={{
          top: orb1Y,
          left: "10%",
          scale: orb1Scale,
          background: "radial-gradient(circle, hsl(140 50% 19%), transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.12]"
        style={{
          top: orb2Y,
          right: "5%",
          scale: orb2Scale,
          background: "radial-gradient(circle, hsl(80 50% 31% / 0.8), transparent 70%)",
          filter: "blur(120px)",
        }}
      />
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{
          top: orb3Y,
          left: "40%",
          background: "radial-gradient(circle, hsl(75 38% 45% / 0.6), transparent 70%)",
          filter: "blur(130px)",
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.10]"
        style={{
          top: orb4Y,
          left: "60%",
          background: "radial-gradient(circle, hsl(150 40% 14%), transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* Mouse-reactive glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.08] hidden md:block"
        style={{
          left: smoothX,
          top: smoothY,
          x: "-50%",
          y: "-50%",
          background: "radial-gradient(circle, hsl(75 40% 60% / 0.6), transparent 60%)",
          filter: "blur(80px)",
          scaleX: 1.2,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="immersive-particle"
            style={{
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 23 + 10) % 100}%`,
              width: `${2 + (i % 4)}px`,
              height: `${2 + (i % 4)}px`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${8 + (i % 6) * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Noise texture overlay */}
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
