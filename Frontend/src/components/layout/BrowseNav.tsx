import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { genres, platforms } from "@/data/platforms";
import { stores } from "@/data/stores";
import { ROUTES } from "@/lib/routes";

const VISIBLE_GENRES = 5;

const navLinkClasses =
  "rounded-md px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white";
const menuLinkClasses =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-primary-soft";

export function BrowseNav() {
  return (
    <nav
      aria-label="Browse games"
      className="hidden border-t border-line bg-surface text-white lg:block"
    >
      <Container className="flex h-11 items-center gap-1">
        <div className="group relative flex h-11 items-center">
          <Link
            href={ROUTES.browse()}
            aria-haspopup="true"
            className="shine flex h-9 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-extrabold text-on-brand transition hover:bg-brand-dark"
          >
            <Menu size={18} aria-hidden />
            Browse games
            <ChevronDown
              size={14}
              aria-hidden
              className="transition group-hover:rotate-180"
            />
          </Link>

          <div className="invisible absolute left-0 top-full z-50 grid w-[46rem] translate-y-1 grid-cols-3 gap-4 rounded-b-xl border border-line bg-surface p-3 text-ink opacity-0 shadow-pop transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <div>
              <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wide text-ink-muted">
                Platforms
              </p>
              <ul>
                {platforms.map((platform) => (
                  <li key={platform.slug}>
                    <Link
                      href={ROUTES.browse({ device: platform.slug })}
                      className={menuLinkClasses}
                    >
                      <span aria-hidden className="text-xl">
                        {platform.emoji}
                      </span>
                      {platform.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wide text-ink-muted">
                Stores
              </p>
              <ul>
                {stores.map((store) => (
                  <li key={store.slug}>
                    <Link
                      href={ROUTES.browse({ store: store.slug })}
                      className={menuLinkClasses}
                    >
                      {store.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={ROUTES.browse()}
                className="mt-2 block rounded-lg bg-brand-soft px-3 py-2.5 text-sm font-bold text-brand transition hover:bg-line-strong"
              >
                See all games →
              </Link>
            </div>
            <div>
              <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wide text-ink-muted">
                Genres
              </p>
              <ul className="grid grid-cols-1">
                {genres.map((genre) => (
                  <li key={genre.slug}>
                    <Link
                      href={ROUTES.browse({ genre: genre.slug })}
                      className={menuLinkClasses}
                    >
                      <span aria-hidden className="text-xl">
                        {genre.emoji}
                      </span>
                      {genre.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <ul className="flex items-center">
          {platforms.map((platform) => (
            <li key={platform.slug}>
              <Link
                href={ROUTES.browse({ device: platform.slug })}
                className={`${navLinkClasses} font-bold`}
              >
                {platform.shortName}
              </Link>
            </li>
          ))}
        </ul>

        <span aria-hidden className="mx-2 h-5 w-px bg-white/25" />

        <ul className="flex items-center">
          {genres.slice(0, VISIBLE_GENRES).map((genre) => (
            <li key={genre.slug}>
              <Link
                href={ROUTES.browse({ genre: genre.slug })}
                className={navLinkClasses}
              >
                {genre.name}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}
