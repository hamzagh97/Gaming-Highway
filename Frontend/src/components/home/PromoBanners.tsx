import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { promoBanners } from "@/data/banners";
import { heroGradient } from "@/lib/color";

export function PromoBanners() {
  return (
    <section aria-label="Promotions" className="py-6">
      <Container>
        <ul className="grid gap-4 md:grid-cols-3">
          {promoBanners.map((banner) => (
            <li key={banner.id}>
              <Link
                href={banner.href}
                className="group relative flex h-40 items-center overflow-hidden rounded-card p-5 text-white transition duration-300 hover:-translate-y-1 hover:shadow-pop"
                style={{ background: heroGradient(banner.hue) }}
              >
                <div className="relative z-10 max-w-[60%] space-y-1">
                  <h3 className="text-lg font-extrabold leading-snug">{banner.title}</h3>
                  <p className="text-xs text-white/75">{banner.subtitle}</p>
                  <span className="inline-flex items-center gap-1 pt-2 text-sm font-bold text-brand">
                    Shop now
                    <ArrowRight size={16} aria-hidden className="transition group-hover:translate-x-1" />
                  </span>
                </div>
                <span
                  aria-hidden
                  className="absolute -right-3 -bottom-3 select-none text-[7rem] leading-none transition duration-300 group-hover:scale-110 group-hover:-rotate-6"
                >
                  {banner.emoji}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
