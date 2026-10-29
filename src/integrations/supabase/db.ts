import { PostgrestClient } from "@supabase/postgrest-js";
import type { Database } from "./types";

/**
 * Data access for the whole site.
 *
 * Public visitors only ever read tables (and insert a contact submission),
 * so they talk to PostgREST directly with the anon key: postgrest-js alone is
 * ~15 KB, where the full supabase-js client — auth, realtime, storage,
 * functions — is ~170 KB minified and used to sit in every page's entry
 * bundle.
 *
 * Signed-in requests (the admin panel) need the user's JWT and its refresh,
 * so in the admin, or whenever a Supabase session is stored in this browser,
 * `db()` returns the full client instead, loaded on demand.
 */
const URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const publicDb = new PostgrestClient<Database>(`${URL}/rest/v1`, {
  headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
});

/** supabase-js keeps the session in localStorage as sb-<project>-auth-token. */
const hasStoredSession = () => {
  try {
    return Object.keys(window.localStorage).some((k) => /^sb-.+-auth-token$/.test(k));
  } catch {
    return false;
  }
};

export const db = async (): Promise<typeof publicDb> => {
  if (typeof window !== "undefined" && (window.location.pathname.startsWith("/admin") || hasStoredSession())) {
    // Same .from()/.rpc() surface; the full client adds the session's JWT.
    return (await import("./client")).supabase as unknown as typeof publicDb;
  }
  return publicDb;
};
