import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import Eyebrow from "@/components/ui/eyebrow";
import FoilSeal, { CERT_NO } from "@/components/FoilSeal";

/* Transcribed from certificate KMC-LK-20100098-OFPL. Verifiable claims. */
const VERIFY_URL = "https://www.kmcertification.com";
const SCOPE =
  "Receiving, handling and storing of locally sourced and imported food and beverages, and repacking of dry food items — corn flour, dried nuts, seeds and herbs.";

/**
 * Certification on /about. The homepage manifesto ("The Olive Standard")
 * makes the claim and closes with the seal; this is where the seal is
 * examined. The foil coin — ringed by its engraved standard and certificate
 * number — is the artifact; alongside it, only what a buyer actually needs:
 * the audited scope in plain English and an independent route to verify.
 */
const CertificationSection = () => (
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
      <div className="grid lg:grid-cols-12 gap-14 lg:gap-16 items-center">
        {/* The artifact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative flex items-center justify-center py-10">
            <FoilSeal
              coinClassName="w-44 h-44 sm:w-52 sm:h-52"
              glowClassName="w-[380px] h-[380px]"
              ringText={`GMP Certified · Codex Alimentarius CXC 1-1969 · ${CERT_NO} ·`}
              ringClassName="w-[290px] h-[290px] sm:w-[330px] sm:h-[330px]"
            />
          </div>
        </motion.div>

        {/* The examination */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.12 }}
          className="lg:col-span-7"
        >
          <Eyebrow variant="pill" tone="accent" className="mb-6">
            Certification
          </Eyebrow>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.08] tracking-tight text-primary-foreground">
            The Olive Standard,
            <span className="block text-gradient-gold-dark italic">certified.</span>
          </h2>

          <p className="mt-5 font-body text-[15px] md:text-base text-primary-foreground/60 leading-relaxed max-w-xl">
            A standard you describe yourself isn't worth much. Ours is audited by an
            independent body against the Codex Alimentarius General Principles of Food
            Hygiene — the same food-safety code your own auditors work to.
          </p>

          {/* Audited scope — hairline rows, not a card */}
          <div className="mt-9 border-y border-white/[0.08] divide-y divide-white/[0.08]">
            <div className="grid sm:grid-cols-[140px_1fr] gap-2 sm:gap-6 py-5">
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-primary-foreground/40 pt-0.5">
                What's covered
              </p>
              <p className="font-body text-sm text-primary-foreground/80 leading-relaxed">{SCOPE}</p>
            </div>
            <div className="grid sm:grid-cols-[140px_1fr] gap-2 sm:gap-6 py-5">
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-primary-foreground/40 pt-0.5">
                Issued by
              </p>
              <p className="font-body text-sm text-primary-foreground/80 leading-relaxed">
                Knowledge Mag Certifications (Pvt) Ltd · Certificate{" "}
                <span className="tabular-nums">{CERT_NO}</span>
              </p>
            </div>
          </div>

          <a
            href={VERIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 pl-4 pr-3.5 py-2.5 font-body text-[13px] font-semibold text-accent transition-colors hover:bg-accent/15 hover:border-accent/50"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify with the issuer
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

export default CertificationSection;
