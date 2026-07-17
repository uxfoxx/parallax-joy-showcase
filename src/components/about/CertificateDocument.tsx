import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, Maximize2, ShieldCheck, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { EASE_OUT_EXPO } from "@/lib/motion";
import Eyebrow from "@/components/ui/eyebrow";
import certificate from "@/assets/gmp-certificate.webp";

/* Transcribed from the certificate. Verifiable claims — keep in sync. */
const CERT_NO = "KMC-LK-20100098-OFPL";
const VERIFY_URL = "https://www.kmcertification.com";
const SCOPE =
  "Receiving, handling and storing of locally sourced and imported food and beverages, and repacking of dry food items — corn flour, dried nuts, seeds and herbs.";

/* ─── Section ────────────────────────────────────────────────────────── */

/**
 * The GMP certificate, in full, on /about.
 *
 * The homepage manifesto ("The Olive Standard") makes the claim and closes it
 * with the seal; this is where that claim is cashed. The document does the
 * talking — the only copy alongside it is the scope in plain English and a
 * route to verify, rather than a restatement of fields already legible on the
 * page beside it.
 */
const CertificateDocument = () => {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 130, damping: 20 });
  const sy = useSpring(py, { stiffness: 130, damping: 20 });

  // Light raking across the glass of a framed document, plus a slight tilt.
  const rotateY = useTransform(sx, [0, 1], [-7, 7]);
  const rotateX = useTransform(sy, [0, 1], [5, -5]);
  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(600px circle at ${glareX} ${glareY}, rgba(255,255,255,0.16), transparent 45%)`;

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
    <section
      id="certificate"
      className="relative overflow-hidden py-section-base lg:py-section-base-lg"
      style={{ background: "hsl(150 40% 6%)" }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Warm glow behind the document, echoing the seal on the homepage */}
      <div
        aria-hidden
        className="absolute -left-32 top-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full pointer-events-none hidden lg:block"
        style={{ background: "radial-gradient(circle, hsl(45 70% 55% / 0.10), transparent 65%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* The document */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="lg:col-span-6 flex justify-center"
            style={{ perspective: 1200 }}
          >
            <motion.button
              ref={ref}
              type="button"
              onClick={() => setOpen(true)}
              onPointerMove={reduced ? undefined : track}
              onPointerLeave={reset}
              aria-label="View the full GMP certificate"
              style={reduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="group relative w-full max-w-[460px] rounded-lg overflow-hidden shadow-[0_40px_90px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/15 transition-shadow duration-500 hover:shadow-[0_50px_110px_-20px_rgba(0,0,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <img
                src={certificate}
                alt={`GMP certificate ${CERT_NO} issued to Olive Foods (Pvt) Ltd by Knowledge Mag Certifications`}
                width={618}
                height={882}
                /* NOT lazy. Inside this 3D-transformed (tilt) subtree Chromium
                 * resolves the lazy-load intersection unreliably — the document
                 * intermittently never loads at all. It's the whole point of the
                 * section, so a guaranteed 124KB beats an image that sometimes
                 * isn't there. Same reason as the seal in StandardSeal.tsx. */
                decoding="async"
                className="w-full h-auto block"
              />
              <motion.span
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={reduced ? undefined : { backgroundImage: glare }}
              />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-forest-deep/85 backdrop-blur-sm px-3 py-1.5 font-body text-[11px] font-semibold text-primary-foreground/90 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100">
                <Maximize2 className="w-3 h-3" />
                Click to enlarge
              </span>
            </motion.button>
          </motion.div>

          {/* What the document can't tell you at a glance */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.12 }}
            className="lg:col-span-6"
          >
            <Eyebrow variant="pill" tone="accent" className="mb-6">
              Certification
            </Eyebrow>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.08] tracking-tight text-primary-foreground">
              The Olive Standard,
              <span className="block text-gradient-gold-dark italic">on paper.</span>
            </h2>

            <p className="mt-5 font-body text-[15px] md:text-base text-primary-foreground/60 leading-relaxed max-w-lg">
              A standard you describe yourself isn't worth much. This is the document
              behind ours — issued by an independent body, audited against the same
              food-hygiene code your own auditors work to.
            </p>

            <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <Eyebrow variant="plain" tone="muted" className="mb-2.5">
                What's covered
              </Eyebrow>
              <p className="font-body text-sm text-primary-foreground/75 leading-relaxed">{SCOPE}</p>
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
              Certificate {CERT_NO} · Knowledge Mag Certifications (Pvt) Ltd
            </p>
          </motion.div>
        </div>
      </div>

      {/* Full-size view */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(94vw,760px)] p-0 bg-transparent border-0 shadow-none [&>button]:hidden">
          <DialogTitle className="sr-only">
            GMP certificate {CERT_NO} — Olive Foods (Pvt) Ltd
          </DialogTitle>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-forest-deep border border-white/20 flex items-center justify-center text-primary-foreground/80 hover:text-primary-foreground hover:border-accent/50 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <img
              src={certificate}
              alt={`GMP certificate ${CERT_NO} issued to Olive Foods (Pvt) Ltd`}
              className="w-full h-auto max-h-[88vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CertificateDocument;
