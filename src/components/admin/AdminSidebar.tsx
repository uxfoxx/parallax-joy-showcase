import { useEffect, useState } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useContactSubmissions } from "@/lib/api";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import mark from "@/assets/olive-mark.svg";
import { ADMIN_NAV, navItemFor } from "./nav";

/** Enquiries from the last 7 days — the sidebar badge. */
function useRecentEnquiries() {
  const { data } = useContactSubmissions();
  const since = Date.now() - 7 * 86_400_000;
  return data?.filter((s) => Date.parse(s.created_at) >= since).length ?? 0;
}

export function AdminSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed" && !isMobile;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const active = navItemFor(pathname)?.url;
  const recent = useRecentEnquiries();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-3 pb-2 pt-4">
        <Link to="/admin" className="flex items-center gap-2.5 rounded-lg px-1 py-1 outline-none ring-sidebar-ring focus-visible:ring-2" onClick={() => setOpenMobile(false)}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-accent ring-1 ring-sidebar-border">
            <img src={mark} alt="" className="h-6 w-6" width={24} height={24} />
          </span>
          {!collapsed && (
            <span className="min-w-0 leading-tight">
              <span className="block font-display text-[15px] font-bold tracking-tight text-sidebar-accent-foreground">Olive Foods</span>
              <span className="block font-body text-[10.5px] font-semibold uppercase tracking-[0.2em] text-sidebar-primary">Admin</span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-1">
        {ADMIN_NAV.map((group) => (
          <SidebarGroup key={group.label} className="py-1.5">
            <SidebarGroupLabel className="font-body text-[10.5px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = active === item.url;
                  const badge = item.url === "/admin/submissions" && recent > 0 ? recent : null;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "relative h-9 font-body text-[13.5px] text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          "data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground",
                        )}
                      >
                        <Link to={item.url} onClick={() => setOpenMobile(false)}>
                          {isActive && <span aria-hidden className="absolute -left-1 top-1.5 bottom-1.5 w-[3px] rounded-full bg-sidebar-primary" />}
                          <item.icon className={cn("h-4 w-4", isActive ? "text-sidebar-primary" : "text-sidebar-foreground/60")} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {badge && (
                        <SidebarMenuBadge className="rounded-full bg-sidebar-primary px-1.5 font-body text-[10.5px] font-bold text-sidebar-primary-foreground" title={`${badge} in the last 7 days`}>
                          {badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="gap-1 border-t border-sidebar-border px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="View website" className="h-9 font-body text-[13.5px] text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 text-sidebar-foreground/60" />
                <span>View website</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut} tooltip="Sign out" className="h-auto min-h-9 py-2 font-body text-[13.5px] text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sidebar-primary font-display text-[11px] font-bold uppercase text-sidebar-primary-foreground">
                {email?.[0] ?? "A"}
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[12.5px] text-sidebar-accent-foreground">{email ?? "Signed in"}</span>
                <span className="block text-[11px] text-sidebar-foreground/50">Sign out</span>
              </span>
              <LogOut className="h-4 w-4 shrink-0 text-sidebar-foreground/50" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
