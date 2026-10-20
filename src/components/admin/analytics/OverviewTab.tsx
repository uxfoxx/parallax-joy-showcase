import { useMemo } from "react";
import { Eye, FileCheck2, MessageSquare, MousePointerClick, Search, Target, Users, Waves } from "lucide-react";
import { useContactSubmissions } from "@/lib/api";
import {
  fmtDec,
  fmtInt,
  fmtPct,
  pathOf,
  useClarity,
  useGa,
  useIndexing,
  useSearch,
  type Range,
} from "@/lib/insights";
import { BarList, Delta, Freshness, Kpi, Panel, Skeletons } from "./ui";
import { Legend, TrendChart, type Series } from "./TrendChart";
import { LEAD_LABELS, isIndexed } from "./labels";

const traffic: Series[] = [
  { key: "users", label: "Visitors", color: "hsl(var(--forest-mid))" },
  { key: "views", label: "Page views", color: "hsl(var(--gold))" },
];
const search: Series[] = [
  { key: "impressions", label: "Impressions", color: "hsl(var(--gold))", axis: "right" },
  { key: "clicks", label: "Clicks", color: "hsl(var(--forest-mid))" },
];

export default function OverviewTab({ days }: { days: Range }) {
  const ga = useGa(days);
  const gsc = useSearch(days);
  const idx = useIndexing();
  const clarity = useClarity();
  const { data: submissions } = useContactSubmissions();

  const g = ga.data?.data;
  const s = gsc.data?.data;
  const results = idx.data?.data?.results ?? [];
  const indexed = results.filter(isIndexed).length;
  const c = clarity.data?.data;

  const forms = useMemo(() => {
    const since = Date.now() - days * 86_400_000;
    const before = since - days * 86_400_000;
    const list = submissions ?? [];
    return {
      now: list.filter((x) => Date.parse(x.created_at) >= since).length,
      prev: list.filter((x) => Date.parse(x.created_at) >= before && Date.parse(x.created_at) < since).length,
    };
  }, [submissions, days]);

  const leadClicks = g?.leadEvents.reduce((n, e) => n + e.count, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {ga.isLoading || gsc.isLoading ? (
          <Skeletons count={8} className="h-[104px]" />
        ) : (
          <>
            <Kpi icon={Users} label="Visitors" value={fmtInt(g?.totals.activeUsers)} delta={g && <Delta now={g.totals.activeUsers} before={g.previous.activeUsers} />} sub={g ? `${fmtInt(g.totals.newUsers)} new · ${fmtInt(g.totals.sessions)} sessions` : "Google Analytics"} />
            <Kpi icon={Eye} label="Page views" value={fmtInt(g?.totals.screenPageViews)} delta={g && <Delta now={g.totals.screenPageViews} before={g.previous.screenPageViews} />} sub={g ? `${fmtPct(g.totals.engagementRate, 0)} engaged sessions` : undefined} />
            <Kpi icon={Target} tone="good" label="Enquiries" value={fmtInt(forms.now)} delta={<Delta now={forms.now} before={forms.prev} />} sub={`Quote forms · ${fmtInt(leadClicks)} call/WhatsApp/email taps`} />
            <Kpi icon={MessageSquare} label="Lead actions" value={fmtInt(g?.totals.keyEvents)} delta={g && <Delta now={g.totals.keyEvents} before={g.previous.keyEvents} />} sub="Key events in Google Analytics" />
            <Kpi icon={MousePointerClick} label="Google clicks" value={fmtInt(s?.totals.clicks)} delta={s && <Delta now={s.totals.clicks} before={s.previous.clicks} />} sub={s ? `${fmtPct(s.totals.ctr)} click-through` : "Search Console"} />
            <Kpi icon={Search} label="Google impressions" value={fmtInt(s?.totals.impressions)} delta={s && <Delta now={s.totals.impressions} before={s.previous.impressions} />} sub="Times the site appeared in results" />
            <Kpi icon={Waves} label="Avg. Google position" value={fmtDec(s?.totals.position)} delta={s && <Delta now={s.totals.position} before={s.previous.position} invert />} sub="Lower is better" />
            <Kpi
              icon={FileCheck2}
              tone={results.length && indexed / results.length > 0.9 ? "good" : "warn"}
              label="Pages indexed"
              value={results.length ? `${indexed}/${idx.data?.data?.total ?? results.length}` : "–"}
              sub={c ? `${fmtInt(c.sessions)} Clarity sessions in 24 h` : "Google index, checked daily"}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Visitors" description={`Last ${days} days · Google Analytics`} action={<Legend series={traffic} />}>
          <TrendChart data={g?.daily ?? []} series={traffic} />
          <div className="mt-3">
            <Freshness source="Google Analytics" updatedAt={ga.data?.updatedAt} error={ga.data?.error ?? (ga.error as Error | null)?.message} />
          </div>
        </Panel>
        <Panel title="Google search" description={`Last ${days} days · Search Console (latest 2–3 days still filling in)`} action={<Legend series={search} />}>
          <TrendChart data={s?.daily ?? []} series={search} />
          <div className="mt-3">
            <Freshness source="Search Console" updatedAt={gsc.data?.updatedAt} error={gsc.data?.error ?? (gsc.error as Error | null)?.message} />
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Top pages" description="By page views">
          <BarList items={(g?.pages ?? []).map((p) => ({ label: p.path, value: p.views }))} />
        </Panel>
        <Panel title="Top Google searches" description="By clicks, then impressions">
          <BarList
            items={(s?.queries ?? [])
              .slice()
              .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
              .map((q) => ({ label: q.name, value: q.clicks, extra: <span className="font-normal text-muted-foreground">{fmtInt(q.impressions)} imp.</span> }))}
          />
        </Panel>
        <Panel title="Lead actions" description="Taps and forms that start a conversation">
          <BarList
            items={[
              { label: "Quote / contact form sent", value: forms.now },
              ...(g?.leadEvents ?? []).filter((e) => e.name !== "generate_lead").map((e) => ({ label: LEAD_LABELS[e.name] ?? e.name, value: e.count })),
            ]}
            empty="No lead actions yet."
          />
        </Panel>
      </div>

      <Panel title="Where visitors land from Google" description="Search Console · top pages by clicks">
        <BarList
          items={(s?.pages ?? []).map((p) => ({ label: pathOf(p.name), value: p.clicks, href: p.name, extra: <span className="font-normal text-muted-foreground">pos. {fmtDec(p.position)}</span> }))}
          max={10}
        />
      </Panel>
    </div>
  );
}
