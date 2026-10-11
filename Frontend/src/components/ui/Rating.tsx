import { Star } from "lucide-react";
import { formatCompactNumber } from "@/lib/format";
import { cn } from "@/lib/cn";

interface RatingProps {
  value: number;
  reviewCount?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
}

const STARS = [0, 1, 2, 3, 4];

function StarRow({ size }: { size: number }) {
  return (
    <>
      {STARS.map((index) => (
        <Star key={index} size={size} fill="currentColor" strokeWidth={0} className="shrink-0" />
      ))}
    </>
  );
}

/** Star rating with fractional fill, e.g. 4.6 fills 92% of the row. */
export function Rating({ value, reviewCount, size = 14, showValue = true, className }: RatingProps) {
  const fill = Math.max(0, Math.min(100, (value / 5) * 100));

  return (
    <div className={cn("flex items-center gap-1.5 text-xs", className)}>
      <span className="relative inline-flex" aria-hidden>
        <span className="flex text-line-strong">
          <StarRow size={size} />
        </span>
        <span className="absolute inset-y-0 left-0 flex overflow-hidden text-brand-dark" style={{ width: `${fill}%` }}>
          <StarRow size={size} />
        </span>
      </span>
      <span className="sr-only">
        Rated {value} out of 5{reviewCount !== undefined ? ` from ${reviewCount} reviews` : ""}
      </span>
      {showValue && <span className="font-bold text-ink">{value.toFixed(1)}</span>}
      {reviewCount !== undefined && <span className="text-ink-muted">({formatCompactNumber(reviewCount)})</span>}
    </div>
  );
}
