import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { ArrowUpRight, MapPin } from "lucide-react";
import { staggerGrid, EASE_OUT_EXPO } from "@/lib/motion";
import CurtainImage from "@/components/motion/CurtainImage";
import { cdnImg } from "@/lib/img";

type MediaCardProps = {
  /** URL the card links to. */
  to?: string;
  /** Click handler. With `to` as well, the card is still a real link (so
   *  crawlers follow it and ⌘/Ctrl/middle-click open the page) and a plain
   *  click runs this instead — e.g. a product quick view. */
  onClick?: () => void;
  image: string | null;
  title: string;
  /** Small line above the title (e.g. the brand). */
  eyebrow?: string;
  meta?: string;
  origin?: string | null;
  badge?: ReactNode;
  fallback?: ReactNode;
  variant?: "dark" | "light";
  index?: number;
  columns?: number;
  /**
   * TEMPORARY: when true the image renders inside a padded inset so the
   * visual footprint matches standard cards. Used by ProductCard while a
   * subset of products has oversized source images uploaded under the
   * featured/premium flag. Remove once images are re-uploaded at
   * consistent dimensions.
   */
  imageInset?: boolean;
};

/**
 * Shared portrait card used by ProductCard and BrandCard so the two card
 * families read as visual siblings. The 4/5 tile is a warm "studio" surface:
 * product and logo images mostly come on white, so they're multiplied into
 * it (the white disappears instead of reading as a pasted box), sized with an
 * even margin, and grounded by a soft floor shadow. While an image loads the
 * tile shows a shimmer, never an empty box. Caption: optional eyebrow (the
 * brand), name, meta, and an accent hairline that draws in on hover.
 */
const MediaCard = ({
  to,
  onClick,
  image,
  title,
  eyebrow,
  meta,
  origin,
  badge,
  fallback,
  variant = "light",
  index = 0,
  columns = 3,
  imageInset = false,
}: MediaCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  // Resilient source: optimized transform → original object URL → placeholder.
  // Supabase's image-transform endpoint occasionally fails (rate limits, load),
  // and without a fallback the card would sit on an endless loading pulse. The
  // original object URL always works, so we retry with it before giving up.
  const [srcTier, setSrcTier] = useState(0); // 0 = optimized, 1 = original, 2 = failed
  const isDark = variant === "dark";
  const hasImage = !!image && srcTier < 2;

  const inner = (
    <Tilt
      tiltMaxAngleX={3}
      tiltMaxAngleY={3}
      perspective={1400}
      glareEnable
      glareMaxOpacity={0.14}
      glareColor="#e6c96b"
      glareBorderRadius="16px"
      transitionSpeed={900}
    >
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-2xl border transition-shadow duration-500 group-hover:shadow-2xl group-hover:shadow-black/20 ${
          isDark
            ? "border-white/10 bg-[radial-gradient(ellipse_at_50%_35%,hsl(150_30%_16%),hsl(150_35%_9%))]"
            : "border-border/60 bg-[radial-gradient(ellipse_at_50%_35%,#ffffff_0%,hsl(42_33%_95%)_70%,hsl(42_28%_91%)_100%)] shadow-sm"
        }`}
      >
        {hasImage ? (
          <>
            {/* Loading: a shimmer, so the tile never sits empty. */}
            {!imgLoaded && <div aria-hidden className="absolute inset-0 skeleton-shimmer" />}
            {/* Floor shadow under the product. */}
            {!isDark && (
              <span
                aria-hidden
                className={`absolute bottom-[9%] left-1/2 h-[4%] w-[48%] -translate-x-1/2 rounded-[50%] bg-forest-deep/[0.07] blur-md transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              />
            )}
            <CurtainImage
              // Multiply on the wrapper, not the <img>: the curtain's clip-path
              // isolates the image, so a blend on it has nothing to blend with.
              wrapperClassName={`${imageInset ? "absolute inset-[14%]" : "absolute inset-[9%]"} ${isDark ? "" : "mix-blend-multiply"}`}
              wrapperStyle={{ width: "auto", height: "auto" }}
              src={srcTier === 0 ? cdnImg(image!, 600) : image!}
              alt={title}
              onLoad={() => setImgLoaded(true)}
              onError={() => setSrcTier((t) => t + 1)}
              className={`absolute inset-0 w-full h-full object-contain transition-[transform,opacity] duration-[900ms] ease-out group-hover:scale-[1.05] ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-forest-deep/40 via-forest-mid/25 to-accent/15 flex items-center justify-center">
            {fallback}
          </div>
        )}

        {/* Shine sweep */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full"
          style={{ transition: "opacity 0.6s ease, transform 1.1s ease" }}
        />

        {/* Top-right badge slot */}
        {badge && <div className="absolute top-3 right-3 z-20">{badge}</div>}

        {/* Arrow chip — appears on hover */}
        <div className="absolute top-3 left-3 z-20 opacity-0 group-hover:opacity-100 translate-y-[-4px] group-hover:translate-y-0 transition-all duration-300">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 backdrop-blur-md border border-white/25">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </span>
        </div>
      </div>
    </Tilt>
  );

  const caption = (
    <div className="pt-3 px-0.5">
      {eyebrow && (
        <p className="mb-1 truncate font-body text-[10.5px] font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
      )}
      <h3 className="font-body text-sm font-semibold leading-snug text-foreground group-hover:text-accent transition-colors line-clamp-2">
        {title}
      </h3>
      {(meta || origin) && (
        <div className="mt-1 flex items-center justify-between gap-2 font-body text-xs text-muted-foreground">
          {meta && <span className="truncate">{meta}</span>}
          {/* {origin && (
            <span className="flex items-center gap-1 shrink-0">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{origin}</span>
            </span>
          )} */}
        </div>
      )}
      <div className="relative mt-1.5 h-px bg-border overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.65,
        ease: EASE_OUT_EXPO,
        delay: staggerGrid(index, columns),
      }}
      whileHover={{ y: -4 }}
    >
      {to ? (
        <Link
          to={to}
          className="block group"
          aria-label={title}
          onClick={
            onClick
              ? (e) => {
                  // Let the browser handle new-tab/window clicks; a plain
                  // left click runs the handler (quick view) instead.
                  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  onClick();
                }
              : undefined
          }
        >
          {inner}
          {caption}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="block group w-full text-left cursor-pointer"
          aria-label={title}
        >
          {inner}
          {caption}
        </button>
      )}
    </motion.div>
  );
};

export default MediaCard;
