// Only admins of the site get data: the browser sends its Supabase session
// token, and we ask Supabase who that is and whether user_roles lists them as
// admin — the same check AdminLayout makes. No service-role key is needed;
// Supabase evaluates the lookup as that user.
import { createHash } from "node:crypto";

const verdicts = new Map(); // sha256(token) -> { ok, until }

export async function isAdmin(token, { url, anonKey }) {
  if (!token || !url || !anonKey) return false;
  const id = createHash("sha256").update(token).digest("hex");
  const hit = verdicts.get(id);
  if (hit && hit.until > Date.now()) return hit.ok;

  const headers = { apikey: anonKey, authorization: `Bearer ${token}` };
  let ok = false;
  try {
    const me = await fetch(`${url}/auth/v1/user`, { headers });
    if (me.ok) {
      const user = await me.json();
      const roles = await fetch(
        `${url}/rest/v1/user_roles?select=role&user_id=eq.${encodeURIComponent(user.id)}&role=eq.admin`,
        { headers },
      );
      ok = roles.ok && (await roles.json()).length > 0;
    }
  } catch {
    ok = false;
  }
  if (verdicts.size > 200) verdicts.clear();
  verdicts.set(id, { ok, until: Date.now() + (ok ? 5 : 1) * 60_000 });
  return ok;
}
