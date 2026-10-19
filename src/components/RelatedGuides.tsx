import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { guidesFor } from "@/lib/guides";

/** Links a category or brand page to the buying guides that cover it. Renders nothing when none do. */
const RelatedGuides = ({ category, brand, className = "" }: { category?: string; brand?: string; className?: string }) => {
  const guides = guidesFor({ category, brand });
  if (!guides.length) return null;
  return (
    <div className={className}>
      <h2 className="font-display text-lg font-semibold text-foreground mb-3">Buying guides</h2>
      <ul className="space-y-2">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link to={`/guides/${g.slug}`} className="inline-flex items-center gap-1.5 font-body text-sm text-accent hover:underline">
              {g.title} <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedGuides;
