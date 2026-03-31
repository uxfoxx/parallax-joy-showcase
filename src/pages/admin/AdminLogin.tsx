import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Account created! Ask an admin to grant you the admin role.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Check admin role
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
          if (roles && roles.length > 0) {
            navigate("/admin");
          } else {
            toast.error("You don't have admin access.");
            await supabase.auth.signOut();
          }
        }
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-deep flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-forest-mid flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-7 h-7 text-forest-light" />
          </div>
          <h1 className="font-display text-2xl font-bold text-primary-foreground">Admin Panel</h1>
          <p className="font-body text-sm text-primary-foreground/50 mt-2">Sign in to manage products & brands</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-primary-foreground/70 font-body">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-forest-mid/30 border-primary-foreground/10 text-primary-foreground font-body"
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-primary-foreground/70 font-body">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-forest-mid/30 border-primary-foreground/10 text-primary-foreground font-body"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-accent text-white hover:bg-accent/90 font-body font-semibold rounded-lg">
            {loading ? "..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
