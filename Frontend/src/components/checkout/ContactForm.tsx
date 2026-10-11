import { TextField } from "@/components/ui/TextField";
import type { CheckoutField, CheckoutValues, FieldErrors } from "@/lib/validation";

interface ContactFormProps {
  values: CheckoutValues;
  errors: FieldErrors<CheckoutField>;
  onChange: (field: keyof CheckoutValues, value: string) => void;
}

export function ContactForm({ values, errors, onChange }: ContactFormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField
        label="Full name"
        name="fullName"
        autoComplete="name"
        value={values.fullName}
        error={errors.fullName}
        onChange={(event) => onChange("fullName", event.target.value)}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        hint="Your game keys and account details are sent here"
        value={values.email}
        error={errors.email}
        onChange={(event) => onChange("email", event.target.value)}
      />
      <TextField
        label="WhatsApp number (optional)"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="20 123 456"
        hint="Tunisian mobile number, for quick support"
        className="sm:col-span-2"
        value={values.phone}
        error={errors.phone}
        onChange={(event) => onChange("phone", event.target.value)}
      />
    </div>
  );
}
