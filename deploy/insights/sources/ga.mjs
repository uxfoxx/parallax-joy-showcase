// Google Analytics 4 (Data API). Fetched when an admin opens the page and
// cached briefly — the Data API quota is generous, but there's no point asking
// twice a minute.
import { google } from "../lib/google.mjs";

const LEAD_EVENTS = ["generate_lead", "request_quote", "sourcing_request", "whatsapp_click", "phone_click", "email_click"];
const API = (property, method) => `https://analyticsdata.googleapis.com/v1beta/properties/${property}:${method}`;

const num = (v) => (v == null ? 0 : Number(v));
const rows = (report, dims = 1) =>
  (report.rows ?? []).map((r) => ({
    keys: r.dimensionValues?.slice(0, dims).map((d) => d.value) ?? [],
    values: r.metricValues.map((m) => num(m.value)),
  }));

/** Totals for this period and the one before it, a daily series, and breakdowns. */
export async function gaReport(property, days) {
  const current = { startDate: `${days - 1}daysAgo`, endDate: "today", name: "current" };
  const previous = { startDate: `${days * 2 - 1}daysAgo`, endDate: `${days}daysAgo`, name: "previous" };
  const range = [current];
  const totals = ["activeUsers", "newUsers", "sessions", "screenPageViews", "engagementRate", "averageSessionDuration", "keyEvents"];

  const [a, b] = await Promise.all([
    google(API(property, "batchRunReports"), {
      requests: [
        { dateRanges: [current, previous], metrics: totals.map((name) => ({ name })) },
        {
          dateRanges: range,
          dimensions: [{ name: "date" }],
          metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }, { name: "keyEvents" }],
          orderBys: [{ dimension: { dimensionName: "date" } }],
          limit: 400,
        },
        {
          dateRanges: range,
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }, { name: "userEngagementDuration" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 20,
        },
        {
          dateRanges: range,
          dimensions: [{ name: "sessionDefaultChannelGroup" }],
          metrics: [{ name: "sessions" }, { name: "keyEvents" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 12,
        },
        {
          dateRanges: range,
          dimensions: [{ name: "sessionSourceMedium" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 10,
        },
      ],
    }),
    google(API(property, "batchRunReports"), {
      requests: [
        {
          dateRanges: range,
          dimensions: [{ name: "country" }],
          metrics: [{ name: "activeUsers" }],
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
          limit: 10,
        },
        {
          dateRanges: range,
          dimensions: [{ name: "city" }],
          metrics: [{ name: "activeUsers" }],
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
          limit: 10,
        },
        { dateRanges: range, dimensions: [{ name: "deviceCategory" }], metrics: [{ name: "activeUsers" }] },
        {
          dateRanges: range,
          dimensions: [{ name: "eventName" }],
          metrics: [{ name: "eventCount" }],
          dimensionFilter: { filter: { fieldName: "eventName", inListFilter: { values: LEAD_EVENTS } } },
        },
        {
          dateRanges: range,
          dimensions: [{ name: "landingPage" }],
          metrics: [{ name: "sessions" }, { name: "keyEvents" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 10,
        },
      ],
    }),
  ]);

  const [tot, daily, pages, channels, sources] = a.reports;
  const [countries, cities, devices, events, landing] = b.reports;

  // With two date ranges GA adds a dateRange dimension to the totals rows.
  const totalsFor = (name) => {
    const row = (tot.rows ?? []).find((r) => r.dimensionValues?.[0]?.value === name) ?? (name === "current" ? tot.rows?.[0] : null);
    return Object.fromEntries(totals.map((m, i) => [m, num(row?.metricValues?.[i]?.value)]));
  };

  // GA returns only days that had visits; chart every day of the range.
  const seen = new Map(
    rows(daily).map(({ keys: [d], values: [users, sessions, views, leads] }) => [
      `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`,
      { users, sessions, views, leads },
    ]),
  );
  const filled = Array.from({ length: days }, (_, i) => {
    // GA dates are in the property's time zone (Asia/Colombo, UTC+5:30).
    const date = new Date(Date.now() + 5.5 * 3_600_000 - (days - 1 - i) * 86_400_000).toISOString().slice(0, 10);
    return { date, ...(seen.get(date) ?? { users: 0, sessions: 0, views: 0, leads: 0 }) };
  });

  return {
    days,
    totals: totalsFor("current"),
    previous: totalsFor("previous"),
    daily: filled,
    pages: rows(pages).map(({ keys: [path], values: [views, users, engaged] }) => ({ path, views, users, avgEngagement: users ? engaged / users : 0 })),
    channels: rows(channels).map(({ keys: [name], values: [sessions, leads] }) => ({ name, sessions, leads })),
    sources: rows(sources).map(({ keys: [name], values: [sessions] }) => ({ name, sessions })),
    countries: rows(countries).map(({ keys: [name], values: [users] }) => ({ name, users })),
    cities: rows(cities).map(({ keys: [name], values: [users] }) => ({ name, users })),
    devices: rows(devices).map(({ keys: [name], values: [users] }) => ({ name, users })),
    leadEvents: LEAD_EVENTS.map((name) => ({
      name,
      count: rows(events).find((r) => r.keys[0] === name)?.values[0] ?? 0,
    })),
    landing: rows(landing).map(({ keys: [path], values: [sessions, leads] }) => ({ path, sessions, leads })),
  };
}

/** Who is on the site right now (last 30 minutes). */
export async function gaRealtime(property) {
  const [res, total] = await Promise.all([
    google(API(property, "runRealtimeReport"), {
      dimensions: [{ name: "unifiedScreenName" }],
      metrics: [{ name: "activeUsers" }],
      limit: 10,
    }),
    google(API(property, "runRealtimeReport"), { metrics: [{ name: "activeUsers" }] }),
  ]);
  return {
    activeUsers: num(total.rows?.[0]?.metricValues?.[0]?.value),
    pages: rows(res).map(({ keys: [title], values: [users] }) => ({ title, users })),
  };
}
