import { CART_MAX_QUANTITY } from "./constants";
import type { CartLine, UserProfile } from "@/types";

/**
 * Type guards for data read back from localStorage. Stored values can be edited
 * or corrupted by the user, extensions or older app versions, so they are
 * checked before use instead of being trusted.
 */

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isShortString = (value: unknown, max = 200): value is string =>
  typeof value === "string" && value.length > 0 && value.length <= max;

const MAX_ITEMS = 100;

export const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.length <= MAX_ITEMS && value.every((item) => isShortString(item));

export function isCartLines(value: unknown): value is CartLine[] {
  return (
    Array.isArray(value) &&
    value.length <= MAX_ITEMS &&
    value.every(
      (line) =>
        isRecord(line) &&
        isShortString(line.id) &&
        isShortString(line.productId) &&
        Number.isInteger(line.quantity) &&
        (line.quantity as number) >= 1 &&
        (line.quantity as number) <= CART_MAX_QUANTITY &&
        isRecord(line.variants) &&
        Object.values(line.variants).every((option) => isShortString(option)),
    )
  );
}

export const isUserProfileOrNull = (value: unknown): value is UserProfile | null =>
  value === null || (isRecord(value) && isShortString(value.name) && isShortString(value.email));
