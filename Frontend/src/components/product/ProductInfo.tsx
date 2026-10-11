"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ShoppingCart, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Rating } from "@/components/ui/Rating";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { useUI } from "@/context/ui-context";
import { getGameListings } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { useProductSelection } from "@/hooks/useProductSelection";
import { getFormatLabel, getMaxQuantity } from "@/lib/product";
import { ROUTES } from "@/lib/routes";
import type { Product } from "@/types";
import { DeliveryInfo } from "./DeliveryInfo";
import { PlatformBadge } from "./PlatformBadge";
import { VariantSelector } from "./VariantSelector";
import { WishlistButton } from "./WishlistButton";

export function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem, clear } = useCart();
  const { toast } = useToast();
  const { openModal } = useUI();
  const {
    variants,
    quantity,
    setQuantity,
    selectVariant,
    unitPrice,
    originalUnitPrice,
  } = useProductSelection(product);

  const platformListings = getGameListings(product);
  const soldOut = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleAdd = () => {
    const added = addItem(product.id, { quantity, variants });
    if (added === 0) {
      toast("You already have the maximum of this game in your cart", {
        tone: "info",
      });
      return;
    }
    toast(
      added < quantity
        ? `Added ${added} (limit reached)`
        : `Added ${added} to your cart`,
      {
        tone: "success",
        action: { label: "View cart", onClick: () => openModal("cart") },
      },
    );
  };

  const handleBuyNow = () => {
    addItem(product.id, { quantity, variants });
    router.push(ROUTES.checkout);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <PlatformBadge platform={product.platform} />
          <p className="text-sm font-semibold text-accent">
            {product.publisher}
          </p>
        </div>
        <h1 className="text-xl font-extrabold leading-snug sm:text-2xl">
          {product.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <Rating
            value={product.rating}
            reviewCount={product.reviewCount}
            size={16}
          />
          {product.bestSeller && <Badge variant="accent">Best seller</Badge>}
          {product.preOrder ? (
            <Badge variant="accent">Pre-order · {product.releaseLabel}</Badge>
          ) : (
            <Badge variant={product.format === "key" ? "success" : "accent"}>
              <Zap size={11} aria-hidden className="fill-current" />
              {getFormatLabel(product.format)} · instant delivery
            </Badge>
          )}
          <Badge variant="neutral">{product.ageRating}</Badge>
        </div>
      </div>

      <div className="space-y-1 border-y border-line py-4">
        <Price price={unitPrice} originalPrice={originalUnitPrice} size="lg" />
        <p className="text-xs text-ink-muted">Prices in TND, VAT included</p>
      </div>

      {platformListings.length > 1 && (
        <div className="space-y-2">
          <p className="text-sm font-bold">Also available on</p>
          <ul className="flex flex-wrap gap-2">
            {platformListings.map((listing) => {
              const current = listing.id === product.id;
              return (
                <li key={listing.id}>
                  <Link
                    href={ROUTES.product(listing.slug)}
                    aria-current={current}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                      current
                        ? "border-brand bg-brand-soft"
                        : "border-line-strong hover:border-brand",
                    )}
                  >
                    <PlatformBadge platform={listing.platform} />
                    {listing.price.toLocaleString("en-US")} TND
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <VariantSelector
        groups={product.variants}
        selected={variants}
        onSelect={selectVariant}
      />

      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={getMaxQuantity(product)}
        />
        {lowStock && (
          <span className="text-sm font-semibold text-danger">
            Only {product.stock} left in stock
          </span>
        )}
        {soldOut && (
          <span className="text-sm font-semibold text-danger">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          size="lg"
          disabled={soldOut}
          onClick={handleAdd}
          leftIcon={<ShoppingCart size={20} aria-hidden />}
          className="min-w-44 flex-1"
        >
          {product.preOrder ? "Pre-order now" : "Add to cart"}
        </Button>
        <Button
          size="lg"
          variant="dark"
          disabled={soldOut}
          onClick={handleBuyNow}
          className="min-w-32 flex-1"
        >
          Buy now
        </Button>
        <WishlistButton productId={product.id} variant="full" />
      </div>

      <DeliveryInfo product={product} />

      <ul className="space-y-2 text-sm">
        {product.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2">
            <Check
              size={16}
              aria-hidden
              className="mt-0.5 shrink-0 text-success"
            />
            {highlight}
          </li>
        ))}
      </ul>
    </div>
  );
}
