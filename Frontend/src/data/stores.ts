import type { PlatformSlug, Store, StoreSlug } from "@/types";

export const stores: Store[] = [
  { slug: "steam", name: "Steam", device: "pc" },
  { slug: "epic", name: "Epic Games", device: "pc" },
  { slug: "origin", name: "Origin", device: "pc" },
  { slug: "ubisoft", name: "Ubisoft Connect", device: "pc" },
  { slug: "gog", name: "GOG.COM", device: "pc" },
  { slug: "psn", name: "PSN", device: "ps5" },
  { slug: "xbox-live", name: "Xbox Live", device: "xbox" },
];

/** Store used when a listing does not name one. */
export const defaultStoreFor = (device: PlatformSlug): StoreSlug =>
  device === "ps5" ? "psn" : device === "xbox" ? "xbox-live" : "steam";
