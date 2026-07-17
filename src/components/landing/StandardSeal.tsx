import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import gmpBadge from "@/assets/gmp-certified-badge.webp";

const CERT_NO = "KMC-LK-20100098-OFPL";

/**
 * The seal that closes "The Olive Standard".
 *
 * The manifesto above it is a claim; this is the receipt. It's set the way a
 * seal closes a charter — pressed over a hairline rule at the foot of the
 * statement — rather than as a separate trust-badge section, so the claim and
 * its proof read as one object. The full certificate lives on /about.
 */
const StandardSeal = () => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 140, damping: 20 });
  const sy = useSpring(py, { stiffness: 140, damping: 20 });

  // Foil catching the light, same behaviour as the certificate on /about.
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
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mt-14 flex flex-col items-center"
    >
      {/* The seal, pressed over the rule that closes the statement */}
      <div className="relative flex w-full max-w-sm items-center justify-center" style={{ perspective: 700 }}>
        <span
          aria-hidden
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/35 to-transparent"
        />
        {/* Warm foil glow, so the coin reads as metal against the dark scene */}
        <span
          aria-hidden
          className="absolute w-44 h-44 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(45 75% 55% / 0.22), transparent 62%)" }}
        />
        <motion.div
          ref={ref}
          onPointerMove={reduced ? undefined : track}
          onPointerLeave={reset}
          style={reduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full"
        >
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_18px_44px_-10px_rgba(0,0,0,0.9)]">
            <img
              src={gmpBadge}
              alt={`GMP certified by Knowledge Mag Certifications — certificate ${CERT_NO}`}
              width={354}
              height={354}
              /* NOT lazy. DepthScene's parallax wrapper is continuously
               * transformed, and Chromium never resolves the lazy-load
               * intersection inside it — the seal simply never loads. Costs
               * nothing: BrandManifesto is already React.lazy, so this 21KB
               * only mounts once the visitor scrolls near it. */
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

      <p className="mt-5 font-body text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
        GMP certified · Codex Alimentarius CXC 1-1969
      </p>

      <Link
        to="/about#certificate"
        /* py-3 keeps the tap target at ~44px; the text is only ~20px tall. */
        className="group mt-0.5 inline-flex items-center gap-1.5 px-2 py-3 font-body text-[13px] font-semibold text-accent transition-colors hover:text-accent/80"
      >
        See the certificate
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
};

export default StandardSeal;
