"use client";

import { RadioCard } from "@/components/ui/RadioCard";
import { TextField } from "@/components/ui/TextField";
import { formatCardNumber, formatExpiry, formatPrice } from "@/lib/format";
import type { CheckoutField, CheckoutValues, FieldErrors } from "@/lib/validation";
import type { PaymentMethod } from "@/types";

interface PaymentOptionsProps {
  methods: PaymentMethod[];
  selectedId: PaymentMethod["id"];
  onSelect: (id: PaymentMethod["id"]) => void;
  values: CheckoutValues;
  errors: FieldErrors<CheckoutField>;
  onChange: (field: keyof CheckoutValues, value: string) => void;
}

export function PaymentOptions({ methods, selectedId, onSelect, values, errors, onChange }: PaymentOptionsProps) {
  return (
    <div className="space-y-3">
      {methods.map((method) => (
        <RadioCard
          key={method.id}
          name="payment"
          value={method.id}
          checked={method.id === selectedId}
          onChange={(id) => onSelect(id as PaymentMethod["id"])}
          title={method.label}
          description={method.description}
          trailing={method.fee > 0 ? `+ ${formatPrice(method.fee)}` : undefined}
        />
      ))}

      {selectedId === "card" && (
        <div className="grid gap-4 rounded-xl bg-surface-muted p-4 sm:grid-cols-2">
          <p className="text-xs text-ink-soft sm:col-span-2">
            Demo form: nothing is charged and card details never leave your browser. Test card: 4242 4242 4242 4242,
            any future expiry, any 3-digit code.
          </p>
          <TextField
            label="Name on card"
            name="cardName"
            autoComplete="cc-name"
            className="sm:col-span-2"
            value={values.cardName}
            error={errors.cardName}
            onChange={(event) => onChange("cardName", event.target.value)}
          />
          <TextField
            label="Card number"
            name="cardNumber"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            className="sm:col-span-2"
            value={values.cardNumber}
            error={errors.cardNumber}
            onChange={(event) => onChange("cardNumber", formatCardNumber(event.target.value))}
          />
          <TextField
            label="Expiry"
            name="cardExpiry"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={values.cardExpiry}
            error={errors.cardExpiry}
            onChange={(event) => onChange("cardExpiry", formatExpiry(event.target.value))}
          />
          <TextField
            label="Security code"
            name="cardCvc"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            maxLength={4}
            value={values.cardCvc}
            error={errors.cardCvc}
            onChange={(event) => onChange("cardCvc", event.target.value.replace(/\D/g, ""))}
          />
        </div>
      )}
    </div>
  );
}
