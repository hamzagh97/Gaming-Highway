import Image from "next/image";
import { Gamepad2 } from "lucide-react";
import { isAllowedImageSrc } from "@/lib/image";
import { cn } from "@/lib/cn";
import { getPlatformBySlug } from "@/lib/catalog";
import type { PlatformSlug } from "@/types";

interface ProductImageProps {
  /** Image URL or local path. When missing (or not allowed) a neutral placeholder is shown. */
  src?: string;
  /** Describes the image; use "" when it is purely decorative (e.g. a thumbnail next to a title). */
  alt: string;
  /** Small coloured platform badge in the bottom-left corner. */
  platform?: PlatformSlug;
  /** Passed to next/image so the browser downloads a suitably sized file. */
  sizes?: string;
  /** Set on the main image above the fold (product page) so it loads first. */
  priority?: boolean;
  className?: string;
}

const badgeClasses: Record<PlatformSlug, string> = {
  ps5: "bg-platform-ps5",
  xbox: "bg-platform-xbox",
  pc: "bg-platform-pc",
};

const DEFAULT_SIZES = "(min-width: 1024px) 15rem, (min-width: 640px) 25vw, 45vw";

/** Game cover (3:4). Shows the real image, or a placeholder until you add one. */
export function ProductImage({ src, alt, platform, sizes = DEFAULT_SIZES, priority, className }: ProductImageProps) {
  const usable = src && isAllowedImageSrc(src) ? src : null;

  return (
    <div className={cn("@container relative aspect-[3/4] w-full overflow-hidden bg-surface-muted", className)}>
      {usable ? (
        <Image src={usable} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          className="absolute inset-0 grid place-items-center bg-linear-to-br from-surface-muted to-page text-ink-muted"
        >
          <Gamepad2 aria-hidden className="size-[34cqw]" strokeWidth={1.5} />
        </div>
      )}

      {platform && (
        <span
          aria-hidden
          className={cn(
            "absolute bottom-[3cqw] left-[3cqw] rounded-[2cqw] px-[3cqw] py-[1cqw] text-[7cqw] font-bold leading-none text-white shadow-card",
            badgeClasses[platform],
          )}
        >
          {getPlatformBySlug(platform)?.shortName}
        </span>
      )}
    </div>
  );
}
