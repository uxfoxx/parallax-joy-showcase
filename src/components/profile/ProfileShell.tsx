/**
 * Shared branded backdrop for every /profile/:slug screen (chooser, business
 * card, brochure, not-found) — same dark forest gradient + dot-grid used
 * across the profile-link experience.
 */
const ProfileShell = ({ children, wide }: { children: React.ReactNode; wide?: boolean }) => (
  <main className="relative min-h-screen w-full flex items-center justify-center p-5 overflow-hidden bg-forest-deep">
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, hsl(140 50% 19% / 0.55), transparent 60%), linear-gradient(180deg, hsl(150 40% 6%), hsl(150 40% 9%))",
      }}
    />
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.35] pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(circle, hsl(75 38% 45% / 0.10) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
      }}
    />
    <div className={`relative z-10 w-full ${wide ? "max-w-3xl" : "max-w-sm"}`}>{children}</div>
  </main>
);

export default ProfileShell;
