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

const FACTS = [
  { k: "Issued to", v: "Olive Foods (Pvt) Ltd\nNo. 615, Negombo Road, Mabola, Wattala" },
  { k: "Standard", v: "GMP — Codex Alimentarius\nCXC 1-1969, General Principles of Food Hygiene" },
  { k: "Certificate no.", v: CERT_NO },
  { k: "Issued", v: "10 July 2026" },
  { k: "Valid to", v: "9 July 2029" },
  { k: "Issued by", v: "Knowledge Mag Certifications (Pvt) Ltd" },
];

/**
 * The GMP certificate on the About page, shown in full. Framed like the
 * physical document it is — light rakes across the "glass" as the pointer
 * moves — and opens to full size for actually reading it. The homepage carries
 * the seal + audit cycle; here the document itself is the point.
 */
const CertificateDocument = () => {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 130, damping: 20 });
  const sy = useSpring(py, { stiffness: 130, damping: 20 });

  // A narrow band of light travelling across the glass, plus a slight tilt.
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
              className="group relative w-full max-w-[420px] rounded-lg overflow-hidden shadow-[0_40px_90px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/15 transition-shadow duration-500 hover:shadow-[0_50px_110px_-20px_rgba(0,0,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <img
                src={certificate}
                alt={`GMP certificate ${CERT_NO} issued to Olive Foods (Pvt) Ltd by Knowledge Mag Certifications`}
                width={618}
                height={882}
                loading="lazy"
                decoding="async"
                className="w-full h-auto block"
              />
              {/* Light raking across the glass */}
              <motion.span
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={reduced ? undefined : { backgroundImage: glare }}
              />
              {/* Enlarge affordance */}
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-forest-deep/85 backdrop-blur-sm px-3 py-1.5 font-body text-[11px] font-semibold text-primary-foreground/90 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100">
                <Maximize2 className="w-3 h-3" />
                Click to enlarge
              </span>
            </motion.button>
          </motion.div>

          {/* The record */}
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
              The certificate,
              <span className="block text-gradient-gold-dark italic">in full.</span>
            </h2>

            <p className="mt-5 font-body text-[15px] md:text-base text-primary-foreground/60 leading-relaxed max-w-lg">
              Not a badge we drew ourselves — the actual document, exactly as issued.
              Read it here, or check it against the issuer's register.
            </p>

            <dl className="mt-8 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {FACTS.map(({ k, v }) => (
                <div key={k} className="grid grid-cols-[110px_1fr] sm:grid-cols-[132px_1fr] gap-4 py-3">
                  <dt className="font-body text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-primary-foreground/40 pt-0.5">
                    {k}
                  </dt>
                  <dd className="font-body text-sm text-primary-foreground/85 whitespace-pre-line leading-relaxed">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>

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
