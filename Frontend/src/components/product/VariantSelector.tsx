import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { SelectedVariants, VariantGroup } from "@/types";

interface VariantSelectorProps {
  groups: VariantGroup[];
  selected: SelectedVariants;
  onSelect: (groupId: string, value: string) => void;
}

export function VariantSelector({ groups, selected, onSelect }: VariantSelectorProps) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <fieldset key={group.id}>
          <legend className="mb-2 text-sm font-semibold">{group.label}</legend>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => {
              const isSelected = option.value === selected[group.id];
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelect(group.id, option.value)}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-sm font-semibold transition",
                    isSelected ? "border-brand bg-brand text-on-brand" : "border-line-strong hover:border-brand",
                  )}
                >
                  {option.label}
                  {option.priceDelta ? (
                    <span className={cn("ml-1.5 font-medium", isSelected ? "text-white/80" : "text-ink-muted")}>
                      +{formatPrice(option.priceDelta)}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
