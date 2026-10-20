import { fmtDuration, fmtInt, fmtPct, LINKS, useGa, type Range } from "@/lib/insights";
import { BarList, DataTable, Delta, Freshness, Kpi, Panel, Skeletons } from "./ui";
import { Legend, TrendChart, type Series } from "./TrendChart";
import { LEAD_LABELS } from "./labels";

const series: Series[] = [
  { key: "users", label: "Visitors", color: "hsl(var(--forest-mid))" },
  { key: "sessions", label: "Sessions", color: "hsl(var(--forest-light))" },
  { key: "views", label: "Page views", color: "hsl(var(--gold))" },
];

export default function VisitorsTab({ days }: { days: Range }) {
  const ga = useGa(days);
  const g = ga.data?.data;
  const t = g?.totals;
  const p = g?.previous;

  return (
    <div className="space-y-6">
      <Freshness source="Google Analytics 4" updatedAt={ga.data?.updatedAt} error={ga.data?.error ?? (ga.error as Error | null)?.message} link={LINKS.ga} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {!t || !p ? (
          <Skeletons count={4} className="h-[104px]" />
        ) : (
          <>
            <Kpi label="Visitors" value={fmtInt(t.activeUsers)} delta={<Delta now={t.activeUsers} before={p.activeUsers} />} sub={`${fmtInt(t.newUsers)} first-time`} />
            <Kpi label="Sessions" value={fmtInt(t.sessions)} delta={<Delta now={t.sessions} before={p.sessions} />} sub={`${fmtDuration(t.averageSessionDuration)} average`} />
            <Kpi label="Page views" value={fmtInt(t.screenPageViews)} delta={<Delta now={t.screenPageViews} before={p.screenPageViews} />} sub={t.sessions ? `${(t.screenPageViews / t.sessions).toFixed(1)} per session` : undefined} />
            <Kpi label="Engaged sessions" value={fmtPct(t.engagementRate, 0)} delta={<Delta now={t.engagementRate} before={p.engagementRate} />} sub="Stayed 10 s+, viewed 2+ pages or acted" />
          </>
        )}
      </div>

      <Panel title="Traffic over time" description={`Last ${days} days`} action={<Legend series={series} />}>
        <TrendChart data={g?.daily ?? []} series={series} height={280} />
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Most viewed pages">
          <DataTable
            rows={g?.pages ?? []}
            columns={[
              { key: "p", label: "Page", render: (r) => <span className="break-all">{r.path}</span> },
              { key: "v", label: "Views", align: "right", render: (r) => fmtInt(r.views) },
              { key: "u", label: "Visitors", align: "right", render: (r) => fmtInt(r.users) },
              { key: "t", label: "Time / visitor", align: "right", render: (r) => fmtDuration(r.avgEngagement) },
            ]}
          />
        </Panel>
        <Panel title="Landing pages" description="Where sessions start, and the lead actions they lead to">
          <DataTable
            rows={g?.landing ?? []}
            columns={[
              { key: "p", label: "Landing page", render: (r) => <span className="break-all">{r.path || "/"}</span> },
              { key: "s", label: "Sessions", align: "right", render: (r) => fmtInt(r.sessions) },
              { key: "l", label: "Lead actions", align: "right", render: (r) => fmtInt(r.leads) },
            ]}
          />
        </Panel>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Panel title="Channels" description="How visitors found the site">
          <BarList items={(g?.channels ?? []).map((c) => ({ label: c.name, value: c.sessions, extra: c.leads ? <span className="font-normal text-muted-foreground">{c.leads} leads</span> : undefined }))} />
        </Panel>
        <Panel title="Sources" description="Source / medium">
          <BarList items={(g?.sources ?? []).map((c) => ({ label: c.name, value: c.sessions }))} />
        </Panel>
        <Panel title="Lead actions" description="Google Analytics key events">
          <BarList items={(g?.leadEvents ?? []).map((e) => ({ label: LEAD_LABELS[e.name] ?? e.name, value: e.count }))} empty="No lead actions yet." />
        </Panel>
        <Panel title="Countries">
          <BarList items={(g?.countries ?? []).map((c) => ({ label: c.name, value: c.users }))} />
        </Panel>
        <Panel title="Cities">
          <BarList items={(g?.cities ?? []).map((c) => ({ label: c.name, value: c.users }))} />
        </Panel>
        <Panel title="Devices">
          <BarList items={(g?.devices ?? []).map((c) => ({ label: c.name.charAt(0).toUpperCase() + c.name.slice(1), value: c.users }))} />
        </Panel>
      </div>
    </div>
  );
}
