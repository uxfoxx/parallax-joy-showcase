
## Full Plan: Fix Double Vertical Scrollbar, Custom Scrollbar, Cursor Visibility, Floating Navbar/WhatsApp, and Scroll/Cursor Slowness

### What I found (root causes)
1. **Navbar/WhatsApp not always floating** on Home is mainly caused by `perspective: "1200px"` on `src/pages/Index.tsx` root wrapper. This can break true viewport-fixed behavior for descendants.
2. **Cursor feels slow / not visible everywhere** because:
   - `CustomCursor` is only mounted on `/` (not global).
   - It initializes off-screen (`-100,-100`) and only appears after movement.
   - It competes at the same z-layer as WhatsApp.
3. **Overall scrolling + cursor lag** comes from multiple RAF loops that call React state every frame:
   - `src/components/landing/ImmersiveBackground.tsx` (`setMouse` in RAF)
   - `src/hooks/useMouseGradient.ts` (`setPos` in RAF, used by multiple sections)
4. **Double vertical scrollbar appearance** is from mixed scroll contexts (root document + embedded map iframe behavior) and lack of a strict single-page scroll container policy.
5. **No custom scrollbar styling** is currently defined globally.

---

### Implementation steps

#### 1) Enforce a single global scroll container + custom scrollbar
- **File:** `src/index.css`
- Set a consistent page scroller (`html` as scroller, body non-competing).
- Keep horizontal overflow clipped globally.
- Add modern custom scrollbar styles:
  - `::-webkit-scrollbar`, `::-webkit-scrollbar-track`, `::-webkit-scrollbar-thumb`
  - Firefox: `scrollbar-width`, `scrollbar-color`
- Add subtle hover state for thumb and rounded track to match brand look.

#### 2) Restore true fixed floating behavior for navbar + WhatsApp
- **File:** `src/pages/Index.tsx`
- Remove `style={{ perspective: "1200px" }}` from the root container.
- Keep `overflow-x-hidden`, but avoid parent transforms/perspective that affect fixed children.
- Confirm `Navbar` + `FloatingWhatsApp` remain in top-level route layout flow.

#### 3) Make custom cursor always visible site-wide and faster
- **Files:**  
  - `src/App.tsx` (mount cursor globally once)  
  - `src/components/landing/CustomCursor.tsx` (visibility + speed)  
  - `src/index.css` (global native cursor hiding class for fine pointers)
- Move cursor mount out of Home-only rendering.
- Initialize dot at viewport center (not off-screen) so it is visible immediately.
- Increase follow responsiveness (higher lerp values for snappier motion).
- Raise cursor z-index above all UI layers; place WhatsApp just below cursor.
- Add robust contrast ring/shadow so dot is visible on both dark and light sections.

#### 4) Remove performance bottlenecks causing scroll/cursor lag
- **Files:**  
  - `src/hooks/useMouseGradient.ts`  
  - `src/components/landing/ImmersiveBackground.tsx`
- Refactor from **state-per-frame** to **ref + direct style/CSS-variable updates** to avoid rerendering large sections every animation frame.
- Keep existing visual behavior, but run animation updates outside React render loop.
- Reduce expensive background animation intensity slightly on low-end scenarios.

#### 5) Fix map-driven secondary scrollbar visuals
- **Files:**  
  - `src/components/landing/LocationsSection.tsx`  
  - `src/pages/AboutPage.tsx` (map section there too)
- Tighten map wrapper overflow handling.
- Set iframe non-scrolling intent and ensure rounded container clips internals cleanly.
- Keep map UX intact while preventing “second scrollbar” feel.

---

### Files to modify
- `src/index.css`
- `src/pages/Index.tsx`
- `src/App.tsx`
- `src/components/landing/CustomCursor.tsx`
- `src/hooks/useMouseGradient.ts`
- `src/components/landing/ImmersiveBackground.tsx`
- `src/components/landing/LocationsSection.tsx`
- `src/pages/AboutPage.tsx`

---

### Verification checklist after implementation
1. Only one vertical page scrollbar is visible during full-page scroll.
2. Custom scrollbar styling appears consistently (Chrome/Safari/Edge + Firefox fallback).
3. Navbar stays fixed at top on all sections/routes.
4. WhatsApp button always floats and never scrolls away.
5. Green cursor dot is visible on dark + light sections and reacts faster than before.
6. Scroll and cursor movement feel noticeably smoother with less lag/jitter.
