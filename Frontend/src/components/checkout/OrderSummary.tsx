"use client";

import { Lock } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/product/ProductImage";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { OrderTotals } from "@/lib/pricing";
import { describeVariants, getFormatLabel } from "@/lib/product";
import type { CartLineDetail } from "@/types";
import { PromoCodeField } from "./PromoCodeField";

type PromoProps = ComponentProps<typeof PromoCodeField>;

interface OrderSummaryProps {
  lines: CartLineDetail[];
  totals: OrderTotals;
  promo: PromoProps;
  placing: boolean;
  className?: string;
}

function SummaryRow({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={cn("font-semibold", tone === "success" && "text-success")}>{value}</dd>
    </div>
  );
}

export function OrderSummary({ lines, totals, promo, placing, className }: OrderSummaryProps) {
  return (
    <aside aria-label="Order summary" className={cn("h-fit rounded-card bg-surface p-5 shadow-card sm:p-6", className)}>
      <h2 className="mb-4 text-lg font-bold">Order summary</h2>

      <ul className="max-h-72 divide-y divide-line overflow-y-auto">
        {lines.map((line) => {
          const variantText = describeVariants(line.product, line.variants);
          return (
            <li key={line.id} className="flex gap-3 py-3 first:pt-0">
              <div className="relative w-14 shrink-0">
                <ProductImage
                  src={line.product.images[0]}
                  alt={line.product.title}
                  platform={line.product.platform}
                  className="rounded-lg"
                />
                <span className="absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold leading-5 text-on-brand">
                  {line.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium leading-5">{line.product.title}</p>
                <p className="text-xs text-ink-muted">
                  {getFormatLabel(line.product.format)}
                  {variantText && ` · ${variantText}`}
                </p>
              </div>
              <p className="shrink-0 text-sm font-bold">{formatPrice(line.unitPrice * line.quantity)}</p>
            </li>
          );
        })}
      </ul>

      <div className="my-5 border-t border-line pt-5">
        <PromoCodeField {...promo} />
      </div>

      <dl className="space-y-2.5">
        <SummaryRow label="Subtotal" value={formatPrice(totals.subtotal)} />
        {totals.discount > 0 && <SummaryRow label="Promo discount" value={`- ${formatPrice(totals.discount)}`} tone="success" />}
        <SummaryRow label="Delivery" value="Sent by email" />
        <div className="flex items-center justify-between border-t border-line pt-3">
          <dt className="font-bold">Total</dt>
          <dd className="text-xl font-extrabold">{formatPrice(totals.total)}</dd>
        </div>
      </dl>

      <Button type="submit" size="lg" fullWidth loading={placing} leftIcon={<Lock size={18} aria-hidden />} className="mt-5">
        {placing ? "Placing order..." : "Place order"}
      </Button>
      <p className="mt-3 text-center text-xs text-ink-muted">Demo checkout: no real order is created.</p>
    </aside>
  );
}
