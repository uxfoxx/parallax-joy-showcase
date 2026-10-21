import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import SplitText from "@/components/motion/SplitText";
import { useBrands, useProducts } from "@/lib/api";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cdnImg, fallbackToOriginal } from "@/lib/img";

/**
 * "Brands we partner with." — every brand's logo, full colour, in an even
 * grid of identical tiles (the old marquee faded and desaturated them and cut
 * them off at the edges, which read as unfinished). Brands with products link
 * to their brand page; the rest are a plain tile. Logos come on white, so the
 * tiles are white too, and each logo is fitted to the same optical box.
 *
 * File name kept (`OurPartnersHexagon.tsx`) so Index.tsx imports stay
 * stable — purely a cosmetic mismatch with the file name now.
 */

type Logo = {
  id: string;
  name: string;
  slug: string;
  image_url: string;
};

const LogoTile = ({ logo, linked, index }: { logo: Logo; linked: boolean; index: number }) => (
  <motion.li
    className="w-[calc(50%-6px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(16.666%-14px)]"
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay: (index % 6) * 0.05 + Math.floor(index / 6) * 0.08, ease: EASE_OUT_EXPO }}
  >
    <Wrapper
      logo={logo}
      linked={linked}
      className={`group relative flex aspect-[3/2] items-center justify-center rounded-2xl border border-border/70 bg-white p-3 transition-[transform,box-shadow,border-color] duration-300 sm:p-4 ${
        linked ? "hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_36px_-18px_rgba(0,0,0,0.25)]" : ""
      }`}
    >
      <img
        src={cdnImg(logo.image_url, 360)}
        onError={fallbackToOriginal(logo.image_url)}
        alt={logo.name}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
      />
      {linked && (
        <ArrowUpRight
          aria-hidden
          className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
    </Wrapper>
  </motion.li>
);

const Wrapper = ({ logo, linked, className, children }: { logo: Logo; linked: boolean; className: string; children: ReactNode }) =>
  linked ? (
    <Link to={`/brands/${logo.slug}`} aria-label={logo.name} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );

const OurPartnersHexagon = () => {
  const { data: brands = [] } = useBrands();
  const { data: products = [] } = useProducts();
  const stocked = new Set(products.map((p) => p.brand_id));
  const logos = brands.filter((b): b is typeof b & { image_url: string } => !!b.image_url);

  if (logos.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-section-base lg:py-section-base-lg bg-background">
      {/* Editorial dot-grid backdrop — matches every other white section */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--forest-mid) / 0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Soft accent orbs */}
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-[0.05] pointer-events-none animate-orb"
        style={{ background: "radial-gradient(circle, hsl(140 55% 25%), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -left-24 w-[360px] h-[360px] rounded-full opacity-[0.04] pointer-events-none animate-orb"
        style={{
          background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)",
          animationDelay: "9s",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          className="max-w-2xl mx-auto text-center mb-14 lg:mb-20"
        >
          <Eyebrow variant="pill" tone="accent" className="mb-7">
            Our Partnerships
          </Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold text-foreground leading-[1.04] tracking-tight">
            <SplitText
              text="Brands we"
              by="word"
              stagger={0.05}
              as="span"
              className="inline-block mr-[0.25em]"
            />
            <SplitText
              text="partner with."
              by="word"
              stagger={0.05}
              delay={0.16}
              as="span"
              className="inline-block text-gradient-gold italic"
              tokenClassName="text-gradient-gold italic"
            />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT_EXPO }}
            className="font-body text-[15.5px] md:text-[17px] text-muted-foreground leading-relaxed mt-7"
          >
            We don't just import. We represent. Long-term relationships with
            growers, producers, and brand owners across Europe, Asia, and the
            Middle East.
          </motion.p>
        </motion.div>

        {/* Every brand, one even grid */}
        {/* flex-wrap (not grid) so a short last row sits centred */}
        <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {logos.map((logo, i) => (
            <LogoTile key={logo.id} logo={logo} linked={stocked.has(logo.id)} index={i} />
          ))}
        </ul>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE_OUT_EXPO }}
          className="flex justify-center mt-14"
        >
          <Button asChild variant="brandOutline" size="pill" className="font-body group">
            <Link to="/contact">
              Become a partner
              <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default OurPartnersHexagon;
