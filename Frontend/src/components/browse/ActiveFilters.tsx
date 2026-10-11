import { X } from "lucide-react";
import { genres, platforms } from "@/data/platforms";
import { stores } from "@/data/stores";
import { SITE } from "@/lib/constants";
import { TYPE_OPTIONS, type BrowseQuery } from "@/lib/browse";

interface Chip {
  key: string;
  group: string;
  label: string;
  remove: Partial<BrowseQuery>;
}

function buildChips(query: BrowseQuery): Chip[] {
  const chips: Chip[] = [];

  if (query.q) chips.push({ key: "q", group: "Search", label: query.q, remove: { q: "" } });

  for (const slug of query.devices) {
    const label = platforms.find((item) => item.slug === slug)?.name ?? slug;
    chips.push({ key: `device-${slug}`, group: "Device", label, remove: { devices: query.devices.filter((v) => v !== slug) } });
  }
  for (const slug of query.stores) {
    const label = stores.find((item) => item.slug === slug)?.name ?? slug;
    chips.push({ key: `store-${slug}`, group: "Platform", label, remove: { stores: query.stores.filter((v) => v !== slug) } });
  }
  for (const slug of query.genres) {
    const label = genres.find((item) => item.slug === slug)?.name ?? slug;
    chips.push({ key: `genre-${slug}`, group: "Category", label, remove: { genres: query.genres.filter((v) => v !== slug) } });
  }
  for (const value of query.types) {
    const label = TYPE_OPTIONS.find((item) => item.value === value)?.label ?? value;
    chips.push({ key: `type-${value}`, group: "Type", label, remove: { types: query.types.filter((v) => v !== value) } });
  }
  if (query.min !== null || query.max !== null) {
    const from = query.min !== null ? `${query.min}` : "0";
    const to = query.max !== null ? `${query.max}` : "+";
    chips.push({ key: "price", group: "Price", label: `${from} - ${to} ${SITE.currency}`, remove: { min: null, max: null } });
  }
  return chips;
}

export function hasActiveFilters(query: BrowseQuery): boolean {
  return buildChips(query).length > 0;
}

interface ActiveFiltersProps {
  query: BrowseQuery;
  onChange: (patch: Partial<BrowseQuery>) => void;
  onClearAll: () => void;
}

/** "Clear all" plus one removable chip per active filter. */
export function ActiveFilters({ query, onChange, onClearAll }: ActiveFiltersProps) {
  const chips = buildChips(query);
  if (chips.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      <li>
        <button type="button" onClick={onClearAll} className="text-sm font-semibold text-accent hover:underline">
          Clear all
        </button>
      </li>
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            onClick={() => onChange(chip.remove)}
            aria-label={`Remove filter ${chip.group}: ${chip.label}`}
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-line-strong bg-surface px-3 py-1 text-xs transition hover:border-brand"
          >
            <span className="font-bold">{chip.group}:</span>
            <span className="truncate text-ink-soft">{chip.label}</span>
            <X size={14} aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  );
}
