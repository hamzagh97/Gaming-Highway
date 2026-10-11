import { useCallback, useState } from "react";
import { getDefaultVariants, getVariantsDelta } from "@/lib/product";
import type { Product, SelectedVariants } from "@/types";

/** Edition and quantity selection shared by the product page and quick view. */
export function useProductSelection(product: Product) {
  const [variants, setVariants] = useState<SelectedVariants>(() => getDefaultVariants(product));
  const [quantity, setQuantity] = useState(1);

  const selectVariant = useCallback((groupId: string, value: string) => {
    setVariants((previous) => ({ ...previous, [groupId]: value }));
  }, []);

  // The edition surcharge applies to the "was" price too, so discounts stay accurate.
  const delta = getVariantsDelta(product, variants);
  const unitPrice = product.price + delta;
  const originalUnitPrice = product.originalPrice !== undefined ? product.originalPrice + delta : undefined;

  return { variants, quantity, setQuantity, selectVariant, unitPrice, originalUnitPrice };
}
