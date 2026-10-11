import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { fieldControlClasses } from "@/components/ui/TextField";
import { SORT_OPTIONS, type BrowseQuery, type SortKey, type ViewMode } from "@/lib/browse";
import { cn } from "@/lib/cn";

interface ResultsToolbarProps {
  query: BrowseQuery;
  activeFilterCount: number;
  onChange: (patch: Partial<BrowseQuery>) => void;
  onOpenFilters: () => void;
}

const VIEWS: { value: ViewMode; label: string; Icon: typeof List }[] = [
  { value: "list", label: "List view", Icon: List },
  { value: "grid", label: "Grid view", Icon: LayoutGrid },
];

/** Filters button (mobile), list/grid switch and the sort menu. */
export function ResultsToolbar({ query, activeFilterCount, onChange, onOpenFilters }: ResultsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button variant="outline" size="sm" className="lg:hidden" onClick={onOpenFilters} leftIcon={<SlidersHorizontal size={16} aria-hidden />}>
        Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
      </Button>

      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-1" role="group" aria-label="Layout">
          {VIEWS.map(({ value, label, Icon }) => (
            <IconButton
              key={value}
              label={label}
              size="sm"
              aria-pressed={query.view === value}
              onClick={() => onChange({ view: value })}
              className={cn(query.view === value && "bg-brand-soft text-brand")}
            >
              <Icon size={18} aria-hidden />
            </IconButton>
          ))}
        </div>

        <label htmlFor="browse-sort" className="hidden text-sm font-bold sm:block">
          Sort by
        </label>
        <select
          id="browse-sort"
          value={query.sort}
          onChange={(event) => onChange({ sort: event.target.value as SortKey })}
          className={cn(fieldControlClasses, "h-10 w-auto border-line-strong pr-8")}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
