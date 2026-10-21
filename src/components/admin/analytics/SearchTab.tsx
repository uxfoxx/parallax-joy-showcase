import { useState } from "react";
import { fmtAgo, fmtDec, fmtInt, fmtPct, LINKS, pathOf, useOpportunities, useRefreshInsight, useSearch, useSitemaps, type Range, type SearchRow } from "@/lib/insights";
import { cn } from "@/lib/utils";
import { BarList, DataTable, Delta, Freshness, Kpi, Panel, Pill, Skeletons } from "./ui";
import { Legend, TrendChart, type Series } from "./TrendChart";

const series: Series[] = [
  { key: "impressions", label: "Impressions", color: "hsl(var(--gold))", axis: "right" },
  { key: "clicks", label: "Clicks", color: "hsl(var(--forest-mid))" },
];

const rowCols = (label: string, render: (r: SearchRow) => React.ReactNode) => [
  { key: "n", label, render },
  { key: "c", label: "Clicks", align: "right" as const, render: (r: SearchRow) => fmtInt(r.clicks) },
  { key: "i", label: "Impressions", align: "right" as const, render: (r: SearchRow) => fmtInt(r.impressions) },
  { key: "t", label: "CTR", align: "right" as const, render: (r: SearchRow) => fmtPct(r.ctr) },
  { key: "p", label: "Position", align: "right" as const, render: (r: SearchRow) => <Position value={r.position} /> },
];

function Position({ value }: { value: number }) {
  return (
    <span className={cn("tabular-nums", value <= 3 ? "font-semibold text-emerald-700 dark:text-emerald-400" : value <= 10 ? "text-foreground" : "text-muted-foreground")}>
      {fmtDec(value)}
    </span>
  );
}

export default function SearchTab({ days }: { days: Range }) {
  const gsc = useSearch(days);
  const maps = useSitemaps();
  const opps = useOpportunities(days);
  const refresh = useRefreshInsight();
  const [view, setView] = useState<"queries" | "pages">("queries");
  const s = gsc.data?.data;

  return (
    <div className="space-y-6">
      <Freshness source="Google Search Console" updatedAt={gsc.data?.updatedAt} error={gsc.data?.error ?? (gsc.error as Error | null)?.message} link={LINKS.gsc} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {!s ? (
          <Skeletons count={4} className="h-[104px]" />
        ) : (
          <>
            <Kpi label="Clicks" value={fmtInt(s.totals.clicks)} delta={<Delta now={s.totals.clicks} before={s.previous.clicks} />} sub="Visits from Google search" />
            <Kpi label="Impressions" value={fmtInt(s.totals.impressions)} delta={<Delta now={s.totals.impressions} before={s.previous.impressions} />} sub="Times shown in results" />
            <Kpi label="Click-through rate" value={fmtPct(s.totals.ctr)} delta={<Delta now={s.totals.ctr} before={s.previous.ctr} />} />
            <Kpi label="Average position" value={fmtDec(s.totals.position)} delta={<Delta now={s.totals.position} before={s.previous.position} invert />} sub="Lower is better" />
          </>
        )}
      </div>

      <Panel title="Clicks and impressions" description={`Last ${days} days · the latest 2–3 days are still being counted`} action={<Legend series={series} />}>
        <TrendChart data={s?.daily ?? []} series={series} height={280} />
      </Panel>

      <Panel
        title={view === "queries" ? "What people searched" : "Pages that appeared"}
        action={
          <div className="inline-flex rounded-lg border border-border p-0.5">
            {(["queries", "pages"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn("rounded-md px-3 py-1 font-body text-xs font-medium transition-colors", view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {v === "queries" ? "Searches" : "Pages"}
              </button>
            ))}
          </div>
        }
      >
        {view === "queries" ? (
          <DataTable rows={s?.queries ?? []} columns={rowCols("Search", (r) => r.name)} limit={50} />
        ) : (
          <DataTable
            rows={s?.pages ?? []}
            columns={rowCols("Page", (r) => (
              <a href={r.name} target="_blank" rel="noopener noreferrer" className="break-all hover:underline">
                {pathOf(r.name)}
              </a>
            ))}
            limit={50}
          />
        )}
      </Panel>

      {/* The monthly SEO loop: work down this list, then re-check next month. */}
      <Panel
        title="Opportunities"
        description={
          <>
            Searches (not your brand name) where a page already appears at positions 4–20, sorted by the extra clicks a move into the top 3 would bring.
            Work down this list each month: on page 1, sharpen that page's title and description to win the click; on page 2, strengthen the page itself
            (content that answers that search, links to it from related pages).
          </>
        }
      >
        {!opps.data?.data ? (
          opps.data?.error ? <p className="font-body text-sm text-muted-foreground">{opps.data.error}</p> : <Skeletons count={1} className="h-40" />
        ) : (
          <DataTable
            rows={opps.data.data.rows}
            empty="No searches in the 4–20 range yet. Check back as Google gathers data."
            columns={[
              { key: "q", label: "Search", render: (r) => <span className="font-medium">{r.query}</span> },
              {
                key: "p",
                label: "Page",
                render: (r) => (
                  <a href={r.page} target="_blank" rel="noopener noreferrer" className="break-all text-muted-foreground hover:text-foreground hover:underline">
                    {pathOf(r.page)}
                  </a>
                ),
              },
              { key: "pos", label: "Position", align: "right", render: (r) => <Position value={r.position} /> },
              { key: "i", label: "Impressions", align: "right", render: (r) => fmtInt(r.impressions) },
              { key: "c", label: "Clicks", align: "right", render: (r) => fmtInt(r.clicks) },
              { key: "g", label: "Potential", align: "right", render: (r) => <span className="tabular-nums">+{fmtDec(r.potential)}</span> },
              {
                key: "s",
                label: "Next step",
                render: (r) => (r.stage === "page1" ? <Pill tone="warn">Page 1 · sharpen title</Pill> : <Pill tone="neutral">Page 2 · strengthen page</Pill>),
              },
            ]}
            limit={40}
          />
        )}
      </Panel>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel title="Countries" description="By impressions">
          <BarList items={(s?.countries ?? []).map((c) => ({ label: c.name.toUpperCase(), value: c.impressions, extra: <span className="font-normal text-muted-foreground">{fmtInt(c.clicks)} clicks</span> }))} />
        </Panel>
        <Panel title="Devices" description="By impressions">
          <BarList items={(s?.devices ?? []).map((c) => ({ label: c.name.charAt(0) + c.name.slice(1).toLowerCase(), value: c.impressions, extra: <span className="font-normal text-muted-foreground">{fmtInt(c.clicks)} clicks</span> }))} />
        </Panel>
      </div>

      <Panel
        title="Sitemaps"
        description="What Google last read from the sitemaps"
        action={
          <Freshness
            source="Search Console"
            updatedAt={maps.data?.updatedAt}
            error={maps.data?.error}
            running={maps.data?.running}
            refreshing={refresh.isPending && refresh.variables === "sitemaps"}
            onRefresh={() => refresh.mutate("sitemaps")}
          />
        }
      >
        {!maps.data?.data ? (
          <Skeletons count={1} className="h-24" />
        ) : (
          <DataTable
            rows={maps.data.data}
            columns={[
              { key: "p", label: "Sitemap", render: (r) => <span className="break-all">{pathOf(r.path)}</span> },
              { key: "s", label: "Status", render: (r) => (r.errors ? <Pill tone="bad">{r.errors} errors</Pill> : r.warnings ? <Pill tone="warn">{r.warnings} warnings</Pill> : r.pending ? <Pill tone="neutral">Pending</Pill> : <Pill tone="good">Success</Pill>) },
              { key: "u", label: "URLs", align: "right", render: (r) => fmtInt(r.submitted) },
              { key: "d", label: "Last read", align: "right", render: (r) => fmtAgo(r.lastDownloaded) },
            ]}
          />
        )}
      </Panel>
    </div>
  );
}
