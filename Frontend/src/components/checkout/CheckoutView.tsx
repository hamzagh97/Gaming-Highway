"use client";

import { ShoppingCart } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { useUI } from "@/context/ui-context";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { generateOrderNumber } from "@/lib/order";
import { calculateTotals } from "@/lib/pricing";
import { ROUTES } from "@/lib/routes";
import { ContactForm } from "./ContactForm";
import { CheckoutSection } from "./CheckoutSection";
import { OrderSummary } from "./OrderSummary";
import { PaymentOptions } from "./PaymentOptions";

const ORDER_DELAY_MS = 900;

export function CheckoutView() {
  const { lines, subtotal, hydrated, clear } = useCart();
  const { openOrderSuccess } = useUI();
  const { toast } = useToast();
  const form = useCheckoutForm();
  const [placing, setPlacing] = useState(false);

  const promoRate = form.promo.applied?.rate ?? 0;
  const totals = useMemo(
    () => calculateTotals({ subtotal, payment: form.payment, promoRate }),
    [subtotal, form.payment, promoRate],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (placing) return;

    const firstInvalid = form.validate();
    if (firstInvalid) {
      toast("Please check the highlighted fields", { tone: "error" });
      document.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setPlacing(true);
    await new Promise((resolve) => window.setTimeout(resolve, ORDER_DELAY_MS));
    const orderNumber = generateOrderNumber();
    clear();
    setPlacing(false);
    openOrderSuccess(orderNumber);
  };

  if (!hydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-card bg-surface shadow-card">
        <EmptyState
          icon={<ShoppingCart size={28} aria-hidden />}
          title="Your cart is empty"
          description="Add a game to your cart, then come back to check out."
          action={<ButtonLink href={ROUTES.home}>Start shopping</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid items-start gap-6 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-6">
        <CheckoutSection step={1} title="Contact details">
          <ContactForm values={form.values} errors={form.errors} onChange={form.setField} />
        </CheckoutSection>

        <CheckoutSection step={2} title="Payment">
          <PaymentOptions
            methods={form.methods}
            selectedId={form.payment.id}
            onSelect={form.setPaymentId}
            values={form.values}
            errors={form.errors}
            onChange={form.setField}
          />
        </CheckoutSection>
      </div>

      <OrderSummary
        lines={lines}
        totals={totals}
        placing={placing}
        promo={{
          input: form.promo.input,
          applied: form.promo.applied,
          error: form.promo.error,
          onInputChange: form.promo.setInput,
          onApply: form.promo.apply,
          onRemove: form.promo.remove,
        }}
        className="lg:sticky lg:top-6"
      />
    </form>
  );
}
