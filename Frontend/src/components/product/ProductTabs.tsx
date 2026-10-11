"use client";

import { useState } from "react";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { getProductSpecs } from "@/lib/product";
import type { Product } from "@/types";
import { ReviewsPanel } from "./ReviewsPanel";

type TabId = "description" | "specs" | "reviews";

const ID_PREFIX = "product";

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<TabId>("description");

  const items: TabItem[] = [
    { id: "description", label: "Description" },
    { id: "specs", label: product.platform === "pc" ? "Details & PC requirements" : "Details" },
    { id: "reviews", label: `Reviews (${product.reviewCount.toLocaleString("en-US")})` },
  ];

  return (
    <section id="product-details" className="rounded-card bg-surface p-4 shadow-card sm:p-6">
      <Tabs items={items} value={active} onChange={(id) => setActive(id as TabId)} idPrefix={ID_PREFIX} />

      <div
        role="tabpanel"
        id={`${ID_PREFIX}-panel-${active}`}
        aria-labelledby={`${ID_PREFIX}-tab-${active}`}
        className="pt-6"
      >
        {active === "description" && (
          <div className="max-w-3xl space-y-4">
            <p className="leading-7 text-ink-soft">{product.description}</p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm">
              {product.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}

        {active === "specs" && (
          <dl className="max-w-2xl divide-y divide-line overflow-hidden rounded-xl border border-line text-sm">
            {getProductSpecs(product).map((spec) => (
              <div key={spec.label} className="grid grid-cols-3 gap-4 px-4 py-3 odd:bg-surface-muted/60">
                <dt className="font-semibold">{spec.label}</dt>
                <dd className="col-span-2 text-ink-soft">{spec.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {active === "reviews" && <ReviewsPanel product={product} />}
      </div>
    </section>
  );
}
