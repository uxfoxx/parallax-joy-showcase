import { QueryClient, dehydrate, hydrate, type DehydratedState } from "@tanstack/react-query";

/* Cache responses for 5 minutes so navigating between pages doesn't refetch
 * and flash empty/loading states (the visitor's "have to reload twice for
 * images to show" perception was actually React Query refetching on every
 * route mount). */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Prerendered pages carry the data they were rendered with
 * (<script id="__olive_state__">, written by scripts/prerender.mjs).
 *
 * The client mounts with createRoot, which replaces the prerendered DOM.
 * Without this seed the first render had no data: product, category and
 * brand pages collapsed to a loading state and rebuilt once Supabase
 * answered — the layout shift (CLS 0.6–1.0) and the late LCP PageSpeed
 * reported. Seeded, the first render matches the HTML already on screen.
 *
 * The seed is as old as the build, so it is stale by the time anyone reads
 * it: each query still refetches in the background on mount and React Query
 * swaps in anything that changed since.
 */
export function seedFromPrerender() {
  const el = document.getElementById("__olive_state__");
  if (!el?.textContent) return;
  try {
    hydrate(queryClient, JSON.parse(el.textContent) as DehydratedState);
  } catch {
    /* a bad seed just means fetching as usual */
  }
}

/** Queries that are never baked into public HTML. */
const PRIVATE_KEYS = new Set(["isAdmin", "contact_submissions", "insights"]);

/** For the prerender: the cache's successful public queries, serialised. */
export function exposeDehydrate() {
  (window as Window & { __oliveDehydrate?: () => string }).__oliveDehydrate = () =>
    JSON.stringify(
      dehydrate(queryClient, {
        shouldDehydrateQuery: (q) => q.state.status === "success" && !PRIVATE_KEYS.has(String(q.queryKey[0])),
      }),
    );
}
