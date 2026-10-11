import type { PaymentMethod } from "@/types";

const round2 = (value: number) => Math.round(value * 100) / 100;

export function getDiscountPercent(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  paymentFee: number;
  total: number;
}

interface TotalsInput {
  subtotal: number;
  payment: PaymentMethod;
  /** Promo discount as a fraction, e.g. 0.1 for 10%. */
  promoRate: number;
}

/** Everything is delivered digitally, so there is no shipping cost. */
export function calculateTotals({ subtotal, payment, promoRate }: TotalsInput): OrderTotals {
  const discount = round2(subtotal * promoRate);

  return {
    subtotal,
    discount,
    paymentFee: payment.fee,
    total: round2(subtotal - discount + payment.fee),
  };
}
