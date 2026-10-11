export type CheckoutField =
  | "fullName"
  | "email"
  | "phone"
  | "cardName"
  | "cardNumber"
  | "cardExpiry"
  | "cardCvc";

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export interface CheckoutValues {
  fullName: string;
  email: string;
  phone: string;
  notes: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Tunisian mobile numbers: 8 digits starting with 2, 4, 5 or 9, optionally prefixed by the country code.
const TUNISIAN_MOBILE_PATTERN = /^(?:\+216|00216|216)?[2459]\d{7}$/;

export const isValidEmail = (value: string) => EMAIL_PATTERN.test(value.trim());
export const isValidPhone = (value: string) => TUNISIAN_MOBILE_PATTERN.test(value.replace(/[\s-]/g, ""));

function passesLuhn(digits: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

function isExpiryInFuture(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  // A card is valid through the end of its expiry month.
  return new Date(year, month, 1).getTime() > Date.now();
}

export function validateCheckout(values: CheckoutValues, paymentId: string): FieldErrors<CheckoutField> {
  const errors: FieldErrors<CheckoutField> = {};

  if (values.fullName.trim().length < 3) errors.fullName = "Enter your full name";
  if (!isValidEmail(values.email)) errors.email = "Enter a valid email address";
  // The phone number is optional (used for WhatsApp support), but must be valid when given.
  if (values.phone.trim() && !isValidPhone(values.phone)) {
    errors.phone = "Enter a valid Tunisian mobile number, e.g. 20 123 456";
  }

  if (paymentId === "card") {
    const digits = values.cardNumber.replace(/\s/g, "");
    if (values.cardName.trim().length < 3) errors.cardName = "Enter the name on the card";
    if (digits.length !== 16 || !passesLuhn(digits)) errors.cardNumber = "Enter a valid 16-digit card number";
    if (!isExpiryInFuture(values.cardExpiry)) errors.cardExpiry = "Enter a valid expiry (MM/YY)";
    if (!/^\d{3,4}$/.test(values.cardCvc)) errors.cardCvc = "Enter the 3 or 4 digit code";
  }

  return errors;
}

/** Field order used to focus the first invalid input. */
export const CHECKOUT_FIELD_ORDER: CheckoutField[] = [
  "fullName",
  "email",
  "phone",
  "cardName",
  "cardNumber",
  "cardExpiry",
  "cardCvc",
];
