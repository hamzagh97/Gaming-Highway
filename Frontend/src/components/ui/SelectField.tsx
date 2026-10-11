"use client";

import { ChevronDown } from "lucide-react";
import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { fieldControlClasses } from "./TextField";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<ComponentProps<"select">, "id"> {
  label: string;
  options: SelectOption[];
  placeholder: string;
  error?: string;
}

export function SelectField({ label, options, placeholder, error, className, ...props }: SelectFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(fieldControlClasses, "appearance-none pr-9", error ? "border-danger" : "border-line-strong")}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
