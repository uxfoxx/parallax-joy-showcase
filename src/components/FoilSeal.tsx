import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import gmpBadge from "@/assets/gmp-certified-badge.webp";

export const CERT_NO = "KMC-LK-20100098-OFPL";

type FoilSealProps = {
  /** Tailwind size classes for the coin, e.g. "w-24 h-24 sm:w-28 sm:h-28". */
  coinClassName: string;
  /** When set, an engraved ring of this text slowly orbits the coin. */
  ringText?: string;
  /** Tailwind size classes for the ring (should exceed the coin). */
  ringClassName?: string;
  /** Tailwind size classes for the warm glow behind the coin. */
  glowClassName?: string;
};

/**
 * The GMP seal as the foil-stamped object it is: the coin tilts toward the
 * pointer and a specular highlight sweeps the gold, the way real foil catches
 * a light. Shared by the homepage manifesto (StandardSeal) and the About
 * certification section so the artifact is identical everywhere it appears.
 *
 * The image is deliberately NOT lazy — inside 3D-transformed subtrees Chromium
 * never reliably resolves the lazy-load intersection, so a lazy seal can
 * simply never load (see StandardSeal/CertificationSection call sites).
 */
const FoilSeal = ({ coinClassName, ringText, ringClassName, glowClassName }: FoilSealProps) => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 140, damping: 20 });
  const sy = useSpring(py, { stiffness: 140, damping: 20 });

  const rotateY = useTransform(sx, [0, 1], [-16, 16]);
  const rotateX = useTransform(sy, [0, 1], [14, -14]);
  const sheenX = useTransform(sx, (v) => `${v * 100}%`);
  const sheenY = useTransform(sy, (v) => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.6), rgba(255,255,255,0.12) 38%, transparent 62%)`;

  const track = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="relative flex items-center justify-center" style={{ perspective: 700 }}>
      {/* Warm foil glow — the only warm light in the forest-green scenes */}
      <span
        aria-hidden
        className={`absolute rounded-full pointer-events-none ${glowClassName ?? "w-44 h-44"}`}
        style={{ background: "radial-gradient(circle, hsl(45 75% 55% / 0.22), transparent 62%)" }}
      />

      {/* Engraved ring — the milled edge of the coin, slowly turning */}
      {ringText && (
        <motion.svg
          aria-hidden
          viewBox="0 0 400 400"
          className={`absolute pointer-events-none ${ringClassName ?? ""}`}
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <path id="foil-seal-ring" d="M 200,32 a 168,168 0 1,1 -0.1,0" fill="none" />
          </defs>
          <text
            fill="hsl(45 60% 72%)"
            fontSize="12.5"
            letterSpacing="3.4"
            style={{ textTransform: "uppercase", fontWeight: 600 }}
          >
            <textPath href="#foil-seal-ring" startOffset="0%">
              {ringText}
            </textPath>
          </text>
        </motion.svg>
      )}

      {/* The coin */}
      <motion.div
        ref={ref}
        onPointerMove={reduced ? undefined : track}
        onPointerLeave={reset}
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative rounded-full ${coinClassName}`}
      >
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_18px_44px_-10px_rgba(0,0,0,0.9)]">
          <img
            src={gmpBadge}
            alt={`GMP certified by Knowledge Mag Certifications — certificate ${CERT_NO}`}
            width={354}
            height={354}
            decoding="async"
            className="w-full h-full object-contain select-none"
            draggable={false}
          />
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-soft-light"
            style={reduced ? undefined : { backgroundImage: sheen }}
          />
        </div>
        {/* Rim light — sells the raised edge of a struck coin */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: "inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -2px 6px rgba(0,0,0,0.4)" }}
        />
      </motion.div>
    </div>
  );
};

export default FoilSeal;
