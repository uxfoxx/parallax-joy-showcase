import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { ArrowUpRight, MapPin } from "lucide-react";
import { staggerGrid, EASE_OUT_EXPO } from "@/lib/motion";
import CurtainImage from "@/components/motion/CurtainImage";

type MediaCardProps = {
  to: string;
  image: string | null;
  title: string;
  meta?: string;
  origin?: string | null;
  badge?: ReactNode;
  fallback?: ReactNode;
  variant?: "dark" | "light";
  index?: number;
  columns?: number;
};

/**
 * Shared portrait card used by ProductCard and BrandCard so the two card
 * families read as visual siblings. Image fills a 4/5 tile; content is
 * overlaid on a bottom scrim. Tilt + curtain reveal + shine sweep + accent
 * hairline draw-in on hover.
 */
const MediaCard = ({
  to,
  image,
  title,
  meta,
  origin,
  badge,
  fallback,
  variant = "light",
  index = 0,
  columns = 3,
}: MediaCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isDark = variant === "dark";

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
      <Link to={to} className="block group" aria-label={title}>
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
            className={`relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm group-hover:shadow-2xl group-hover:shadow-black/25 transition-shadow duration-500 border ${
              isDark ? "border-white/10 bg-forest-deep/40" : "border-border/70 bg-muted"
            }`}
          >
            {image ? (
              <>
                {!imgLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
                <CurtainImage
                  wrapperClassName="absolute inset-0"
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  src={image}
                  alt={title}
                  onLoad={() => setImgLoaded(true)}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] ${
                    imgLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-forest-deep/40 via-forest-mid/25 to-accent/15 flex items-center justify-center">
                {fallback}
              </div>
            )}

            {/* Bottom scrim for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

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

            {/* Text overlay */}
            <div className="absolute inset-x-0 bottom-0 p-5 z-10">
              <h3 className="font-display text-base md:text-lg font-semibold leading-snug text-white drop-shadow-sm line-clamp-2">
                {title}
              </h3>
              {(meta || origin) && (
                <div className="flex items-center justify-between gap-3 mt-2 font-body text-xs text-white/70">
                  {meta && <span className="truncate">{meta}</span>}
                  {origin && (
                    <span className="flex items-center gap-1 shrink-0 text-white/65">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[120px]">{origin}</span>
                    </span>
                  )}
                </div>
              )}
              {/* Accent hairline draws in on hover */}
              <div className="relative mt-3 h-px bg-white/10 overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[700ms] ease-out" />
              </div>
            </div>
          </div>
        </Tilt>
      </Link>
    </motion.div>
  );
};

export default MediaCard;
