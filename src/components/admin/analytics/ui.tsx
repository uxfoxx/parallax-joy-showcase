import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, ExternalLink, Loader2, RefreshCw, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtAgo } from "@/lib/insights";

/** A titled card. Panels fade up as they mount (tailwindcss-animate). */
export function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card p-5 sm:p-6 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both",
        className,
      )}
    >
      {(title || action) && (
        <header className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            {title && <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>}
            {description && <p className="mt-0.5 font-body text-xs text-muted-foreground">{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

/** Percentage change badge. `invert` for metrics where lower is better (search position). */
export function Delta({ now, before, invert = false }: { now: number; before: number; invert?: boolean }) {
  if (!before && !now) return null;
  if (!before) return <span className="rounded-full bg-muted px-1.5 py-0.5 font-body text-[11px] font-medium text-muted-foreground">new</span>;
  const change = (now - before) / before;
  if (Math.abs(change) < 0.005) return <span className="font-body text-[11px] text-muted-foreground">no change</span>;
  const good = invert ? change < 0 : change > 0;
  const Icon = change > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-body text-[11px] font-semibold tabular-nums",
        good ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-rose-500/10 text-rose-700 dark:text-rose-400",
      )}
      title="Compared with the previous period"
    >
      <Icon className="h-3 w-3" aria-hidden />
      {Math.abs(change * 100).toFixed(Math.abs(change) < 0.1 ? 1 : 0)}%
    </span>
  );
}

export function Kpi({
  label,
  value,
  sub,
  delta,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  delta?: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "default" | "good" | "warn" | "bad";
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/25 animate-in fade-in zoom-in-95 duration-500 fill-mode-both">
      <div className="flex items-center justify-between gap-2">
        <span className="font-body text-xs font-medium text-muted-foreground">{label}</span>
        {Icon && (
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg",
              tone === "good" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
              tone === "warn" && "bg-amber-500/10 text-amber-700 dark:text-amber-400",
              tone === "bad" && "bg-rose-500/10 text-rose-700 dark:text-rose-400",
              tone === "default" && "bg-forest-deep/10 text-forest-mid dark:text-primary",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold tabular-nums text-foreground">{value}</span>
        {delta}
      </div>
      {sub && <p className="mt-1 font-body text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

/** Ranked list with proportional bars. */
export function BarList({
  items,
  format = (n) => n.toLocaleString("en-US"),
  empty = "No data yet.",
  max: maxItems = 8,
}: {
  items: { label: ReactNode; value: number; href?: string; extra?: ReactNode }[];
  format?: (n: number) => string;
  empty?: string;
  max?: number;
}) {
  const shown = items.slice(0, maxItems);
  const top = Math.max(...shown.map((i) => i.value), 1);
  if (!shown.length) return <p className="font-body text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="space-y-1.5">
      {shown.map((item, i) => (
        <li key={i} className="relative">
          <div
            className="absolute inset-y-0 left-0 rounded-md bg-forest-mid/10 dark:bg-primary/10 origin-left animate-in fade-in duration-700"
            style={{ width: `${Math.max(2, (item.value / top) * 100)}%` }}
            aria-hidden
          />
          <div className="relative flex items-center justify-between gap-3 px-2.5 py-1.5">
            <span className="min-w-0 truncate font-body text-sm text-foreground">
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {item.label}
                </a>
              ) : (
                item.label
              )}
            </span>
            <span className="flex shrink-0 items-center gap-2 font-body text-sm font-semibold tabular-nums text-foreground">
              {item.extra}
              {format(item.value)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export type Column<T> = { key: string; label: string; align?: "left" | "right"; render: (row: T) => ReactNode; className?: string };

export function DataTable<T>({ rows, columns, empty = "No data yet.", limit }: { rows: T[]; columns: Column<T>[]; empty?: string; limit?: number }) {
  const shown = limit ? rows.slice(0, limit) : rows;
  if (!shown.length) return <p className="font-body text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="-mx-5 overflow-x-auto sm:-mx-6">
      <table className="w-full min-w-[480px] border-collapse font-body text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cn(
                  "px-5 py-2 text-xs font-medium text-muted-foreground first:pl-5 sm:px-6 sm:first:pl-6",
                  c.align === "right" ? "text-right" : "text-left",
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shown.map((row, i) => (
            <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
              {columns.map((c) => (
                <td key={c.key} className={cn("px-5 py-2 align-top sm:px-6", c.align === "right" && "text-right tabular-nums", c.className)}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** "Updated 2 h ago · Search Console", with any error and a refresh button. */
export function Freshness({
  source,
  updatedAt,
  error,
  running,
  onRefresh,
  refreshing,
  link,
}: {
  source: string;
  updatedAt?: string | null;
  error?: string | null;
  running?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  link?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span className={cn("h-1.5 w-1.5 rounded-full", error ? "bg-amber-500" : updatedAt ? "bg-emerald-500" : "bg-muted-foreground/40")} />
        {running ? "Updating…" : `Updated ${fmtAgo(updatedAt)}`} · {source}
      </span>
      {error && (
        <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400" title={error}>
          <TriangleAlert className="h-3 w-3" /> {error.length > 90 ? `${error.slice(0, 90)}…` : error}
        </span>
      )}
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={running || refreshing}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-foreground hover:bg-muted disabled:opacity-50"
        >
          {running || refreshing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          Refresh
        </button>
      )}
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-foreground hover:underline">
          Open <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 font-body text-sm",
        tone === "warn" ? "border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200" : "border-border bg-muted/40 text-muted-foreground",
      )}
    >
      {children}
    </div>
  );
}

export function Skeletons({ count = 4, className = "h-24" }: { count?: number; className?: string }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={cn("animate-pulse rounded-xl border border-border bg-muted/50", className)} />
      ))}
    </>
  );
}

/** Small status pill: good / warn / bad / neutral. */
export function Pill({ tone, children }: { tone: "good" | "warn" | "bad" | "neutral"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 font-body text-[11px] font-semibold",
        tone === "good" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        tone === "warn" && "bg-amber-500/10 text-amber-700 dark:text-amber-400",
        tone === "bad" && "bg-rose-500/10 text-rose-700 dark:text-rose-400",
        tone === "neutral" && "bg-muted text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}
