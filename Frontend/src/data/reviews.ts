import type { Review } from "@/types";

const reviewPool: Omit<Review, "id">[] = [
  {
    author: "Sara M.",
    rating: 5,
    title: "Exactly what I was waiting for",
    body: "Got my key within minutes and the game runs beautifully. I will order from here again.",
    date: "12 Sep 2026",
    verified: true,
    helpful: 24,
  },
  {
    author: "Omar K.",
    rating: 4,
    title: "Great game, instant delivery",
    body: "Everything arrived by email almost instantly. The game is a lot of fun, though the first hour is slow.",
    date: "3 Sep 2026",
    verified: true,
    helpful: 11,
  },
  {
    author: "Layla A.",
    rating: 5,
    title: "Can't put it down",
    body: "Looks and plays even better than the trailers. Loading times are short and the story kept me hooked.",
    date: "28 Aug 2026",
    verified: true,
    helpful: 18,
  },
  {
    author: "Daniel R.",
    rating: 3,
    title: "Good, not perfect",
    body: "Solid game with a few rough edges. The price here was fair and the order was exactly as described.",
    date: "19 Aug 2026",
    verified: false,
    helpful: 6,
  },
  {
    author: "Fatima H.",
    rating: 5,
    title: "Perfect for game night",
    body: "Bought it for the family and everyone loves it. Support answered my question within an hour.",
    date: "7 Aug 2026",
    verified: true,
    helpful: 15,
  },
  {
    author: "Yusuf T.",
    rating: 4,
    title: "Worth the money",
    body: "Plenty of content for the price. Online matches were smooth from day one.",
    date: "30 Jul 2026",
    verified: true,
    helpful: 9,
  },
  {
    author: "Hana B.",
    rating: 5,
    title: "Key worked instantly",
    body: "Got my key by email within minutes and activated it without any trouble. Highly recommended.",
    date: "21 Jul 2026",
    verified: true,
    helpful: 13,
  },
  {
    author: "Karim S.",
    rating: 4,
    title: "Happy with it",
    body: "Good value compared with other shops. The game looks great on my setup and runs steadily.",
    date: "11 Jul 2026",
    verified: false,
    helpful: 5,
  },
];

/** Returns a stable set of mock reviews for a product (rotated by product id). */
export function getReviewsForProduct(productId: string): Review[] {
  const seed = [...productId].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return Array.from({ length: 6 }, (_, index) => ({
    ...reviewPool[(seed + index) % reviewPool.length],
    id: `${productId}-review-${index}`,
  }));
}
