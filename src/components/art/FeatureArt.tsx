/**
 * Hand-drawn SVG illustrations for the landing "Why Choose Us" cards.
 * Keeps the same stroke/accent vocabulary as CategoryArt so the page
 * reads as a coherent set. Uses currentColor for stroke.
 */
type ArtProps = { className?: string };

const base = "stroke-current fill-none";
const accentFill = "fill-[hsl(var(--accent)/0.22)]";

export const ImportDistributionArt = ({ className }: ArtProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <g className={base} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
      {/* box */}
      <path d="M14 22 L32 14 L50 22 L50 46 L32 54 L14 46 Z" />
      <path d="M14 22 L32 30 L50 22" />
      <path d="M32 30 L32 54" />
      {/* arrows around box */}
      <path d="M6 12 Q10 8 16 10" />
      <path d="M6 12 L10 10 M6 12 L8 16" />
      <path d="M58 52 Q54 56 48 54" />
      <path d="M58 52 L54 54 M58 52 L56 48" />
    </g>
    <circle cx="32" cy="30" r="2" className={`${base} ${accentFill}`} strokeWidth="1.5" />
  </svg>
);

export const WarehouseArt = ({ className }: ArtProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <g className={base} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
      {/* roof + body */}
      <path d="M8 28 L32 14 L56 28 L56 54 L8 54 Z" />
      <path d="M8 28 L56 28" />
      {/* door */}
      <path d="M26 54 L26 40 L38 40 L38 54" />
      {/* windows/crates */}
      <rect x="14" y="34" width="8" height="6" />
      <rect x="42" y="34" width="8" height="6" />
      <rect x="14" y="44" width="8" height="6" />
      <rect x="42" y="44" width="8" height="6" />
    </g>
    <rect x="26" y="40" width="12" height="14" className={accentFill} strokeWidth="0" />
  </svg>
);

export const ColdChainArt = ({ className }: ArtProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <g className={base} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
      {/* thermometer */}
      <path d="M28 10 Q28 6 32 6 Q36 6 36 10 L36 36 Q40 39 40 44 Q40 50 32 50 Q24 50 24 44 Q24 39 28 36 Z" />
      <line x1="32" y1="14" x2="32" y2="36" />
      {/* snowflakes flanking */}
      <g transform="translate(10 24)">
        <line x1="-4" y1="0" x2="4" y2="0" />
        <line x1="0" y1="-4" x2="0" y2="4" />
        <line x1="-3" y1="-3" x2="3" y2="3" />
        <line x1="-3" y1="3" x2="3" y2="-3" />
      </g>
      <g transform="translate(54 36)">
        <line x1="-4" y1="0" x2="4" y2="0" />
        <line x1="0" y1="-4" x2="0" y2="4" />
        <line x1="-3" y1="-3" x2="3" y2="3" />
        <line x1="-3" y1="3" x2="3" y2="-3" />
      </g>
    </g>
    <circle cx="32" cy="44" r="4" className={`${base} ${accentFill}`} strokeWidth="1.6" />
  </svg>
);

export const DistributionArt = ({ className }: ArtProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <g className={base} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
      {/* truck body */}
      <path d="M6 42 L6 22 L34 22 L34 42 Z" />
      <path d="M34 28 L46 28 L54 36 L54 42 L34 42 Z" />
      <line x1="6" y1="42" x2="54" y2="42" />
      {/* wheels */}
      <circle cx="16" cy="46" r="4" />
      <circle cx="44" cy="46" r="4" />
      {/* route dots */}
      <circle cx="10" cy="14" r="1.4" className="fill-current stroke-none" />
      <circle cx="22" cy="10" r="1.4" className="fill-current stroke-none" />
      <circle cx="34" cy="14" r="1.4" className="fill-current stroke-none" />
      <circle cx="46" cy="10" r="1.4" className="fill-current stroke-none" />
    </g>
    <path d="M38 32 L46 32 L50 36 L38 36 Z" className={`${accentFill} stroke-current`} strokeWidth="1.6" />
  </svg>
);

export type FeatureArtKey = "import" | "warehouse" | "cold" | "distribution";

export const FeatureArt = ({ kind, className }: { kind: FeatureArtKey; className?: string }) => {
  switch (kind) {
    case "import":       return <ImportDistributionArt className={className} />;
    case "warehouse":    return <WarehouseArt className={className} />;
    case "cold":         return <ColdChainArt className={className} />;
    case "distribution": return <DistributionArt className={className} />;
  }
};

export default FeatureArt;
