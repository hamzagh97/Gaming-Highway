import { getGenreBySlug, getPlatformBySlug, getStoreBySlug } from "./catalog";
import { CART_MAX_QUANTITY } from "./constants";
import type {
  Product,
  ProductFormat,
  ProductSpec,
  SelectedVariants,
} from "@/types";

export function getDefaultVariants(product: Product): SelectedVariants {
  return Object.fromEntries(
    product.variants.map((group) => [group.id, group.options[0].value]),
  );
}

export function describeVariants(
  product: Product,
  selected: SelectedVariants,
): string {
  return product.variants
    .map((group) => {
      const option = group.options.find(
        (item) => item.value === selected[group.id],
      );
      return option ? `${group.label}: ${option.label}` : null;
    })
    .filter(Boolean)
    .join(" · ");
}

/** Edition surcharge for the selected options. */
export function getVariantsDelta(
  product: Product,
  selected: SelectedVariants,
): number {
  return product.variants.reduce((sum, group) => {
    const option = group.options.find(
      (item) => item.value === selected[group.id],
    );
    return sum + (option?.priceDelta ?? 0);
  }, 0);
}

export function getUnitPrice(
  product: Product,
  selected: SelectedVariants,
): number {
  return product.price + getVariantsDelta(product, selected);
}

export function getMaxQuantity(product: Product): number {
  return Math.max(1, Math.min(product.stock, CART_MAX_QUANTITY));
}

export function createLineId(
  productId: string,
  variants: SelectedVariants,
): string {
  const key = Object.entries(variants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([group, value]) => `${group}=${value}`)
    .join("|");
  return `${productId}:${key}`;
}

export const getFormatLabel = (format: ProductFormat): string =>
  format === "key" ? "Digital key" : "Fresh account";

/** Common facts shown first, followed by the listing's own specs (e.g. PC requirements). */
export function getProductSpecs(product: Product): ProductSpec[] {
  return [
    {
      label: "Device",
      value: getPlatformBySlug(product.platform)?.name ?? product.platform,
    },
    {
      label: "Platform",
      value: getStoreBySlug(product.store)?.name ?? product.store,
    },
    {
      label: "Genre",
      value: getGenreBySlug(product.genre)?.name ?? product.genre,
    },
    { label: "Publisher", value: product.publisher },
    { label: "Age rating", value: product.ageRating },
    { label: "Players", value: product.players },
    {
      label: "Delivery",
      value: `${getFormatLabel(product.format)}, sent by email`,
    },
    { label: "Release", value: product.releaseLabel },
    ...product.specs,
  ];
}
