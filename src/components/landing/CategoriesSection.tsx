import { motion, useMotionValue, useTransform, useSpring, useScroll } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories, useProducts, type Product } from "@/lib/api";
import { categorySlug } from "@/lib/categories";
import { productCategories, useSuppliedCategories } from "@/hooks/useSuppliedCategories";
import { cdnImg, fallbackToOriginal } from "@/lib/img";
import { isHouseBrand, listOf } from "@/lib/brands";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import SplitText from "@/components/motion/SplitText";
import MagneticButton from "@/components/motion/MagneticButton";
import Eyebrow from "@/components/ui/eyebrow";

/** A few of the category's products as small tiles, fanned out on hover. */
const Thumbs = ({ items, extra, hovered }: { items: Product[]; extra: number; hovered: boolean }) => (
  <div aria-hidden className="flex items-center">
    {items.map((p, i) => (
      <motion.span
        key={p.id}
        animate={{ x: hovered ? i * 6 : 0, y: hovered ? (i % 2 ? -3 : 3) : 0, rotate: hovered ? (i - (items.length - 1) / 2) * 3 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="-ml-3 first:ml-0 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-[radial-gradient(ellipse_at_50%_35%,#fff,hsl(42_33%_94%))] shadow-sm md:h-16 md:w-16"
        style={{ zIndex: items.length - i }}
      >
        <img
          src={cdnImg(p.image_url!, 128)}
          onError={fallbackToOriginal(p.image_url!)}
          alt=""
          loading="lazy"
          width={64}
          height={64}
          className="h-full w-full object-contain p-1.5 mix-blend-multiply"
        />
      </motion.span>
    ))}
    {extra > 0 && (
      <span className="-ml-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-card font-body text-xs font-semibold text-muted-foreground shadow-sm md:h-16 md:w-16" style={{ zIndex: 0 }}>
        +{extra}
      </span>
    )}
  </div>
);

const CategoryRow = ({
  name,
  desc,
  items,
  extra,
  index,
}: {
  name: string;
  desc: string;
  items: Product[];
  extra: number;
  index: number;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
    >
      <Link to={`/categories/${categorySlug(name)}`} className="block">
        {/* Hover background */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.22 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/[0.06] via-accent/[0.02] to-transparent pointer-events-none"
        />

        <div className="relative flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:gap-8 md:px-6 md:py-6">
          {/* Text */}
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl font-bold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-forest-deep md:text-2xl lg:text-[28px]">
              {name}
            </h3>
            {desc && <p className="mt-1 max-w-lg font-body text-sm leading-relaxed text-muted-foreground">{desc}</p>}
          </div>

          {/* Products + arrow */}
          <div className="flex shrink-0 items-center justify-between gap-5 sm:justify-end">
            {items.length > 0 && <Thumbs items={items} extra={extra} hovered={hovered} />}
            <motion.span
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors duration-300 group-hover:border-transparent group-hover:bg-forest-deep group-hover:text-primary-foreground"
            >
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mx-4 md:mx-6" />
      </Link>
    </motion.div>
  );
};

const CategoriesSection = () => {
  const { data: allCategories = [] } = useCategories();
  const supplied = useSuppliedCategories();
  type HomeCategory = { name: string; homepage_featured?: boolean; homepage_order?: number | null };
  const featured = (allCategories as HomeCategory[])
    .filter((c) => c.homepage_featured)
    .sort((a, b) => (a.homepage_order ?? 0) - (b.homepage_order ?? 0))
    .map((c) => c.name);
  // Curated in Admin → Categories; until then, the categories with the most
  // products (an alphabetical fallback used to put "Flour: 2 products" here).
  const categories = (featured.length > 0 ? featured : supplied.map((c) => c.name)).slice(0, 6);

  // Real facts per row (product count + brands) instead of one stock line.
  const { data: products = [] } = useProducts();
  const inCategory = (name: string) => products.filter((p) => productCategories(p).includes(name));
  const summary = (name: string) => {
    const inCat = products.filter((p) => productCategories(p).includes(name));
    const brands = [...new Set(inCat.map((p) => p.brands?.name).filter((b): b is string => !!b && !isHouseBrand(b)))];
    if (!inCat.length) return "";
    const count = `${inCat.length} product${inCat.length === 1 ? "" : "s"}`;
    return brands.length ? `${count} from ${listOf(brands.slice(0, 3))}${brands.length > 3 ? " and more" : ""}` : count;
  };

  const sectionRef = useRef<HTMLElement>(null);

  // Mouse parallax for watermark
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 90 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 90 });
  const wmarkX = useTransform(smoothX, [-0.5, 0.5], [-24, 24]);
  const wmarkY = useTransform(smoothY, [-0.5, 0.5], [-14, 14]);

  // Scroll parallax for watermark
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const wmarkScrollY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="relative overflow-hidden py-section-base lg:py-section-base-lg bg-background"
      onMouseMove={handleMouseMove}
    >
      {/* Unified dot-grid backdrop — matches all white sections */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--forest-mid) / 0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Mouse + scroll parallax watermark */}
      

      {/* Subtle accent orb */}
      <div
        className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--accent)), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-[280px] h-[280px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(140 50% 19%), transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mb-16"
        >
          <Eyebrow variant="pill" tone="accent" className="mb-8">
            Product Categories
          </Eyebrow>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight tracking-tight">
            <SplitText text="Everything Your" by="word" stagger={0.05} as="span" className="block" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="block text-gradient-gold"
            >
              <span className="block">Business Needs</span>
            </motion.div>
          </h2>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            We import and distribute across all major food categories, with quality and variety for every business need.
          </p>
        </motion.div>

        {/* Category rows */}
        <div className="border-t border-border">
          {categories.map((name, i) => {
            const all = inCategory(name);
            const withImage = all.filter((p) => p.image_url);
            const items = withImage.slice(0, 3);
            return <CategoryRow key={name} name={name} desc={summary(name)} items={items} extra={all.length - items.length} index={i} />;
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <MagneticButton>
            <Button asChild variant="brand" size="pill" className="font-body group">
              <Link to="/categories">
                All categories
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
