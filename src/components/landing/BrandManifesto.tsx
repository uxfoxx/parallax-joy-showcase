import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Globe2, Snowflake, Truck, Warehouse, type LucideIcon } from "lucide-react";
import Eyebrow from "@/components/ui/eyebrow";
import CursorSpotlight from "@/components/motion/CursorSpotlight";
import ScrollRevealWords from "@/components/motion/ScrollRevealWords";
import FoilSeal from "@/components/FoilSeal";

/**
 * BrandManifesto — "The Olive Standard".
 *
 * The line "a supply chain is really a chain of relationships" made literal:
 * the headline lights up word by word as it scrolls in, and beside it the
 * chain itself draws down the page — sourced → bonded → cold chain →
 * delivered — with a pulse of light travelling the rail and each link
 * switching on as the pulse reaches it. The GMP seal stamps down as the last
 * link: the statement is the claim, the seal is the receipt.
 *
 * Every figure is one the site already states (company.json at-a-glance).
 * Scroll-linked, so it follows the reader; prefers-reduced-motion shows the
 * finished chain.
 */
const LINKS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Globe2, title: "Sourced worldwide", text: "From producers in 30+ countries." },
  { icon: Warehouse, title: "Held in bond in Colombo", text: "Imported and stored in our bonded warehouse." },
  { icon: Snowflake, title: "Kept at −18 °C", text: "Frozen lines never leave an unbroken cold chain." },
  { icon: Truck, title: "Delivered island-wide", text: "To hotels, restaurants and retailers in all 25 districts." },
];

const ease = [0.22, 1, 0.36, 1] as const;

const BrandManifesto = () => {
  const reduced = !!useReducedMotion();
  const chainRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: chainRef, offset: ["start 78%", "end 52%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const railScale = useTransform(progress, [0, 1], [0, 1]);
  const pulseTop = useTransform(progress, (v) => `${Math.min(100, Math.max(0, v * 100))}%`);
  const pulseOpacity = useTransform(progress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  // Which links are lit; the seal stamps once the pulse has passed them all.
  const [lit, setLit] = useState(reduced ? LINKS.length : 0);
  const [sealed, setSealed] = useState(reduced);
  useMotionValueEvent(progress, "change", (v) => {
    if (reduced) return;
    const n = Math.min(LINKS.length, Math.floor(v * LINKS.length + 0.35));
    setLit((prev) => (prev === n ? prev : n));
    if (v > 0.96 && !sealed) setSealed(true);
  });

  return (
    <section
      aria-labelledby="olive-standard-title"
      // Sits between Why Choose Us and Built to Last: same edge colour as its
      // neighbours (hsl 150 40% 5%) plus a hairline, so the run of dark
      // sections reads as one chapter without hard seams.
      className="relative overflow-hidden border-t border-white/[0.06] py-section-base lg:py-section-base-lg"
      style={{ background: "radial-gradient(ellipse 90% 70% at 70% 40%, hsl(150 45% 7.5%), hsl(150 40% 5%) 70%)" }}
    >
      {/* Ambient: two slow forest/olive glows and a faint contour texture. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-[10%] top-[10%] h-[45vw] w-[45vw] rounded-full opacity-[0.14] blur-[120px] animate-orb"
          style={{ background: "radial-gradient(circle, hsl(140 55% 24%), transparent 70%)" }}
        />
        <div
          className="absolute -right-[12%] bottom-[-10%] h-[40vw] w-[40vw] rounded-full opacity-[0.12] blur-[120px] animate-orb"
          style={{ background: "radial-gradient(circle, hsl(75 40% 45%), transparent 70%)", animationDelay: "7s" }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-[0.05]" preserveAspectRatio="none" viewBox="0 0 800 600">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path key={i} d={`M-50 ${120 + i * 70} C 200 ${60 + i * 70}, 420 ${200 + i * 70}, 850 ${110 + i * 70}`} fill="none" stroke="white" strokeWidth="0.8" />
          ))}
        </svg>
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:px-8">
        {/* ── The statement ── */}
        <div>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease }}
          >
            <Eyebrow variant="pill" tone="primary" className="mb-8">
              The Olive Standard
            </Eyebrow>
          </motion.div>

          <ScrollRevealWords
            id="olive-standard-title"
            lines={["A supply chain is", "really a chain of", "relationships."]}
            highlight={["relationships"]}
            highlightClassName="italic text-gradient-gold-dark"
            className="font-display text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[60px]"
          />

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="mt-8 max-w-xl font-body text-base leading-relaxed text-white/60 sm:text-lg"
          >
            For thirty-plus years we've connected leading growers and producers with Sri Lanka's hotels, restaurants and retailers — sourced
            with intent, delivered with trust.
          </motion.p>

        </div>

        {/* ── The chain ── */}
        <div className="relative">
          <ol ref={chainRef} className="relative space-y-4 pl-16 sm:pl-20">
            {/* Rail: faint track, olive fill drawn by scroll, travelling pulse. */}
            <span aria-hidden className="absolute bottom-6 left-[27px] top-6 w-px bg-white/10 sm:left-[35px]" />
            <motion.span
              aria-hidden
              className="absolute bottom-6 left-[27px] top-6 w-px origin-top bg-gradient-to-b from-gold-light via-accent to-forest-light sm:left-[35px]"
              style={{ scaleY: reduced ? 1 : railScale }}
            />
            {!reduced && (
              <span aria-hidden className="absolute bottom-6 left-[27px] top-6 w-px sm:left-[35px]">
                <motion.span
                  className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-light shadow-[0_0_18px_6px_hsl(75_40%_60%/0.55)]"
                  style={{ top: pulseTop, opacity: pulseOpacity }}
                />
              </span>
            )}

            {LINKS.map(({ icon: Icon, title, text }, i) => {
              const on = i < lit;
              return (
                <li key={title} className="relative">
                  {/* Node on the rail */}
                  <span
                    aria-hidden
                    className={`absolute -left-16 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-2xl border transition-all duration-500 sm:-left-20 sm:h-[72px] sm:w-[72px] ${
                      on
                        ? "border-gold-light/50 bg-[hsl(75_40%_45%/0.18)] text-gold-light shadow-[0_0_30px_-6px_hsl(75_40%_55%/0.6)]"
                        : "border-white/10 bg-white/[0.03] text-white/35"
                    }`}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <div
                    className={`rounded-2xl border px-5 py-4 backdrop-blur-sm transition-all duration-500 sm:px-6 sm:py-5 ${
                      on ? "border-white/15 bg-white/[0.06] translate-x-0" : "border-white/[0.06] bg-white/[0.015] translate-x-2 opacity-60"
                    }`}
                  >
                    <p className={`font-display text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors duration-500 ${on ? "text-gold-light" : "text-white/35"}`}>
                      Link {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold text-white sm:text-xl">{title}</p>
                    <p className="mt-0.5 font-body text-sm text-white/55">{text}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* The receipt: the GMP seal stamps down as the final link. */}
          <div className="mt-8 flex items-center gap-5 pl-16 sm:pl-20">
            <motion.div
              initial={false}
              animate={sealed ? { scale: 1, opacity: 1, rotate: 0 } : { scale: 1.6, opacity: 0, rotate: -12 }}
              transition={{ type: "spring", stiffness: 380, damping: 18, mass: 0.8 }}
              className="relative shrink-0"
            >
              {sealed && !reduced && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full border-2 border-gold-light/60"
                  initial={{ scale: 0.9, opacity: 0.9 }}
                  animate={{ scale: 1.9, opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
              )}
              <FoilSeal coinClassName="w-20 h-20 sm:w-24 sm:h-24" glowClassName="w-36 h-36" />
            </motion.div>
            <motion.div
              initial={false}
              animate={sealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
              transition={{ duration: 0.5, delay: sealed && !reduced ? 0.15 : 0, ease }}
            >
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">Sealed</p>
              <p className="mt-1 font-body text-sm font-semibold text-white">GMP certified · Codex Alimentarius CXC 1-1969</p>
              <Link
                to="/about#certificate"
                className="group mt-1 inline-flex items-center gap-1.5 py-2 font-body text-[13px] font-semibold text-accent transition-colors hover:text-accent/80"
              >
                See the certification
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <CursorSpotlight color="hsl(75 40% 60% / 0.12)" size={560} blendMode="screen" />
    </section>
  );
};

export default BrandManifesto;
