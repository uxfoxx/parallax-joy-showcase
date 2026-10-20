import { ExternalLink, Flame, MousePointer2, Repeat2, ScrollText, TriangleAlert, Undo2 } from "lucide-react";
import { fmtDuration, fmtInt, LINKS, pathOf, useClarity, useRefreshInsight, type Share } from "@/lib/insights";
import { BarList, DataTable, Freshness, Kpi, Notice, Panel, Skeletons } from "./ui";
import { Legend, TrendChart, type Series } from "./TrendChart";

const history: Series[] = [
  { key: "sessions", label: "Sessions", color: "hsl(var(--forest-mid))" },
  { key: "rageClicks", label: "Rage clicks", color: "rgb(244 63 94)", axis: "right" },
  { key: "deadClicks", label: "Dead clicks", color: "hsl(var(--gold))", axis: "right" },
];

const heatmap = (url: string) => `${LINKS.clarity}/heatmaps?url=${encodeURIComponent(url)}`;

function Signal({ label, share, hint, icon }: { label: string; share?: Share; hint: string; icon: React.ComponentType<{ className?: string }> }) {
  const pct = share?.sessionsPct ?? 0;
  return (
    <Kpi
      icon={icon}
      tone={pct >= 10 ? "bad" : pct > 0 ? "warn" : "good"}
      label={label}
      value={`${pct.toFixed(pct && pct < 10 ? 1 : 0)}%`}
      sub={`${fmtInt(share?.count ?? 0)} time${share?.count === 1 ? "" : "s"} · ${hint}`}
    />
  );
}

export default function BehaviourTab() {
  const q = useClarity();
  const refresh = useRefreshInsight();
  const c = q.data?.data;
  const hist = Object.entries(q.data?.history ?? {}).map(([date, v]) => ({ date, ...v }));
  const left = q.data?.callsLeft ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Freshness
          source="Microsoft Clarity · last 24 hours"
          updatedAt={q.data?.updatedAt}
          error={q.data?.error}
          running={q.data?.running}
          refreshing={refresh.isPending && refresh.variables === "clarity"}
          onRefresh={left > 0 ? () => refresh.mutate("clarity") : undefined}
        />
        <div className="flex flex-wrap gap-2">
          {[
            ["Heatmaps", `${LINKS.clarity}/heatmaps`],
            ["Recordings", `${LINKS.clarity}/impressions`],
            ["Clarity dashboard", `${LINKS.clarity}/dashboard`],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-body text-xs font-medium text-foreground hover:border-primary/30"
            >
              {label} <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </div>
      <Notice>
        Clarity's API only allows 10 reads a day and covers the last 24 hours, so this view refreshes every 4 hours and keeps one snapshot a day to build the trend below.
        Heatmaps and session recordings open in Clarity. {left} manual refresh{left === 1 ? "" : "es"} left today.
      </Notice>

      {!c ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Skeletons count={4} className="h-[104px]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi label="Sessions" value={fmtInt(c.sessions)} sub={`${fmtInt(c.botSessions)} of them bots · ${fmtInt(c.users)} people`} />
            <Kpi label="Pages per session" value={c.pagesPerSession.toFixed(1)} />
            <Kpi label="Scroll depth" value={`${Math.round(c.scrollDepth)}%`} sub="Average, of each page's height" />
            <Kpi label="Time on site" value={fmtDuration(c.totalTime)} sub={`${fmtDuration(c.activeTime)} actively engaged`} />
          </div>
          <div>
            <h3 className="mb-3 font-display text-sm font-semibold text-foreground">Frustration signals</h3>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              <Signal icon={Flame} label="Rage clicks" share={c.rageClicks} hint="rapid repeated clicks" />
              <Signal icon={MousePointer2} label="Dead clicks" share={c.deadClicks} hint="clicks that did nothing" />
              <Signal icon={Undo2} label="Quick backs" share={c.quickbacks} hint="left a page within seconds" />
              <Signal icon={ScrollText} label="Excessive scrolling" share={c.excessiveScroll} hint="scrolling back and forth" />
              <Signal icon={TriangleAlert} label="Script errors" share={c.scriptErrors} hint="JavaScript errors" />
              <Signal icon={Repeat2} label="Error clicks" share={c.errorClicks} hint="clicks that hit an error" />
            </div>
          </div>
        </>
      )}

      <Panel title="Daily trend" description="One Clarity snapshot per day — grows over time" action={<Legend series={history} />}>
        <TrendChart data={hist} series={history} />
      </Panel>

      <Panel title="Pages" description="Last 24 hours · open a page's heatmap in Clarity">
        <DataTable
          rows={q.data?.pages ?? []}
          empty="The per-page breakdown is fetched once a day."
          columns={[
            {
              key: "u",
              label: "Page",
              render: (r) => (
                <a href={heatmap(r.url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 break-all hover:underline">
                  {pathOf(r.url)} <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                </a>
              ),
            },
            { key: "s", label: "Sessions", align: "right", render: (r) => fmtInt(r.sessions) },
            { key: "d", label: "Scroll", align: "right", render: (r) => (r.scrollDepth == null ? "–" : `${Math.round(r.scrollDepth)}%`) },
            { key: "r", label: "Rage", align: "right", render: (r) => fmtInt(r.rageClicks) },
            { key: "x", label: "Dead", align: "right", render: (r) => fmtInt(r.deadClicks) },
            { key: "q", label: "Quick backs", align: "right", render: (r) => fmtInt(r.quickbacks) },
          ]}
        />
      </Panel>

      {c && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Panel title="Devices">
            <BarList items={c.devices.map((d) => ({ label: d.name, value: d.sessions }))} />
          </Panel>
          <Panel title="Browsers">
            <BarList items={c.browsers.map((d) => ({ label: d.name, value: d.sessions }))} />
          </Panel>
          <Panel title="Operating systems">
            <BarList items={c.os.map((d) => ({ label: d.name, value: d.sessions }))} />
          </Panel>
          <Panel title="Countries">
            <BarList items={c.countries.map((d) => ({ label: d.name, value: d.sessions }))} />
          </Panel>
          <Panel title="Referrers">
            <BarList items={c.referrers.map((d) => ({ label: d.name, value: d.sessions }))} empty="No referrers in the last 24 hours." />
          </Panel>
          <Panel title="Page titles">
            <BarList items={c.pages.map((d) => ({ label: d.name, value: d.sessions }))} />
          </Panel>
        </div>
      )}
    </div>
  );
}
