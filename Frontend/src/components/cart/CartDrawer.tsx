"use client";

import { ShoppingCart } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/context/cart-context";
import { useUI } from "@/context/ui-context";
import { formatPrice } from "@/lib/format";
import { ROUTES } from "@/lib/routes";
import { CartLineItem } from "./CartLineItem";

export function CartDrawer() {
  const { modal, closeModal } = useUI();
  const { lines, itemCount, subtotal } = useCart();
  const isEmpty = lines.length === 0;

  const footer = isEmpty ? undefined : (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-soft">Subtotal</span>
        <span className="text-lg font-extrabold">{formatPrice(subtotal)}</span>
      </div>
      <p className="text-xs text-ink-muted">Your keys and accounts are sent by email after payment. Promo codes are applied at checkout.</p>
      <ButtonLink href={ROUTES.checkout} size="lg" fullWidth onClick={closeModal}>
        Go to checkout
      </ButtonLink>
      <Button variant="outline" fullWidth onClick={closeModal}>
        Continue shopping
      </Button>
    </div>
  );

  return (
    <Drawer
      open={modal === "cart"}
      onClose={closeModal}
      title={isEmpty ? "Your cart" : `Your cart (${itemCount})`}
      footer={footer}
    >
      {isEmpty ? (
        <EmptyState
          icon={<ShoppingCart size={28} aria-hidden />}
          title="Your cart is empty"
          description="Pick your next PC, PS5 or Xbox game."
          action={<Button onClick={closeModal}>Start shopping</Button>}
        />
      ) : (
        <div className="space-y-2 p-4">
          <ul className="divide-y divide-line">
            {lines.map((line) => (
              <CartLineItem key={line.id} line={line} onNavigate={closeModal} />
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  );
}
