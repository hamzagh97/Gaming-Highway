"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import { describeVariants, getFormatLabel, getMaxQuantity } from "@/lib/product";
import { ProductImage } from "@/components/product/ProductImage";
import { PlatformBadge } from "@/components/product/PlatformBadge";
import { ROUTES } from "@/lib/routes";
import type { CartLineDetail } from "@/types";

interface CartLineItemProps {
  line: CartLineDetail;
  /** Called when the product link is followed, e.g. to close the drawer. */
  onNavigate?: () => void;
}

export function CartLineItem({ line, onNavigate }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product } = line;
  const variantText = describeVariants(product, line.variants);

  return (
    <li className="flex gap-3 py-4">
      <Link href={ROUTES.product(product.slug)} onClick={onNavigate} className="w-20 shrink-0 overflow-hidden rounded-lg">
        <ProductImage src={product.images[0]} alt={product.title} platform={product.platform} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={ROUTES.product(product.slug)}
          onClick={onNavigate}
          className="line-clamp-2 text-sm font-semibold leading-5 hover:text-accent"
        >
          {product.title}
        </Link>
        <div className="flex items-center gap-2">
          <PlatformBadge platform={product.platform} />
          <span className="text-xs text-ink-muted">
            {getFormatLabel(product.format)}
            {variantText && ` · ${variantText}`}
          </span>
        </div>
        <p className="text-sm font-extrabold">{formatPrice(line.unitPrice * line.quantity)}</p>

        <div className="mt-auto flex items-center justify-between pt-1">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            max={getMaxQuantity(product)}
            onChange={(quantity) => updateQuantity(line.id, quantity)}
          />
          <IconButton label={`Remove ${product.title}`} size="sm" onClick={() => removeItem(line.id)}>
            <Trash2 size={16} aria-hidden />
          </IconButton>
        </div>
      </div>
    </li>
  );
}
