"use client";

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

interface TextFieldProps extends Omit<ComponentProps<"input">, "id"> {
  label: string;
  error?: string;
  hint?: string;
}

export const fieldControlClasses =
  "h-11 w-full rounded-lg border bg-surface px-3 text-sm outline-none transition placeholder:text-ink-muted focus:border-ink focus:ring-2 focus:ring-brand/60 disabled:bg-surface-muted";

export function TextField({ label, error, hint, className, ...props }: TextFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        className={cn(fieldControlClasses, error ? "border-danger" : "border-line-strong")}
        {...props}
      />
      {(error || hint) && (
        <p id={messageId} className={cn("mt-1 text-xs", error ? "font-medium text-danger" : "text-ink-muted")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
