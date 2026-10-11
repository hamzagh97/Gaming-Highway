import type {
  PlatformSlug,
  Product,
  ProductFormat,
  ProductSpec,
} from "@/types";
import { games, type GameDefinition, type Listing } from "./games";
import { platforms } from "./platforms";
import { defaultStoreFor } from "./stores";
import { editions } from "./variant-presets";

/** Everything is digital. Unless a listing says otherwise, PS5 games are fresh accounts and PC/Xbox games are keys. */
const defaultFormat = (slug: PlatformSlug): ProductFormat =>
  slug === "ps5" ? "account" : "key";

function buildListing(
  game: GameDefinition,
  platformSlug: PlatformSlug,
  listing: Listing,
): Product {
  const platform = platforms.find((item) => item.slug === platformSlug);
  if (!platform)
    throw new Error(
      `Unknown platform "${platformSlug}" in game "${game.slug}"`,
    );

  const specs: ProductSpec[] =
    platformSlug === "pc"
      ? game.pcRequirements
      : [{ label: "Download size", value: game.installSize }];

  return {
    id: `${game.slug}-${platformSlug}`,
    slug: `${game.slug}-${platformSlug}`,
    gameSlug: game.slug,
    title: `${game.title} (${platform.shortName})`,
    publisher: game.publisher,
    platform: platformSlug,
    store: listing.store ?? defaultStoreFor(platformSlug),
    genre: game.genre,
    format: listing.format ?? defaultFormat(platformSlug),
    price: listing.price,
    originalPrice: listing.originalPrice,
    rating: game.rating,
    reviewCount: listing.reviewCount,
    stock: listing.stock ?? 99,
    images: game.images,
    ageRating: game.ageRating,
    players: game.players,
    releaseLabel: game.releaseLabel,
    preOrder: game.preOrder ?? false,
    isNew: game.isNew,
    bestSeller: game.bestSeller,
    highlights: game.highlights,
    description: game.description,
    specs,
    variants: game.deluxeExtra ? [editions(game.deluxeExtra)] : [],
  };
}

export const products: Product[] = games.flatMap((game) =>
  (Object.entries(game.listings) as [PlatformSlug, Listing][]).map(
    ([platformSlug, listing]) => buildListing(game, platformSlug, listing),
  ),
);
