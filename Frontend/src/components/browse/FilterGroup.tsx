import { cn } from "@/lib/cn";

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selected: readonly string[];
  onToggle: (value: string) => void;
}

/** A titled list of checkboxes, each with the number of games it would show. */
export function FilterGroup({ title, options, selected, onToggle }: FilterGroupProps) {
  return (
    <fieldset className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-sm font-bold">{title}</legend>
      <ul className="space-y-1">
        {options.map((option) => {
          const checked = selected.includes(option.value);
          const disabled = option.count === 0 && !checked;
          return (
            <li key={option.value}>
              <label
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition",
                  disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-surface-muted",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onToggle(option.value)}
                  className="size-4 shrink-0 rounded accent-brand"
                />
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                <span className="text-xs text-ink-muted">{option.count}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
