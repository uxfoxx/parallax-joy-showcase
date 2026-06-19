import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useInView,
  type MotionValue,
} from "framer-motion";
import { useCallback, useRef, type ReactNode } from "react";
import CursorSpotlight from "@/components/motion/CursorSpotlight";
import { useParallaxRange } from "@/lib/motion";

/**
 * DepthScene — the dark, cinematic 3D depth-parallax backdrop shared by
 * BrandManifesto ("The Olive Standard") and TeamSection ("Building
 * Partnerships That Last"), so the two read as visual siblings.
 *
 * Layer stack (back → front), each drifting at its own rate on BOTH scroll
 * and pointer so the planes separate in depth:
 *   1. near-black radial base
 *   2. aurora mesh blobs (forest + gold, animate-orb)
 *   3. giant ghost wordmark (caller-supplied)
 *   4. receding gold perspective floor-grid (signature element)
 *   5. depth-blurred floating particles
 *   6. foreground content slot (caller-supplied `children`)
 *   7. cursor-tracking gold spotlight overlay
 */

/** One depth particle. Lives in its own component so its useTransform hooks
 *  are legal (no hooks-in-loops). Closer (bigger) particles react more. */
const Particle = ({
  pmx,
  pmy,
  mag,
  className,
  style,
}: {
  pmx: MotionValue<number>;
  pmy: MotionValue<number>;
  mag: number;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const x = useTransform(pmx, (v) => v * mag);
  const y = useTransform(pmy, (v) => v * mag);
  return (
    <motion.span
      aria-hidden
      className={`absolute rounded-full ${className ?? ""}`}
      style={{ x, y, willChange: "transform", ...style }}
    />
  );
};

type DepthSceneProps = {
  /** The oversized faint word behind the content (e.g. "trust", "partners"). */
  ghostWord: string;
  /** Foreground content — eyebrow, headline, body, CTAs. */
  children: ReactNode;
};

const DepthScene = ({ ghostWord, children }: DepthSceneProps) => {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  // Only run the continuously-repainting floor-grid drift while the section is
  // near the viewport — keeps two off-screen scenes from contending for the
  // main thread (which made the marquee + navbar feel janky).
  const inView = useInView(sectionRef, { margin: "200px 0px 200px 0px" });

  // ── Scroll parallax per plane (different magnitudes = depth) ──
  const auroraY = useParallaxRange(sectionRef, [-30, 30]);
  const ghostY = useParallaxRange(sectionRef, [-70, 70]);
  const floorY = useParallaxRange(sectionRef, [40, -40]);
  const contentY = useParallaxRange(sectionRef, [60, -40]);

  // ── Pointer parallax — normalized -0.5..0.5, springed ──
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pmx = useSpring(rawX, { stiffness: 90, damping: 26, mass: 0.5 });
  const pmy = useSpring(rawY, { stiffness: 90, damping: 26, mass: 0.5 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduced) return;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [rawX, rawY, reduced],
  );
  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  // Per-plane pointer offsets (back small, front large + inverted for depth).
  const ghostPX = useTransform(pmx, (v) => v * 26);
  const ghostPY = useTransform(pmy, (v) => v * 18);
  const floorPX = useTransform(pmx, (v) => v * 14);
  const contentPX = useTransform(pmx, (v) => v * -22);
  const contentPY = useTransform(pmy, (v) => v * -12);

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative overflow-hidden min-h-[88vh] flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse 80% 70% at 50% 45%, hsl(150 48% 5%), hsl(150 50% 2%) 75%)",
      }}
    >
      {/* 2 — Aurora mesh blobs */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ y: reduced ? 0 : auroraY }}
      >
        <div
          className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full blur-[120px] opacity-[0.16] animate-orb"
          style={{ background: "radial-gradient(circle, hsl(140 55% 22%), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-[20%] -right-[8%] w-[45vw] h-[45vw] rounded-full blur-[120px] opacity-[0.12] animate-orb"
          style={{
            background: "radial-gradient(circle, hsl(75 40% 45%), transparent 70%)",
            animationDelay: "8s",
          }}
        />
      </motion.div>

      {/* 3 — Giant ghost wordmark */}
      <motion.div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ y: reduced ? 0 : ghostY }}
      >
        <motion.span
          className="font-display font-black tracking-tighter text-white/[0.035] leading-none whitespace-nowrap"
          style={{
            fontSize: "26vw",
            x: reduced ? 0 : ghostPX,
            translateY: reduced ? 0 : ghostPY,
            willChange: "transform",
          }}
        >
          {ghostWord}
        </motion.span>
      </motion.div>

      {/* 4 — Receding perspective floor grid (signature element) */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none overflow-hidden"
        style={{ perspective: "600px" }}
      >
        <motion.div
          className="absolute inset-x-[-50%] bottom-0 h-[140%]"
          style={{
            x: reduced ? 0 : floorPX,
            y: reduced ? 0 : floorY,
            // framer composes its own transform from x/y/rotateX — never set a
            // literal `transform` alongside these or they clash.
            rotateX: 62,
            transformOrigin: "center bottom",
            transformPerspective: 600,
            backgroundImage:
              "linear-gradient(to right, hsl(75 42% 48% / 0.16) 1px, transparent 1px), linear-gradient(to bottom, hsl(75 42% 48% / 0.16) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "linear-gradient(to top, black 0%, transparent 78%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 78%)",
            willChange: "transform, background-position",
          }}
          animate={reduced || !inView ? undefined : { backgroundPositionY: ["0px", "64px"] }}
          transition={
            reduced || !inView ? undefined : { duration: 3.2, repeat: Infinity, ease: "linear" }
          }
        />
      </div>

      {/* 5 — Floating depth particles */}
      {!reduced && (
        <>
          <Particle pmx={pmx} pmy={pmy} mag={46} className="bg-accent/40"
            style={{ top: "24%", left: "16%", width: 10, height: 10 }} />
          <Particle pmx={pmx} pmy={pmy} mag={30} className="bg-white/30 blur-[1px]"
            style={{ top: "62%", left: "22%", width: 6, height: 6 }} />
          <Particle pmx={pmx} pmy={pmy} mag={56} className="bg-accent/30"
            style={{ top: "32%", right: "18%", width: 12, height: 12 }} />
          <Particle pmx={pmx} pmy={pmy} mag={22} className="bg-white/20 blur-[2px]"
            style={{ top: "70%", right: "26%", width: 5, height: 5 }} />
          <Particle pmx={pmx} pmy={pmy} mag={38} className="bg-forest-light/40 blur-[1px]"
            style={{ top: "18%", right: "38%", width: 7, height: 7 }} />
          <Particle pmx={pmx} pmy={pmy} mag={18} className="bg-white/15 blur-[2px]"
            style={{ top: "48%", left: "8%", width: 4, height: 4 }} />
        </>
      )}

      {/* 6 — Foreground content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center"
        style={{
          y: reduced ? 0 : contentY,
          x: reduced ? 0 : contentPX,
          translateY: reduced ? 0 : contentPY,
        }}
      >
        {children}
      </motion.div>

      {/* 7 — Cursor-tracking gold spotlight */}
      <CursorSpotlight color="hsl(75 40% 60% / 0.16)" size={560} blendMode="screen" />
    </section>
  );
};

export default DepthScene;
