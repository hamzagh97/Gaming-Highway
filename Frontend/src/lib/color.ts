const wrapHue = (hue: number) => ((hue % 360) + 360) % 360;

/** Dark tinted gradient, used behind genre tiles. */
export const tileGradient = (hue: number): string =>
  `linear-gradient(135deg, hsl(${wrapHue(hue)} 6% 12%) 0%, hsl(${wrapHue(hue + 20)} 8% 19%) 100%)`;

/** Deep charcoal gradient (a faint hue tint) used behind hero and banner copy (white text sits on top). */
export const heroGradient = (hue: number): string =>
  `linear-gradient(105deg, hsl(${wrapHue(hue)} 22% 8%) 0%, hsl(${wrapHue(hue + 25)} 26% 19%) 100%)`;
