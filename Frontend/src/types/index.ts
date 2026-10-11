export type PlatformSlug = "ps5" | "xbox" | "pc";

export interface Platform {
  slug: PlatformSlug;
  /** Full name, e.g. "PlayStation 5". */
  name: string;
  /** Badge label, e.g. "PS5". */
  shortName: string;
  emoji: string;
  hue: number;
}

/** Where the game is redeemed or played: Steam, PSN, Xbox Live... */
export type StoreSlug = "steam" | "origin" | "epic" | "gog" | "ubisoft" | "psn" | "xbox-live";

export interface Store {
  slug: StoreSlug;
  name: string;
  /** The device this store belongs to. */
  device: PlatformSlug;
}

export interface Genre {
  slug: string;
  name: string;
  emoji: string;
}

/** Everything is delivered digitally: a game key, or a fresh account that already owns the game. */
export type ProductFormat = "key" | "account";

export interface VariantOption {
  value: string;
  label: string;
  /** Amount added to the product price when this option is selected (e.g. a Deluxe edition). */
  priceDelta?: number;
}

export interface VariantGroup {
  id: string;
  label: string;
  options: VariantOption[];
}

/** Maps a variant group id to the selected option value. */
export type SelectedVariants = Record<string, string>;

export interface ProductSpec {
  label: string;
  value: string;
}

/** One sellable listing: a game on a single platform. */
export interface Product {
  id: string;
  slug: string;
  /** Shared by every platform listing of the same game. */
  gameSlug: string;
  title: string;
  publisher: string;
  platform: PlatformSlug;
  /** Store where the key or account is used (Steam, PSN...). */
  store: StoreSlug;
  genre: string;
  format: ProductFormat;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  /** Image URLs or local paths. The first is the cover; any others fill the product-page gallery. */
  images: string[];
  ageRating: string;
  players: string;
  /** Shown to customers, e.g. "Out now" or "Releases 14 Nov 2026". */
  releaseLabel: string;
  preOrder: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
  highlights: string[];
  description: string;
  specs: ProductSpec[];
  variants: VariantGroup[];
}

export interface CartLine {
  id: string;
  productId: string;
  quantity: number;
  variants: SelectedVariants;
}

export interface CartLineDetail extends CartLine {
  product: Product;
  /** Product price plus any selected edition surcharge. */
  unitPrice: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  emoji: string;
  hue: number;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  hue: number;
  href: string;
}

export interface PaymentMethod {
  id: "card";
  label: string;
  description: string;
  fee: number;
}

export interface PromoCode {
  code: string;
  rate: number;
  description: string;
}

export interface UserProfile {
  name: string;
  email: string;
}
