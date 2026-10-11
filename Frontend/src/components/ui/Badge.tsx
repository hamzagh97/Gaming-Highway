import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const variantClasses = {
  neutral: "bg-surface-muted text-ink-soft",
  brand: "bg-brand text-on-brand",
  dark: "bg-black/70 text-white backdrop-blur",
  sale: "bg-danger text-white",
  success: "bg-success-soft text-success",
  accent: "bg-accent-soft text-accent",
} as const;

export type BadgeVariant = keyof typeof variantClasses;

interface BadgeProps extends ComponentProps<"span"> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
