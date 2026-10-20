/** Open / closed pill with a live dot (map section, footer). */
export default function StatusPill({ open, label, reduced, compact = false }: { open: boolean; label: string; reduced: boolean; compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border font-body font-semibold ${
        compact ? "px-2 py-0.5 text-[11px]" : "px-3 py-1.5 text-xs"
      } ${open ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-amber-400/30 bg-amber-400/10 text-amber-300"}`}
    >
      <span className="relative flex h-2 w-2">
        {!reduced && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${open ? "bg-emerald-400" : "bg-amber-400"}`} />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${open ? "bg-emerald-400" : "bg-amber-400"}`} />
      </span>
      {label}
    </span>
  );
}
