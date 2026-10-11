import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  trailing?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel = "View all",
  actionHref,
  trailing,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-4">
        {trailing}
        {actionHref && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-0.5 text-sm font-semibold text-accent hover:text-accent-dark"
          >
            {actionLabel}
            <ChevronRight size={16} aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
