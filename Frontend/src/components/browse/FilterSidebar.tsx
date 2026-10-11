"use client";

import { useMemo } from "react";
import { genres, platforms } from "@/data/platforms";
import { stores } from "@/data/stores";
import {
  countByFacet,
  TYPE_OPTIONS,
  type BrowseQuery,
  type FacetKey,
} from "@/lib/browse";
import { FilterGroup, type FilterOption } from "./FilterGroup";
import { PriceFilter } from "./PriceFilter";

interface FilterSidebarProps {
  query: BrowseQuery;
  onChange: (patch: Partial<BrowseQuery>) => void;
}

function toggle<T extends string>(list: readonly T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function FilterSidebar({ query, onChange }: FilterSidebarProps) {
  const counts = useMemo(
    () => ({
      devices: countByFacet(query, "devices"),
      stores: countByFacet(query, "stores"),
      genres: countByFacet(query, "genres"),
      types: countByFacet(query, "types"),
    }),
    [query],
  );

  const build = (
    facet: FacetKey,
    items: { value: string; label: string }[],
  ): FilterOption[] =>
    items.map((item) => ({ ...item, count: counts[facet][item.value] ?? 0 }));

  return (
    <div>
      <FilterGroup
        title="Device"
        options={build(
          "devices",
          platforms.map((item) => ({ value: item.slug, label: item.name })),
        )}
        selected={query.devices}
        onToggle={(value) =>
          onChange({
            devices: toggle(
              query.devices,
              value as (typeof query.devices)[number],
            ),
          })
        }
      />
      <FilterGroup
        title="Platform"
        options={build(
          "stores",
          stores.map((item) => ({ value: item.slug, label: item.name })),
        )}
        selected={query.stores}
        onToggle={(value) =>
          onChange({
            stores: toggle(
              query.stores,
              value as (typeof query.stores)[number],
            ),
          })
        }
      />
      <FilterGroup
        title="Categories"
        options={build(
          "genres",
          genres.map((item) => ({ value: item.slug, label: item.name })),
        )}
        selected={query.genres}
        onToggle={(value) => onChange({ genres: toggle(query.genres, value) })}
      />
      <PriceFilter
        min={query.min}
        max={query.max}
        onApply={(min, max) => onChange({ min, max })}
      />
      <FilterGroup
        title="Type"
        options={build("types", TYPE_OPTIONS)}
        selected={query.types}
        onToggle={(value) =>
          onChange({
            types: toggle(query.types, value as (typeof query.types)[number]),
          })
        }
      />
    </div>
  );
}
