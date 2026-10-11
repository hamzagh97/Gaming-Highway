"use client";

import { Tag, X } from "lucide-react";
import type { KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";
import type { PromoCode } from "@/types";

interface PromoCodeFieldProps {
  input: string;
  applied: PromoCode | null;
  error: string | null;
  onInputChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
}

export function PromoCodeField({ input, applied, error, onInputChange, onApply, onRemove }: PromoCodeFieldProps) {
  if (applied) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-success-soft px-3 py-2 text-sm">
        <span className="flex items-center gap-2 font-semibold text-success">
          <Tag size={16} aria-hidden />
          {applied.code}: {applied.description}
        </span>
        <button type="button" aria-label="Remove promo code" onClick={onRemove} className="text-success hover:opacity-70">
          <X size={16} aria-hidden />
        </button>
      </div>
    );
  }

  // The input lives inside the checkout <form>, so Enter must apply the code instead of submitting the order.
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onApply();
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <label htmlFor="promo-code" className="sr-only">
          Promo code
        </label>
        <input
          id="promo-code"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Promo code"
          className="h-10 min-w-0 flex-1 rounded-lg border border-line-strong px-3 text-sm uppercase outline-none placeholder:normal-case focus:border-brand focus:ring-2 focus:ring-brand/40"
        />
        <Button variant="outline" onClick={onApply} disabled={input.trim().length === 0}>
          Apply
        </Button>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
