import { genres, platforms } from "@/data/platforms";
import { products } from "@/data/products";
import { stores } from "@/data/stores";
import type { Genre, Platform, Product, Store } from "@/types";
import { getDiscountPercent } from "./pricing";

export const getAllProducts = (): Product[] => products;

export const getProductById = (id: string): Product | undefined =>
  products.find((product) => product.id === id);

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((product) => product.slug === slug);

export const getPlatformBySlug = (slug: string): Platform | undefined =>
  platforms.find((platform) => platform.slug === slug);

export const getStoreBySlug = (slug: string): Store | undefined =>
  stores.find((store) => store.slug === slug);

export const getGenreBySlug = (slug: string): Genre | undefined =>
  genres.find((genre) => genre.slug === slug);

/** The same game on every platform it is sold for (including `product` itself). */
export const getGameListings = (product: Product): Product[] =>
  products.filter((item) => item.gameSlug === product.gameSlug);

export const getDealProducts = (limit = 10): Product[] =>
  [...products]
    .filter(
      (product) =>
        getDiscountPercent(product.price, product.originalPrice) >= 15,
    )
    .sort(
      (a, b) =>
        getDiscountPercent(b.price, b.originalPrice) -
        getDiscountPercent(a.price, a.originalPrice),
    )
    .slice(0, limit);

export const getBestSellers = (limit = 10): Product[] =>
  products.filter((product) => product.bestSeller).slice(0, limit);

export const getNewArrivals = (limit = 10): Product[] =>
  products.filter((product) => product.isNew).slice(0, limit);

export const getPreOrders = (limit = 10): Product[] =>
  products.filter((product) => product.preOrder).slice(0, limit);

export const getTopRatedProducts = (limit = 10): Product[] =>
  [...products]
    .filter((product) => product.reviewCount > 0)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, limit);

/** Other games the shopper may like: same platform and genre first, then same platform, then the rest. */
export function getRelatedProducts(product: Product, limit = 10): Product[] {
  const others = products.filter((item) => item.gameSlug !== product.gameSlug);
  const score = (item: Product) =>
    (item.platform === product.platform ? 2 : 0) +
    (item.genre === product.genre ? 1 : 0);

  return [...others].sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/** True when every word of `query` appears in the product's title, publisher, device, store or genre. */
export function matchesQuery(product: Product, query: string): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const device = getPlatformBySlug(product.platform);
  const genre = getGenreBySlug(product.genre);
  const store = getStoreBySlug(product.store);
  const haystack = [
    product.title,
    product.publisher,
    device?.name,
    device?.shortName,
    store?.name,
    genre?.name,
    product.format === "key" ? "key" : "account",
    product.preOrder ? "pre-order preorder" : "",
  ]
    .join(" ")
    .toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

/** Quick matches for the search suggestions. */
export function searchProducts(query: string, limit = 6): Product[] {
  if (!query.trim()) return [];
  return products
    .filter((product) => matchesQuery(product, query))
    .slice(0, limit);
}
