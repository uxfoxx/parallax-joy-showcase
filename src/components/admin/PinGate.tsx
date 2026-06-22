import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PIN = "9984";
const STORAGE_KEY = "bp_pin_ok";

/**
 * Lightweight PIN gate for a sensitive admin page. Already behind the admin
 * auth guard; this adds a per-session PIN (sessionStorage) on top. Client-side
 * only — not a real security boundary, just a soft lock as requested.
 */
const PinGate = ({ children, title = "E Business Profiles" }: { children: ReactNode; title?: string }) => {
  const [unlocked, setUnlocked] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1"
  );
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === PIN) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setValue("");
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 12 }}
        animate={error ? { opacity: 1, y: 0, x: [0, -8, 8, -6, 6, 0] } : { opacity: 1, y: 0 }}
        transition={{ duration: error ? 0.4 : 0.4, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => setError(false)}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-card"
      >
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Lock className="h-5 w-5" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
        <p className="mt-1.5 font-body text-sm text-muted-foreground">
          Enter the PIN to manage business profiles.
        </p>
        <Input
          autoFocus
          type="password"
          inputMode="numeric"
          maxLength={8}
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          placeholder="••••"
          className={`mt-5 h-12 text-center text-lg tracking-[0.5em] ${error ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
          aria-label="PIN"
        />
        {error && (
          <p className="mt-2 font-body text-xs text-destructive">Incorrect PIN. Try again.</p>
        )}
        <Button type="submit" className="mt-5 h-11 w-full bg-accent hover:bg-accent/90 text-white font-semibold">
          Unlock
        </Button>
      </motion.form>
    </div>
  );
};

export default PinGate;
