export interface RatingBucket {
  stars: number;
  percent: number;
}

/** Builds a plausible star distribution that averages out near `rating`. */
export function getRatingBreakdown(rating: number): RatingBucket[] {
  const stars = [5, 4, 3, 2, 1];
  const weights = stars.map((value) => Math.exp(-((value - rating) ** 2) / 0.9));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return stars.map((value, index) => ({
    stars: value,
    percent: Math.round((weights[index] / total) * 100),
  }));
}
