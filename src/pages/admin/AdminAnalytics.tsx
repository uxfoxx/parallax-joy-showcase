import { lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInsightsStatus, useRealtime, type Range } from "@/lib/insights";
import { cn } from "@/lib/utils";
import { Notice } from "@/components/admin/analytics/ui";

// recharts and each tab load only when someone opens this page.
const OverviewTab = lazy(() => import("@/components/admin/analytics/OverviewTab"));
const VisitorsTab = lazy(() => import("@/components/admin/analytics/VisitorsTab"));
const SearchTab = lazy(() => import("@/components/admin/analytics/SearchTab"));
const IndexingTab = lazy(() => import("@/components/admin/analytics/IndexingTab"));
const BehaviourTab = lazy(() => import("@/components/admin/analytics/BehaviourTab"));
const BingTab = lazy(() => import("@/components/admin/analytics/BingSpeedTabs").then((m) => ({ default: m.BingTab })));
const SpeedTab = lazy(() => import("@/components/admin/analytics/BingSpeedTabs").then((m) => ({ default: m.SpeedTab })));

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "visitors", label: "Visitors" },
  { id: "search", label: "Google Search" },
  { id: "indexing", label: "Indexing" },
  { id: "behaviour", label: "Heatmaps & behaviour" },
  { id: "bing", label: "Bing & AI search" },
  { id: "speed", label: "Speed" },
] as const;
const RANGES: Range[] = [7, 28, 90];

function LiveNow() {
  const rt = useRealtime();
  const n = rt.data?.data?.activeUsers;
  if (n == null) return null;
  const pages = rt.data?.data?.pages ?? [];
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-body text-xs text-foreground"
      title={pages.length ? pages.map((p) => `${p.title}: ${p.users}`).join("\n") : "Nobody on the site in the last 30 minutes"}
    >
      <span className="relative flex h-2 w-2">
        {n > 0 && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", n > 0 ? "bg-emerald-500" : "bg-muted-foreground/40")} />
      </span>
      <span className="font-semibold tabular-nums">{n}</span> on the site now
    </span>
  );
}

const AdminAnalytics = () => {
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.id === params.get("tab")) ? (params.get("tab") as string) : "overview";
  const days = (RANGES.includes(Number(params.get("days")) as Range) ? Number(params.get("days")) : 28) as Range;
  const status = useInsightsStatus();
  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    next.set(k, v);
    setParams(next, { replace: true });
  };
  const ranged = tab === "overview" || tab === "visitors" || tab === "search";

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground">
            <Activity className="h-5 w-5 text-forest-mid" /> Analytics
          </h1>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            Visitors, Google and Bing search, indexing, heatmap signals and speed for olivefoods.lk, in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LiveNow />
          <div className={cn("inline-flex rounded-lg border border-border bg-card p-0.5 transition-opacity", !ranged && "pointer-events-none opacity-40")} aria-label="Date range">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => set("days", String(r))}
                aria-pressed={days === r}
                className={cn(
                  "rounded-md px-3 py-1.5 font-body text-xs font-medium transition-colors",
                  days === r ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r} days
              </button>
            ))}
          </div>
        </div>
      </div>

      {status.error && <Notice tone="warn">{(status.error as Error).message} The analytics service runs on the server; if this persists, it may be restarting.</Notice>}

      <Tabs value={tab} onValueChange={(v) => set("tab", v)}>
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <TabsList className="h-auto w-max gap-1 bg-muted/60 p-1">
            {TABS.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="px-3 py-1.5 font-body text-sm">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <Suspense fallback={<p className="pt-6 font-body text-sm text-muted-foreground">Loading…</p>}>
          <TabsContent value="overview" className="pt-4">
            <OverviewTab days={days} />
          </TabsContent>
          <TabsContent value="visitors" className="pt-4">
            <VisitorsTab days={days} />
          </TabsContent>
          <TabsContent value="search" className="pt-4">
            <SearchTab days={days} />
          </TabsContent>
          <TabsContent value="indexing" className="pt-4">
            <IndexingTab />
          </TabsContent>
          <TabsContent value="behaviour" className="pt-4">
            <BehaviourTab />
          </TabsContent>
          <TabsContent value="bing" className="pt-4">
            <BingTab />
          </TabsContent>
          <TabsContent value="speed" className="pt-4">
            <SpeedTab />
          </TabsContent>
        </Suspense>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
