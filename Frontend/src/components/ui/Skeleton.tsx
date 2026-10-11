import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-lg bg-linear-to-r from-surface-muted via-line-strong to-surface-muted bg-[length:200%_100%]",
        className,
      )}
      {...props}
    />
  );
}
