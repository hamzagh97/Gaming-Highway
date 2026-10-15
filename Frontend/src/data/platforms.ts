import type { Genre, Platform } from "@/types";

export const platforms: Platform[] = [
  {
    slug: "ps5",
    name: "PlayStation 5",
    shortName: "PS5",
    emoji: "🎮",
    hue: 215,
  },
  {
    slug: "xbox",
    name: "Xbox Series X|S",
    shortName: "Xbox",
    emoji: "🕹️",
    hue: 135,
  },
  { slug: "pc", name: "PC", shortName: "PC", emoji: "🖥️", hue: 175 },
];

export const genres: Genre[] = [
  { slug: "action", name: "Action & Adventure", emoji: "⚔️" },
  { slug: "rpg", name: "RPG", emoji: "🐉" },
  { slug: "shooter", name: "Shooters", emoji: "🎯" },
  { slug: "sports", name: "Sports", emoji: "⚽" },
  { slug: "racing", name: "Racing", emoji: "🏎️" },
  { slug: "strategy", name: "Strategy", emoji: "🏰" },
  { slug: "horror", name: "Horror", emoji: "👻" },
  { slug: "family", name: "Family & Co-op", emoji: "🧩" },
];
