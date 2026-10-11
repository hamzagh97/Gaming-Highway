import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type IconButtonVariant = "ghost" | "solid" | "brand";
type IconButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<IconButtonVariant, string> = {
  ghost: "text-ink hover:bg-ink/10",
  solid: "bg-surface text-ink shadow-card hover:bg-surface-muted",
  brand: "bg-brand text-on-brand hover:bg-brand-dark",
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-11",
};

interface IconButtonProps extends ComponentProps<"button"> {
  /** Accessible name; icon-only buttons must always have one. */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

export function IconButton({
  label,
  variant = "ghost",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full transition duration-150 active:scale-95 disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
