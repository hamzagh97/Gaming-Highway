import { SITE } from "./constants";

/** Deterministic formatting (no locale-dependent output) to keep SSR and client markup identical. */
export function formatPrice(value: number): string {
  const hasDecimals = !Number.isInteger(value);
  const amount = value.toLocaleString("en-US", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `${SITE.currency} ${amount}`;
}

export function formatCompactNumber(value: number): string {
  if (value < 1000) return String(value);
  return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
}

export function padTwo(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

export function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}
