import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Seo from "@/components/Seo";
import mark from "@/assets/olive-mark.svg";
import spread from "@/assets/hero/hero-spread-portrait.webp";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Admins only: anyone else is signed straight back out.
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
        if (roles && roles.length > 0) {
          navigate("/admin");
        } else {
          toast.error("This account doesn't have admin access.");
          await supabase.auth.signOut();
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-[hsl(42_33%_97%)] lg:grid-cols-[1.05fr_1fr]">
      {/* robots.txt also blocks /admin; noindex covers it if linked from elsewhere. */}
      <Seo title="Admin sign-in" description="Olive Foods admin panel." path="/admin/login" noindex />

      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-forest-deep lg:block">
        <img src={spread} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/70 to-forest-deep/20" />
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/10 ring-1 ring-primary-foreground/20 backdrop-blur">
              <img src={mark} alt="" className="h-7 w-7" width={28} height={28} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold text-primary-foreground">Olive Foods</span>
              <span className="block font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">Admin</span>
            </span>
          </div>
          <div className="max-w-md animate-in fade-in slide-in-from-bottom-3 duration-700">
            <p className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-primary-foreground xl:text-5xl">
              Run olivefoods.lk
              <span className="text-gradient-gold-dark block">in one place.</span>
            </p>
            <p className="mt-4 font-body text-[15px] leading-relaxed text-primary-foreground/70">
              The catalogue, brands, homepage showcase, enquiries and the site's analytics — all behind this sign-in.
            </p>
          </div>
          <p className="font-body text-xs text-primary-foreground/45">Olive Foods (Pvt) Ltd · 292 Sea Street, Colombo 11</p>
        </div>
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-deep">
              <img src={mark} alt="" className="h-7 w-7" width={28} height={28} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold text-foreground">Olive Foods</span>
              <span className="block font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Admin</span>
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="mt-1.5 font-body text-sm text-muted-foreground">Sign in with your admin account.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="font-body text-sm">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-card pl-10 font-body"
                  placeholder="you@olivefoods.lk"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="font-body text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-card pl-10 pr-11 font-body"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl font-body text-[15px] font-semibold">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <a href="/" className="mt-8 inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to the website
          </a>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
