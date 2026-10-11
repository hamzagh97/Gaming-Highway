"use client";

import Link from "next/link";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import { Price } from "@/components/ui/Price";
import { ProductImage } from "@/components/product/ProductImage";
import { PlatformBadge } from "@/components/product/PlatformBadge";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { useUI } from "@/context/ui-context";
import { useWishlist } from "@/context/wishlist-context";
import { getProductById } from "@/lib/catalog";
import { ROUTES } from "@/lib/routes";
import type { Product } from "@/types";

export function WishlistDrawer() {
  const { modal, closeModal } = useUI();
  const { ids, toggle } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();

  const products = ids.flatMap((id) => getProductById(id) ?? []);

  const moveToCart = (product: Product) => {
    if (addItem(product.id) === 0) {
      toast("You already have the maximum of this game in your cart", {
        tone: "info",
      });
      return;
    }
    toggle(product.id);
    toast("Moved to your cart", { tone: "success" });
  };

  return (
    <Drawer
      open={modal === "wishlist"}
      onClose={closeModal}
      title={`Wishlist (${products.length})`}
    >
      {products.length === 0 ? (
        <EmptyState
          icon={<Heart size={28} aria-hidden />}
          title="Nothing saved yet"
          description="Tap the heart on any product to save it for later."
          action={<Button onClick={closeModal}>Keep browsing</Button>}
        />
      ) : (
        <ul className="divide-y divide-line px-4">
          {products.map((product) => (
            <li key={product.id} className="flex gap-3 py-4">
              <Link
                href={ROUTES.product(product.slug)}
                onClick={closeModal}
                className="w-20 shrink-0 overflow-hidden rounded-lg"
              >
                <ProductImage
                  src={product.images[0]}
                  alt={product.title}
                  platform={product.platform}
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link
                  href={ROUTES.product(product.slug)}
                  onClick={closeModal}
                  className="line-clamp-2 text-sm font-semibold leading-5 hover:text-accent"
                >
                  {product.title}
                </Link>
                <PlatformBadge platform={product.platform} className="w-fit" />
                <Price
                  price={product.price}
                  originalPrice={product.originalPrice}
                  size="sm"
                />
                <Button
                  size="sm"
                  variant="dark"
                  className="mt-auto w-fit"
                  onClick={() => moveToCart(product)}
                >
                  Move to cart
                </Button>
              </div>
              <IconButton
                label={`Remove ${product.title} from wishlist`}
                size="sm"
                onClick={() => toggle(product.id)}
              >
                <X size={16} aria-hidden />
              </IconButton>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
