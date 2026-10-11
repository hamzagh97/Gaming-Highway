import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { genres, platforms } from "@/data/platforms";
import { products } from "@/data/products";
import { heroGradient, tileGradient } from "@/lib/color";
import { ROUTES } from "@/lib/routes";

/** Shop-by-platform tiles followed by a compact genre grid. */
export function PlatformGrid() {
  return (
    <section aria-label="Shop by platform" className="py-6">
      <Container>
        <div className="rounded-card bg-surface p-4 shadow-card sm:p-6">
          <SectionHeader title="Shop by platform" subtitle="PC, PlayStation 5 and Xbox Series X|S" />
          <ul className="grid gap-3 sm:grid-cols-3">
            {platforms.map((platform) => (
              <li key={platform.slug}>
                <Link
                  href={ROUTES.browse({ device: platform.slug })}
                  className="group relative flex h-28 items-center justify-between overflow-hidden rounded-xl p-5 text-white transition duration-300 hover:-translate-y-1 hover:shadow-pop"
                  style={{ background: heroGradient(platform.hue) }}
                >
                  <span>
                    <span className="block text-xl font-black">{platform.name}</span>
                    <span className="text-xs text-white/75">
                      {products.filter((product) => product.platform === platform.slug).length} games
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="text-6xl transition duration-300 group-hover:scale-110 group-hover:-rotate-6"
                  >
                    {platform.emoji}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-ink-muted">Genres</h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {genres.map((genre, index) => (
              <li key={genre.slug}>
                <Link
                  href={ROUTES.browse({ genre: genre.slug })}
                  className="flex flex-col items-center gap-2 rounded-xl p-3 text-center transition hover:-translate-y-0.5 hover:shadow-card"
                  style={{ background: tileGradient(200 + index * 22) }}
                >
                  <span aria-hidden className="text-3xl">
                    {genre.emoji}
                  </span>
                  <span className="text-xs font-bold leading-tight">{genre.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
