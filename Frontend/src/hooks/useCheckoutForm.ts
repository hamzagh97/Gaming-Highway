import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { paymentMethods, promoCodes } from "@/data/checkout";
import {
  CHECKOUT_FIELD_ORDER,
  validateCheckout,
  type CheckoutField,
  type CheckoutValues,
  type FieldErrors,
} from "@/lib/validation";
import type { PaymentMethod, PromoCode } from "@/types";

const EMPTY_VALUES: CheckoutValues = {
  fullName: "",
  email: "",
  phone: "",
  notes: "",
  cardName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
};

/** All checkout form state: contact, payment, promo code and validation. */
export function useCheckoutForm() {
  const { user, hydrated: authReady } = useAuth();

  const [values, setValues] = useState<CheckoutValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors<CheckoutField>>({});
  const [paymentId, setPaymentId] = useState<PaymentMethod["id"]>(paymentMethods[0].id);

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const payment = paymentMethods.find((method) => method.id === paymentId) ?? paymentMethods[0];

  // Prefill from the saved profile once it has loaded.
  const prefilled = useRef(false);
  useEffect(() => {
    if (prefilled.current || !authReady) return;
    prefilled.current = true;
    setValues((previous) => ({
      ...previous,
      fullName: previous.fullName || user?.name || "",
      email: previous.email || user?.email || "",
    }));
  }, [authReady, user]);

  const setField = useCallback((field: keyof CheckoutValues, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => (previous[field as CheckoutField] ? { ...previous, [field]: undefined } : previous));
  }, []);

  /** Runs validation and returns the first invalid field, or null when the form is valid. */
  const validate = useCallback((): CheckoutField | null => {
    const nextErrors = validateCheckout(values, payment.id);
    setErrors(nextErrors);
    return CHECKOUT_FIELD_ORDER.find((field) => nextErrors[field]) ?? null;
  }, [values, payment.id]);

  const applyPromo = useCallback(() => {
    const match = promoCodes.find((promo) => promo.code === promoInput.trim().toUpperCase());
    if (!match) {
      setAppliedPromo(null);
      setPromoError("That code is not valid. Try GAMER10.");
      return;
    }
    setAppliedPromo(match);
    setPromoError(null);
    setPromoInput("");
  }, [promoInput]);

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
    setPromoError(null);
  }, []);


  return {
    values,
    errors,
    setField,
    validate,
    methods: paymentMethods,
    payment,
    setPaymentId,
    promo: { input: promoInput, applied: appliedPromo, error: promoError, setInput: setPromoInput, apply: applyPromo, remove: removePromo },
  };
}
