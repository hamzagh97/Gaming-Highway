"use client";

import Link from "next/link";
import { CircleCheck, ShoppingCart } from "lucide-react";
import { WishlistButton } from "@/components/product/WishlistButton";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { useUI } from "@/context/ui-context";
import { getPlatformBySlug, getStoreBySlug } from "@/lib/catalog";
import { getFormatLabel } from "@/lib/product";
import { ROUTES } from "@/lib/routes";
import type { Product } from "@/types";

/** One game in the list view: cover, key facts, price and actions. */
export function ResultRow({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { openModal } = useUI();

  const facts = [
    {
      label: "Device",
      value: getPlatformBySlug(product.platform)?.name ?? product.platform,
    },
    {
      label: "Platform",
      value: getStoreBySlug(product.store)?.name ?? product.store,
    },
    { label: "Type", value: getFormatLabel(product.format) },
  ];

  const handleAdd = () => {
    if (addItem(product.id) === 0) {
      toast("You already have the maximum of this game in your cart", { tone: "info" });
      return;
    }
    toast(
      product.preOrder ? "Pre-order added to your cart" : "Added to your cart",
      {
        tone: "success",
        action: { label: "View cart", onClick: () => openModal("cart") },
      },
    );
  };

  return (
    <article className="flex gap-4 rounded-card bg-surface p-3 shadow-card transition hover:bg-surface-muted/50 sm:gap-5">
      <Link
        href={ROUTES.product(product.slug)}
        aria-label={product.title}
        className="block w-24 shrink-0 self-start overflow-hidden rounded-xl sm:w-36"
      >
        <ProductImage
          src={product.images[0]}
          alt={product.title}
          sizes="9rem"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-base font-extrabold leading-snug sm:text-lg">
              <Link
                href={ROUTES.product(product.slug)}
                className="transition hover:text-accent"
              >
                {product.title}
              </Link>
            </h3>
            <dl className="mt-2 grid grid-cols-[5.5rem_1fr] gap-y-1 text-sm">
              {facts.map((fact) => (
                <div key={fact.label} className="contents">
                  <dt className="text-ink-muted">{fact.label}</dt>
                  <dd className="truncate">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-success">
              <CircleCheck size={16} aria-hidden className="shrink-0" />
              {product.preOrder
                ? `Delivered on release (${product.releaseLabel})`
                : "Instant delivery by email"}
            </p>
          </div>

          <Price
            price={product.price}
            originalPrice={product.originalPrice}
            className="shrink-0 flex-col items-end text-right"
          />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {product.preOrder
              ? "Pre-order"
              : product.bestSeller
                ? "Best seller"
                : ""}
          </span>
          <div className="flex items-center gap-2">
            <WishlistButton productId={product.id} />
            <Button
              size="sm"
              onClick={handleAdd}
              leftIcon={<ShoppingCart size={16} aria-hidden />}
            >
              {product.preOrder ? "Pre-order" : "Add to cart"}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
