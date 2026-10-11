"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { PlatformBadge } from "@/components/product/PlatformBadge";
import { ProductImage } from "@/components/product/ProductImage";
import { useToast } from "@/context/toast-context";
import { popularSearches } from "@/data/site";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { searchProducts } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { ROUTES } from "@/lib/routes";

export function SearchBox({ className }: { className?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 150);

  useOnClickOutside(containerRef, () => setOpen(false), open);

  const results = useMemo(() => searchProducts(debouncedQuery), [debouncedQuery]);
  const hasQuery = debouncedQuery.trim().length > 0;

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const term = query.trim().replace(/\s+/g, " ").slice(0, 80);
    if (term) {
      router.push(ROUTES.browse({ q: term }));
      close();
    } else {
      toast("Type a game or platform to search", { tone: "info" });
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex h-11 overflow-hidden rounded-xl border-2 border-line bg-page transition focus-within:border-brand"
      >
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search games, platforms, genres..."
          aria-label="Search games"
          className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-ink-muted"
        />
        <button
          type="submit"
          aria-label="Search"
          className="grid w-12 place-items-center bg-brand text-on-brand transition hover:bg-brand-dark"
        >
          <Search size={18} aria-hidden />
        </button>
      </form>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 animate-pop overflow-hidden rounded-xl border border-line bg-surface shadow-pop">
          {hasQuery ? (
            results.length > 0 ? (
              <ul>
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={ROUTES.product(product.slug)}
                      onClick={close}
                      className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-surface-muted"
                    >
                      <ProductImage
                        src={product.images[0]}
                        alt={product.title}
                        className="w-10 shrink-0 rounded-lg"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 text-sm font-semibold">{product.title}</span>
                        <span className="mt-0.5 flex items-center gap-2 text-xs text-ink-muted">
                          <PlatformBadge platform={product.platform} className="px-1.5 py-0 text-[10px]" />
                          {product.publisher}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-bold">{formatPrice(product.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-6 text-center text-sm text-ink-soft">No games match “{debouncedQuery.trim()}”.</p>
            )
          ) : (
            <div className="p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full bg-surface-muted px-3 py-1.5 text-sm font-medium transition hover:bg-line-strong"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasQuery && (
            <Link
              href={ROUTES.browse({ q: debouncedQuery.trim().slice(0, 80) })}
              onClick={close}
              className="flex items-center gap-2 border-t border-line px-4 py-3 text-sm font-bold text-accent transition hover:bg-surface-muted"
            >
              <Search size={16} aria-hidden />
              <span className="min-w-0 truncate">Results for “{debouncedQuery.trim()}”</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
