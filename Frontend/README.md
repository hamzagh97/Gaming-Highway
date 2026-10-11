# Gaming Highway TN: storefront frontend

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4. Frontend only: all data is typed mock data, there is no backend or database.
The shop sells **PC, PS5 and Xbox games only**. Dark theme in black, charcoal and the logo yellow. The logo is `public/logo.png` (transparent background).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Needs Node 20.9 or newer.

## Pages

| Route             | What it is                                                                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`               | Hero carousel, platform and genre tiles, hot deals with countdown, pre-orders                                                                                                                                                  |
| `/browse`         | All games with filters (device, platform/store, category, price, key/account), sort, list/grid view. State lives in the URL, e.g. `/browse?device=ps5,pc&store=steam&genre=rpg&min=50&max=200&sort=price-asc&view=grid&q=fifa` |
| `/product/[slug]` | One game on one platform: gallery with zoom, editions, "also available on" switcher, what you receive, tabs, reviews                                                                                                           |
| `/checkout`       | Contact details, payment, promo code, order summary (no address: everything is sent by email)                                                                                                                                  |

Modals and drawers: cart, wishlist, sign in, quick view, order success, mobile menu.

## How the shop works

- Every game is sold per platform. `src/data/games.ts` lists each game once with its platform listings, and `src/data/products.ts` expands that into one product per game + platform.
- **Everything is digital.** Each listing is either a **digital key** or a **fresh account** that already owns the game. The format is set per listing (`format: "key" | "account"` in `src/data/games.ts`). By default PC and Xbox are keys and PS5 is an account.
- There is no shipping, address, delivery method or cash on delivery. The customer gives a name and email (keys and account details are sent there) and an optional WhatsApp number.
- Pre-orders and Standard/Deluxe editions (with a price difference) are supported.
- Currency is TND. Phone numbers are validated as Tunisian mobiles (8 digits starting 2, 4, 5 or 9).

Demo promo codes: `GAMER10` (10%) and `WELCOME15` (15%). Test card: `4242 4242 4242 4242`, any future expiry, any 3-digit code. Nothing is charged or stored on a server.

## Project structure

```
src/
  app/            routes, layouts, global CSS (Tailwind theme tokens live in globals.css)
  components/
    ui/           generic building blocks (Button, Modal, Drawer, Tabs, ...)
    layout/       header, footer, logo, navigation
    home/         home page sections
    product/      cards, gallery, product info, reviews
    cart/         cart drawer and lines
    checkout/     checkout sections and forms
    modals/       login, quick view, order success, wishlist
    providers/    AppProviders (composes all contexts)
  context/        cart, wishlist, auth (mock), toast, UI (one overlay at a time)
  data/           typed mock data (games, platforms, banners, checkout options, reviews)
  hooks/          reusable hooks
  lib/            pure helpers: pricing, validation, catalog queries, formatting, routes
  types/          shared TypeScript types
public/           static files, e.g. public/images/games/ for your cover art
```

## Customising

- **Colours**: edit the `@theme` block in `src/app/globals.css`. It is a dark theme: `page` < `surface` < `surface-muted` are the backgrounds, `ink` is the (light) text colour, `brand` (yellow) is the single accent: buttons, active states, badges, links. `on-brand` is the dark text used on top of it.
- **Games**: edit `src/data/games.ts`. Titles and studios there are fictional placeholders, replace them with your real catalogue.
- **Game images**: in `src/data/games.ts` fill each game's `images: []` with URLs (or local paths). The first is the cover shown on cards, the others appear as gallery thumbnails on the product page.
  - Local files: put them in `public/images/games/` and use `"/images/games/starfall.jpg"`.
  - Remote URLs (https only): add the host, e.g. `"cdn.yourshop.tn"`, to `src/config/image-hosts.ts` and restart `npm run dev`. That one list configures both the Next.js image optimiser and the CSP `img-src` rule. If a host is missing, the placeholder is shown and the console tells you which host to add.
  - Use portrait covers (3:4 ratio); they are cropped with `object-cover`.
  - Hero banners, promo banners and platform tiles still use emoji and gradients (`src/data/banners.ts`)
- **Shop details**: name, currency, support email and cart limits are in `src/lib/constants.ts`.

## Browse page

- Reached from: Enter in the search box, the "Results for" link under the suggestions, the shining "Browse games" button and its dropdown, and every navbar item (PS5, Xbox, PC, genres) which opens it pre-filtered.
- "Device" is `ps5 | xbox | pc`; "Platform" is the store (`steam`, `epic`, `origin`, `ubisoft`, `gog`, `psn`, `xbox-live`, set per listing in `src/data/games.ts`).
- URL input is untrusted: `src/lib/browse.ts` (`parseBrowseQuery`) whitelists every value, limits `q` to 80 characters, strips control characters and clamps prices.
- The `shine` utility in `globals.css` is the sweeping highlight on the Browse button.

## Security

Already in place:

- No `dangerouslySetInnerHTML` or `eval`; links come from constants and the catalogue, never from user input.
- Security headers and a Content-Security-Policy in `next.config.ts` (HSTS only in production).
- Data read from `localStorage` (cart, wishlist, profile) is validated in `src/lib/storage-guards.ts` and discarded if it has the wrong shape. The cart stores only product ids and quantities, prices are recomputed from the catalogue.
- Card details stay in component state and are never stored or logged.

Before going live:

- Run `npm install` and **commit `package-lock.json`**. Run `npm run audit` regularly and keep Next.js up to date.
- Tighten the CSP with nonces (see the comment in `next.config.ts`) and add your payment provider's hosts.
- Use your payment provider's hosted page or fields instead of the demo card form.
- Recompute prices and validate promo codes on the server. Never ship keys or account logins in the frontend.
- Replace the mock login with real authentication (`httpOnly` + `Secure` + `SameSite` cookies), rate limiting and bot protection.
- Remote cover art is limited to the hosts in `src/config/image-hosts.ts` (image optimiser and CSP); never use a wildcard host.
