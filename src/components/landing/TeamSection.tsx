import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import SplitText from "@/components/motion/SplitText";
import MagneticButton from "@/components/motion/MagneticButton";
import CursorSpotlight from "@/components/motion/CursorSpotlight";
import sectors from "@/data/sectors.json";

/**
 * TeamSection — "Built to Last".
 *
 * The section's own sentence — relationships over transactions, consistency
 * over sales, trust over speed — becomes the centrepiece: three pairs where
 * the lesser word is struck through as each row arrives. Beside it, the
 * thirty-plus years counted up, and below, a slow ribbon of the trades Olive
 * Foods supplies, each a link to its sector page. Interlocking rings turning
 * in the background are the "link" motif, kept faint.
 *
 * Facts only from the site (30+ years, the six sectors in sectors.json).
 */
const VALUES = [
  { keep: "Relationships", over: "transactions" },
  { keep: "Consistency", over: "sales" },
  { keep: "Trust", over: "speed" },
];

const ease = [0.22, 1, 0.36, 1] as const;

/** Shows the real figure by default (prerendered HTML, no-JS, reduced motion);
 *  resets to 0 just before it scrolls into view, then counts up. */
function YearsCounter({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const near = useInView(ref, { once: true, margin: "0px 0px 400px 0px" });
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [n, setN] = useState(30);
  const armed = useRef(false);
  useEffect(() => {
    if (reduced || !near || armed.current) return;
    const r = ref.current?.getBoundingClientRect();
    // Only reset if it's still below the fold — never visibly jump 30 → 0.
    if (r && r.top > window.innerHeight) {
      armed.current = true;
      setN(0);
    }
  }, [near, reduced]);
  useEffect(() => {
    if (reduced || !inView || !armed.current) return;
    const controls = animate(0, 30, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduced]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
    </span>
  );
}

function ValueRow({ keep, over, index, reduced }: { keep: string; over: string; index: number; reduced: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const shown = reduced || inView;
  return (
    <motion.li
      ref={ref}
      initial={reduced ? false : { opacity: 0, x: 30 }}
      animate={shown ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.7, delay: index * 0.12, ease }}
      className="group relative flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 backdrop-blur-sm transition-colors duration-300 hover:border-gold-light/30 hover:bg-white/[0.07] sm:px-7 sm:py-6"
    >
      <span className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light/80">{String(index + 1).padStart(2, "0")}</span>
      <span className="font-display text-3xl font-bold tracking-tight text-gradient-gold-dark sm:text-4xl">{keep}</span>
      <span className="font-body text-sm text-white/40">over</span>
      <span className="relative font-display text-xl font-semibold text-white/45 sm:text-2xl">
        {over}
        {/* the strike draws across once the row is in view */}
        <motion.span
          aria-hidden
          className="absolute left-[-4%] right-[-4%] top-[55%] h-[2px] origin-left rounded-full bg-gold-light/80"
          initial={reduced ? false : { scaleX: 0 }}
          animate={shown ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.6, delay: index * 0.12 + 0.45, ease }}
        />
      </span>
    </motion.li>
  );
}

const TeamSection = () => {
  const reduced = !!useReducedMotion();
  const ribbon = [...sectors, ...sectors];

  return (
    <section
      aria-labelledby="built-to-last-title"
      className="relative overflow-hidden border-t border-white/[0.06] py-section-base lg:py-section-base-lg"
      style={{ background: "linear-gradient(175deg, hsl(150 40% 5%) 0%, hsl(146 45% 9%) 60%, hsl(140 50% 13%) 100%)" }}
    >
      {/* Interlocking rings — the "link" motif — turning very slowly. */}
      <div aria-hidden className="pointer-events-none absolute -right-[12%] top-1/2 hidden h-[620px] w-[900px] -translate-y-1/2 opacity-[0.12] md:block">
        <motion.svg
          viewBox="0 0 900 620"
          className="h-full w-full"
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="360" cy="310" r="230" fill="none" stroke="hsl(75 40% 60%)" strokeWidth="1.2" />
          <circle cx="540" cy="310" r="230" fill="none" stroke="hsl(75 40% 60%)" strokeWidth="1.2" />
          <circle cx="360" cy="310" r="170" fill="none" stroke="white" strokeWidth="0.6" strokeDasharray="2 10" />
          <circle cx="540" cy="310" r="170" fill="none" stroke="white" strokeWidth="0.6" strokeDasharray="2 10" />
        </motion.svg>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] bottom-[-20%] h-[40vw] w-[40vw] rounded-full opacity-[0.14] blur-[120px] animate-orb"
        style={{ background: "radial-gradient(circle, hsl(75 40% 45%), transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-8">
        {/* ── Left: the promise + the years ── */}
        <div>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease }}
          >
            <Eyebrow variant="pill" tone="primary" className="mb-8">
              Built to Last
            </Eyebrow>
          </motion.div>

          <h2 id="built-to-last-title" className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[60px]">
            <SplitText text="Building partnerships" by="word" stagger={0.05} as="span" className="block" />
            <span className="mt-1 block">
              <SplitText text="that" by="word" stagger={0.05} delay={0.18} as="span" className="mr-[0.28em]" />
              <SplitText text="last." by="word" stagger={0.05} delay={0.28} as="span" className="italic text-gradient-gold-dark" tokenClassName="text-gradient-gold-dark italic" />
            </span>
          </h2>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            className="mt-7 max-w-lg font-body text-base leading-relaxed text-white/60 sm:text-lg"
          >
            Olive Foods exists because of relationships — between our team and the suppliers, hoteliers and retailers who shape Sri Lanka's food
            trade.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
            className="mt-10 flex items-end gap-5"
          >
            <p className="font-display text-[88px] font-bold leading-[0.8] tracking-tight text-white sm:text-[112px]">
              <YearsCounter reduced={reduced} />
              <span className="text-gradient-gold-dark">+</span>
            </p>
            <p className="max-w-[12rem] pb-2 font-body text-sm leading-snug text-white/55">
              years connecting producers with Sri Lanka's kitchens and shelves
            </p>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.6, delay: 0.55, ease }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <MagneticButton>
              <Button asChild variant="brand" size="pill" className="group font-body">
                <Link to="/contact">
                  Become a partner
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button asChild variant="heroOutline" size="pill" className="font-body">
                <Link to="/about">Our story</Link>
              </Button>
            </MagneticButton>
          </motion.div>
        </div>

        {/* ── Right: what we value ── */}
        <div>
          <p className="mb-4 font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">· What we value</p>
          <ul className="space-y-3">
            {VALUES.map((v, i) => (
              <ValueRow key={v.keep} {...v} index={i} reduced={reduced} />
            ))}
          </ul>
        </div>
      </div>

      {/* ── Ribbon: the trades we supply ── */}
      <div className="relative z-10 mt-16 lg:mt-20">
        <p className="mb-4 text-center font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">Partners in every kind of kitchen</p>
        <div className="group/ribbon relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div
            className={`flex w-max gap-3 ${reduced ? "flex-wrap justify-center" : "animate-marquee-scroll group-hover/ribbon:[animation-play-state:paused]"}`}
            style={reduced ? undefined : { animationDuration: "38s" }}
          >
            {(reduced ? sectors : ribbon).map((s, i) => (
              <Link
                key={`${s.slug}-${i}`}
                to={`/supply/${s.slug}`}
                aria-hidden={i >= sectors.length ? true : undefined}
                tabIndex={i >= sectors.length ? -1 : undefined}
                className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 font-display text-sm font-semibold text-white/80 transition-colors hover:border-gold-light/40 hover:bg-white/[0.08] hover:text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold-light/70" />
                {s.name}
                <ArrowUpRight className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-light" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CursorSpotlight color="hsl(75 40% 60% / 0.12)" size={520} blendMode="screen" />
    </section>
  );
};

export default TeamSection;
