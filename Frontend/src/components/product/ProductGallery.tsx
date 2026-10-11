"use client";

import { useState, type MouseEvent } from "react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { getDiscountPercent } from "@/lib/pricing";
import type { Product } from "@/types";
import { ProductImage } from "./ProductImage";
import { WishlistButton } from "./WishlistButton";

export function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number } | null>(null);
  const discount = getDiscountPercent(product.price, product.originalPrice);

  // With no images yet, one slot is still shown so the placeholder appears.
  const images: (string | undefined)[] = product.images.length > 0 ? product.images : [undefined];
  const activeImage = images[Math.min(activeIndex, images.length - 1)];

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setZoomOrigin({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      {images.length > 1 && (
        <ul className="flex gap-2 lg:flex-col">
          {images.map((image, index) => (
            <li key={image ?? index}>
              <button
                type="button"
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={activeIndex === index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "block w-16 overflow-hidden rounded-lg border-2 transition",
                  activeIndex === index ? "border-brand" : "border-transparent hover:border-line-strong",
                )}
              >
                <ProductImage src={image} alt="" sizes="4rem" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div
        className="relative min-w-0 flex-1 cursor-zoom-in overflow-hidden rounded-2xl border border-line"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomOrigin(null)}
      >
        <div
          className="transition-transform duration-150 ease-out"
          style={{
            transform: zoomOrigin ? "scale(1.8)" : "scale(1)",
            transformOrigin: zoomOrigin ? `${zoomOrigin.x}% ${zoomOrigin.y}%` : "center",
          }}
        >
          <ProductImage
            src={activeImage}
            alt={product.title}
            platform={product.platform}
            sizes="(min-width: 1024px) 30rem, 90vw"
            priority
          />
        </div>

        <div className="pointer-events-none absolute left-3 top-3 flex gap-2">
          {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
          {product.preOrder ? <Badge variant="accent">Pre-order</Badge> : product.isNew && <Badge variant="dark">New</Badge>}
        </div>
        <WishlistButton productId={product.id} className="absolute right-3 top-3" />
      </div>
    </div>
  );
}
