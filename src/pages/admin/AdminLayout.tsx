import { Suspense, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { navItemFor } from "@/components/admin/nav";
import Seo from "@/components/Seo";
import mark from "@/assets/olive-mark.svg";

/** Branded holding screen while the admin check runs. */
function AdminSplash() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-forest-deep">
      <img src={mark} alt="" className="h-12 w-12 animate-pulse" width={48} height={48} />
      <p className="font-body text-sm text-primary-foreground/60">Opening the admin…</p>
    </div>
  );
}

const AdminLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);
  const current = navItemFor(pathname);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/admin/login");
        return;
      }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
      if (!roles || roles.length === 0) {
        navigate("/admin/login");
        return;
      }
      setReady(true);
    };
    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!ready) return <AdminSplash />;

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Colombo" });

  return (
    <SidebarProvider>
      <Seo title={current ? `${current.title} · Admin` : "Admin"} description="Olive Foods admin panel." path="/admin" noindex />
      {/* h-screen (not min-h-screen) + an internally-scrolling content pane keeps
       * the window itself from scrolling, so opening/closing an edit dialog
       * (Radix scroll lock) no longer jumps the admin to the top. */}
      {/* Analytics never starts on /admin, but if a session wanders in from the
          public site, nothing in the admin panel is ever recorded. */}
      <div data-clarity-mask="true" className="admin-shell flex h-screen w-full overflow-hidden bg-sidebar">
        <AdminSidebar />
        <SidebarInset className="flex min-h-0 flex-col overflow-hidden bg-[hsl(42_33%_97%)] md:my-2 md:mr-2 md:rounded-2xl">
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border/70 bg-[hsl(42_33%_97%/0.85)] px-4 backdrop-blur-md sm:px-6">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
            <span aria-hidden className="h-5 w-px bg-border" />
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 font-body text-sm">
              <Link to="/admin" className="text-muted-foreground transition-colors hover:text-foreground">
                Admin
              </Link>
              {current && current.url !== "/admin" && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                  <span className="hidden text-muted-foreground sm:inline">{current.group}</span>
                  <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground/60 sm:block" />
                  <span className="truncate font-medium text-foreground">{current.title}</span>
                </>
              )}
              {current?.url === "/admin" && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                  <span className="font-medium text-foreground">Dashboard</span>
                </>
              )}
            </nav>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden font-body text-xs text-muted-foreground lg:inline">{today}</span>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 font-body text-xs font-medium text-foreground transition-colors hover:border-primary/30"
              >
                View site <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {/* Admin pages are lazy chunks — keep the sidebar/header up while one loads. */}
              <Suspense
                fallback={
                  <div className="space-y-4">
                    <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
                    <div className="h-64 animate-pulse rounded-2xl bg-muted/70" />
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
