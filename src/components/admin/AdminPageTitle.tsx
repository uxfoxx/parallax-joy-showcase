import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { navItemFor } from "./nav";

/**
 * Every admin page's title block: brand icon tile, title, one-line
 * description. Defaults come from the nav (./nav.ts), so a page only passes
 * what it wants to override.
 */
export function AdminPageTitle({ title, description, icon }: { title?: string; description?: ReactNode; icon?: LucideIcon }) {
  const { pathname } = useLocation();
  const item = navItemFor(pathname);
  const Icon = icon ?? item?.icon;
  const desc = description ?? item?.description;
  return (
    <div className="flex min-w-0 items-start gap-3.5 animate-in fade-in slide-in-from-bottom-1 duration-500">
      {Icon && (
        <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-deep text-gold-light shadow-[inset_0_0_0_1px_hsl(75_40%_60%/0.18)]">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div className="min-w-0">
        {item && <p className="font-display text-[10.5px] font-semibold uppercase tracking-[0.22em] text-accent">· {item.group}</p>}
        <h1 className="mt-0.5 font-display text-2xl font-bold tracking-tight text-foreground">{title ?? item?.title}</h1>
        {desc && <p className="mt-0.5 max-w-2xl font-body text-sm text-muted-foreground">{desc}</p>}
        {/* Brand divider: accent → transparent hairline. */}
        <span aria-hidden className="mt-3 block h-px w-24 bg-gradient-to-r from-accent to-transparent" />
      </div>
    </div>
  );
}
