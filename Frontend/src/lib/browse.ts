import { genres, platforms } from "@/data/platforms";
import { products } from "@/data/products";
import { stores } from "@/data/stores";
import type { PlatformSlug, Product, ProductFormat, StoreSlug } from "@/types";
import { matchesQuery } from "./catalog";
import { getDiscountPercent } from "./pricing";
import { ROUTES } from "./routes";

/**
 * Everything about the Browse page that is not React: reading and validating the URL,
 * filtering, sorting and counting. The URL is untrusted input (anyone can type anything),
 * so every value is checked against a whitelist or clamped before it is used.
 */

export type SortKey = "best" | "price-asc" | "price-desc" | "discount" | "rating" | "newest";
export type ViewMode = "list" | "grid";
export type FacetKey = "devices" | "stores" | "genres" | "types";

export interface BrowseFilters {
  q: string;
  devices: PlatformSlug[];
  stores: StoreSlug[];
  genres: string[];
  types: ProductFormat[];
  min: number | null;
  max: number | null;
}

export interface BrowseQuery extends BrowseFilters {
  sort: SortKey;
  view: ViewMode;
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "best", label: "Best match" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "discount", label: "Biggest discount" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
];

export const TYPE_OPTIONS: { value: ProductFormat; label: string }[] = [
  { value: "key", label: "Key" },
  { value: "account", label: "Account" },
];

export const DEFAULT_SORT: SortKey = "best";
export const DEFAULT_VIEW: ViewMode = "list";

const MAX_QUERY_LENGTH = 80;
const MAX_PRICE = 100_000;
const MAX_LIST_LENGTH = 200;

const DEVICE_SLUGS = platforms.map((item) => item.slug);
const STORE_SLUGS = stores.map((item) => item.slug);
const GENRE_SLUGS = genres.map((item) => item.slug);
const TYPE_SLUGS = TYPE_OPTIONS.map((item) => item.value);
const SORT_KEYS = SORT_OPTIONS.map((item) => item.value);

export const EMPTY_FILTERS: BrowseFilters = { q: "", devices: [], stores: [], genres: [], types: [], min: null, max: null };

function cleanText(raw: string | null): string {
  return (raw ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_QUERY_LENGTH);
}

/** Splits "a,b,c" and keeps only known, unique values. */
function parseList<T extends string>(raw: string | null, allowed: readonly T[]): T[] {
  if (!raw) return [];
  const known = new Set<string>(allowed);
  const picked = raw.slice(0, MAX_LIST_LENGTH).split(",").filter((value) => known.has(value));
  return [...new Set(picked)] as T[];
}

function parsePrice(raw: string | null): number | null {
  if (!raw || raw.length > 9) return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.min(Math.round(value * 100) / 100, MAX_PRICE);
}

function pick<T extends string>(raw: string | null, allowed: readonly T[], fallback: T): T {
  return allowed.find((value) => value === raw) ?? fallback;
}

/** Turns URL parameters into a safe query. Unknown or malformed values are ignored. */
export function parseBrowseQuery(get: (name: string) => string | null): BrowseQuery {
  let min = parsePrice(get("min"));
  let max = parsePrice(get("max"));
  if (min !== null && max !== null && min > max) [min, max] = [max, min];

  return {
    q: cleanText(get("q")),
    devices: parseList(get("device"), DEVICE_SLUGS),
    stores: parseList(get("store"), STORE_SLUGS),
    genres: parseList(get("genre"), GENRE_SLUGS),
    types: parseList(get("type"), TYPE_SLUGS),
    min,
    max,
    sort: pick(get("sort"), SORT_KEYS, DEFAULT_SORT),
    view: pick(get("view"), ["list", "grid"] as const, DEFAULT_VIEW),
  };
}

/** The reverse of `parseBrowseQuery`: a shareable link for this query (defaults are left out). */
export function toBrowseHref(query: Partial<BrowseQuery>): string {
  return ROUTES.browse({
    q: query.q,
    device: query.devices,
    store: query.stores,
    genre: query.genres,
    type: query.types,
    min: query.min,
    max: query.max,
    sort: query.sort === DEFAULT_SORT ? undefined : query.sort,
    view: query.view === DEFAULT_VIEW ? undefined : query.view,
  });
}

/** Applies the filters. `omit` skips one group, which is how the per-option counts are computed. */
export function applyFilters(items: Product[], filters: BrowseFilters, omit?: FacetKey): Product[] {
  return items.filter(
    (product) =>
      (omit === "devices" || filters.devices.length === 0 || filters.devices.includes(product.platform)) &&
      (omit === "stores" || filters.stores.length === 0 || filters.stores.includes(product.store)) &&
      (omit === "genres" || filters.genres.length === 0 || filters.genres.includes(product.genre)) &&
      (omit === "types" || filters.types.length === 0 || filters.types.includes(product.format)) &&
      (filters.min === null || product.price >= filters.min) &&
      (filters.max === null || product.price <= filters.max) &&
      matchesQuery(product, filters.q),
  );
}

function relevance(product: Product, q: string): number {
  const needle = q.toLowerCase();
  if (!needle) return 0;
  const title = product.title.toLowerCase();
  if (title.startsWith(needle)) return 3;
  if (title.split(/\s+/).some((word) => word.startsWith(needle))) return 2;
  return title.includes(needle) ? 1 : 0;
}

const popularity = (product: Product) => (product.bestSeller ? 1_000_000 : 0) + product.reviewCount;

export function sortProducts(items: Product[], sort: SortKey, q: string): Product[] {
  const list = [...items];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "discount":
      return list.sort(
        (a, b) => getDiscountPercent(b.price, b.originalPrice) - getDiscountPercent(a.price, a.originalPrice),
      );
    case "rating":
      return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "newest":
      return list.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || popularity(b) - popularity(a));
    default:
      return list.sort((a, b) => relevance(b, q) - relevance(a, q) || popularity(b) - popularity(a));
  }
}

/** How many games each option would show given every OTHER active filter. */
export function countByFacet(filters: BrowseFilters, facet: FacetKey): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const product of applyFilters(products, filters, facet)) {
    const key =
      facet === "devices" ? product.platform : facet === "stores" ? product.store : facet === "genres" ? product.genre : product.format;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}
