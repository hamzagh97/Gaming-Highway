"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ViewMode } from "@/lib/browse";
import type { Product } from "@/types";
import { ResultRow } from "./ResultRow";

const PAGE_SIZE = 12;

interface BrowseResultsProps {
  products: Product[];
  view: ViewMode;
  onClearAll: () => void;
  canClear: boolean;
}

/** The result list or grid with a "Show more" button. Remounted (via `key`) whenever the filters change. */
export function BrowseResults({ products, view, onClearAll, canClear }: BrowseResultsProps) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  if (products.length === 0) {
    return (
      <div className="rounded-card bg-surface shadow-card">
        <EmptyState
          icon={<SearchX size={28} aria-hidden />}
          title="No games found"
          description="Try a different spelling, or remove some filters."
          action={canClear ? <Button onClick={onClearAll}>Clear all filters</Button> : undefined}
        />
      </div>
    );
  }

  const shown = products.slice(0, visible);

  return (
    <div className="space-y-4">
      {view === "list" ? (
        <ul className="space-y-3">
          {shown.map((product) => (
            <li key={product.id}>
              <ResultRow product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {shown.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}

      {products.length > visible && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={() => setVisible((count) => count + PAGE_SIZE)}>
            Show more ({products.length - visible} left)
          </Button>
        </div>
      )}
    </div>
  );
}
