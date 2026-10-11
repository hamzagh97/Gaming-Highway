"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Rating } from "@/components/ui/Rating";
import { PlatformBadge } from "@/components/product/PlatformBadge";
import { ProductImage } from "@/components/product/ProductImage";
import { VariantSelector } from "@/components/product/VariantSelector";
import { WishlistButton } from "@/components/product/WishlistButton";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { useUI } from "@/context/ui-context";
import { useProductSelection } from "@/hooks/useProductSelection";
import { getProductById } from "@/lib/catalog";
import { getMaxQuantity } from "@/lib/product";
import { ROUTES } from "@/lib/routes";
import type { Product } from "@/types";

function QuickViewContent({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { closeModal, openModal } = useUI();
  const {
    variants,
    quantity,
    setQuantity,
    selectVariant,
    unitPrice,
    originalUnitPrice,
  } = useProductSelection(product);

  const handleAdd = () => {
    const added = addItem(product.id, { quantity, variants });
    if (added === 0) {
      toast("You already have the maximum of this game in your cart", { tone: "info" });
      return;
    }
    toast(added < quantity ? `Added ${added} (limit reached)` : `Added ${added} to your cart`, {
      tone: "success",
      action: { label: "View cart", onClick: () => openModal("cart") },
    });
    closeModal();
  };

  return (
    <div className="grid gap-6 p-5 md:grid-cols-2">
      <ProductImage
        src={product.images[0]}
        alt={product.title}
        platform={product.platform}
        className="rounded-xl"
      />

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <PlatformBadge platform={product.platform} />
            <p className="text-sm font-semibold text-accent">
              {product.publisher}
            </p>
          </div>
          <h3 className="text-lg font-extrabold leading-snug">
            {product.title}
          </h3>
          <Rating
            value={product.rating}
            reviewCount={product.reviewCount}
            size={15}
          />
        </div>

        <Price price={unitPrice} originalPrice={originalUnitPrice} size="lg" />
        <p className="text-sm text-ink-soft">{product.description}</p>

        <VariantSelector
          groups={product.variants}
          selected={variants}
          onSelect={selectVariant}
        />

        <div className="flex items-center gap-3">
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            max={getMaxQuantity(product)}
          />
          <Button
            size="lg"
            className="flex-1"
            disabled={product.stock === 0}
            onClick={handleAdd}
            leftIcon={<ShoppingCart size={20} aria-hidden />}
          >
            {product.preOrder ? "Pre-order" : "Add to cart"}
          </Button>
          <WishlistButton productId={product.id} />
        </div>

        <Link
          href={ROUTES.product(product.slug)}
          onClick={closeModal}
          className="inline-block text-sm font-semibold text-accent hover:underline"
        >
          View full details
        </Link>
      </div>
    </div>
  );
}

export function QuickViewModal() {
  const { modal, quickViewProductId, closeModal } = useUI();
  const product = quickViewProductId
    ? getProductById(quickViewProductId)
    : undefined;
  const open = modal === "quick-view" && Boolean(product);

  return (
    <Modal open={open} onClose={closeModal} title="Quick view" size="lg">
      {product && <QuickViewContent key={product.id} product={product} />}
    </Modal>
  );
}
