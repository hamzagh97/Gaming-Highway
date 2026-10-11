"use client";

import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import { heroGradient } from "@/lib/color";
import type { HeroSlide } from "@/types";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const AUTOPLAY_MS = 6000;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % count),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      className="relative overflow-hidden rounded-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${count}`}
              aria-hidden={!active}
              className="relative flex min-h-[15rem] w-full shrink-0 items-center overflow-hidden px-6 py-8 text-white sm:min-h-[20rem] sm:px-14"
              style={{ background: heroGradient(slide.hue) }}
            >
              <span
                aria-hidden
                className="absolute -right-16 -top-24 size-72 rounded-full bg-white/10 sm:size-96"
              />
              <span
                aria-hidden
                className="absolute -bottom-24 right-1/3 size-56 rounded-full bg-white/5"
              />

              <div className="relative z-10 max-w-md space-y-3 sm:space-y-4">
                <Badge variant="brand">{slide.eyebrow}</Badge>
                <h2 className="text-2xl font-black leading-tight sm:text-4xl">
                  {slide.title}
                </h2>
                <p className="text-sm text-white/80 sm:text-base">
                  {slide.subtitle}
                </p>
                <ButtonLink
                  href={slide.href}
                  size="lg"
                  tabIndex={active ? 0 : -1}
                >
                  {slide.cta}
                  <ArrowRight size={18} aria-hidden />
                </ButtonLink>
              </div>

              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 bottom-0 animate-float select-none text-[8rem] leading-none drop-shadow-2xl sm:right-16 sm:text-[14rem]"
              >
                {slide.emoji}
              </span>
            </div>
          );
        })}
      </div>

      <IconButton
        label="Previous slide"
        variant="solid"
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 sm:inline-flex"
        onClick={() => goTo(index - 1)}
      >
        <ChevronLeft size={20} aria-hidden />
      </IconButton>
      <IconButton
        label="Next slide"
        variant="solid"
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 sm:inline-flex"
        onClick={() => goTo(index + 1)}
      >
        <ChevronRight size={20} aria-hidden />
      </IconButton>

      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
        {slides.map((slide, dotIndex) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to slide ${dotIndex + 1}`}
            aria-current={dotIndex === index}
            onClick={() => goTo(dotIndex)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              dotIndex === index
                ? "w-6 bg-brand"
                : "w-2 bg-white/50 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </section>
  );
}
