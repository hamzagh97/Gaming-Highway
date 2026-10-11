import { formatPrice } from "@/lib/format";
import { getDiscountPercent } from "@/lib/pricing";
import { cn } from "@/lib/cn";

type PriceSize = "sm" | "md" | "lg";

const priceClasses: Record<PriceSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-3xl",
};

interface PriceProps {
  price: number;
  originalPrice?: number;
  size?: PriceSize;
  className?: string;
}

export function Price({ price, originalPrice, size = "md", className }: PriceProps) {
  const discount = getDiscountPercent(price, originalPrice);

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn("font-extrabold text-ink", priceClasses[size])}>{formatPrice(price)}</span>
      {discount > 0 && originalPrice && (
        <>
          <span className="text-xs text-ink-muted line-through">{formatPrice(originalPrice)}</span>
          <span className="text-xs font-bold text-success">{discount}% off</span>
        </>
      )}
    </div>
  );
}
