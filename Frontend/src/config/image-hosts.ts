/**
 * Hostnames your product images are served from, for example "cdn.mystore.tn" or
 * "images.example.com". Only the hostname: no "https://" and no path.
 *
 * This list is the single source of truth for two things (see next.config.ts):
 *   1. the Next.js image optimiser (`images.remotePatterns`), which refuses unknown hosts;
 *   2. the Content-Security-Policy `img-src` rule, which blocks unknown hosts in the browser.
 *
 * Images stored in the `public/` folder (e.g. "/images/games/starfall.jpg") need no entry.
 * Restart `npm run dev` after changing this file.
 */
export const IMAGE_HOSTS: string[] = [];
