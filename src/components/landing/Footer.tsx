import { useRef, type MouseEvent } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUp, Mail, MapPin } from "lucide-react";
import { BRAND_TAGLINE, BrandLogo } from "@/components/admin/BrandLogo";
import StatusPill from "@/components/StatusPill";
import ContactLanes from "@/components/ContactLanes";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { useSuppliedCategories } from "@/hooks/useSuppliedCategories";
import { categorySlug } from "@/lib/categories";
import { SECTORS } from "@/lib/sectors";
import { IMPORTER_PATH, SOCIAL_PROFILES } from "@/lib/site";
import { GUIDES } from "@/lib/guides";
import { openStatus, useColomboNow } from "@/lib/hours";

/**
 * Site footer — on every page.
 *
 * Three layers, top to bottom: a closing statement (the brand tagline) with
 * the two contact lines — business and bulk orders, general enquiries; the directory (brand +
 * address with live opening status, then Explore / Who we supply / Top
 * categories — the sitewide crawl paths to the sector and category pages);
 * and an oversized "Olive Foods" set in Sora that rises as the page ends,
 * outlined, with a gold fill that follows the cursor.
 *
 * The logo sits on a cream chip (brand guidelines §02: never recoloured on
 * forest grounds). Facts only from company.json.
 */

const FACTS = ["30+ years in the food trade", "30+ source countries", "All 25 districts", "−18 °C cold chain"];

const quickLinks = [
  { label: "About", href: "/about" },
  // Sitewide link with descriptive anchor text to the pillar page.
  { label: "Food importer & distributor", href: IMPORTER_PATH },
  { label: "Products", href: "/products" },
  { label: "Brands", href: "/brands" },
  { label: "Our Products", href: "/products?our=true" },
  { label: "Contact", href: "/contact" },
  ...(GUIDES.length ? [{ label: "Guides", href: "/guides" }] : []),
  { label: "Site map", href: "/site-map" },
];

// Sector + category landing pages aren't in the main nav; these footer links
// are their sitewide internal links (crawl paths + link equity).
const sectorLinks = SECTORS.map((s) => ({ label: s.name, href: `/supply/${s.slug}` }));

const TOP_CATEGORY_COUNT = 6;

const fade = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-8%" },
  transition: { duration: 0.6, delay: i * 0.08, ease: EASE_OUT_EXPO },
});

const Footer = () => {
  const reduced = !!useReducedMotion();
  const now = useColomboNow();
  const status = openStatus(now.day, now.hour);
  const topCategories = useSuppliedCategories()
    .slice(0, TOP_CATEGORY_COUNT)
    .map(({ name }) => ({ label: name, href: `/categories/${categorySlug(name)}` }));

  const columns = [
    { title: "Explore", links: quickLinks },
    { title: "Who We Supply", links: sectorLinks },
    { title: "Top Categories", links: [...topCategories, { label: "All categories", href: "/categories" }] },
  ];

  // The wordmark rises into place as the page runs out.
  const markRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: markRef, offset: ["start end", "end end"] });
  const markY = useTransform(scrollYProgress, [0, 1], ["45%", "12%"]);

  // Gold fill follows the cursor (CSS vars, no re-render per move).
  const onMarkMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <footer className="relative overflow-hidden bg-[hsl(150_40%_5%)] text-white">
      {/* Ground: forest wash from the bottom, faint grid up top. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 100%, hsl(140 50% 19% / 0.55), transparent 70%), linear-gradient(180deg, hsl(150 40% 5%), hsl(148 42% 8%))",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-[0.06] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 lg:px-8 lg:pt-28">
        {/* ── Closing statement + ways to reach us ── */}
        <div className="grid gap-10 xl:grid-cols-[1.45fr_1fr] xl:items-end xl:gap-16">
          <motion.div {...(reduced ? {} : fade(0))}>
            <p className="mb-6 font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-light">· Olive Foods (Pvt) Ltd</p>
            <p className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[56px] xl:text-[52px]">
              Quality you can trust.
              <span className="block text-gradient-gold-dark">Excellence you can taste.</span>
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {FACTS.map((f) => (
                <li key={f} className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 font-body text-[13px] text-white/70">
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* The two lines, labelled by who they're for (see ContactLanes). */}
          <motion.div {...(reduced ? {} : fade(1))}>
            <ContactLanes layout="rows" tone="dark" source="footer" showQuote className="lg:grid-cols-2 xl:grid-cols-1" />
          </motion.div>
        </div>

        <span aria-hidden className="mt-16 block h-px w-full bg-gradient-to-r from-gold-light/50 via-white/10 to-transparent lg:mt-20" />

        {/* ── Directory ── */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-14 lg:py-16">
          <motion.div {...(reduced ? {} : fade(0))} className="col-span-2 space-y-5 lg:col-span-1">
            <Link to="/" aria-label="Olive Foods home" className="inline-flex">
              <BrandLogo chip imgClassName="h-14" />
            </Link>
            <p className="max-w-xs font-body text-sm leading-relaxed text-white/60">
              Import, bonded warehousing and island-wide distribution of imported food and consumer brands for Sri Lanka's hotels, restaurants and
              retailers.
            </p>
            <div className="space-y-2.5 font-body text-sm">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=292+Sea+Street%2C+Colombo+11%2C+Sri+Lanka"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-2.5 text-white/75 transition-colors hover:text-white"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
                <span>
                  292 Sea Street, Colombo 11
                  <span className="block text-white/45">Sri Lanka 01100</span>
                </span>
              </a>
              <a href="mailto:info@olivefoods.lk" className="flex items-center gap-2.5 py-0.5 text-white/75 transition-colors hover:text-white">
                <Mail className="h-4 w-4 shrink-0 text-gold-light" />
                info@olivefoods.lk
              </a>
              <div className="pt-1">
                <StatusPill compact open={status.open} label={status.label} reduced={reduced} />
              </div>
            </div>
            {/* Official profiles — only real ones (see SOCIAL_PROFILES); rel="me"
                marks them as the same entity as this site. */}
            {SOCIAL_PROFILES.length > 0 && (
              <p className="flex flex-wrap gap-x-4 gap-y-2 font-body text-xs">
                {SOCIAL_PROFILES.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="me noopener noreferrer"
                    className="text-white/55 underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-white"
                  >
                    {s.label}
                  </a>
                ))}
              </p>
            )}
          </motion.div>

          {columns.map((col, i) => (
            <motion.nav key={col.title} aria-label={col.title} {...(reduced ? {} : fade(i + 1))} className={i === 2 ? "col-span-2 sm:col-span-1" : undefined}>
              <h2 className="mb-4 font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-light">{col.title}</h2>
              <ul className="space-y-0.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="group relative inline-flex items-center gap-1.5 py-1.5 font-body text-sm text-white/65 transition-colors duration-300 hover:text-white"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold-light/70 transition-transform duration-300 group-hover:scale-x-100" />
                      </span>
                      <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </div>
      </div>

      {/* ── Wordmark ── */}
      <div
        ref={markRef}
        aria-hidden
        onMouseMove={reduced ? undefined : onMarkMove}
        className="group/mark relative z-0 -mt-4 h-[14vw] select-none overflow-hidden lg:-mt-8 lg:h-[13.5vw] 2xl:h-[190px]"
        style={{ ["--mx" as string]: "50%", ["--my" as string]: "40%" }}
      >
        <motion.div style={reduced ? undefined : { y: markY }} className="absolute inset-x-0 top-0 flex justify-center">
          <span className="relative whitespace-nowrap font-display text-[15.5vw] font-bold leading-[0.8] tracking-[-0.045em] lg:text-[17.5vw] 2xl:text-[248px]">
            {/* outline */}
            <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.14)]">Olive Foods</span>
            {/* soft fill, brightest under the cursor */}
            <span
              className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--gold-light)),hsl(var(--accent))_60%,hsl(var(--forest-light)))] bg-clip-text text-transparent opacity-40 transition-opacity duration-500 group-hover/mark:opacity-90 lg:opacity-25"
              style={{
                WebkitMaskImage: "radial-gradient(circle 260px at var(--mx) var(--my), black, transparent 75%)",
                maskImage: "radial-gradient(circle 260px at var(--mx) var(--my), black, transparent 75%)",
              }}
            >
              Olive Foods
            </span>
          </span>
        </motion.div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative z-10 border-t border-white/10 bg-[hsl(150_40%_4%/0.6)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 pb-24 sm:flex-row sm:items-center sm:justify-between md:pb-6 lg:px-8">
          <p className="font-body text-[13px] text-white/55">
            © {new Date().getFullYear()} Olive Foods (Pvt) Ltd. All rights reserved.
            <span className="hidden text-white/35 lg:inline"> · {BRAND_TAGLINE}</span>
          </p>
          <div className="flex items-center gap-5">
            <Link to="/site-map" className="font-body text-[13px] text-white/55 transition-colors hover:text-white">
              Site map
            </Link>
            <Link to="/about#certificate" className="font-body text-[13px] text-white/55 transition-colors hover:text-white">
              GMP certified
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 py-1.5 pl-3.5 pr-1.5 font-body text-[13px] text-white/75 transition-colors hover:border-gold-light/40 hover:text-white"
            >
              Back to top
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.08] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:bg-gold-light group-hover:text-forest-deep">
                <ArrowUp className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
