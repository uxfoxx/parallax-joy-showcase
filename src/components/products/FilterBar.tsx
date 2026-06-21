import { useEffect, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export type FilterOption = { value: string; label: string };

export type FilterDef = {
  id: string;
  label: string;
  options: FilterOption[];
  selected: string[];
  /** Replace this filter's selection. */
  onApply: (next: string[]) => void;
  /** Show the in-popover search field (for long lists). */
  searchable?: boolean;
};

const summarise = (def: FilterDef) => {
  if (def.selected.length === 0) return "";
  const first = def.options.find((o) => o.value === def.selected[0])?.label ?? def.selected[0];
  return def.selected.length > 1 ? `${first} +${def.selected.length - 1}` : first;
};

/** One filter's chip + its multi-select checkbox dropdown (commits on Apply). */
const FilterChip = ({ def }: { def: FilterDef }) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string[]>(def.selected);
  const isActive = def.selected.length > 0;

  // Re-seed the pending selection whenever the popover opens.
  useEffect(() => {
    if (open) setPending(def.selected);
  }, [open, def.selected]);

  const toggle = (value: string) =>
    setPending((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  return (
    <div
      className={`flex items-center rounded-full border overflow-hidden transition-colors ${
        isActive
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-dashed border-border text-muted-foreground"
      }`}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={`flex items-center gap-1.5 py-1.5 font-body text-xs font-medium transition-colors ${
              isActive ? "pl-3 pr-2 hover:bg-accent/15" : "px-3 hover:text-accent"
            }`}
          >
            {!isActive && <Plus className="w-3.5 h-3.5" />}
            <span className={isActive ? "text-accent/70" : ""}>{def.label}</span>
            {isActive && (
              <>
                <span className="text-accent/40">|</span>
                <span className="font-semibold max-w-[150px] truncate">{summarise(def)}</span>
              </>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-0">
          <div className="px-3 pt-3 pb-1 font-body text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
            Filter by {def.label}
          </div>
          <Command>
            {def.searchable && <CommandInput placeholder={`Search ${def.label.toLowerCase()}…`} />}
            <CommandList>
              <CommandEmpty>No matches.</CommandEmpty>
              <CommandGroup>
                {def.options.map((opt) => {
                  const checked = pending.includes(opt.value);
                  return (
                    <CommandItem key={opt.value} value={opt.label} onSelect={() => toggle(opt.value)}>
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                          checked ? "bg-accent border-accent text-white" : "border-muted-foreground/40"
                        }`}
                      >
                        {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      <span className="font-body">{opt.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="p-2 border-t border-border">
            <button
              onClick={() => {
                def.onApply(pending);
                setOpen(false);
              }}
              className="w-full h-9 rounded-md bg-accent text-white font-body text-sm font-semibold hover:bg-accent/90 transition-colors"
            >
              Apply
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {isActive && (
        <button
          aria-label={`Remove ${def.label} filter`}
          onClick={() => def.onApply([])}
          className="px-2 py-1.5 text-accent/70 hover:text-accent hover:bg-accent/15 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

type FilterBarProps = {
  filters: FilterDef[];
  onClearAll: () => void;
};

/**
 * Stripe-style filter chip bar. Active filters render as accent pills
 * ("Category | Oil ✕") — clicking the label re-opens its dropdown, the ✕ clears
 * just that filter. Filters with no selection show as dashed "+ Label" pills
 * you click to add. "Clear filters" resets everything. Pills wrap on mobile.
 */
const FilterBar = ({ filters, onClearAll }: FilterBarProps) => {
  const anyActive = filters.some((f) => f.selected.length > 0);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((def) => (
        <FilterChip key={def.id} def={def} />
      ))}

      {anyActive && (
        <button
          onClick={onClearAll}
          className="ml-1 flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-accent transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
