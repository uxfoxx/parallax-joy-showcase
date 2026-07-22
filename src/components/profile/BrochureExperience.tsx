import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Package } from "lucide-react";
import { useProducts, type Product } from "@/lib/api";
import { cdnImg } from "@/lib/img";
import FoilSeal, { CERT_NO } from "@/components/FoilSeal";

/* ─────────────────────────────────────────────────────────────────────────
 * The Olive Foods lookbook, set in code. Mirrors the print brochure's
 * structure — cover · §01 prologue · certificate plate · §02 index ·
 * §03 house book · §04 directory/colophon — as one continuous scroll with
 * motion a printed page can't do. Serif is Fraunces (the brochure's own
 * colophon typeface), loaded only for this view.
 * ──────────────────────────────────────────────────────────────────────── */

const SERIF: React.CSSProperties = { fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif" };
const EASE = [0.22, 1, 0.36, 1] as const;

/* Content transcribed from the print brochure (Vol. I). */
const INDEX_CATEGORIES = [
  { n: "01", name: "Canned Vegetables & Dried Fruits", origins: "Italy · Belgium" },
  { n: "02", name: "Chocolate & Pastry", origins: "Belgium · France" },
  { n: "03", name: "Dry Nuts, Seeds & Dried Fruits", origins: "United States · India" },
  { n: "04", name: "Edible Oils", origins: "Italy · Spain" },
];

const HOUSES = ["Galle Face Hotel", "ITC", "Sheraton", "Shangri-La", "Marriott", "Taj"];

const DIRECTORY = [
  { label: "Voice", value: "+94 11 207 1717", href: "tel:+94112071717" },
  { label: "WhatsApp", value: "wa.me/94112071717", href: "https://wa.me/94112071717", external: true },
  { label: "Post", value: "info@olivefoods.lk", href: "mailto:info@olivefoods.lk" },
  { label: "Web", value: "olivefoods.lk", href: "/", internal: true },
  { label: "Facebook", value: "/olivefoodslk", href: "https://www.facebook.com/olivefoodslk", external: true },
];

/* Shared micro-typography */
const mono = "font-body text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em]";

/** Running head + folio that opens every paper section, like the print page furniture. */
const RunningHead = ({ section, folio, dark }: { section: string; folio: string; dark?: boolean }) => (
  <div
    className={`flex items-baseline justify-between border-b pb-4 mb-12 sm:mb-16 ${
      dark ? "border-white/15 text-white/45" : "border-foreground/15 text-foreground/45"
    }`}
  >
    <span className={mono}>Olive Foods · Volume I</span>
    <span className={`${mono} hidden sm:block`}>{section}</span>
    <span className={`${mono} tabular-nums`}>{folio}</span>
  </div>
);

/** Line-mask reveal for display type. */
const RevealLine = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block"
      initial={{ y: "110%" }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);

/* ─── §02 — one full-bleed category plate ─────────────────────────────── */

const CategoryPlate = ({
  entry,
  plate,
  product,
}: {
  entry: (typeof INDEX_CATEGORIES)[number];
  plate: string;
  product: Product | undefined;
}) => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // Gentle parallax: the packshot drifts slower than the page.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <figure ref={ref} className="relative border-t border-foreground/10">
      {/* Ghost index number */}
      <span
        aria-hidden
        style={SERIF}
        className="pointer-events-none absolute right-2 top-6 sm:right-6 select-none text-[26vw] sm:text-[18vw] leading-none font-light italic text-foreground/[0.05]"
      >
        {entry.n}
      </span>

      {/* The image, full resolution, nothing else on the plate */}
      <div className="relative flex items-center justify-center min-h-[62svh] sm:min-h-[78svh] px-6 py-16 sm:py-20">
        {product?.image_url ? (
          <motion.img
            src={cdnImg(product.image_url, 1200)}
            alt={entry.name}
            decoding="async"
            style={reduced ? undefined : { y }}
            initial={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-18%" }}
            transition={{ duration: 1.1, ease: EASE }}
            className="max-h-[52svh] sm:max-h-[64svh] w-auto max-w-full object-contain drop-shadow-[0_30px_50px_rgba(20,40,25,0.18)]"
          />
        ) : (
          <div className="flex h-[40svh] items-center justify-center text-foreground/20">
            <Package className="w-20 h-20" strokeWidth={1} />
          </div>
        )}
      </div>

      {/* Caption strip — print-style figure furniture */}
      <figcaption className="relative z-10 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-foreground/10 px-6 sm:px-10 py-5">
        <span className={`${mono} text-accent`}>
          {entry.n} · Plate {plate}
        </span>
        <span style={SERIF} className="text-xl sm:text-2xl font-medium text-foreground">
          {entry.name}
        </span>
        <span className={`${mono} ml-auto text-foreground/40`}>{entry.origins}</span>
      </figcaption>
    </figure>
  );
};

/* ─── the lookbook ────────────────────────────────────────────────────── */

type Props = {
  /** Return to the profile chooser; null when the brochure is the only view. */
  onBack: (() => void) | null;
  /** Print edition, offered as a download when it exists. */
  pdfUrl: string | null;
};

const BrochureExperience = ({ onBack, pdfUrl }: Props) => {
  const reduced = useReducedMotion();
  const { data: products = [] } = useProducts();

  // One representative packshot per index category (featured first).
  const plateProducts = useMemo(() => {
    const pick = (cat: string) => {
      const inCat = products.filter((p) => {
        const cats = (p as Product & { categories?: string[] }).categories;
        return p.image_url && (p.category === cat || cats?.includes(cat));
      });
      return inCat.find((p) => p.featured) ?? inCat[0];
    };
    return INDEX_CATEGORIES.map((c) => pick(c.name));
  }, [products]);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  return (
    <main className="relative bg-background">
      {/* Fraunces is served from the global fonts request in index.html —
         browsers only fetch a family once glyphs actually use it, so the
         other pages pay nothing. (A Helmet-injected <link> here never
         reached <head> alongside the Seo Helmet instance.) */}

      {/* ── Reading bar: back · running title · download ── */}
      <div className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[hsl(150_40%_5%/0.92)] backdrop-blur-md">
        <div className="flex h-12 items-center justify-between gap-3 px-4 sm:px-6">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 py-2 font-body text-sm text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <Link to="/" className="inline-flex items-center gap-1.5 py-2 font-body text-sm text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> olivefoods.lk
            </Link>
          )}
          <span className={`${mono} hidden sm:block text-white/45`}>Olive Foods · A Supplier's Lookbook</span>
          {pdfUrl ? (
            <a
              href={pdfUrl}
              download
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-white hover:bg-accent/90 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </a>
          ) : (
            <span />
          )}
        </div>
        {/* Reading progress hairline */}
        <motion.div style={{ scaleX: progress }} className="h-[2px] origin-left bg-accent" />
      </div>

      {/* ════ COVER ════ */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[hsl(150_40%_5%)] px-6 pt-12 text-white sm:px-10">
        {/* Dot grid + warm breath */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "26px 26px" }}
        />
        <div
          aria-hidden
          className="absolute -top-40 right-[-15%] h-[60vw] w-[60vw] rounded-full pointer-events-none opacity-[0.15]"
          style={{ background: "radial-gradient(circle, hsl(45 70% 55%), transparent 65%)", filter: "blur(90px)" }}
        />

        {/* Corner marks */}
        <div className="relative z-10 mt-6 flex items-start justify-between">
          <div className="space-y-1">
            <p className={`${mono} text-white/60`}>Vol. I</p>
            <p className={`${mono} text-white/35`}>Colombo · Est. 1993</p>
          </div>
          <p className={`${mono} text-white/60 tabular-nums`}>№ 001</p>
        </div>

        {/* Masthead */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className={`${mono} text-accent mb-7`}
          >
            A Supplier's Lookbook
          </motion.p>

          <h1 style={SERIF} className="text-[19vw] leading-[0.9] font-light tracking-tight sm:text-[13vw] lg:text-[10rem]">
            <RevealLine delay={0.25}>Olive</RevealLine>
            <RevealLine delay={0.4} className="italic">
              Foods.
            </RevealLine>
          </h1>

          {/* Spec rows */}
          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
            className="mt-14 w-full max-w-md divide-y divide-white/10 border-y border-white/10 text-left"
          >
            {[
              ["Subject", "Premium food import & distribution"],
              ["Territory", "Sri Lanka, island-wide"],
              ["Trade", "HoReCa · Modern Trade"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[92px_1fr] gap-4 py-3">
                <dt className={`${mono} text-white/40 pt-0.5`}>{k}</dt>
                <dd className={`${mono} text-white/85`}>{v}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.05 }}
            style={SERIF}
            className="mt-12 max-w-sm text-lg italic text-white/60"
          >
            "A supply chain is really a chain of relationships."
          </motion.p>
        </div>

        {/* Foot of cover */}
        <div className="relative z-10 mb-6 flex items-end justify-between">
          <p className={`${mono} text-white/35`}>olivefoods.lk</p>
          <motion.span
            aria-hidden
            animate={reduced ? undefined : { y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className={`${mono} text-white/45`}
          >
            Scroll ↓
          </motion.span>
        </div>
      </section>

      {/* ════ §01 — PROLOGUE ════ */}
      <section className="relative px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <RunningHead section="Prologue" folio="02 / 05" />

          <p className={`${mono} text-accent mb-8`}>§ 01 — On the House</p>

          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 style={SERIF} className="text-4xl leading-[1.08] font-light text-foreground sm:text-5xl lg:text-[3.4rem]">
                <RevealLine>Thirty years of moving</RevealLine>
                <RevealLine delay={0.08}>
                  ingredients from where they{" "}
                </RevealLine>
                <RevealLine delay={0.16} className="italic text-gradient-gold">
                  grow best
                </RevealLine>
                <RevealLine delay={0.24}>to where they matter most.</RevealLine>
              </h2>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                className="mt-10 max-w-xl space-y-5 font-body text-[15px] leading-relaxed text-muted-foreground"
              >
                <p>
                  <span style={SERIF} className="float-left mr-3 mt-1 text-[3.4rem] leading-[0.8] font-light text-accent">
                    O
                  </span>
                  live Foods was founded in 1993 to bring globally-sourced food brands to Sri
                  Lanka's hotels, restaurants, and retailers. Three decades on, we operate as an
                  integrated import-to-shelf partner — sourcing, customs, bonded warehousing,
                  cold chain, and our own delivery fleet.
                </p>
                <p>
                  We measure the work in relationships, not transactions — with the growers we
                  represent and the chefs and buyers we supply.
                </p>
              </motion.div>
            </div>

            {/* Roman-numeral ledger */}
            <div className="lg:col-span-5">
              <ol className="divide-y divide-foreground/10 border-y border-foreground/10">
                {[
                  ["I", "Island-wide delivery", "25 districts, own fleet"],
                  ["II", "Cold-chain logistics", "−18 °C, port to shelf"],
                  ["III", "Bonded warehousing", "Customs-approved facility"],
                  ["IV", "HoReCa & Modern Trade", "3 trade channels served"],
                ].map(([num, title, note], i) => (
                  <motion.li
                    key={num}
                    initial={{ opacity: 0, x: 22 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6, delay: i * 0.09, ease: EASE }}
                    className="group flex items-baseline gap-5 py-5"
                  >
                    <span style={SERIF} className="w-9 shrink-0 text-xl italic text-accent/70">
                      {num}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                        {title}
                      </span>
                      <span className={`${mono} mt-1 block text-foreground/40`}>{note}</span>
                    </span>
                  </motion.li>
                ))}
              </ol>

              {/* Plate I — the cold room, as typographic plate */}
              <motion.figure
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                className="relative mt-10 overflow-hidden rounded-sm bg-[hsl(150_40%_6%)] px-8 py-12 text-center"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none opacity-60"
                  style={{
                    background: "radial-gradient(ellipse at 50% 110%, hsl(190 50% 30% / 0.35), transparent 60%)",
                  }}
                />
                <p style={SERIF} className="relative text-6xl font-light italic text-white/90">
                  −18 °C
                </p>
                <figcaption className={`${mono} relative mt-5 text-white/40`}>
                  Plate I — Wattala facility, cold room
                </figcaption>
              </motion.figure>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CERTIFICATE PLATE ════ */}
      <section className="relative overflow-hidden bg-[hsl(150_40%_5%)] px-6 py-24 sm:py-32">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "26px 26px" }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-18%" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative flex flex-col items-center"
        >
          <FoilSeal
            coinClassName="w-36 h-36 sm:w-44 sm:h-44"
            glowClassName="w-[320px] h-[320px]"
            ringText={`GMP Certified · Codex Alimentarius CXC 1-1969 · ${CERT_NO} ·`}
            ringClassName="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px]"
          />
          <p className={`${mono} mt-12 text-white/60`}>GMP · Codex Alimentarius CXC 1-1969</p>
          <p className={`${mono} mt-2 text-white/35 tabular-nums`}>Cert. {CERT_NO}</p>
        </motion.div>
      </section>

      {/* ════ §02 — AN INDEX ════ */}
      <section className="relative px-6 pt-20 sm:px-10 sm:pt-28">
        <div className="mx-auto max-w-6xl">
          <RunningHead section="An Index" folio="03 / 05" />
          <p className={`${mono} text-accent mb-8`}>§ 02 — An Index</p>

          <div className="grid gap-10 pb-16 sm:pb-20 lg:grid-cols-12">
            <h2 style={SERIF} className="text-4xl font-light leading-[1.08] text-foreground sm:text-5xl lg:col-span-7 lg:text-[3.4rem]">
              <RevealLine>Four categories,</RevealLine>
              <RevealLine delay={0.08} className="italic text-gradient-gold">
                selected
              </RevealLine>
              <RevealLine delay={0.16}>— of ten in the range.</RevealLine>
            </h2>
            <p className="max-w-xs self-end font-body text-sm leading-relaxed text-muted-foreground lg:col-span-5 lg:justify-self-end">
              A partial index. The full catalogue lives on the products page — continue past
              the plates, or turn to the directory and write to us.
            </p>
          </div>
        </div>

        {/* The plates — image only, full resolution */}
        <div className="mx-auto max-w-6xl">
          {INDEX_CATEGORIES.map((entry, i) => (
            <CategoryPlate key={entry.n} entry={entry} plate={["II", "III", "IV", "V"][i]} product={plateProducts[i]} />
          ))}
        </div>

        {/* Continue strip */}
        <div className="mx-auto max-w-6xl border-t border-foreground/10 py-10">
          <Link
            to="/products"
            className="group flex flex-wrap items-baseline justify-between gap-4"
          >
            <span className={`${mono} text-foreground/40`}>Continue the index →</span>
            <span style={SERIF} className="text-2xl italic text-foreground transition-colors group-hover:text-accent sm:text-3xl">
              View the full catalogue
              <ArrowUpRight className="ml-2 inline h-5 w-5 -translate-y-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-2" />
            </span>
            <span className={`${mono} text-foreground/40`}>olivefoods.lk/products</span>
          </Link>
        </div>
      </section>

      {/* ════ §03 — THE HOUSE BOOK ════ */}
      <section className="relative overflow-hidden bg-[hsl(150_40%_5%)] px-6 py-20 text-white sm:px-10 sm:py-28">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "26px 26px" }}
        />
        <div className="relative mx-auto max-w-6xl">
          <RunningHead section="The House Book" folio="04 / 05" dark />
          <p className={`${mono} text-accent mb-8`}>§ 03 — The House Book</p>

          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 style={SERIF} className="text-4xl font-light leading-[1.05] sm:text-5xl lg:text-[3.6rem]">
                <RevealLine>Trusted by</RevealLine>
                <RevealLine delay={0.08}>the houses</RevealLine>
                <RevealLine delay={0.16}>
                  that <em className="not-italic italic text-gradient-gold-dark">set the</em>
                </RevealLine>
                <RevealLine delay={0.24} className="italic text-gradient-gold-dark">
                  standard.
                </RevealLine>
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                className="mt-8 max-w-sm font-body text-[15px] leading-relaxed text-white/55"
              >
                A selection of the hospitality partners we supply in Sri Lanka. Not a client
                list, a house book — long-standing relationships with the kitchens and buyers
                who shape the country's fine-dining and premium retail trade.
              </motion.p>

              {/* Stats hairline */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
                className="mt-10 grid max-w-sm grid-cols-3 divide-x divide-white/10 border-y border-white/10"
              >
                {[
                  ["30+", "Years trading"],
                  ["25", "Districts served"],
                  ["3", "Trade channels"],
                ].map(([v, l]) => (
                  <div key={l} className="px-4 py-5 first:pl-0">
                    <p style={SERIF} className="text-2xl italic text-white">
                      {v}
                    </p>
                    <p className={`${mono} mt-1.5 text-white/40`}>{l}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* House index rows */}
            <div className="lg:col-span-7">
              <p className={`${mono} mb-4 text-white/35`}>Plates II–VII · Client marks</p>
              <ol className="divide-y divide-white/10 border-y border-white/10">
                {HOUSES.map((house, i) => (
                  <motion.li
                    key={house}
                    initial={{ opacity: 0, x: 28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
                    className="group flex items-baseline gap-6 py-5"
                  >
                    <span className={`${mono} w-8 shrink-0 tabular-nums text-accent/70`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={SERIF}
                      className="text-2xl font-light text-white/85 transition-colors duration-300 group-hover:text-accent sm:text-3xl"
                    >
                      {house}
                    </span>
                  </motion.li>
                ))}
              </ol>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                style={SERIF}
                className="mt-6 text-right italic text-white/40"
              >
                …and many more, off-record.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ════ §04 — DIRECTORY / COLOFÓN ════ */}
      <section className="relative px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <RunningHead section="Colofón" folio="05 / 05" />
          <p className={`${mono} text-accent mb-8`}>§ 04 — Directory</p>

          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h2 style={SERIF} className="text-5xl font-light leading-[1.02] text-foreground sm:text-6xl">
                <RevealLine className="italic text-gradient-gold">Écrivez</RevealLine>
                <RevealLine delay={0.1}>— write to us.</RevealLine>
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                className="mt-7 max-w-sm font-body text-[15px] leading-relaxed text-muted-foreground"
              >
                Whether it's a first order, a listing enquiry, or a supplier introduction —
                we'd like to hear from you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                className="mt-9"
              >
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3.5 font-body text-sm font-semibold text-white transition-colors hover:bg-accent/90"
                >
                  Start a conversation
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>

            <div className="lg:col-span-6">
              <dl className="divide-y divide-foreground/10 border-y border-foreground/10">
                {DIRECTORY.map((d, i) => (
                  <motion.div
                    key={d.label}
                    initial={{ opacity: 0, x: 22 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
                    className="grid grid-cols-[110px_1fr] items-baseline gap-6 py-4"
                  >
                    <dt className={`${mono} text-foreground/40`}>{d.label}</dt>
                    <dd>
                      {d.internal ? (
                        <Link to={d.href} className="font-body text-sm text-foreground transition-colors hover:text-accent">
                          {d.value}
                        </Link>
                      ) : (
                        <a
                          href={d.href}
                          {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="font-body text-sm text-foreground transition-colors hover:text-accent"
                        >
                          {d.value}
                        </a>
                      )}
                    </dd>
                  </motion.div>
                ))}
              </dl>

              {/* Colophon small print */}
              <div className={`${mono} mt-10 grid grid-cols-2 gap-x-8 gap-y-3 text-foreground/35 sm:grid-cols-3`}>
                <p>Colophon MMXXVI</p>
                <p>Set in Fraunces & Inter</p>
                <p>Composed in code</p>
                <p>GMP · Codex CXC 1-1969</p>
                <p className="tabular-nums">Cert. {CERT_NO}</p>
                <p>© Olive Foods (Pvt) Ltd</p>
              </div>
            </div>
          </div>

          <p className={`${mono} mt-16 border-t border-foreground/10 pt-6 text-center text-foreground/35`}>
            Olive Foods (Pvt) Ltd · Wattala, Sri Lanka
          </p>
        </div>
      </section>
    </main>
  );
};

export default BrochureExperience;
