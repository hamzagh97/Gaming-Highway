"use client";

import { cn } from "@/lib/cn";

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  idPrefix: string;
  className?: string;
}

/** Tab list. The consumer renders the panel with id `${idPrefix}-panel-${value}`. */
export function Tabs({ items, value, onChange, idPrefix, className }: TabsProps) {
  return (
    <div role="tablist" className={cn("no-scrollbar flex gap-6 overflow-x-auto border-b border-line", className)}>
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${item.id}`}
            aria-selected={active}
            aria-controls={`${idPrefix}-panel-${item.id}`}
            onClick={() => onChange(item.id)}
            className={cn(
              "relative whitespace-nowrap py-3 text-sm font-semibold transition-colors",
              active
                ? "text-accent after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-accent"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
