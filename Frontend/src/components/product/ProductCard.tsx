"use client";

import Link from "next/link";
import { Eye, ShoppingCart, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { useUI } from "@/context/ui-context";
import { cn } from "@/lib/cn";
import { getDiscountPercent } from "@/lib/pricing";
import { getFormatLabel } from "@/lib/product";
import { ROUTES } from "@/lib/routes";
import type { Product } from "@/types";
import { ProductImage } from "./ProductImage";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { openModal, openQuickView } = useUI();

  const discount = getDiscountPercent(product.price, product.originalPrice);
  const soldOut = product.stock === 0;

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
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-xl border border-line bg-surface p-2 transition duration-200 hover:-translate-y-0.5 hover:shadow-card",
        className,
      )}
    >
      <div className="relative">
        <Link
          href={ROUTES.product(product.slug)}
          aria-label={product.title}
          className="block overflow-hidden rounded-lg"
        >
          <ProductImage
            src={product.images[0]}
            alt={product.title}
            platform={product.platform}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {discount > 0 && (
          <Badge variant="sale" className="absolute left-2 top-2">
            -{discount}%
          </Badge>
        )}
        <WishlistButton
          productId={product.id}
          className="absolute right-2 top-2"
        />

        <button
          type="button"
          onClick={() => openQuickView(product.id)}
          className="absolute inset-x-3 bottom-2 hidden translate-y-2 items-center justify-center gap-1.5 rounded-lg bg-surface/95 py-2 text-xs font-bold opacity-0 shadow-card backdrop-blur transition duration-200 hover:bg-surface group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 md:flex"
        >
          <Eye size={14} aria-hidden />
          Quick view
        </button>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1.5 px-1">
        {product.preOrder ? (
          <Badge variant="accent" className="w-fit">
            Pre-order · {product.releaseLabel}
          </Badge>
        ) : (
          <Badge
            variant={product.format === "key" ? "success" : "accent"}
            className="w-fit"
          >
            <Zap size={11} aria-hidden className="fill-current" />
            {getFormatLabel(product.format)}
          </Badge>
        )}
        <Link
          href={ROUTES.product(product.slug)}
          className="line-clamp-2 min-h-10 text-sm font-medium leading-5 transition hover:text-accent"
        >
          {product.title}
        </Link>
        <Rating value={product.rating} reviewCount={product.reviewCount} />
        <Price
          price={product.price}
          originalPrice={product.originalPrice}
          className="mt-auto pt-1"
        />
      </div>

      <Button
        size="sm"
        variant="dark"
        fullWidth
        disabled={soldOut}
        onClick={handleAdd}
        leftIcon={<ShoppingCart size={16} aria-hidden />}
        className="mt-3"
      >
        {soldOut
          ? "Out of stock"
          : product.preOrder
            ? "Pre-order"
            : "Add to cart"}
      </Button>
    </article>
  );
}
