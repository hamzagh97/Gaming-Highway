"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface RadioCardProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
}

export function RadioCard({ name, value, checked, onChange, title, description, trailing }: RadioCardProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
        checked ? "border-brand bg-brand-soft" : "border-line-strong hover:border-ink-muted",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 transition",
          checked ? "border-brand bg-brand text-on-brand" : "border-line-strong",
        )}
      >
        {checked && <Check size={12} strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{title}</span>
        {description && <span className="mt-0.5 block text-sm text-ink-soft">{description}</span>}
      </span>
      {trailing && <span className="shrink-0 text-sm font-bold">{trailing}</span>}
    </label>
  );
}
