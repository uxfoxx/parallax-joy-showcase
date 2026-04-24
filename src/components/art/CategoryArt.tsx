/**
 * Hand-drawn style SVG illustrations for landing-page category rows.
 * Each one is a minimal, single-stroke line drawing with a tiny gold
 * accent fill — deliberately more "small art" than "icon" so the rows
 * feel editorial instead of dashboard-y. 56×56 default, all strokes
 * respond to `currentColor` so the parent sets the colour (we use
 * `text-forest-mid` on white / `text-accent` on hover).
 */
type ArtProps = { className?: string };

const base = "stroke-current fill-none";
const accentFill = "fill-[hsl(var(--accent)/0.18)]";

const Frozen = ({ className }: ArtProps) => (
  <svg viewBox="0 0 56 56" className={className} aria-hidden>
    <g className={base} strokeWidth="1.5" strokeLinecap="round">
      <line x1="28" y1="8" x2="28" y2="48" />
      <line x1="10.7" y1="18" x2="45.3" y2="38" />
      <line x1="45.3" y1="18" x2="10.7" y2="38" />
      {/* arrow tips */}
      <path d="M24 12 L28 8 L32 12" />
      <path d="M24 44 L28 48 L32 44" />
      <path d="M14 14 L11 18 L15 21" />
      <path d="M41 35 L45 38 L42 42" />
      <path d="M42 14 L45 18 L41 21" />
      <path d="M15 35 L11 38 L14 42" />
    </g>
    <circle cx="28" cy="28" r="3" className={`${base} ${accentFill}`} strokeWidth="1.5" />
  </svg>
);

const Dairy = ({ className }: ArtProps) => (
  <svg viewBox="0 0 56 56" className={className} aria-hidden>
    <g className={base} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      {/* milk carton */}
      <path d="M20 16 L20 46 Q20 48 22 48 L34 48 Q36 48 36 46 L36 16 L32 10 L24 10 Z" />
      <path d="M20 16 L36 16" />
      <path d="M24 10 L24 14 L32 14 L32 10" />
    </g>
    {/* drop */}
    <path d="M42 28 Q45 32 42 35 Q39 32 42 28 Z" className={`${base} ${accentFill}`} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const Oil = ({ className }: ArtProps) => (
  <svg viewBox="0 0 56 56" className={className} aria-hidden>
    <g className={base} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      {/* olive branch */}
      <path d="M8 40 Q24 32 48 18" />
      <ellipse cx="20" cy="34" rx="5" ry="3" transform="rotate(-20 20 34)" />
      <ellipse cx="32" cy="27" rx="5" ry="3" transform="rotate(-25 32 27)" />
      <ellipse cx="42" cy="21" rx="5" ry="3" transform="rotate(-25 42 21)" />
      <path d="M16 30 L20 33" />
      <path d="M28 23 L32 26" />
    </g>
    <circle cx="42" cy="38" r="3.5" className={`${base} ${accentFill}`} strokeWidth="1.5" />
  </svg>
);

const Grain = ({ className }: ArtProps) => (
  <svg viewBox="0 0 56 56" className={className} aria-hidden>
    <g className={base} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* wheat stalk */}
      <path d="M28 48 L28 14" />
      <path d="M28 20 Q22 18 20 13" />
      <path d="M28 20 Q34 18 36 13" />
      <path d="M28 26 Q22 24 20 19" />
      <path d="M28 26 Q34 24 36 19" />
      <path d="M28 32 Q22 30 20 25" />
      <path d="M28 32 Q34 30 36 25" />
      <path d="M28 38 Q22 36 20 31" />
      <path d="M28 38 Q34 36 36 31" />
    </g>
    <path d="M28 10 L24 6 M28 10 L32 6" className={base} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Grocery = ({ className }: ArtProps) => (
  <svg viewBox="0 0 56 56" className={className} aria-hidden>
    <g className={base} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      {/* basket */}
      <path d="M10 22 L46 22 L42 46 L14 46 Z" />
      <path d="M18 22 Q20 10 28 10 Q36 10 38 22" />
      <path d="M19 28 L21 40" />
      <path d="M28 28 L28 40" />
      <path d="M37 28 L35 40" />
    </g>
    <circle cx="28" cy="22" r="2" className={`${base} ${accentFill}`} strokeWidth="1.5" />
  </svg>
);

const Beverage = ({ className }: ArtProps) => (
  <svg viewBox="0 0 56 56" className={className} aria-hidden>
    <g className={base} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      {/* cup */}
      <path d="M14 22 L40 22 L38 44 Q37 48 33 48 L21 48 Q17 48 16 44 Z" />
      <path d="M40 26 Q48 26 48 32 Q48 38 40 38" />
      {/* steam */}
      <path d="M20 14 Q22 10 20 6" />
      <path d="M28 14 Q30 10 28 6" />
      <path d="M36 14 Q38 10 36 6" />
    </g>
  </svg>
);

const Chocolate = ({ className }: ArtProps) => (
  <svg viewBox="0 0 56 56" className={className} aria-hidden>
    <g className={base} strokeWidth="1.5" strokeLinejoin="round">
      <rect x="12" y="12" width="32" height="32" rx="3" />
      <line x1="22" y1="12" x2="22" y2="44" />
      <line x1="32" y1="12" x2="32" y2="44" />
      <line x1="12" y1="22" x2="44" y2="22" />
      <line x1="12" y1="32" x2="44" y2="32" />
    </g>
    <rect x="22" y="22" width="10" height="10" className={`${base} ${accentFill}`} strokeWidth="1.5" />
  </svg>
);

const Seafood = ({ className }: ArtProps) => (
  <svg viewBox="0 0 56 56" className={className} aria-hidden>
    <g className={base} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      {/* fish */}
      <path d="M8 28 Q18 14 34 20 Q44 24 48 28 Q44 32 34 36 Q18 42 8 28 Z" />
      <path d="M48 28 L54 22 L54 34 Z" />
      <circle cx="38" cy="26" r="1.2" className="fill-current stroke-none" />
      <path d="M24 24 Q22 28 24 32" />
    </g>
  </svg>
);

const Meat = ({ className }: ArtProps) => (
  <svg viewBox="0 0 56 56" className={className} aria-hidden>
    <g className={base} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 20 Q10 12 18 10 Q24 8 28 14 Q32 8 38 10 Q46 12 44 20 Q50 24 46 30 Q48 38 40 40 Q36 48 28 44 Q20 48 16 40 Q8 38 10 30 Q6 24 12 20 Z" />
      <path d="M22 26 Q28 22 34 26 Q32 32 28 32 Q24 32 22 26 Z" className={accentFill} strokeWidth="1.5" />
    </g>
  </svg>
);

const Fruit = ({ className }: ArtProps) => (
  <svg viewBox="0 0 56 56" className={className} aria-hidden>
    <g className={base} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M28 16 Q18 16 14 26 Q10 38 18 46 Q24 50 28 46 Q32 50 38 46 Q46 38 42 26 Q38 16 28 16 Z" />
      <path d="M28 16 L28 10" />
      <path d="M28 12 Q34 8 38 10 Q34 14 28 12" />
    </g>
  </svg>
);

const Default = ({ className }: ArtProps) => (
  <svg viewBox="0 0 56 56" className={className} aria-hidden>
    <g className={base} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M28 8 Q12 24 18 44 Q28 38 28 28 Q28 38 38 44 Q44 24 28 8 Z" />
      <path d="M28 24 L28 44" />
    </g>
  </svg>
);

const artMap: Array<[string, (p: ArtProps) => JSX.Element]> = [
  ["frozen",    Frozen],
  ["seafood",   Seafood],
  ["dairy",     Dairy],
  ["cheese",    Dairy],
  ["butter",    Dairy],
  ["oil",       Oil],
  ["flour",     Grain],
  ["grain",     Grain],
  ["rice",      Grain],
  ["pasta",     Grain],
  ["grocery",   Grocery],
  ["beverage",  Beverage],
  ["coffee",    Beverage],
  ["tea",       Beverage],
  ["chocolate", Chocolate],
  ["pastry",    Chocolate],
  ["bakery",    Chocolate],
  ["meat",      Meat],
  ["poultry",   Meat],
  ["fruit",     Fruit],
  ["vegetable", Fruit],
];

export const CategoryArt = ({ name, className }: { name: string; className?: string }) => {
  const lower = name.toLowerCase();
  const hit = artMap.find(([k]) => lower.includes(k));
  const Component = hit ? hit[1] : Default;
  return <Component className={className} />;
};

export default CategoryArt;
