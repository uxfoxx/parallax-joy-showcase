import { createElement, lazy, useState, type ComponentType } from "react";

type Module<P> = { default: ComponentType<P>; preload?: () => Promise<unknown> };
export type Preloadable<P = object> = ComponentType<P> & { preload: () => Promise<void> };

/**
 * React.lazy that can be loaded ahead of rendering.
 *
 * A plain lazy component always suspends on its first render, even when its
 * chunk is already in memory, so it paints its Suspense fallback for a frame.
 * After a prerendered page that fallback is a real problem: createRoot
 * replaces the HTML already on screen, so the page would blank out and
 * rebuild. main.tsx calls `preload()` for the current route before the
 * first render, and once the chunk has loaded the component renders
 * synchronously, with no fallback.
 *
 * A module may export its own `preload` (for its lazy sections); preload()
 * awaits that too, so the whole page is ready before React mounts.
 */
export function lazyPage<P extends object>(factory: () => Promise<Module<P>>): Preloadable<P> {
  let loaded: ComponentType<P> | null = null;
  let pending: Promise<Module<P>> | null = null;
  const load = () =>
    (pending ??= factory().then((m) => {
      loaded = m.default;
      return m;
    }));
  // Rendering on demand (in-app navigation) loads just the module, and its
  // own lazy sections stream in after it; preload() also waits for those.
  const preload = () => load().then(async (m) => void (await m.preload?.()));
  const Lazy = lazy(load);
  function Page(props: P) {
    // Decided once per mount, so the element type never changes under a
    // mounted page (that would remount it and lose its state).
    const [Component] = useState<ComponentType<P>>(() => loaded ?? (Lazy as unknown as ComponentType<P>));
    return createElement(Component, props);
  }
  return Object.assign(Page, { preload });
}
