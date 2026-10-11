import { BadgeCheck, ThumbsUp } from "lucide-react";
import { Rating } from "@/components/ui/Rating";
import type { Review } from "@/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="space-y-2 border-b border-line py-5 last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Rating value={review.rating} showValue={false} size={14} />
        <h3 className="text-sm font-bold">{review.title}</h3>
      </div>
      <p className="text-sm text-ink-soft">{review.body}</p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span className="font-semibold text-ink">{review.author}</span>
        <span>{review.date}</span>
        {review.verified && (
          <span className="inline-flex items-center gap-1 text-success">
            <BadgeCheck size={14} aria-hidden />
            Verified purchase
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <ThumbsUp size={12} aria-hidden />
          {review.helpful} found this helpful
        </span>
      </div>
    </article>
  );
}
