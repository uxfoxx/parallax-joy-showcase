// Olive Foods admin insights — the data behind /admin/analytics.
//
// One small, dependency-free Node process (pm2 app "olivefoods-insights",
// 127.0.0.1:4101, reached through nginx at /api/insights/). It holds the
// read-only keys for Google Analytics 4, Search Console, Microsoft Clarity and
// Bing Webmaster so they never reach a browser, and answers only signed-in
// admins (lib/auth.mjs).
//
// Fresh-when-asked:  GA4 reports and real-time (short in-memory cache),
//                    Search Console performance (6 h cache).
// On a schedule:     Clarity (≤ CLARITY_DAILY_CALLS a day — its API allows 10),
//                    index status of every sitemap URL (daily sweep),
//                    sitemaps + Bing (6-hourly), PageSpeed (daily).
// Every scheduled result is kept on disk (lib/store.mjs), so restarts — every
// deploy — serve the last data at once and spend no extra API calls.
//
// Config: INSIGHTS_SECRETS dir (google-sa.json + insights.env: CLARITY_TOKEN,
// BING_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY), INSIGHTS_DATA dir, and the
// non-secret IDs below. Locally both dirs default to ./.secrets and ./.data.
import http from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { googleConfigured } from "./lib/google.mjs";
import { isAdmin } from "./lib/auth.mjs";
import { openStore, read, save, write } from "./lib/store.mjs";
import { gaRealtime, gaReport } from "./sources/ga.mjs";
import { inspect, opportunities, searchReport, sitemapUrls, sitemaps } from "./sources/gsc.mjs";
import { byUrl, clarityInsights, summarise } from "./sources/clarity.mjs";
import { bingReport } from "./sources/bing.mjs";
import { speedReport } from "./sources/speed.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const SECRETS = process.env.INSIGHTS_SECRETS || join(here, ".secrets");
const DATA = process.env.INSIGHTS_DATA || join(here, ".data");

// KEY=value lines; real environment variables win.
const envFile = join(SECRETS, "insights.env");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
  }
}
const env = process.env;
const cfg = {
  host: env.INSIGHTS_HOST || "127.0.0.1",
  port: Number(env.INSIGHTS_PORT || 4101),
  ga4: env.GA4_PROPERTY || "559765187",
  gsc: env.GSC_SITE || "sc-domain:olivefoods.lk",
  site: (env.SITE_URL || "https://www.olivefoods.lk").replace(/\/$/, ""),
  bingSite: env.BING_SITE || "https://olivefoods.lk/",
  clarity: env.CLARITY_TOKEN || "",
  bing: env.BING_API_KEY || "",
  supabase: { url: env.SUPABASE_URL || "", anonKey: env.SUPABASE_ANON_KEY || "" },
  clarityDaily: Number(env.CLARITY_DAILY_CALLS || 7),
  schedules: env.INSIGHTS_SCHEDULES !== "0", // 0 = serve cached data only (local work)
  // Local UI work only: skip the admin check. Ignored whenever NODE_ENV is
  // production, which the pm2 config always sets on the server.
  noAuth: env.INSIGHTS_DEV_NOAUTH === "1" && env.NODE_ENV !== "production",
};
const hasGoogle = googleConfigured(join(SECRETS, "google-sa.json"));
openStore(DATA);

const HOUR = 3_600_000;
const log = (...a) => console.log(new Date().toISOString(), ...a);
const ageOf = (name) => {
  const t = read(name)?.checkedAt;
  return t ? Date.now() - Date.parse(t) : Infinity;
};

// ─── On-demand sources, cached in memory ───
const memo = new Map();
async function cached(key, ttl, fn) {
  const hit = memo.get(key);
  if (hit && Date.now() - hit.at < ttl) return hit.value;
  if (hit?.pending) return hit.pending;
  const pending = fn()
    .then((data) => ({ updatedAt: new Date().toISOString(), data, error: null }))
    .catch((e) => ({ updatedAt: hit?.value?.updatedAt ?? null, data: hit?.value?.data ?? null, error: e.message }));
  memo.set(key, { ...hit, pending });
  const value = await pending;
  memo.set(key, { at: Date.now(), value });
  return value;
}

// ─── Scheduled sources ───
const running = new Set();
async function job(name, fn) {
  if (running.has(name)) return;
  running.add(name);
  try {
    save(name, await fn());
    log(`[${name}] updated`);
  } catch (e) {
    save(name, null, e);
    log(`[${name}] failed: ${e.message}`);
  } finally {
    running.delete(name);
  }
}

// Clarity: a persisted call log keeps us under the daily cap across restarts.
function clarityBudget() {
  const calls = (read("clarity-calls") ?? []).filter((t) => Date.now() - t < 24 * HOUR);
  return { calls, left: cfg.clarityDaily - calls.length };
}
async function clarityCall(dimension) {
  const { calls, left } = clarityBudget();
  if (left <= 0) throw new Error("Clarity's daily API allowance is used up; it refreshes within 24 hours.");
  write("clarity-calls", [...calls, Date.now()]);
  return clarityInsights(cfg.clarity, dimension);
}
async function refreshClarity({ force = false } = {}) {
  if (!cfg.clarity) return;
  if (!force && ageOf("clarity") < 4 * HOUR) return;
  await job("clarity", async () => {
    const summary = summarise(await clarityCall());
    // One snapshot per (Colombo) day builds the history the API doesn't keep.
    const day = new Date(Date.now() + 5.5 * HOUR).toISOString().slice(0, 10);
    const history = read("clarity-history") ?? {};
    history[day] = { sessions: summary.sessions, users: summary.users, botSessions: summary.botSessions, scrollDepth: summary.scrollDepth, activeTime: summary.activeTime, deadClicks: summary.deadClicks.count, rageClicks: summary.rageClicks.count, quickbacks: summary.quickbacks.count };
    write("clarity-history", Object.fromEntries(Object.entries(history).sort().slice(-90)));
    return summary;
  });
}
async function refreshClarityPages() {
  if (!cfg.clarity || ageOf("clarity-pages") < 20 * HOUR || clarityBudget().left <= 1) return;
  await job("clarity-pages", async () => byUrl(await clarityCall("URL")));
}

async function refreshIndexing({ force = false } = {}) {
  if (!hasGoogle || running.has("indexing")) return;
  const prev = read("indexing")?.data;
  if (!force && prev?.finishedAt && Date.now() - Date.parse(prev.finishedAt) < 22 * HOUR) return;
  running.add("indexing");
  try {
    const urls = await sitemapUrls(cfg.site);
    const results = Object.fromEntries((prev?.results ?? []).filter((r) => urls.includes(r.url)).map((r) => [r.url, r]));
    const due = urls
      .filter((u) => force || !results[u] || Date.now() - Date.parse(results[u].checkedAt) > 20 * HOUR)
      .sort((a, b) => Date.parse(results[a]?.checkedAt ?? 0) - Date.parse(results[b]?.checkedAt ?? 0));
    const startedAt = new Date().toISOString();
    const snapshot = (finishedAt) => ({ startedAt, finishedAt, total: urls.length, results: urls.map((u) => results[u]).filter(Boolean) });
    let failures = 0;
    for (const [i, url] of due.entries()) {
      try {
        results[url] = await inspect(cfg.gsc, url);
      } catch (e) {
        failures++;
        if (/quota|rate/i.test(e.message)) break; // try again on the next round
      }
      if (i % 20 === 19) save("indexing", snapshot(null));
      await new Promise((r) => setTimeout(r, 1200)); // well under 600/min
    }
    save("indexing", snapshot(new Date().toISOString()));
    log(`[indexing] inspected ${due.length} URL(s), ${failures} failed`);
  } catch (e) {
    save("indexing", null, e);
    log(`[indexing] failed: ${e.message}`);
  } finally {
    running.delete("indexing");
  }
}

const refreshers = {
  clarity: () => refreshClarity({ force: true }),
  indexing: () => refreshIndexing({ force: true }),
  sitemaps: () => hasGoogle && job("sitemaps", () => sitemaps(cfg.gsc)),
  bing: () => cfg.bing && job("bing", () => bingReport(cfg.bing, cfg.bingSite)),
  speed: () => job("speed", () => speedReport(`${cfg.site}/`)),
};

function tick() {
  refreshClarity();
  refreshClarityPages();
  refreshIndexing();
  if (hasGoogle && ageOf("sitemaps") > 6 * HOUR) refreshers.sitemaps();
  if (cfg.bing && ageOf("bing") > 6 * HOUR) refreshers.bing();
  const speed = read("speed");
  if (ageOf("speed") > (speed?.error ? 3 : 22) * HOUR) refreshers.speed();
}

// ─── HTTP ───
const days = (u) => ([7, 28, 90].includes(Number(u.searchParams.get("days"))) ? Number(u.searchParams.get("days")) : 28);
const stored = (name, configured, extra = {}) => ({ configured, ...(read(name) ?? { updatedAt: null, data: null, error: null }), running: running.has(name), ...extra });

const routes = {
  "GET status": () => ({
    google: hasGoogle,
    clarity: Boolean(cfg.clarity),
    bing: Boolean(cfg.bing),
    clarityCallsLeft: clarityBudget().left,
    ga4Property: cfg.ga4,
    gscSite: cfg.gsc,
  }),
  "GET ga": (u) => (hasGoogle ? cached(`ga:${days(u)}`, 15 * 60_000, () => gaReport(cfg.ga4, days(u))) : { configured: false }),
  "GET realtime": () => (hasGoogle ? cached("rt", 60_000, () => gaRealtime(cfg.ga4)) : { configured: false }),
  "GET search": (u) => (hasGoogle ? cached(`gsc:${days(u)}`, 6 * HOUR, () => searchReport(cfg.gsc, days(u))) : { configured: false }),
  "GET opportunities": (u) => (hasGoogle ? cached(`opp:${days(u)}`, 6 * HOUR, () => opportunities(cfg.gsc, days(u))) : { configured: false }),
  "GET sitemaps": () => stored("sitemaps", hasGoogle),
  "GET indexing": () => stored("indexing", hasGoogle, { running: running.has("indexing") }),
  "GET clarity": () =>
    stored("clarity", Boolean(cfg.clarity), {
      history: read("clarity-history") ?? {},
      pages: read("clarity-pages")?.data ?? [],
      callsLeft: clarityBudget().left,
    }),
  "GET bing": () => stored("bing", Boolean(cfg.bing)),
  "GET speed": () => stored("speed", true),
};

const server = http.createServer(async (req, res) => {
  const send = (code, body) => {
    res.writeHead(code, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    res.end(JSON.stringify(body));
  };
  try {
    const url = new URL(req.url, "http://insights");
    const path = url.pathname.replace(/^\/api\/insights\/?/, "").replace(/\/$/, "");
    if (path === "health") return send(200, { ok: true });

    const token = /^Bearer (.+)$/.exec(req.headers.authorization ?? "")?.[1];
    if (!cfg.noAuth && !(await isAdmin(token, cfg.supabase))) return send(401, { error: "Admins only." });

    if (req.method === "POST" && path.startsWith("refresh/")) {
      const fn = refreshers[path.slice(8)];
      if (!fn) return send(404, { error: "Unknown source." });
      if (path === "refresh/clarity" && clarityBudget().left <= 0) return send(429, { error: "Clarity's daily allowance is used up." });
      fn(); // runs in the background; the page polls
      return send(202, { started: true });
    }
    const route = routes[`${req.method} ${path}`];
    if (!route) return send(404, { error: "Not found." });
    send(200, await route(url));
  } catch (e) {
    log("request failed:", e.message);
    send(500, { error: "Something went wrong." });
  }
});

server.listen(cfg.port, cfg.host, () => {
  log(`insights on ${cfg.host}:${cfg.port} — google:${hasGoogle} clarity:${Boolean(cfg.clarity)} bing:${Boolean(cfg.bing)} schedules:${cfg.schedules}`);
  if (cfg.schedules) {
    setTimeout(tick, 5_000);
    setInterval(tick, 10 * 60_000);
  }
});
