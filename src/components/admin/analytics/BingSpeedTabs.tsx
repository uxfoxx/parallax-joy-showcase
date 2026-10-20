import { fmtDec, fmtInt, LINKS, pathOf, useBing, useRefreshInsight, useSpeed, type FieldData, type SpeedRun } from "@/lib/insights";
import { cn } from "@/lib/utils";
import { DataTable, Freshness, Kpi, Notice, Panel, Pill, Skeletons } from "./ui";
import { Legend, TrendChart, type Series } from "./TrendChart";

const bingSeries: Series[] = [
  { key: "impressions", label: "Impressions", color: "hsl(var(--gold))", axis: "right" },
  { key: "clicks", label: "Clicks", color: "hsl(var(--forest-mid))" },
];

export function BingTab() {
  const q = useBing();
  const refresh = useRefreshInsight();
  const b = q.data?.data;
  const clicks = b?.daily.reduce((n, d) => n + d.clicks, 0) ?? 0;
  const impressions = b?.daily.reduce((n, d) => n + d.impressions, 0) ?? 0;
  const latest = b?.crawl.at(-1);
  const empty = b && !b.daily.length && !b.queries.length;

  return (
    <div className="space-y-6">
      <Freshness
        source="Bing Webmaster Tools · every 6 hours"
        updatedAt={q.data?.updatedAt}
        error={q.data?.error}
        running={q.data?.running}
        refreshing={refresh.isPending && refresh.variables === "bing"}
        onRefresh={() => refresh.mutate("bing")}
        link={LINKS.bing}
      />
      <Notice>Bing's results also power ChatGPT search and Microsoft Copilot, so these numbers are the clearest view of AI-search visibility.</Notice>
      {empty && <Notice tone="warn">Bing is still processing the site after it was added on 20 October 2026; its reports usually start within 48 hours.</Notice>}
      {!b ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Skeletons count={4} className="h-[104px]" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label="Clicks" value={fmtInt(clicks)} sub="Last 6 months" />
          <Kpi label="Impressions" value={fmtInt(impressions)} sub="Last 6 months" />
          <Kpi label="Pages in Bing's index" value={latest ? fmtInt(latest.inIndex) : "–"} sub={latest ? `as of ${latest.date}` : "Waiting for Bing"} />
          <Kpi label="Crawl errors" tone={latest?.errors ? "warn" : "good"} value={latest ? fmtInt(latest.errors) : "–"} sub={latest ? `${fmtInt(latest.crawled)} pages crawled that day` : undefined} />
        </div>
      )}
      <Panel title="Bing clicks and impressions" action={<Legend series={bingSeries} />}>
        <TrendChart data={b?.daily ?? []} series={bingSeries} />
      </Panel>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Searches on Bing">
          <DataTable
            rows={b?.queries ?? []}
            columns={[
              { key: "n", label: "Search", render: (r) => r.name },
              { key: "c", label: "Clicks", align: "right", render: (r) => fmtInt(r.clicks) },
              { key: "i", label: "Impressions", align: "right", render: (r) => fmtInt(r.impressions) },
              { key: "p", label: "Position", align: "right", render: (r) => fmtDec(r.position) },
            ]}
          />
        </Panel>
        <Panel title="Pages on Bing">
          <DataTable
            rows={b?.pages ?? []}
            columns={[
              { key: "n", label: "Page", render: (r) => <span className="break-all">{pathOf(r.name)}</span> },
              { key: "c", label: "Clicks", align: "right", render: (r) => fmtInt(r.clicks) },
              { key: "i", label: "Impressions", align: "right", render: (r) => fmtInt(r.impressions) },
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}

const CWV: { key: keyof NonNullable<FieldData>; label: string; unit: (n: number) => string }[] = [
  { key: "lcp", label: "Largest paint (LCP)", unit: (n) => `${(n / 1000).toFixed(1)} s` },
  { key: "inp", label: "Responsiveness (INP)", unit: (n) => `${Math.round(n)} ms` },
  { key: "cls", label: "Layout shift (CLS)", unit: (n) => n.toFixed(2) },
  { key: "fcp", label: "First paint (FCP)", unit: (n) => `${(n / 1000).toFixed(1)} s` },
  { key: "ttfb", label: "Server response (TTFB)", unit: (n) => `${(n / 1000).toFixed(1)} s` },
];

function Score({ label, value }: { label: string; value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const color = value >= 90 ? "rgb(16 185 129)" : value >= 50 ? "rgb(245 158 11)" : "rgb(244 63 94)";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden>
          <circle cx="32" cy="32" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(c * value) / 100} ${c}`} className="transition-[stroke-dasharray] duration-1000" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold tabular-nums" style={{ color }}>
          {value}
        </span>
      </div>
      <span className="text-center font-body text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

function RunCard({ run }: { run: SpeedRun }) {
  const field = run.page ?? run.origin;
  return (
    <Panel title={run.strategy === "mobile" ? "Phones" : "Desktop"} description="Homepage · Lighthouse lab test">
      <div className="grid grid-cols-4 gap-2">
        <Score label="Performance" value={run.scores.performance ?? 0} />
        <Score label="Accessibility" value={run.scores.accessibility ?? 0} />
        <Score label="Best practices" value={run.scores["best-practices"] ?? 0} />
        <Score label="SEO" value={run.scores.seo ?? 0} />
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 font-body text-sm sm:grid-cols-3">
        {[
          ["First paint", run.lab.fcp],
          ["Largest paint", run.lab.lcp],
          ["Blocking time", run.lab.tbt],
          ["Layout shift", run.lab.cls],
          ["Speed index", run.lab.si],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-muted-foreground">{k}</dt>
            <dd className="font-medium tabular-nums text-foreground">{v ?? "–"}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 border-t border-border pt-4">
        <p className="mb-2 font-body text-xs font-medium text-muted-foreground">Real visitors (Chrome, last 28 days)</p>
        {field ? (
          <ul className="space-y-1.5">
            {CWV.map(({ key, label, unit }) => {
              const m = field[key] as { p75: number; category: string } | undefined;
              if (!m) return null;
              return (
                <li key={key} className="flex items-center justify-between font-body text-sm">
                  <span className="text-foreground">{label}</span>
                  <span className="flex items-center gap-2 tabular-nums">
                    {unit(m.p75)}
                    <Pill tone={m.category === "FAST" ? "good" : m.category === "AVERAGE" ? "warn" : "bad"}>{m.category === "FAST" ? "Good" : m.category === "AVERAGE" ? "Needs work" : "Poor"}</Pill>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="font-body text-sm text-muted-foreground">Chrome reports real-visitor speed only once a site has enough visits; it will appear here automatically.</p>
        )}
      </div>
    </Panel>
  );
}

export function SpeedTab() {
  const q = useSpeed();
  const refresh = useRefreshInsight();
  const s = q.data?.data;
  return (
    <div className="space-y-6">
      <Freshness
        source="PageSpeed Insights · daily"
        updatedAt={q.data?.updatedAt}
        error={q.data?.error}
        running={q.data?.running}
        refreshing={refresh.isPending && refresh.variables === "speed"}
        onRefresh={() => refresh.mutate("speed")}
        link="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.olivefoods.lk%2F"
      />
      {!s ? (
        <div className={cn("grid gap-6 lg:grid-cols-2")}>
          <Skeletons count={2} className="h-80" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <RunCard run={s.mobile} />
          <RunCard run={s.desktop} />
        </div>
      )}
    </div>
  );
}
