"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { useWishlist } from "@/context/wishlist-context";
import { cn } from "@/lib/cn";

interface WishlistButtonProps {
  productId: string;
  /** `icon` is the small round button on cards; `full` is the labelled button on the product page. */
  variant?: "icon" | "full";
  className?: string;
}

export function WishlistButton({
  productId,
  variant = "icon",
  className,
}: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  const saved = has(productId);
  const label = saved ? "Remove from wishlist" : "Add to wishlist";
  const icon = (
    <Heart
      size={variant === "icon" ? 18 : 20}
      aria-hidden
      className={cn("transition", saved && "fill-danger text-danger")}
    />
  );

  if (variant === "full") {
    return (
      <Button
        variant="outline"
        size="lg"
        onClick={() => toggle(productId)}
        aria-pressed={saved}
        leftIcon={icon}
        className={className}
      >
        {saved ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <IconButton
      label={label}
      variant="solid"
      size="sm"
      aria-pressed={saved}
      onClick={() => toggle(productId)}
      className={className}
    >
      {icon}
    </IconButton>
  );
}
