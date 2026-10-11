import { getPlatformBySlug } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import type { PlatformSlug } from "@/types";

const classes: Record<PlatformSlug, string> = {
  ps5: "bg-platform-ps5",
  xbox: "bg-platform-xbox",
  pc: "bg-platform-pc",
};

export function PlatformBadge({ platform, className }: { platform: PlatformSlug; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold text-white",
        classes[platform],
        className,
      )}
    >
      {getPlatformBySlug(platform)?.shortName ?? platform}
    </span>
  );
}
