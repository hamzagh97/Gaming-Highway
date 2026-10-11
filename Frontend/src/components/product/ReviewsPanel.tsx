"use client";

import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { useToast } from "@/context/toast-context";
import { getReviewsForProduct } from "@/data/reviews";
import { getRatingBreakdown } from "@/lib/reviews";
import type { Product } from "@/types";
import { ReviewCard } from "./ReviewCard";

export function ReviewsPanel({ product }: { product: Product }) {
  const { toast } = useToast();
  const reviews = getReviewsForProduct(product.id);
  const breakdown = getRatingBreakdown(product.rating);

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <div className="space-y-4">
        <div>
          <p className="text-5xl font-black">{product.rating.toFixed(1)}</p>
          <Rating value={product.rating} showValue={false} size={18} className="mt-1" />
          <p className="mt-1 text-sm text-ink-soft">{product.reviewCount.toLocaleString("en-US")} ratings</p>
        </div>

        <ul className="space-y-1.5">
          {breakdown.map((bucket) => (
            <li key={bucket.stars} className="flex items-center gap-2 text-xs">
              <span className="w-8 shrink-0 font-semibold">{bucket.stars} ★</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                <span className="block h-full rounded-full bg-brand-dark" style={{ width: `${bucket.percent}%` }} />
              </span>
              <span className="w-9 shrink-0 text-right text-ink-muted">{bucket.percent}%</span>
            </li>
          ))}
        </ul>

        <Button
          variant="outline"
          fullWidth
          onClick={() => toast("Reviews are mock data in this demo", { tone: "info" })}
        >
          Write a review
        </Button>
      </div>

      <div>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
