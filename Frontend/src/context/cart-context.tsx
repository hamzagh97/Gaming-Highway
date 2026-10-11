"use client";

import { useCallback, useMemo, type ReactNode } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { createStrictContext } from "@/lib/create-strict-context";
import { getProductById } from "@/lib/catalog";
import {
  createLineId,
  getDefaultVariants,
  getMaxQuantity,
  getUnitPrice,
} from "@/lib/product";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { isCartLines } from "@/lib/storage-guards";
import type { CartLine, CartLineDetail, SelectedVariants } from "@/types";

interface AddItemOptions {
  quantity?: number;
  variants?: SelectedVariants;
}

interface CartContextValue {
  /** Cart lines joined with their product data and unit price. */
  lines: CartLineDetail[];
  itemCount: number;
  subtotal: number;
  /** False until the saved cart has been read from localStorage. */
  hydrated: boolean;
  /** Returns how many were actually added (0 when the line is already at its maximum). */
  addItem: (productId: string, options?: AddItemOptions) => number;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clear: () => void;
}

const [CartContextProvider, useCart] =
  createStrictContext<CartContextValue>("Cart");

export { useCart };

export function CartProvider({ children }: { children: ReactNode }) {
  const [rawLines, setRawLines, hydrated] = useLocalStorage<CartLine[]>(
    STORAGE_KEYS.cart,
    [],
    isCartLines,
  );

  const lines = useMemo<CartLineDetail[]>(
    () =>
      rawLines.flatMap((line) => {
        const product = getProductById(line.productId);
        return product
          ? [
              {
                ...line,
                product,
                unitPrice: getUnitPrice(product, line.variants),
              },
            ]
          : [];
      }),
    [rawLines],
  );

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );
  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [lines],
  );

  const addItem = useCallback(
    (productId: string, options: AddItemOptions = {}) => {
      const product = getProductById(productId);
      if (!product || product.stock === 0) return 0;

      const variants = options.variants ?? getDefaultVariants(product);
      const id = createLineId(productId, variants);
      const max = getMaxQuantity(product);

      // Worked out here, not inside the state updater, so the real amount can be returned.
      const inCart = rawLines.find((line) => line.id === id)?.quantity ?? 0;
      const added = Math.max(
        0,
        Math.min(max, inCart + (options.quantity ?? 1)) - inCart,
      );
      if (added === 0) return 0;

      setRawLines((current) => {
        const existing = current.find((line) => line.id === id);
        if (existing) {
          return current.map((line) =>
            line.id === id
              ? { ...line, quantity: Math.min(max, line.quantity + added) }
              : line,
          );
        }
        return [...current, { id, productId, variants, quantity: added }];
      });
      return added;
    },
    [rawLines, setRawLines],
  );

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) => {
      setRawLines((current) =>
        current.map((line) => {
          if (line.id !== lineId) return line;
          const product = getProductById(line.productId);
          const max = product ? getMaxQuantity(product) : quantity;
          return { ...line, quantity: Math.max(1, Math.min(max, quantity)) };
        }),
      );
    },
    [setRawLines],
  );

  const removeItem = useCallback(
    (lineId: string) =>
      setRawLines((current) => current.filter((line) => line.id !== lineId)),
    [setRawLines],
  );

  const clear = useCallback(() => setRawLines([]), [setRawLines]);

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotal,
      hydrated,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    }),
    [
      lines,
      itemCount,
      subtotal,
      hydrated,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    ],
  );

  return <CartContextProvider value={value}>{children}</CartContextProvider>;
}
