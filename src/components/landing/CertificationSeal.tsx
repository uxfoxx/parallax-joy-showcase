import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import Eyebrow from "@/components/ui/eyebrow";
import gmpBadge from "@/assets/gmp-certified-badge.webp";

/* Facts transcribed from certificate KMC-LK-20100098-OFPL. Keep in sync with
 * the physical certificate — these are verifiable claims, not marketing copy. */
const CERT_NO = "KMC-LK-20100098-OFPL";
const VERIFY_URL = "https://www.kmcertification.com";
const SCOPE =
  "Receiving, handling and storing of locally sourced and imported food and beverages, and repacking of dry food items — corn flour, dried nuts, seeds and herbs.";

/** Audit cycle. `date` is ISO so the "where we are now" marker stays true over time. */
const MILESTONES = [
  { label: "Issued", date: "2026-07-10" },
  { label: "Surveillance I", date: "2027-07-10" },
  { label: "Surveillance II", date: "2028-07-10" },
  { label: "Recertification", date: "2029-07-09" },
] as const;

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/* ─── The seal — a foil-stamped medallion that catches the light ──────── */

const Medallion = () => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Normalised pointer position across the medallion (0–1 on each axis).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 140, damping: 20 });
  const sy = useSpring(py, { stiffness: 140, damping: 20 });

  // Tilt the coin toward the cursor, and sweep a specular highlight across the
  // foil — the same way a real foil-stamped seal behaves under a light.
  const rotateY = useTransform(sx, [0, 1], [-15, 15]);
  const rotateX = useTransform(sy, [0, 1], [13, -13]);
  const sheenX = useTransform(sx, (v) => `${v * 100}%`);
  const sheenY = useTransform(sy, (v) => `${v * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.55), rgba(255,255,255,0.10) 38%, transparent 62%)`;

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
    <div className="relative flex items-center justify-center" style={{ perspective: 900 }}>
      {/* Warm foil glow — the only warm light in an otherwise forest-green section */}
      <div
        aria-hidden
        className="absolute w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(45 75% 55% / 0.20), transparent 62%)" }}
      />

      {/* Engraved ring — the milled edge of the coin, slowly turning */}
      <motion.svg
        aria-hidden
        viewBox="0 0 400 400"
        className="absolute w-[300px] h-[300px] sm:w-[356px] sm:h-[356px] pointer-events-none"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path id="seal-ring" d="M 200,32 a 168,168 0 1,1 -0.1,0" fill="none" />
        </defs>
        <text
          fill="hsl(45 60% 72%)"
          fontSize="12.5"
          letterSpacing="3.4"
          style={{ textTransform: "uppercase", fontWeight: 600 }}
        >
          <textPath href="#seal-ring" startOffset="0%">
            GMP Certified · Codex Alimentarius CXC 1-1969 · {CERT_NO} ·
          </textPath>
        </text>
      </motion.svg>

      {/* The coin */}
      <motion.div
        ref={ref}
        onPointerMove={reduced ? undefined : track}
        onPointerLeave={reset}
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-[186px] h-[186px] sm:w-[218px] sm:h-[218px] rounded-full"
      >
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_26px_60px_-18px_rgba(0,0,0,0.85)]">
          <img
            src={gmpBadge}
            alt={`GMP certified by Knowledge Mag Certifications — certificate ${CERT_NO}`}
            width={354}
            height={354}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain select-none"
            draggable={false}
          />
          {/* Specular foil sheen, clipped to the coin */}
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-soft-light"
            style={reduced ? undefined : { backgroundImage: sheen }}
          />
        </div>
        {/* Rim light, sells the raised edge */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: "inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -2px 6px rgba(0,0,0,0.35)" }}
        />
      </motion.div>
    </div>
  );
};

/* ─── Audit cycle rail ───────────────────────────────────────────────── */

const AuditRail = () => {
  const now = Date.now();
  const start = new Date(MILESTONES[0].date).getTime();
  const end = new Date(MILESTONES[MILESTONES.length - 1].date).getTime();
  const progress = Math.min(1, Math.max(0, (now - start) / (end - start)));

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <Eyebrow variant="plain" tone="muted">
          Audit cycle
        </Eyebrow>
        <span className="font-body text-[11px] text-primary-foreground/40 tabular-nums">
          Valid to {fmt(MILESTONES[MILESTONES.length - 1].date)}
        </span>
      </div>

      <div className="relative">
        {/* Rail. NB: Tailwind's opacity scale only emits multiples of 5 — an
         * off-scale value like /12 compiles to nothing and the rail vanishes. */}
        <div aria-hidden className="absolute left-0 right-0 top-[5px] h-px bg-white/[0.12]" />
        {/* Elapsed portion of the cycle. The width carries the real value so a
         * skipped animation can never imply a completed cycle; the transform
         * only wipes it in. */}
        <div
          aria-hidden
          className="absolute left-0 top-[5px] h-px overflow-hidden"
          style={{ width: `${progress * 100}%` }}
        >
          <motion.div
            className="h-full w-full bg-accent origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.2 }}
          />
        </div>

        <ol className="relative grid grid-cols-4 gap-2">
          {MILESTONES.map((m, i) => {
            const done = new Date(m.date).getTime() <= now;
            return (
              <li key={m.label} className="flex flex-col">
                <motion.span
                  aria-hidden
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: 0.3 + i * 0.09 }}
                  className={`w-[11px] h-[11px] rounded-full border-2 ${
                    done ? "bg-accent border-accent" : "bg-forest-deep border-white/25"
                  }`}
                />
                {/* 10px on mobile: "Recertification" is a single unbreakable
                  * word and overflows a quarter-width column at 11px. */}
                <span className="mt-3 font-body text-[10px] sm:text-xs font-semibold text-primary-foreground/85 leading-tight">
                  {m.label}
                </span>
                <span className="mt-0.5 font-body text-[10px] sm:text-[11px] text-primary-foreground/40 tabular-nums">
                  {fmt(m.date)}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

/* ─── Section ────────────────────────────────────────────────────────── */

/**
 * GMP certification. Rather than a generic trust-badge strip, the seal is
 * treated as the physical artifact it is — a foil coin that catches the light —
 * next to the parts of the certificate a buyer actually checks: the audited
 * scope, the audit cycle, and an independent verification route.
 */
const CertificationSeal = () => (
  <section
    id="certification"
    className="relative overflow-hidden py-section-base lg:py-section-base-lg"
    style={{ background: "hsl(150 40% 6%)" }}
  >
    {/* Dot grid — matches the other dark panels */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />

    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Seal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="lg:col-span-5 flex justify-center"
        >
          <Medallion />
        </motion.div>

        {/* Credential */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.12 }}
          className="lg:col-span-7"
        >
          <Eyebrow variant="pill" tone="accent" className="mb-6">
            Certified Operations
          </Eyebrow>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.08] tracking-tight text-primary-foreground">
            Audited, not just
            <span className="block text-gradient-gold-dark italic">asserted.</span>
          </h2>

          <p className="mt-5 font-body text-[15px] md:text-base text-primary-foreground/60 leading-relaxed max-w-xl">
            Our Wattala facility is GMP certified against the Codex Alimentarius
            General Principles of Food Hygiene — the same food-safety code your
            auditors work to. Certificate{" "}
            <span className="text-primary-foreground/85 tabular-nums">{CERT_NO}</span>.
          </p>

          {/* Audited scope */}
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
            <Eyebrow variant="plain" tone="muted" className="mb-2.5">
              Audited scope
            </Eyebrow>
            <p className="font-body text-sm text-primary-foreground/75 leading-relaxed">{SCOPE}</p>
          </div>

          <div className="mt-8">
            <AuditRail />
          </div>

          <a
            href={VERIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 pl-4 pr-3.5 py-2.5 font-body text-[13px] font-semibold text-accent transition-colors hover:bg-accent/15 hover:border-accent/50"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify this certificate
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <p className="mt-3 font-body text-[11px] text-primary-foreground/35">
            Independently issued by Knowledge Mag Certifications (Pvt) Ltd.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CertificationSeal;
