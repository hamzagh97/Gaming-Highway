import { ROUTES } from "@/lib/routes";
import type { HeroSlide, PromoBanner } from "@/types";

export const heroSlides: HeroSlide[] = [
  {
    id: "new-releases",
    eyebrow: "New releases",
    title: "Your next game is here",
    subtitle: "The latest PC, PS5 and Xbox games, delivered to your inbox in minutes.",
    cta: "Shop all games",
    href: ROUTES.browse(),
    emoji: "🎮",
    hue: 50,
  },
  {
    id: "ps5",
    eyebrow: "PlayStation 5",
    title: "Big PS5 games, better prices",
    subtitle: "Fresh PS5 accounts with your game ready to play, sent by email.",
    cta: "Shop PS5 games",
    href: ROUTES.browse({ device: "ps5" }),
    emoji: "🚀",
    hue: 235,
  },
  {
    id: "xbox",
    eyebrow: "Xbox Series X|S",
    title: "Level up your Xbox library",
    subtitle: "Racing, shooters, sports and family favourites, instant delivery.",
    cta: "Shop Xbox games",
    href: ROUTES.browse({ device: "xbox" }),
    emoji: "🕹️",
    hue: 140,
  },
  {
    id: "pc",
    eyebrow: "PC game keys",
    title: "Instant keys for PC gamers",
    subtitle: "Your key arrives by email minutes after payment.",
    cta: "Shop PC games",
    href: ROUTES.browse({ device: "pc" }),
    emoji: "🖥️",
    hue: 175,
  },
];

export const promoBanners: PromoBanner[] = [
  {
    id: "preorders",
    title: "Pre-orders are open",
    subtitle: "Lock in Skyforge Legends and get the bonus armour",
    emoji: "⏳",
    hue: 50,
    href: ROUTES.product("skyforge-legends-ps5"),
  },
  {
    id: "family",
    title: "Game night essentials",
    subtitle: "Family and co-op games for everyone",
    emoji: "🧩",
    hue: 50,
    href: ROUTES.browse({ genre: "family" }),
  },
  {
    id: "pc-keys",
    title: "PC keys from 79 TND",
    subtitle: "Digital delivery in minutes",
    emoji: "⚡",
    hue: 50,
    href: ROUTES.browse({ device: "pc" }),
  },
];
