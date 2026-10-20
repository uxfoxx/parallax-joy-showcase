import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { fmtAgo, LINKS, pathOf, useIndexing, useRefreshInsight, type Inspection } from "@/lib/insights";
import { cn } from "@/lib/utils";
import { DataTable, Freshness, Notice, Panel, Pill, Skeletons } from "./ui";
import { coverageTone, isIndexed } from "./labels";

/** Page type from the path, for grouping. */
const kindOf = (url: string) => {
  const p = pathOf(url);
  if (p === "/") return "Home";
  const first = p.split("/")[1];
  return { products: "Products", brands: "Brands", categories: "Categories", guides: "Guides", supply: "Sectors" }[first] ?? "Pages";
};

export default function IndexingTab() {
  const q = useIndexing();
  const refresh = useRefreshInsight();
  const [filter, setFilter] = useState<string>("all");
  const [text, setText] = useState("");
  const data = q.data?.data;
  const results = useMemo(() => data?.results ?? [], [data]);

  const states = useMemo(() => {
    const m = new Map<string, { count: number; tone: ReturnType<typeof coverageTone>["tone"] }>();
    for (const r of results) {
      const cur = m.get(r.coverage) ?? { count: 0, tone: coverageTone(r).tone };
      cur.count++;
      m.set(r.coverage, cur);
    }
    return [...m.entries()].sort((a, b) => b[1].count - a[1].count);
  }, [results]);

  const byKind = useMemo(() => {
    const m = new Map<string, { total: number; indexed: number }>();
    for (const r of results) {
      const k = kindOf(r.url);
      const cur = m.get(k) ?? { total: 0, indexed: 0 };
      cur.total++;
      if (isIndexed(r)) cur.indexed++;
      m.set(k, cur);
    }
    return [...m.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [results]);

  const indexed = results.filter(isIndexed).length;
  const total = data?.total ?? 0;
  const pct = total ? indexed / total : 0;

  const rows = results
    .filter((r) => filter === "all" || r.coverage === filter)
    .filter((r) => !text || pathOf(r.url).toLowerCase().includes(text.toLowerCase()))
    .sort((a, b) => Number(isIndexed(a)) - Number(isIndexed(b)) || pathOf(a.url).localeCompare(pathOf(b.url)));

  return (
    <div className="space-y-6">
      <Freshness
        source="Search Console URL Inspection · checked daily"
        updatedAt={data?.finishedAt ?? q.data?.updatedAt}
        error={q.data?.error}
        running={q.data?.running}
        refreshing={refresh.isPending && refresh.variables === "indexing"}
        onRefresh={() => refresh.mutate("indexing")}
        link={LINKS.gsc}
      />
      {q.data?.running && results.length < total && (
        <Notice>
          Checking every page with Google — {results.length} of {total} done. This runs one page at a time and takes a few minutes; the table fills in as it goes.
        </Notice>
      )}

      {!data ? (
        <div className="grid gap-3 md:grid-cols-3">
          <Skeletons count={3} className="h-32" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel title="Pages in Google" className="lg:col-span-1">
            <div className="flex items-center gap-5">
              <Ring value={pct} />
              <div>
                <p className="font-display text-3xl font-bold tabular-nums text-foreground">
                  {indexed}
                  <span className="text-lg font-semibold text-muted-foreground"> / {total}</span>
                </p>
                <p className="font-body text-sm text-muted-foreground">sitemap pages indexed</p>
              </div>
            </div>
            <ul className="mt-5 space-y-2">
              {byKind.map(([kind, v]) => (
                <li key={kind} className="font-body text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground">{kind}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {v.indexed}/{v.total}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-700" style={{ width: `${(v.indexed / v.total) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Status" description="Tap a status to filter the list" className="lg:col-span-2">
            <div className="flex flex-wrap gap-2">
              <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All pages" count={results.length} tone="neutral" />
              {states.map(([state, v]) => (
                <FilterChip key={state} active={filter === state} onClick={() => setFilter(state)} label={state} count={v.count} tone={v.tone} />
              ))}
            </div>
            {filter !== "all" && results.find((r) => r.coverage === filter) && (
              <p className="mt-4 font-body text-sm text-muted-foreground">{coverageTone(results.find((r) => r.coverage === filter) as Inspection).hint}</p>
            )}
          </Panel>
        </div>
      )}

      <Panel
        title="Every page"
        description="Not-indexed pages first"
        action={
          <label className="relative block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Filter by path"
              className="h-8 w-48 rounded-lg border border-border bg-background pl-8 pr-2 font-body text-sm outline-none focus:border-primary/40"
            />
          </label>
        }
      >
        <DataTable
          rows={rows}
          limit={300}
          empty={data ? "No pages match." : "The first check is still running."}
          columns={[
            {
              key: "u",
              label: "Page",
              render: (r) => (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="break-all text-foreground hover:underline">
                  {pathOf(r.url)}
                </a>
              ),
            },
            { key: "s", label: "Google status", render: (r) => <Pill tone={coverageTone(r).tone}>{r.coverage}</Pill> },
            { key: "c", label: "Last crawled", align: "right", render: (r) => <span className="text-muted-foreground">{r.lastCrawl ? fmtAgo(r.lastCrawl) : "never"}</span> },
            {
              key: "g",
              label: "",
              align: "right",
              render: (r) => (
                <span className="inline-flex items-center gap-2">
                  {r.googleCanonical && r.userCanonical && r.googleCanonical !== r.userCanonical && <Pill tone="warn">Google chose another canonical</Pill>}
                  {r.link && (
                    <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" title="Open in Search Console">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </span>
              ),
            },
          ]}
        />
      </Panel>
    </div>
  );
}

function FilterChip({ active, onClick, label, count, tone }: { active: boolean; onClick: () => void; label: string; count: number; tone: "good" | "warn" | "bad" | "neutral" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-body text-xs font-medium transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary/30",
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          tone === "good" && "bg-emerald-500",
          tone === "warn" && "bg-amber-500",
          tone === "bad" && "bg-rose-500",
          tone === "neutral" && "bg-muted-foreground/50",
        )}
      />
      {label}
      <span className={cn("tabular-nums", active ? "text-primary-foreground/80" : "text-muted-foreground")}>{count}</span>
    </button>
  );
}

/** Donut showing the indexed share. */
function Ring({ value }: { value: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <svg width="76" height="76" viewBox="0 0 76 76" className="shrink-0 -rotate-90" aria-hidden>
      <circle cx="38" cy="38" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
      <circle
        cx="38"
        cy="38"
        r={r}
        fill="none"
        stroke={value > 0.9 ? "rgb(16 185 129)" : value > 0.6 ? "rgb(245 158 11)" : "rgb(244 63 94)"}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${c * value} ${c}`}
        className="transition-[stroke-dasharray] duration-1000"
      />
    </svg>
  );
}
