"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { products } from "@/data/products";
import { useBrowseQuery } from "@/hooks/useBrowseQuery";
import { applyFilters, sortProducts, toBrowseHref } from "@/lib/browse";
import { ActiveFilters, hasActiveFilters } from "./ActiveFilters";
import { BrowseResults } from "./BrowseResults";
import { FilterSidebar } from "./FilterSidebar";
import { ResultsToolbar } from "./ResultsToolbar";

/** The whole Browse page: filters on the left, toolbar and results on the right. */
export function BrowseView() {
  const { query, update, clearAll } = useBrowseQuery();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const results = useMemo(
    () => sortProducts(applyFilters(products, query), query.sort, query.q),
    [query],
  );

  const filterCount = useMemo(() => {
    const { devices, stores, genres, types, min, max, q } = query;
    return devices.length + stores.length + genres.length + types.length + (min !== null || max !== null ? 1 : 0) + (q ? 1 : 0);
  }, [query]);

  const active = hasActiveFilters(query);

  return (
    <Container className="py-6">
      <header className="mb-6 border-b border-line pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {query.q ? <>Results for “{query.q}”</> : "Browse games"}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {results.length} {results.length === 1 ? "item" : "items"}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[16.5rem_1fr]">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-36 max-h-[calc(100dvh-10rem)] overflow-y-auto pr-2">
            <FilterSidebar query={query} onChange={update} />
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <ResultsToolbar
            query={query}
            activeFilterCount={filterCount}
            onChange={update}
            onOpenFilters={() => setFiltersOpen(true)}
          />
          <ActiveFilters query={query} onChange={update} onClearAll={clearAll} />
          <BrowseResults
            key={toBrowseHref({ ...query, view: "list", sort: "best" })}
            products={results}
            view={query.view}
            onClearAll={clearAll}
            canClear={active}
          />
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        side="left"
        footer={
          <Button size="lg" fullWidth onClick={() => setFiltersOpen(false)}>
            Show {results.length} {results.length === 1 ? "game" : "games"}
          </Button>
        }
      >
        <div className="p-4">
          <FilterSidebar query={query} onChange={update} />
        </div>
      </Drawer>
    </Container>
  );
}

export function BrowseFallback() {
  return (
    <Container className="py-6">
      <div className="mb-6 h-16 w-64 animate-pulse rounded-lg bg-surface" />
      <div className="grid gap-8 lg:grid-cols-[16.5rem_1fr]">
        <div className="hidden h-96 animate-pulse rounded-card bg-surface lg:block" />
        <div className="h-96 animate-pulse rounded-card bg-surface" />
      </div>
    </Container>
  );
}
