// Microsoft Clarity Data Export API. Hard limit: 10 calls per project per day,
// covering at most the last 1–3 days. So the service calls it on a schedule
// (never per page view), counts every call in a persisted log, and keeps one
// snapshot per day to build a history the API itself doesn't offer.
// Heatmaps and recordings themselves aren't in the API — the admin page links
// to them in Clarity.

const ENDPOINT = "https://www.clarity.ms/export-data/api/v1/project-live-insights";

export async function clarityInsights(token, dimension) {
  const params = new URLSearchParams({ numOfDays: "1" });
  if (dimension) params.set("dimension1", dimension);
  const res = await fetch(`${ENDPOINT}?${params}`, { headers: { authorization: `Bearer ${token}` } });
  const text = await res.text();
  if (!res.ok) throw new Error(`Clarity ${res.status}: ${text.slice(0, 160)}`);
  return JSON.parse(text);
}

/** Flattens the API's metric list into one object a page can read. */
export function summarise(raw) {
  const metric = (name) => raw.find((m) => m.metricName === name)?.information ?? [];
  const share = (name) => {
    const i = metric(name)[0] ?? {};
    return { sessionsPct: Number(i.sessionsWithMetricPercentage ?? 0), count: Number(i.subTotal ?? 0) };
  };
  const traffic = metric("Traffic")[0] ?? {};
  const engagement = metric("EngagementTime")[0] ?? {};
  const list = (name) =>
    metric(name)
      .map((i) => ({ name: i.name ?? i.Name ?? i.url ?? "Unknown", sessions: Number(i.sessionsCount ?? 0) }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10);
  return {
    sessions: Number(traffic.totalSessionCount ?? 0),
    botSessions: Number(traffic.totalBotSessionCount ?? 0),
    users: Number(traffic.distinctUserCount ?? 0),
    pagesPerSession: Number(traffic.pagesPerSessionPercentage ?? 0),
    scrollDepth: Number(metric("ScrollDepth")[0]?.averageScrollDepth ?? 0),
    totalTime: Number(engagement.totalTime ?? 0),
    activeTime: Number(engagement.activeTime ?? 0),
    deadClicks: share("DeadClickCount"),
    rageClicks: share("RageClickCount"),
    quickbacks: share("QuickbackClick"),
    excessiveScroll: share("ExcessiveScroll"),
    scriptErrors: share("ScriptErrorCount"),
    errorClicks: share("ErrorClickCount"),
    browsers: list("Browser"),
    devices: list("Device"),
    os: list("OS"),
    countries: list("Country"),
    pages: list("PageTitle"),
    referrers: list("ReferrerUrl"),
  };
}

/** Per-URL breakdown (dimension1=URL): each metric's rows carry a Url. */
export function byUrl(raw) {
  const pages = new Map();
  for (const m of raw) {
    for (const i of m.information ?? []) {
      const url = i.Url ?? i.URL ?? i.url;
      if (!url) continue;
      const p = pages.get(url) ?? { url, sessions: 0, deadClicks: 0, rageClicks: 0, quickbacks: 0, scrollDepth: null };
      if (m.metricName === "Traffic") p.sessions = Number(i.totalSessionCount ?? p.sessions);
      if (m.metricName === "DeadClickCount") p.deadClicks = Number(i.subTotal ?? 0);
      if (m.metricName === "RageClickCount") p.rageClicks = Number(i.subTotal ?? 0);
      if (m.metricName === "QuickbackClick") p.quickbacks = Number(i.subTotal ?? 0);
      if (m.metricName === "ScrollDepth") p.scrollDepth = Number(i.averageScrollDepth ?? 0);
      pages.set(url, p);
    }
  }
  return [...pages.values()].sort((a, b) => b.sessions - a.sessions).slice(0, 25);
}
