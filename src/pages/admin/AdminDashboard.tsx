import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Box,
  ExternalLink,
  Handshake,
  Image as ImageIcon,
  Layers,
  MessageSquare,
  Plus,
  Star,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { useBrands, useCategories, useContactSubmissions, useProducts } from "@/lib/api";
import { fmtInt, fmtPct, useGa, useRealtime, useSearch } from "@/lib/insights";
import { Delta } from "@/components/admin/analytics/ui";
import { TrendChart, type Series } from "@/components/admin/analytics/TrendChart";
import { cn } from "@/lib/utils";

const ease = "animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both";

function greeting() {
  const h = Number(new Date().toLocaleString("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Colombo" }));
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function StatCard({ icon: Icon, label, value, sub, to, delay = 0 }: { icon: LucideIcon; label: string; value: React.ReactNode; sub?: React.ReactNode; to: string; delay?: number }) {
  return (
    <Link
      to={to}
      className={cn("group relative overflow-hidden rounded-lg border border-border/80 bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float", ease)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.07] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
      </div>
      <p className="mt-4 font-display text-3xl font-bold tabular-nums tracking-tight text-foreground">{value}</p>
      <p className="mt-0.5 font-body text-sm font-medium text-foreground">{label}</p>
      {sub && <p className="mt-1 font-body text-xs text-muted-foreground">{sub}</p>}
    </Link>
  );
}

function Panel({ title, action, children, className, delay = 0 }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <section className={cn("rounded-lg border border-border/80 bg-card p-5 shadow-card sm:p-6", ease, className)} style={{ animationDelay: `${delay}ms` }}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

const PanelLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className="inline-flex items-center gap-1 font-body text-xs font-semibold text-primary hover:underline">
    {children} <ArrowRight className="h-3 w-3" />
  </Link>
);

const visitors: Series[] = [{ key: "users", label: "Visitors", color: "hsl(var(--forest-mid))" }];

function WebsiteWeek() {
  const ga = useGa(7);
  const gsc = useSearch(7);
  const g = ga.data?.data;
  const s = gsc.data?.data;
  const failed = ga.isError && gsc.isError;
  const tiles = [
    { label: "Visitors", now: g?.totals.activeUsers, prev: g?.previous.activeUsers },
    { label: "Page views", now: g?.totals.screenPageViews, prev: g?.previous.screenPageViews },
    { label: "Google clicks", now: s?.totals.clicks, prev: s?.previous.clicks },
    { label: "Google impressions", now: s?.totals.impressions, prev: s?.previous.impressions },
  ];
  return (
    <Panel title="The website, last 7 days" action={<PanelLink to="/admin/analytics">Open analytics</PanelLink>} delay={180} className="lg:col-span-2">
      {failed ? (
        <p className="font-body text-sm text-muted-foreground">The analytics service isn't reachable right now. The rest of the admin works as normal.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tiles.map((t) => (
              <div key={t.label} className="rounded-xl bg-muted/50 px-3.5 py-3">
                <p className="font-body text-xs text-muted-foreground">{t.label}</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  {t.now == null ? (
                    <span className="h-6 w-12 animate-pulse rounded bg-muted" />
                  ) : (
                    <span className="font-display text-xl font-bold tabular-nums text-foreground">{fmtInt(t.now)}</span>
                  )}
                  {t.now != null && t.prev != null && <Delta now={t.now} before={t.prev} />}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <TrendChart data={g?.daily ?? []} series={visitors} height={150} />
          </div>
          {s && (
            <p className="mt-2 font-body text-xs text-muted-foreground">
              Google: {fmtPct(s.totals.ctr)} click-through · average position {s.totals.position.toFixed(1)}
            </p>
          )}
        </>
      )}
    </Panel>
  );
}

function LiveNow() {
  const rt = useRealtime();
  const n = rt.data?.data?.activeUsers;
  if (n == null) return null;
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 font-body text-xs text-primary-foreground ring-1 ring-primary-foreground/15">
      <span className="relative flex h-2 w-2">
        {n > 0 && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", n > 0 ? "bg-emerald-400" : "bg-primary-foreground/40")} />
      </span>
      <span className="font-semibold tabular-nums">{n}</span> on the site now
    </span>
  );
}

const AdminDashboard = () => {
  const { data: brands } = useBrands({ raw: true });
  const { data: products } = useProducts(undefined, { raw: true });
  const { data: categories } = useCategories();
  const { data: submissions } = useContactSubmissions();

  const week = Date.now() - 7 * 86_400_000;
  const newEnquiries = submissions?.filter((s) => Date.parse(s.created_at) >= week).length ?? 0;
  const featured = products?.filter((p) => p.featured).length ?? 0;
  const recent = submissions?.slice(0, 6) ?? [];
  const brandIdsWithProducts = new Set(products?.map((p) => p.brand_id));

  const total = products?.length ?? 0;
  const health = [
    { label: "Products with a photo", done: products?.filter((p) => p.image_url).length ?? 0, of: total, to: "/admin/products" },
    { label: "Products with a description", done: products?.filter((p) => p.description?.replace(/<[^>]+>/g, "").trim()).length ?? 0, of: total, to: "/admin/products" },
    { label: "Products in a category", done: products?.filter((p) => (p as { categories?: string[] }).categories?.length || p.category).length ?? 0, of: total, to: "/admin/products" },
    { label: "Brands with a logo", done: brands?.filter((b) => b.image_url).length ?? 0, of: brands?.length ?? 0, to: "/admin/brands" },
  ];

  const actions: { label: string; to: string; icon: LucideIcon }[] = [
    { label: "Add a product", to: "/admin/products", icon: Plus },
    { label: "Add a brand", to: "/admin/brands", icon: Tag },
    { label: "Homepage showcase", to: "/admin/featured", icon: Star },
    { label: "Partner logos", to: "/admin/partners", icon: Handshake },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      {/* Brand "forest wash" band: forest-deep → forest-mid → olive accent. */}
      <section className={cn("relative overflow-hidden rounded-lg bg-[linear-gradient(120deg,hsl(150_40%_10%)_0%,hsl(140_50%_19%)_58%,hsl(75_38%_45%)_130%)] px-6 py-7 text-primary-foreground shadow-card sm:px-8 sm:py-8", ease)}>
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,hsl(75_40%_60%/0.22),transparent_70%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-light">· {greeting()}</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Here's <span className="text-gradient-gold-dark">olivefoods.lk</span> today
            </h1>
            <p className="mt-2 max-w-xl font-body text-sm text-primary-foreground/70">
              {total} products from {brands?.length ?? "…"} brands in {categories?.length ?? "…"} categories
              {newEnquiries ? ` · ${newEnquiries} new ${newEnquiries === 1 ? "enquiry" : "enquiries"} this week` : ""}.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LiveNow />
            <Link to="/admin/analytics" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[linear-gradient(90deg,hsl(var(--gold)),hsl(var(--gold-light)))] px-4 font-body text-xs font-semibold text-forest-deep shadow-[0_6px_18px_-8px_hsl(75_40%_45%/0.8)] transition-transform hover:-translate-y-0.5">
              <Activity className="h-3.5 w-3.5" /> Analytics
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 font-body text-xs font-semibold text-primary-foreground ring-1 ring-primary-foreground/25 transition-colors hover:bg-primary-foreground/10">
              View website <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Box} label="Products" value={products ? total : "–"} sub={`${featured} featured on the homepage`} to="/admin/products" delay={60} />
        <StatCard icon={Tag} label="Brands" value={brands?.length ?? "–"} sub={`${brands?.filter((b) => brandIdsWithProducts.has(b.id)).length ?? 0} with products`} to="/admin/brands" delay={100} />
        <StatCard icon={Layers} label="Categories" value={categories?.length ?? "–"} sub="Each has its own page" to="/admin/categories" delay={140} />
        <StatCard icon={MessageSquare} label="Enquiries this week" value={submissions ? newEnquiries : "–"} sub={`${submissions?.length ?? 0} in total`} to="/admin/submissions" delay={180} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <WebsiteWeek />

        <Panel title="Recent enquiries" action={<PanelLink to="/admin/submissions">View all</PanelLink>} delay={220}>
          {recent.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No enquiries yet.</p>
          ) : (
            <ul className="-mx-2 space-y-0.5">
              {recent.map((s) => (
                <li key={s.id}>
                  <Link to="/admin/submissions" className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted/60">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/[0.08] font-display text-sm font-bold uppercase text-primary">
                      {s.name?.trim()?.[0] ?? "?"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-body text-sm font-medium text-foreground">{s.name}</span>
                      <span className="block truncate font-body text-xs text-muted-foreground">{s.subject}</span>
                    </span>
                    <span className="shrink-0 font-body text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(s.created_at), { addSuffix: true })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Catalogue health" action={<span className="font-body text-xs text-muted-foreground">What the public pages show</span>} delay={260} className="lg:col-span-2">
          <ul className="space-y-4">
            {health.map((h) => {
              const pct = h.of ? h.done / h.of : 0;
              const left = h.of - h.done;
              return (
                <li key={h.label}>
                  <div className="flex items-baseline justify-between gap-3 font-body text-sm">
                    <span className="text-foreground">{h.label}</span>
                    <span className="flex items-center gap-3">
                      <span className="tabular-nums text-muted-foreground">
                        {h.done}/{h.of}
                      </span>
                      {left > 0 ? (
                        <Link to={h.to} className="text-xs font-semibold text-primary hover:underline">
                          {left} to fix
                        </Link>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-700">All done</span>
                      )}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full transition-[width] duration-1000 ease-out", pct >= 0.95 ? "bg-emerald-500" : pct >= 0.7 ? "bg-gold" : "bg-amber-500")}
                      style={{ width: `${Math.round(pct * 100)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="Quick actions" delay={300}>
          <div className="grid grid-cols-2 gap-2.5">
            {actions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-background p-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/30"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-deep text-gold-light">
                  <a.icon className="h-4 w-4" />
                </span>
                <span className="font-body text-[13px] font-medium leading-tight text-foreground">{a.label}</span>
              </Link>
            ))}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 flex items-center justify-between rounded-xl bg-muted/60 px-3.5 py-3 font-body text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" /> See how the site looks
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default AdminDashboard;
