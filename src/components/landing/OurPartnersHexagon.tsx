import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import SplitText from "@/components/motion/SplitText";
import MarqueeRow from "@/components/motion/MarqueeRow";
import { useBrands } from "@/lib/api";
import { EASE_OUT_EXPO } from "@/lib/motion";

/**
 * "Brands we partner with." — three-row sliding logo marquee on white.
 *
 * Borderless tiles float through three rows at alternating directions
 * and slightly different baseline speeds. Each row picks up scroll
 * velocity via `MarqueeRow` for a subtle "alive" feel. Hover any tile
 * to bring the logo to full opacity + saturation, lift it slightly,
 * and reveal an outbound link badge.
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

const LogoTile = ({ logo }: { logo: Logo }) => {
  const cls =
    "group relative flex items-center justify-center w-[200px] md:w-[240px] h-[110px] md:h-[130px] mx-3 rounded-2xl hover:shadow-[0_18px_36px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-[transform,box-shadow] duration-300";

  return (
    <Link to={`/products?brand=${logo.slug}`} aria-label={logo.name} className={cls}>
      <img
        src={logo.image_url}
        alt={logo.name}
        loading="lazy"
        className="max-h-[60%] max-w-[78%] object-contain opacity-70 saturate-[0.85] group-hover:opacity-100 group-hover:saturate-100 transition duration-300"
      />
      <ArrowUpRight
        aria-hidden
        className="absolute top-3 right-3 w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
    </Link>
  );
};

const OurPartnersHexagon = () => {
  const { data: brands = [] } = useBrands();
  const logos = brands.filter((b): b is typeof b & { image_url: string } => !!b.image_url);

  if (logos.length === 0) return null;

  // Split the brand portfolio across two rows so each logo appears in one row
  // instead of three. useBrands() is already ordered by name → stable split.
  const half = Math.ceil(logos.length / 2);
  const rowA = logos.slice(0, half);
  const rowB = logos.slice(half).length > 0 ? logos.slice(half) : logos.slice(0, half);

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
          <Eyebrow variant="pill" tone="primary" className="mb-7">
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
            />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT_EXPO }}
            className="font-body text-[15.5px] md:text-[17px] text-muted-foreground leading-relaxed mt-7"
          >
            We don't just import — we represent. Long-term relationships with
            growers, producers, and brand owners across Europe, Asia, and the
            Middle East.
          </motion.p>
        </motion.div>

        {/* Marquee stack — three rows, alternating directions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative space-y-3"
        >
          {/* Edge fades — white → transparent */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-24 md:w-32 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--background)) 10%, hsl(var(--background) / 0.7) 50%, transparent 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 w-24 md:w-32 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(270deg, hsl(var(--background)) 10%, hsl(var(--background) / 0.7) 50%, transparent 100%)",
            }}
          />

          <MarqueeRow baseVelocity={3} direction={-1} repeat={6}>
            {rowA.map((logo) => (
              <LogoTile key={`r1-${logo.id}`} logo={logo} />
            ))}
          </MarqueeRow>
          <MarqueeRow baseVelocity={2.5} direction={1} repeat={6}>
            {rowB.map((logo) => (
              <LogoTile key={`r2-${logo.id}`} logo={logo} />
            ))}
          </MarqueeRow>
        </motion.div>

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
