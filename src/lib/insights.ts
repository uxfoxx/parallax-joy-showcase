/**
 * Admin analytics data, from the insights service on the VPS
 * (deploy/insights, nginx /api/insights/ → 127.0.0.1:4101). The service holds
 * the read-only keys for GA4, Search Console, Clarity and Bing and answers only
 * admins: every call carries the admin's Supabase session token.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Range = 7 | 28 | 90;

/** What every endpoint returns around its data. */
export type Envelope<T> = {
  configured?: boolean;
  updatedAt: string | null;
  checkedAt?: string | null;
  data: T | null;
  error: string | null;
  running?: boolean;
};

export type GaReport = {
  days: number;
  totals: GaTotals;
  previous: GaTotals;
  daily: { date: string; users: number; sessions: number; views: number; leads: number }[];
  pages: { path: string; views: number; users: number; avgEngagement: number }[];
  channels: { name: string; sessions: number; leads: number }[];
  sources: { name: string; sessions: number }[];
  countries: { name: string; users: number }[];
  cities: { name: string; users: number }[];
  devices: { name: string; users: number }[];
  leadEvents: { name: string; count: number }[];
  landing: { path: string; sessions: number; leads: number }[];
};
export type GaTotals = {
  activeUsers: number;
  newUsers: number;
  sessions: number;
  screenPageViews: number;
  engagementRate: number;
  averageSessionDuration: number;
  keyEvents: number;
};
export type Realtime = { activeUsers: number; pages: { title: string; users: number }[] };

export type SearchRow = { name: string; clicks: number; impressions: number; ctr: number; position: number };
export type SearchTotals = Omit<SearchRow, "name">;
export type SearchReport = {
  days: number;
  totals: SearchTotals;
  previous: SearchTotals;
  daily: (SearchTotals & { date: string })[];
  queries: SearchRow[];
  pages: SearchRow[];
  countries: SearchRow[];
  devices: SearchRow[];
};
export type Sitemap = {
  path: string;
  isIndex: boolean;
  lastSubmitted: string | null;
  lastDownloaded: string | null;
  pending: boolean;
  errors: number;
  warnings: number;
  submitted: number;
};
export type Inspection = {
  url: string;
  verdict: "PASS" | "NEUTRAL" | "FAIL" | "PARTIAL" | "VERDICT_UNSPECIFIED";
  coverage: string;
  lastCrawl: string | null;
  fetch: string | null;
  robots: string | null;
  indexing: string | null;
  crawledAs: string | null;
  googleCanonical: string | null;
  userCanonical: string | null;
  link: string | null;
  checkedAt: string;
};
export type IndexingData = { startedAt: string; finishedAt: string | null; total: number; results: Inspection[] };

export type Share = { sessionsPct: number; count: number };
export type ClaritySummary = {
  sessions: number;
  botSessions: number;
  users: number;
  pagesPerSession: number;
  scrollDepth: number;
  totalTime: number;
  activeTime: number;
  deadClicks: Share;
  rageClicks: Share;
  quickbacks: Share;
  excessiveScroll: Share;
  scriptErrors: Share;
  errorClicks: Share;
  browsers: Named[];
  devices: Named[];
  os: Named[];
  countries: Named[];
  pages: Named[];
  referrers: Named[];
};
export type Named = { name: string; sessions: number };
export type ClarityPage = { url: string; sessions: number; deadClicks: number; rageClicks: number; quickbacks: number; scrollDepth: number | null };
export type ClarityEnvelope = Envelope<ClaritySummary> & {
  history: Record<string, { sessions: number; users: number; botSessions: number; scrollDepth: number; activeTime: number; deadClicks: number; rageClicks: number; quickbacks: number }>;
  pages: ClarityPage[];
  callsLeft: number;
};

export type BingReport = {
  daily: { date: string; clicks: number; impressions: number }[];
  queries: { name: string; clicks: number; impressions: number; position: number }[];
  pages: { name: string; clicks: number; impressions: number; position: number }[];
  crawl: { date: string; crawled: number; errors: number; inIndex: number; inLinks: number }[];
};

export type FieldMetric = { p75: number; category: "FAST" | "AVERAGE" | "SLOW" | string };
export type FieldData = { overall: string | null; lcp?: FieldMetric; inp?: FieldMetric; cls?: FieldMetric; fcp?: FieldMetric; ttfb?: FieldMetric } | null;
export type SpeedRun = {
  strategy: "mobile" | "desktop";
  scores: Record<string, number>;
  lab: Record<string, string | null>;
  page: FieldData;
  origin: FieldData;
};
export type SpeedReport = { url: string; mobile: SpeedRun; desktop: SpeedRun };

export type Status = {
  google: boolean;
  clarity: boolean;
  bing: boolean;
  clarityCallsLeft: number;
  ga4Property: string;
  gscSite: string;
};

export const LINKS = {
  ga: "https://analytics.google.com/analytics/web/#/p559765187/reports/intelligenthome",
  gsc: "https://search.google.com/search-console?resource_id=sc-domain%3Aolivefoods.lk",
  bing: "https://www.bing.com/webmasters/home?siteUrl=https%3A%2F%2Folivefoods.lk%2F",
  clarity: `https://clarity.microsoft.com/projects/view/${import.meta.env.VITE_CLARITY_ID || "z0n03rfjd8"}`,
};

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  let res: Response;
  try {
    res = await fetch(`/api/insights/${path}`, {
      ...init,
      headers: { authorization: `Bearer ${session?.access_token ?? ""}` },
    });
  } catch {
    throw new Error("The analytics service can't be reached.");
  }
  if (res.status === 401) throw new Error("Your admin session has expired. Sign in again.");
  const body = await res.json().catch(() => null);
  if (!res.ok && res.status !== 202) throw new Error(body?.error || `The analytics service answered ${res.status}.`);
  return body as T;
}

const useInsight = <T,>(path: string, opts: { refetchInterval?: number | ((data: T | undefined) => number | false) } = {}) =>
  useQuery({
    queryKey: ["insights", path],
    queryFn: () => call<T>(path),
    staleTime: 60_000,
    retry: 1,
    refetchInterval: opts.refetchInterval
      ? (q) => (typeof opts.refetchInterval === "function" ? opts.refetchInterval(q.state.data as T | undefined) : opts.refetchInterval) ?? false
      : undefined,
  });

const whileRunning = (d?: { running?: boolean }) => (d?.running ? 10_000 : false);

export const useInsightsStatus = () => useInsight<Status>("status");
export const useGa = (days: Range) => useInsight<Envelope<GaReport>>(`ga?days=${days}`);
export const useRealtime = () => useInsight<Envelope<Realtime>>("realtime", { refetchInterval: 60_000 });
export const useSearch = (days: Range) => useInsight<Envelope<SearchReport>>(`search?days=${days}`);
export const useSitemaps = () => useInsight<Envelope<Sitemap[]>>("sitemaps", { refetchInterval: whileRunning });
export const useIndexing = () => useInsight<Envelope<IndexingData>>("indexing", { refetchInterval: whileRunning });
export const useClarity = () => useInsight<ClarityEnvelope>("clarity", { refetchInterval: whileRunning });
export const useBing = () => useInsight<Envelope<BingReport>>("bing", { refetchInterval: whileRunning });
export const useSpeed = () => useInsight<Envelope<SpeedReport>>("speed", { refetchInterval: whileRunning });

export type Refreshable = "clarity" | "indexing" | "sitemaps" | "bing" | "speed";

/** Asks the service to fetch a scheduled source again now; the hooks above poll while it runs. */
export const useRefreshInsight = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (source: Refreshable) => call<{ started: boolean }>(`refresh/${source}`, { method: "POST" }),
    onSuccess: (_d, source) => {
      // The job flips `running` on the server almost at once; re-read to start polling.
      window.setTimeout(() => qc.invalidateQueries({ queryKey: ["insights", source] }), 800);
    },
  });
};

// ─── Formatting ───
export const fmtInt = (n: number | null | undefined) => (n == null ? "–" : Math.round(n).toLocaleString("en-US"));
export const fmtPct = (n: number | null | undefined, digits = 1) => (n == null ? "–" : `${(n * 100).toFixed(digits)}%`);
export const fmtDec = (n: number | null | undefined, digits = 1) => (n == null ? "–" : n.toFixed(digits));
export function fmtDuration(seconds: number | null | undefined) {
  if (seconds == null) return "–";
  const s = Math.round(seconds);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m}m ${s % 60}s` : `${Math.floor(m / 60)}h ${m % 60}m`;
}
export function fmtAgo(iso: string | null | undefined) {
  if (!iso) return "never";
  const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} d ago`;
}
/** "/products/x" from a full olivefoods.lk URL; the bare (no-www) host is labelled, since Google treats it as a separate URL. */
export function pathOf(url: string) {
  const m = /^https?:\/\/(www\.)?olivefoods\.lk(.*)$/.exec(url);
  if (!m) return url;
  const path = m[2] || "/";
  return m[1] ? path : `${path} (without www)`;
}
