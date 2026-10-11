import type { PlatformSlug, ProductFormat, ProductSpec, StoreSlug } from "@/types";

export interface Listing {
  price: number;
  originalPrice?: number;
  reviewCount: number;
  stock?: number;
  /** Defaults by platform: PC and Xbox are keys, PS5 is a fresh account. */
  format?: ProductFormat;
  /** Defaults by device: PC is Steam, PS5 is PSN, Xbox is Xbox Live. */
  store?: StoreSlug;
}

export interface GameDefinition {
  slug: string;
  title: string;
  publisher: string;
  genre: string;
  /** Cover first, then extra screenshots. */
  images: string[];
  rating: number;
  ageRating: string;
  players: string;
  releaseLabel: string;
  preOrder?: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
  /** Extra cost of the Deluxe edition; omit when the game has a single edition. */
  deluxeExtra?: number;
  installSize: string;
  description: string;
  highlights: string[];
  /** Shown on PC listings. */
  pcRequirements: ProductSpec[];
  /** One entry per platform the game is sold on. */
  listings: Partial<Record<PlatformSlug, Listing>>;
}

/**
 * Mock catalog. Every title and studio is fictional: replace this file with
 * your real catalog (or an API call) when you are ready.
 */
export const games: GameDefinition[] = [
  {
    slug: "starfall-odyssey",
    title: "Starfall Odyssey",
    publisher: "Northwind Interactive",
    genre: "rpg",
    /** Cover first, then extra screenshots. Paste your image URLs here (hosts go in src/config/image-hosts.ts). */
    images: [],
    rating: 4.7,
    ageRating: "PEGI 16",
    players: "1 player",
    releaseLabel: "Out now",
    bestSeller: true,
    deluxeExtra: 40,
    installSize: "78 GB",
    description:
      "A space-faring role-playing adventure. Command your own ship, recruit a crew and uncover what happened to the lost colonies.",
    highlights: [
      "60-hour story with branching choices",
      "Customise and upgrade your ship",
      "Recruit companions with their own quests",
      "Photo mode and New Game+",
    ],
    pcRequirements: [
      { label: "OS", value: "Windows 10 64-bit" },
      { label: "Processor", value: "Quad-core, 3.0 GHz" },
      { label: "Graphics", value: "6 GB VRAM class GPU" },
      { label: "Memory", value: "16 GB RAM" },
      { label: "Storage", value: "80 GB SSD" },
    ],
    listings: {
      ps5: { price: 249, originalPrice: 289, reviewCount: 1840 },
      xbox: { price: 229, originalPrice: 289, reviewCount: 920, format: "account" },
      pc: { price: 189, originalPrice: 229, reviewCount: 1310 },
    },
  },
  {
    slug: "dragonreach-ashes-of-the-crown",
    title: "Dragonreach: Ashes of the Crown",
    publisher: "Emberlight Studios",
    genre: "rpg",
    /** Cover first, then extra screenshots. Paste your image URLs here (hosts go in src/config/image-hosts.ts). */
    images: [],
    rating: 4.6,
    ageRating: "PEGI 18",
    players: "1 player",
    releaseLabel: "Out now",
    deluxeExtra: 45,
    installSize: "95 GB",
    description:
      "Choose a side in a kingdom torn apart by war and dragonfire in this open-world fantasy epic.",
    highlights: [
      "Huge open world to explore",
      "Deep crafting and skill trees",
      "Dragon encounters and boss fights",
      "Choices that change the ending",
    ],
    pcRequirements: [
      { label: "OS", value: "Windows 10 64-bit" },
      { label: "Processor", value: "6-core, 3.2 GHz" },
      { label: "Graphics", value: "8 GB VRAM class GPU" },
      { label: "Memory", value: "16 GB RAM" },
      { label: "Storage", value: "100 GB SSD" },
    ],
    listings: {
      ps5: { price: 239, originalPrice: 279, reviewCount: 1120 },
      pc: { price: 189, reviewCount: 870, store: "epic" },
    },
  },
  {
    slug: "velocity-rush-gt",
    title: "Velocity Rush GT",
    publisher: "Apex Garage Games",
    genre: "racing",
    /** Cover first, then extra screenshots. Paste your image URLs here (hosts go in src/config/image-hosts.ts). */
    images: [],
    rating: 4.5,
    ageRating: "PEGI 3",
    players: "1–2 local, up to 16 online",
    releaseLabel: "Out now",
    bestSeller: true,
    deluxeExtra: 30,
    installSize: "52 GB",
    description:
      "Street circuits, mountain passes and night races. Tune your car, join online events and chase the leaderboard.",
    highlights: [
      "120 cars with deep tuning",
      "Split-screen and 16-player online races",
      "Dynamic weather and day-night cycle",
      "Wheel and controller support",
    ],
    pcRequirements: [
      { label: "OS", value: "Windows 10 64-bit" },
      { label: "Processor", value: "Quad-core, 3.0 GHz" },
      { label: "Graphics", value: "4 GB VRAM class GPU" },
      { label: "Memory", value: "12 GB RAM" },
      { label: "Storage", value: "55 GB SSD" },
    ],
    listings: {
      ps5: { price: 199, originalPrice: 239, reviewCount: 1560 },
      xbox: { price: 199, originalPrice: 239, reviewCount: 1030 },
      pc: { price: 149, originalPrice: 189, reviewCount: 1710 },
    },
  },
  {
    slug: "neon-syndicate",
    title: "Neon Syndicate",
    publisher: "Glitchwave Games",
    genre: "shooter",
    /** Cover first, then extra screenshots. Paste your image URLs here (hosts go in src/config/image-hosts.ts). */
    images: [],
    rating: 4.4,
    ageRating: "PEGI 18",
    players: "1 player campaign, 1–24 online",
    releaseLabel: "Out now",
    isNew: true,
    deluxeExtra: 35,
    installSize: "110 GB",
    description:
      "A cyberpunk first-person shooter with a story-driven campaign and fast, team-based online modes.",
    highlights: [
      "8-hour campaign",
      "24-player online battles",
      "Hackable gadgets and abilities",
      "Cross-progression between your devices",
    ],
    pcRequirements: [
      { label: "OS", value: "Windows 10 64-bit" },
      { label: "Processor", value: "6-core, 3.4 GHz" },
      { label: "Graphics", value: "8 GB VRAM class GPU" },
      { label: "Memory", value: "16 GB RAM" },
      { label: "Storage", value: "115 GB SSD" },
    ],
    listings: {
      ps5: { price: 229, originalPrice: 259, reviewCount: 640 },
      xbox: { price: 229, originalPrice: 259, reviewCount: 515 },
      pc: { price: 179, originalPrice: 209, reviewCount: 722, store: "origin" },
    },
  },
  {
    slug: "pitch-masters-27",
    title: "Pitch Masters 27",
    publisher: "Goalpost Sports",
    genre: "sports",
    /** Cover first, then extra screenshots. Paste your image URLs here (hosts go in src/config/image-hosts.ts). */
    images: [],
    rating: 4.2,
    ageRating: "PEGI 3",
    players: "1–4 local, online leagues",
    releaseLabel: "Out now",
    bestSeller: true,
    installSize: "58 GB",
    description:
      "This season's football game with refreshed squads, smarter AI and online leagues to play with friends.",
    highlights: [
      "Updated squads and kits",
      "Career mode and online seasons",
      "Local multiplayer for up to 4",
      "Improved goalkeeper and set-piece play",
    ],
    pcRequirements: [
      { label: "OS", value: "Windows 10 64-bit" },
      { label: "Processor", value: "Quad-core, 3.0 GHz" },
      { label: "Graphics", value: "4 GB VRAM class GPU" },
      { label: "Memory", value: "8 GB RAM" },
      { label: "Storage", value: "60 GB SSD" },
    ],
    listings: {
      ps5: { price: 259, originalPrice: 289, reviewCount: 2210 },
      xbox: { price: 259, originalPrice: 289, reviewCount: 1480 },
      pc: { price: 189, originalPrice: 219, reviewCount: 1650, store: "ubisoft" },
    },
  },
  {
    slug: "shadowlight-manor",
    title: "Shadowlight Manor",
    publisher: "Moonhollow Games",
    genre: "horror",
    /** Cover first, then extra screenshots. Paste your image URLs here (hosts go in src/config/image-hosts.ts). */
    images: [],
    rating: 4.3,
    ageRating: "PEGI 18",
    players: "1 player",
    releaseLabel: "Out now",
    installSize: "44 GB",
    description:
      "Explore a haunted estate with nothing but a lantern. Solve puzzles, hide from what hunts you and uncover the family's secret.",
    highlights: [
      "Atmospheric survival horror",
      "Dynamic lighting that matters",
      "Headphones recommended",
      "Multiple endings",
    ],
    pcRequirements: [
      { label: "OS", value: "Windows 10 64-bit" },
      { label: "Processor", value: "Quad-core, 2.8 GHz" },
      { label: "Graphics", value: "4 GB VRAM class GPU" },
      { label: "Memory", value: "8 GB RAM" },
      { label: "Storage", value: "45 GB SSD" },
    ],
    listings: {
      ps5: { price: 189, originalPrice: 229, reviewCount: 410 },
      pc: { price: 129, originalPrice: 159, reviewCount: 380, store: "gog" },
    },
  },
  {
    slug: "kingdom-forge",
    title: "Kingdom Forge",
    publisher: "Ironclad Studios",
    genre: "strategy",
    /** Cover first, then extra screenshots. Paste your image URLs here (hosts go in src/config/image-hosts.ts). */
    images: [],
    rating: 4.6,
    ageRating: "PEGI 12",
    players: "1 player, 1–8 online",
    releaseLabel: "Out now",
    deluxeExtra: 25,
    installSize: "30 GB",
    description:
      "Build a kingdom from a single hut, manage resources and lead your armies in real-time campaigns and online skirmishes.",
    highlights: [
      "Real-time strategy campaign",
      "Up to 8 players online",
      "Map editor included",
      "Mouse and keyboard optimised",
    ],
    pcRequirements: [
      { label: "OS", value: "Windows 10 64-bit" },
      { label: "Processor", value: "Quad-core, 2.5 GHz" },
      { label: "Graphics", value: "2 GB VRAM class GPU" },
      { label: "Memory", value: "8 GB RAM" },
      { label: "Storage", value: "30 GB" },
    ],
    listings: {
      pc: { price: 99, originalPrice: 129, reviewCount: 960 },
    },
  },
  {
    slug: "bubble-bay-party",
    title: "Bubble Bay Party",
    publisher: "Sunny Reef Games",
    genre: "family",
    /** Cover first, then extra screenshots. Paste your image URLs here (hosts go in src/config/image-hosts.ts). */
    images: [],
    rating: 4.5,
    ageRating: "PEGI 3",
    players: "1–4 local co-op",
    releaseLabel: "Out now",
    installSize: "12 GB",
    description:
      "Colourful mini-games and co-op challenges under the sea. Easy to learn, great for game night with the whole family.",
    highlights: [
      "40+ mini-games",
      "Local co-op for up to 4 players",
      "Family-friendly, no online chat",
      "Short rounds for quick sessions",
    ],
    pcRequirements: [
      { label: "OS", value: "Windows 10 64-bit" },
      { label: "Processor", value: "Dual-core, 2.4 GHz" },
      { label: "Graphics", value: "Integrated graphics" },
      { label: "Memory", value: "4 GB RAM" },
      { label: "Storage", value: "12 GB" },
    ],
    listings: {
      ps5: { price: 149, originalPrice: 179, reviewCount: 700 },
      xbox: { price: 149, originalPrice: 179, reviewCount: 560 },
      pc: { price: 79, originalPrice: 99, reviewCount: 820, store: "epic" },
    },
  },
  {
    slug: "skyforge-legends",
    title: "Skyforge Legends",
    publisher: "Dustline Entertainment",
    genre: "action",
    /** Cover first, then extra screenshots. Paste your image URLs here (hosts go in src/config/image-hosts.ts). */
    images: [],
    rating: 0,
    ageRating: "PEGI 16",
    players: "1 player, 1–4 online co-op",
    releaseLabel: "Releases 14 Nov 2026",
    preOrder: true,
    isNew: true,
    deluxeExtra: 50,
    installSize: "90 GB (estimated)",
    description:
      "An action-adventure across floating islands. Forge legendary weapons, battle titans and explore with up to three friends.",
    highlights: [
      "Open-air action across floating islands",
      "Forge and upgrade legendary weapons",
      "Online co-op for up to 4 players",
      "Pre-order bonus: exclusive armour set",
    ],
    pcRequirements: [
      { label: "OS", value: "Windows 10 64-bit" },
      { label: "Processor", value: "6-core, 3.2 GHz" },
      { label: "Graphics", value: "8 GB VRAM class GPU" },
      { label: "Memory", value: "16 GB RAM" },
      { label: "Storage", value: "95 GB SSD" },
    ],
    listings: {
      ps5: { price: 259, reviewCount: 0 },
      xbox: { price: 259, reviewCount: 0 },
      pc: { price: 199, reviewCount: 0 },
    },
  },
];
