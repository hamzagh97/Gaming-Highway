import type { PaymentMethod, PromoCode } from "@/types";

export const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    label: "Credit or debit card",
    description: "Pay online. Your key or account details arrive by email right after payment",
    fee: 0,
  },
];

export const promoCodes: PromoCode[] = [
  { code: "GAMER10", rate: 0.1, description: "10% off your order" },
  { code: "WELCOME15", rate: 0.15, description: "15% off your order" },
];
